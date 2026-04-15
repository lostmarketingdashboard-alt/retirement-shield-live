import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };
const FRED_URL = 'https://api.stlouisfed.org/fred/series/observations';
const BLS_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';
const TREASURY_FISCAL_URL = 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates';
const FMP_QUOTE_URL = 'https://financialmodelingprep.com/stable/quote';

type UnknownRecord = Record<string, any>;

type MacroSnapshot = {
  inflationYoY: number | null;
  medicalInflationYoY: number | null;
  fedFundsCurrent: number | null;
  fedFundsPrior: number | null;
  marketableAvgRate: number | null;
  treasury1Year: number | null;
  treasury3Year: number | null;
  treasury5Year: number | null;
  treasury10Year: number | null;
  warnings: string[];
};

const SEGMENTS = {
  longevity: 'Longevity Worrier',
  tax: 'Tax-Aware Optimizer',
  legacy: 'Legacy Builder'
} as const;

function numberFrom(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function stringFrom(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
  }
  return null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function titleCaseCounty(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatPercent(value: number | null, digits = 1) {
  if (value == null) return 'review needed';
  return `${value.toFixed(digits)}%`;
}

function formatMoney(value: number | null) {
  if (value == null) return 'review needed';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function safeError(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}

async function fetchFredSeries(seriesId: string, apiKey: string) {
  const url = new URL(FRED_URL);
  url.searchParams.set('series_id', seriesId);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('file_type', 'json');
  url.searchParams.set('sort_order', 'desc');
  url.searchParams.set('limit', '14');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FRED ${seriesId} request failed with ${response.status}`);
  }

  const payload = await response.json().catch(() => null);
  return Array.isArray(payload?.observations) ? payload.observations : [];
}

function parseBlsSeries(payload: UnknownRecord, seriesId: string) {
  const series = Array.isArray(payload?.Results?.series)
    ? payload.Results.series.find((item: UnknownRecord) => item?.seriesID === seriesId)
    : null;

  if (!Array.isArray(series?.data)) return [];
  return series.data
    .filter((row: UnknownRecord) => typeof row?.period === 'string' && /^M\d{2}$/.test(row.period))
    .map((row: UnknownRecord) => ({
      year: Number(row.year),
      month: Number(String(row.period).slice(1)),
      value: numberFrom(row.value)
    }))
    .filter((row) => row.value != null);
}

async function fetchBlsSeries(seriesIds: string[], apiKey?: string) {
  const currentYear = new Date().getFullYear();
  const response = await fetch(BLS_URL, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({
      seriesid: seriesIds,
      startyear: String(currentYear - 1),
      endyear: String(currentYear),
      registrationkey: apiKey || undefined
    })
  });

  if (!response.ok) {
    throw new Error(`BLS request failed with ${response.status}`);
  }

  return response.json().catch(() => null);
}

function calculateYoY(seriesRows: Array<{ year: number; month: number; value: number | null }>) {
  const sorted = [...seriesRows]
    .filter((row) => row.value != null)
    .sort((a, b) => (b.year - a.year) || (b.month - a.month));

  const current = sorted[0];
  if (!current || current.value == null) return null;

  const prior = sorted.find((row) => row.year === current.year - 1 && row.month === current.month);
  if (!prior || prior.value == null || prior.value === 0) return null;

  return ((current.value - prior.value) / prior.value) * 100;
}

async function getTreasurySnapshot() {
  const url = new URL(TREASURY_FISCAL_URL);
  url.searchParams.set('filter', 'security_desc:eq:Marketable');
  url.searchParams.set('sort', '-record_date');
  url.searchParams.set('page[size]', '1');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Treasury fiscal data request failed with ${response.status}`);
  }

  const payload = await response.json().catch(() => null);
  const latest = Array.isArray(payload?.data) ? payload.data[0] : null;
  const marketableAvgRate = numberFrom(latest?.avg_interest_rate_amt) ?? 4.1;

  return {
    marketableAvgRate,
    treasury1Year: marketableAvgRate - 0.2,
    treasury3Year: marketableAvgRate,
    treasury5Year: marketableAvgRate + 0.15,
    treasury10Year: marketableAvgRate + 0.3
  };
}

async function getFmpQuotes(apiKey: string) {
  const url = new URL(FMP_QUOTE_URL);
  url.searchParams.set('symbol', 'SPY,SCHD,XLV');
  url.searchParams.set('apikey', apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FMP quote request failed with ${response.status}`);
  }

  const payload = await response.json().catch(() => null);
  return Array.isArray(payload) ? payload : [];
}

async function getCountyPopulation(supabase: ReturnType<typeof createClient>, stateName: string, county: string) {
  const normalizedState = slugify(stateName);
  const normalizedCounty = slugify(county).replace(/-county$/, '');

  const { data } = await supabase
    .from('county_population')
    .select('population')
    .eq('state', normalizedState)
    .eq('county', normalizedCounty)
    .maybeSingle();

  return numberFrom(data?.population);
}

async function getCountyLifeExpectancy(supabase: ReturnType<typeof createClient>, stateName: string, county: string) {
  const countyName = county.toLowerCase().includes('county') ? county : `${titleCaseCounty(county)} County`;
  const { data } = await supabase
    .from('counties')
    .select('"Life Expectancy (Years)"')
    .eq('State', stateName)
    .eq('County', countyName);

  const values = (data || [])
    .map((row: UnknownRecord) => numberFrom(row['Life Expectancy (Years)']))
    .filter((value: number | null): value is number => value != null);

  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

async function getStateGuide(supabase: ReturnType<typeof createClient>, stateName: string) {
  const stateSlug = slugify(stateName);
  const { data } = await supabase
    .from('state_guides')
    .select('state_name,state_estate_tax,state_inheritance_tax,probate_cost_display,probate_timeline_display,medicaid_lookback_display,lady_bird_display,lady_bird_deed_available,tod_display,tod_deed_available')
    .eq('state_slug', stateSlug)
    .maybeSingle();

  return data || null;
}

async function getStateWatchItems(supabase: ReturnType<typeof createClient>, stateCode: string) {
  try {
    const { data } = await supabase
      .from('shield_brief_state_watch_items')
      .select('effective_date,headline,summary,category')
      .eq('state_code', stateCode)
      .eq('is_active', true)
      .order('effective_date', { ascending: false })
      .limit(3);

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function buildWeatherForecast(macro: MacroSnapshot) {
  const parts: string[] = [];

  if (macro.inflationYoY != null) {
    parts.push(`Headline inflation is running around ${formatPercent(macro.inflationYoY)} year over year`);
  }

  if (macro.medicalInflationYoY != null) {
    parts.push(`medical inflation is about ${formatPercent(macro.medicalInflationYoY)}${macro.medicalInflationYoY > (macro.inflationYoY ?? 0) ? ', still hotter than the broad basket' : ''}`);
  }

  if (macro.fedFundsCurrent != null && macro.fedFundsPrior != null) {
    const delta = macro.fedFundsCurrent - macro.fedFundsPrior;
    if (Math.abs(delta) < 0.01) {
      parts.push(`and the Fed funds backdrop is broadly unchanged near ${formatPercent(macro.fedFundsCurrent, 2)}`);
    } else {
      parts.push(`and short-term policy rates moved ${delta > 0 ? 'higher' : 'lower'} to about ${formatPercent(macro.fedFundsCurrent, 2)}`);
    }
  }

  if (macro.treasury10Year != null) {
    parts.push(`with a 10-year Treasury proxy near ${formatPercent(macro.treasury10Year, 2)}`);
  }

  return parts.length
    ? `${parts.join(' ')}. For retirees, the practical question is not “what did the market do?” but whether cash, bond income, healthcare costs, and taxes just got easier or harder to manage.`
    : 'Macro data feeds were partially unavailable, so this month’s forecast is using fallback rate assumptions rather than the full live stack.';
}

function buildSegmentSection(
  segment: string,
  context: {
    stateName: string;
    county: string;
    countyPopulation: number | null;
    lifeExpectancy: number | null;
    stateGuide: UnknownRecord | null;
    stateWatchItems: UnknownRecord[];
    macro: MacroSnapshot;
  }
) {
  const countyLabel = titleCaseCounty(context.county);
  const populationLabel = context.countyPopulation != null ? context.countyPopulation.toLocaleString('en-US') : 'review-needed';

  if (segment === 'longevity') {
    return {
      headline: `${countyLabel} County healthcare pressure is the story to watch this month`,
      summary: `For a longevity-focused retiree in ${context.stateName}, the meaningful question is how long healthcare costs can compound relative to income and portfolio draw. ${countyLabel} County’s reported population is about ${populationLabel}, and the county life expectancy lens is ${context.lifeExpectancy != null ? `${context.lifeExpectancy.toFixed(1)} years` : 'not yet loaded from the county table'}.`,
      bullets: [
        `Medical-care inflation is running about ${formatPercent(context.macro.medicalInflationYoY)} year over year, which matters more to retirees than broad-market headlines.`,
        context.lifeExpectancy != null
          ? `Your county longevity anchor is about ${context.lifeExpectancy.toFixed(1)} years, which should shape how conservatively you think about income durability and late-life care costs.`
          : 'County life expectancy did not resolve for this run, so the longevity section is leaning more heavily on state-level planning context.',
        context.stateGuide?.medicaid_lookback_display
          ? `${context.stateName} Medicaid look-back framing remains ${context.stateGuide.medicaid_lookback_display}, which matters when families assume care planning can wait until after a diagnosis.`
          : `${context.stateName} long-term-care and Medicaid timing rules should be reviewed before the household assumes future care can be solved reactively.`
      ]
    };
  }

  if (segment === 'tax') {
    return {
      headline: `This month’s tax story is the conversion window, not the market narrative`,
      summary: `For the tax-aware retiree, rates, inflation, and Medicare premium cliffs matter more than generic investing commentary. The monthly brief watches IRMAA pressure, Treasury-backed income opportunities, and whether the current environment is friendlier or less friendly to deliberate Roth conversion planning.`,
      bullets: [
        '2026 IRMAA monitoring still starts around $106,000 MAGI for single filers and $212,000 for joint filers, so “one more conversion” decisions still deserve threshold discipline.',
        `A marketable Treasury rate backdrop near ${formatPercent(context.macro.marketableAvgRate, 2)} means the cash alternative remains real, which changes how painful it is to harvest taxable income deliberately.`,
        context.macro.inflationYoY != null
          ? `With inflation near ${formatPercent(context.macro.inflationYoY)}, retirees should treat bracket management as a real return problem, not just a tax-return problem.`
          : 'Inflation data was partially unavailable, so the tax section is leaning more on rate positioning than on the full real-return backdrop.'
      ]
    };
  }

  return {
    headline: `${context.stateName} estate friction still matters more than generic market chatter`,
    summary: `For a legacy-focused retiree, the monthly “what changed?” lens should emphasize probate drag, state death-tax exposure, title strategy, and any state-specific watch items rather than broad-market noise.`,
    bullets: [
      context.stateWatchItems.length
        ? `Your state watchlist currently has ${context.stateWatchItems.length} tracked item${context.stateWatchItems.length === 1 ? '' : 's'} for ${context.stateName}, so the legal context is being actively monitored.`
        : `No manual state watch items are loaded yet for ${context.stateName}, so this month’s legacy section falls back to the standing state-guide posture.`,
      context.stateGuide?.probate_cost_display && context.stateGuide?.probate_timeline_display
        ? `${context.stateName} still carries a probate backdrop of ${context.stateGuide.probate_cost_display} and ${context.stateGuide.probate_timeline_display}, which is the kind of friction surviving families feel immediately.`
        : `${context.stateName} probate cost and timing should be reviewed before the household assumes a will alone will make administration easy.`,
      context.stateGuide?.state_estate_tax && context.stateGuide?.state_estate_tax !== 'None'
        ? `${context.stateName} still shows a state estate-tax exposure of ${context.stateGuide.state_estate_tax}, so transfer structure remains relevant.`
        : context.stateGuide?.state_inheritance_tax && context.stateGuide.state_inheritance_tax !== 'None'
          ? `${context.stateName} still shows an inheritance-tax overlay of ${context.stateGuide.state_inheritance_tax}, which can matter more than families expect.`
          : `${context.stateName} does not show a live state death-tax burden in the current guide snapshot, which lets probate and beneficiary coordination do more of the planning heavy lifting.`
    ]
  };
}

export const POST: APIRoute = async ({ request }) => {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  const fredApiKey = import.meta.env.FRED_API_KEY;
  const blsApiKey = import.meta.env.BLS_API_KEY;
  const fmpApiKey = import.meta.env.FMP_API_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(JSON.stringify({ error: 'Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY.' }), {
      status: 500,
      headers: DEFAULT_HEADERS
    });
  }

  const body = await request.json().catch(() => null);
  const fullName = stringFrom(body?.fullName) || 'Retirement Shield Client';
  const stateCode = stringFrom(body?.stateCode) || '';
  const stateName = stringFrom(body?.stateName) || '';
  const county = stringFrom(body?.county) || '';
  const segment = stringFrom(body?.segment) || 'legacy';

  if (!stateCode || !stateName || !county || !['longevity', 'tax', 'legacy'].includes(segment)) {
    return new Response(JSON.stringify({ error: 'State, county, and a valid segment are required.' }), {
      status: 400,
      headers: DEFAULT_HEADERS
    });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const warnings: string[] = [];

  try {
    const macro: MacroSnapshot = {
      inflationYoY: null,
      medicalInflationYoY: null,
      fedFundsCurrent: null,
      fedFundsPrior: null,
      marketableAvgRate: null,
      treasury1Year: null,
      treasury3Year: null,
      treasury5Year: null,
      treasury10Year: null,
      warnings
    };

    const [countyPopulation, lifeExpectancy, stateGuide, stateWatchItems, treasurySnapshot] = await Promise.all([
      getCountyPopulation(supabase, stateName, county),
      getCountyLifeExpectancy(supabase, stateName, county),
      getStateGuide(supabase, stateName),
      getStateWatchItems(supabase, stateCode),
      getTreasurySnapshot().catch((error) => {
        warnings.push(safeError(error));
        return {
          marketableAvgRate: 4.1,
          treasury1Year: 3.9,
          treasury3Year: 4.1,
          treasury5Year: 4.25,
          treasury10Year: 4.4
        };
      })
    ]);

    macro.marketableAvgRate = treasurySnapshot.marketableAvgRate;
    macro.treasury1Year = treasurySnapshot.treasury1Year;
    macro.treasury3Year = treasurySnapshot.treasury3Year;
    macro.treasury5Year = treasurySnapshot.treasury5Year;
    macro.treasury10Year = treasurySnapshot.treasury10Year;

    if (fredApiKey) {
      try {
        const fedFundsRows = await fetchFredSeries('FEDFUNDS', fredApiKey);
        macro.fedFundsCurrent = numberFrom(fedFundsRows[0]?.value);
        macro.fedFundsPrior = numberFrom(fedFundsRows[1]?.value);
      } catch (error) {
        warnings.push(safeError(error));
      }
    } else {
      warnings.push('FRED_API_KEY missing, so the Fed funds section is using Treasury context only.');
    }

    try {
      const blsPayload = await fetchBlsSeries(['CUUR0000SA0', 'CUUR0000SAM'], blsApiKey);
      macro.inflationYoY = calculateYoY(parseBlsSeries(blsPayload, 'CUUR0000SA0'));
      macro.medicalInflationYoY = calculateYoY(parseBlsSeries(blsPayload, 'CUUR0000SAM'));
    } catch (error) {
      warnings.push(safeError(error));
    }

    let fmpQuotes: UnknownRecord[] = [];
    if (fmpApiKey) {
      try {
        fmpQuotes = await getFmpQuotes(fmpApiKey);
      } catch (error) {
        warnings.push(safeError(error));
      }
    } else {
      warnings.push('FMP_API_KEY missing, so live ETF quote blocks are not included.');
    }

    const weatherForecast = buildWeatherForecast(macro);
    const segmentSection = buildSegmentSection(segment, {
      stateName,
      county,
      countyPopulation,
      lifeExpectancy,
      stateGuide,
      stateWatchItems,
      macro
    });

    const quoteLookup = Object.fromEntries(
      fmpQuotes.map((quote) => [String(quote.symbol || '').toUpperCase(), {
        symbol: String(quote.symbol || '').toUpperCase(),
        price: numberFrom(quote.price),
        changePct: numberFrom(quote.changesPercentage),
        name: stringFrom(quote.name, quote.symbol)
      }])
    );

    const report = {
      generatedAt: new Date().toISOString(),
      monthLabel: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
      fullName,
      stateCode,
      stateName,
      county: titleCaseCounty(county),
      segment,
      segmentLabel: SEGMENTS[segment as keyof typeof SEGMENTS],
      countyPopulation,
      lifeExpectancy,
      stateGuide: stateGuide ? {
        probateCostDisplay: stateGuide.probate_cost_display ?? 'Review needed',
        probateTimelineDisplay: stateGuide.probate_timeline_display ?? 'Review needed',
        stateEstateTax: stateGuide.state_estate_tax ?? 'Unknown',
        stateInheritanceTax: stateGuide.state_inheritance_tax ?? 'Unknown',
        ladyBirdDisplay: stateGuide.lady_bird_display ?? 'Review needed',
        ladyBirdAvailable: Boolean(stateGuide.lady_bird_deed_available),
        todDisplay: stateGuide.tod_display ?? 'Review needed',
        todAvailable: Boolean(stateGuide.tod_deed_available),
        medicaidLookbackDisplay: stateGuide.medicaid_lookback_display ?? 'Review needed'
      } : null,
      stateWatchItems,
      macro: {
        inflationYoY: macro.inflationYoY,
        medicalInflationYoY: macro.medicalInflationYoY,
        fedFundsCurrent: macro.fedFundsCurrent,
        fedFundsPrior: macro.fedFundsPrior,
        marketableAvgRate: macro.marketableAvgRate,
        treasury1Year: macro.treasury1Year,
        treasury3Year: macro.treasury3Year,
        treasury5Year: macro.treasury5Year,
        treasury10Year: macro.treasury10Year,
        weatherForecast
      },
      marketMonitor: [
        quoteLookup.SPY,
        quoteLookup.SCHD,
        quoteLookup.XLV
      ].filter(Boolean),
      segmentSection,
      warnings
    };

    return new Response(JSON.stringify({ report }), {
      status: 200,
      headers: DEFAULT_HEADERS
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: safeError(error) }), {
      status: 500,
      headers: DEFAULT_HEADERS
    });
  }
};
