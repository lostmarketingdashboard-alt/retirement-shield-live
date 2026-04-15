import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const RENTCAST_API_BASE = 'https://api.rentcast.io/v1';
const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

type UnknownRecord = Record<string, any>;

const STATE_NAME_BY_CODE: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho',
  IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada',
  NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon',
  PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', DC: 'District of Columbia'
};

// State-level RPP-style planning index based on BEA regional price parity framing.
const STATE_RPP_INDEX: Record<string, number> = {
  AL: 89.8, AK: 104.8, AZ: 98.4, AR: 86.9, CA: 110.7, CO: 103.0, CT: 103.9, DE: 99.3,
  FL: 99.6, GA: 92.9, HI: 110.0, ID: 92.7, IL: 95.7, IN: 90.2, IA: 87.8, KS: 89.2,
  KY: 89.5, LA: 91.3, ME: 97.8, MD: 102.4, MA: 107.0, MI: 91.5, MN: 95.4, MS: 87.0,
  MO: 89.4, MT: 95.6, NE: 90.1, NV: 101.7, NH: 101.3, NJ: 108.8, NM: 91.6, NY: 102.8,
  NC: 94.0, ND: 93.2, OH: 91.0, OK: 87.8, OR: 100.0, PA: 95.1, RI: 101.2, SC: 91.7,
  SD: 90.2, TN: 90.8, TX: 95.1, UT: 95.8, VT: 100.5, VA: 98.8, WA: 105.1, WV: 89.0,
  WI: 93.6, WY: 93.1, DC: 109.9
};

// Planning-level effective state income tax assumption for rough household comparison.
const STATE_INCOME_TAX_RATE: Record<string, number> = {
  AL: 4.0, AK: 0, AZ: 2.5, AR: 3.9, CA: 7.5, CO: 4.4, CT: 5.0, DE: 4.8, FL: 0, GA: 5.4,
  HI: 7.0, ID: 5.2, IL: 4.95, IN: 3.15, IA: 4.0, KS: 4.6, KY: 4.0, LA: 3.0, ME: 6.2,
  MD: 5.75, MA: 5.0, MI: 4.25, MN: 6.0, MS: 4.4, MO: 4.7, MT: 5.5, NE: 5.0, NV: 0,
  NH: 0, NJ: 6.0, NM: 4.7, NY: 6.5, NC: 4.5, ND: 2.2, OH: 3.5, OK: 3.9, OR: 7.5,
  PA: 3.07, RI: 4.8, SC: 4.7, SD: 0, TN: 0, TX: 0, UT: 4.55, VT: 5.8, VA: 4.7,
  WA: 0, WV: 4.8, WI: 5.2, WY: 0, DC: 6.5
};

function pickNumber(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function pickString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
  }
  return null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function currency(value: number | null) {
  if (value == null) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function normalizeAddress(record: UnknownRecord, fallbackAddress: string) {
  const line = pickString(record.addressLine1, record.streetAddress, record.formattedAddress, fallbackAddress) ?? fallbackAddress;
  const city = pickString(record.city);
  const stateCode = pickString(record.state);
  const stateName = stateCode ? (STATE_NAME_BY_CODE[stateCode] || stateCode) : pickString(record.stateName);
  const zipCode = pickString(record.zipCode, record.zip, record.postalCode);
  const countyRaw = pickString(record.county, record.countyName);
  const county = countyRaw ? (countyRaw.endsWith('County') ? countyRaw : `${countyRaw} County`) : null;

  return {
    shortAddress: line,
    fullAddress: [line, [city, stateCode].filter(Boolean).join(', '), zipCode].filter(Boolean).join(' ').replace(/\s+,/g, ',').trim(),
    city,
    stateCode,
    stateName,
    zipCode,
    county
  };
}

async function rentcastFetch(path: string, query: Record<string, string>, apiKey: string) {
  const url = new URL(`${RENTCAST_API_BASE}${path}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    headers: {
      ...DEFAULT_HEADERS,
      'X-Api-Key': apiKey
    }
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = pickString(data?.message, data?.error, `RentCast returned ${response.status}`);
    throw new Error(message ?? 'RentCast request failed');
  }

  return data;
}

async function loadStateGuide(supabase: ReturnType<typeof createClient>, stateName: string | null) {
  if (!stateName) return null;
  const stateSlug = slugify(stateName);
  const { data } = await supabase
    .from('state_guides')
    .select('*')
    .eq('state_slug', stateSlug)
    .maybeSingle();

  return data || null;
}

async function loadCountyLifeExpectancy(supabase: ReturnType<typeof createClient>, stateName: string | null, countyName: string | null) {
  if (!stateName || !countyName) return null;
  const { data } = await supabase
    .from('counties')
    .select('"Life Expectancy (Years)"')
    .eq('State', stateName)
    .eq('County', countyName);

  const values = (data || [])
    .map((row: any) => row['Life Expectancy (Years)'])
    .filter((value: unknown) => typeof value === 'number');

  if (!values.length) return null;
  return values.reduce((sum: number, value: number) => sum + value, 0) / values.length;
}

function probateMonthsFromDisplay(value: string | null | undefined) {
  const matches = String(value || '').match(/\d+/g);
  if (!matches?.length) return 12;
  const nums = matches.map(Number).filter(Number.isFinite);
  return nums.reduce((sum, num) => sum + num, 0) / nums.length;
}

function complexityScore(guide: any) {
  if (!guide) return 50;

  let score = 35;
  if (guide.state_estate_tax && guide.state_estate_tax !== 'None') score += 12;
  if (guide.state_inheritance_tax && guide.state_inheritance_tax !== 'None') score += 8;
  if (!guide.homestead_protects_from_creditors) score += 8;
  if (!guide.lady_bird_deed_available) score += 7;
  if (!guide.tod_deed_available) score += 6;
  if (!guide.small_estate_affidavit_available) score += 4;
  score += Math.min(20, probateMonthsFromDisplay(guide.probate_timeline_display) * 0.8);
  score += Math.min(10, (pickNumber(guide.probate_cost_pct_high) ?? 4) * 1.1);
  return Math.max(0, Math.min(100, Math.round(score)));
}

async function buildLocationSnapshot(
  supabase: ReturnType<typeof createClient>,
  apiKey: string,
  address: string,
  annualBudget: number,
  annualTaxableIncome: number
) {
  const propertyResults = await rentcastFetch('/properties', {
    address,
    limit: '1',
    suppressLogging: 'true'
  }, apiKey);

  const propertyRecord = Array.isArray(propertyResults) ? propertyResults[0] : propertyResults?.results?.[0];
  if (!propertyRecord) {
    throw new Error(`No property record was found for "${address}".`);
  }

  const normalized = normalizeAddress(propertyRecord, address);
  const canonicalAddress = normalized.fullAddress || address;

  const [valueData, rentData, guide, lifeExpectancy] = await Promise.all([
    rentcastFetch('/avm/value', {
      address: canonicalAddress,
      compCount: '5',
      lookupSubjectAttributes: 'true',
      suppressLogging: 'true'
    }, apiKey),
    rentcastFetch('/avm/rent/long-term', {
      address: canonicalAddress,
      compCount: '5',
      lookupSubjectAttributes: 'true',
      suppressLogging: 'true'
    }, apiKey),
    loadStateGuide(supabase, normalized.stateName),
    loadCountyLifeExpectancy(supabase, normalized.stateName, normalized.county)
  ]);

  const homeValue = pickNumber(valueData?.price, valueData?.value, valueData?.estimate, valueData?.predictedValue);
  const estimatedRent = pickNumber(rentData?.rent, rentData?.price, rentData?.estimate, rentData?.predictedRent);
  const stateCode = normalized.stateCode || '';
  const rppIndex = STATE_RPP_INDEX[stateCode] ?? 100;
  const incomeTaxRate = STATE_INCOME_TAX_RATE[stateCode] ?? 0;
  const estimatedStateTax = annualTaxableIncome * (incomeTaxRate / 100);
  const budgetAdjusted = annualBudget * (rppIndex / 100);
  const complexity = complexityScore(guide);

  return {
    inputAddress: address,
    shortAddress: normalized.shortAddress,
    fullAddress: canonicalAddress,
    city: normalized.city,
    stateCode,
    stateName: normalized.stateName,
    countyName: normalized.county,
    homeValue,
    homeValueLabel: currency(homeValue) ?? '--',
    estimatedRent,
    estimatedRentLabel: currency(estimatedRent) ?? '--',
    rppIndex,
    rppLabel: `${rppIndex.toFixed(1)} vs 100 U.S. baseline`,
    budgetAdjusted,
    budgetAdjustedLabel: currency(budgetAdjusted) ?? '--',
    incomeTaxRate,
    estimatedStateTax,
    estimatedStateTaxLabel: currency(estimatedStateTax) ?? '--',
    lifeExpectancy,
    lifeExpectancyLabel: lifeExpectancy != null ? `${lifeExpectancy.toFixed(1)} yrs` : '—',
    complexity,
    complexityLabel: `${complexity}/100`,
    estateGuide: guide ? {
      probateCostDisplay: guide.probate_cost_display ?? 'Review needed',
      probateTimelineDisplay: guide.probate_timeline_display ?? 'Review needed',
      homesteadDisplay: guide.homestead_display ?? 'Review needed',
      homesteadProtectsFromCreditors: Boolean(guide.homestead_protects_from_creditors),
      ladyBirdDisplay: guide.lady_bird_display ?? 'Review needed',
      ladyBirdAvailable: Boolean(guide.lady_bird_deed_available),
      todDisplay: guide.tod_display ?? 'Review needed',
      todAvailable: Boolean(guide.tod_deed_available),
      stateEstateTax: guide.state_estate_tax ?? 'Unknown',
      stateInheritanceTax: guide.state_inheritance_tax ?? 'Unknown'
    } : null
  };
}

function compareLocation(current: any, candidate: any) {
  const equityShift = (current.homeValue ?? 0) - (candidate.homeValue ?? 0);
  const annualBudgetDelta = candidate.budgetAdjusted - current.budgetAdjusted;
  const annualTaxDelta = candidate.estimatedStateTax - current.estimatedStateTax;
  const longevityDelta = (candidate.lifeExpectancy ?? 0) - (current.lifeExpectancy ?? 0);
  const complexityDelta = candidate.complexity - current.complexity;
  const firstYearImpact = equityShift - annualBudgetDelta - annualTaxDelta;

  return {
    candidate,
    equityShift,
    annualBudgetDelta,
    annualTaxDelta,
    longevityDelta,
    complexityDelta,
    firstYearImpact,
    equityShiftLabel: currency(equityShift) ?? '--',
    annualBudgetDeltaLabel: currency(annualBudgetDelta) ?? '--',
    annualTaxDeltaLabel: currency(annualTaxDelta) ?? '--',
    firstYearImpactLabel: currency(firstYearImpact) ?? '--',
    longevityDeltaLabel: `${longevityDelta >= 0 ? '+' : ''}${longevityDelta.toFixed(1)} yrs`,
    complexityDeltaLabel: `${complexityDelta >= 0 ? '+' : ''}${complexityDelta}`
  };
}

export const POST: APIRoute = async ({ request }) => {
  const rentcastKey = import.meta.env.RENTCAST_API_KEY;
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!rentcastKey) {
    return new Response(JSON.stringify({ error: 'Missing RENTCAST_API_KEY server environment variable.' }), {
      status: 500,
      headers: DEFAULT_HEADERS
    });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(JSON.stringify({ error: 'Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY.' }), {
      status: 500,
      headers: DEFAULT_HEADERS
    });
  }

  const body = await request.json().catch(() => null);
  const currentAddress = pickString(body?.currentAddress);
  const candidateAddresses = (Array.isArray(body?.candidateAddresses) ? body.candidateAddresses : [])
    .map((item) => pickString(item))
    .filter(Boolean) as string[];
  const annualBudget = pickNumber(body?.annualBudget) ?? 72000;
  const annualTaxableIncome = pickNumber(body?.annualTaxableIncome) ?? 85000;

  if (!currentAddress || !candidateAddresses.length) {
    return new Response(JSON.stringify({ error: 'Current address and at least one destination are required.' }), {
      status: 400,
      headers: DEFAULT_HEADERS
    });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const [current, ...destinations] = await Promise.all([
      buildLocationSnapshot(supabase, rentcastKey, currentAddress, annualBudget, annualTaxableIncome),
      ...candidateAddresses.slice(0, 2).map((address) => buildLocationSnapshot(supabase, rentcastKey, address, annualBudget, annualTaxableIncome))
    ]);

    const comparisons = destinations.map((candidate) => compareLocation(current, candidate));
    const best = comparisons.slice().sort((a, b) => b.firstYearImpact - a.firstYearImpact)[0];
    const shareSlug = `move-${slugify(current.stateName || 'current')}-to-${slugify(best?.candidate.stateName || destinations[0]?.stateName || 'destination')}-${Math.random().toString(36).slice(2, 8)}`;

    return new Response(JSON.stringify({
      generatedAt: new Date().toISOString(),
      shareSlug,
      annualBudget,
      annualTaxableIncome,
      current,
      destinations,
      comparisons,
      summary: {
        headline: best
          ? `Moving to ${best.candidate.stateName} could change first-year financial impact by about ${best.firstYearImpactLabel}.`
          : 'Your relocation comparison is ready.',
        subline: best
          ? `That estimate blends home-equity change, state-level cost-of-living shift, and planning-level state income-tax drag.`
          : 'This comparison blends property value, cost-of-living, tax, longevity, and estate-planning factors.'
      }
    }), { status: 200, headers: DEFAULT_HEADERS });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unable to generate the relocation comparison.'
    }), { status: 500, headers: DEFAULT_HEADERS });
  }
};
