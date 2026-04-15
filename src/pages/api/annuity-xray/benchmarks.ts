import type { APIRoute } from 'astro';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };
const FMP_URL = 'https://financialmodelingprep.com/stable/treasury-rates';
const TREASURY_FISCAL_URL = 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates';

type TreasurySnapshot = {
  asOfDate: string;
  year1: number;
  year3: number;
  year5: number;
  year10: number;
  source: string;
  marketableAvgRate?: number | null;
};

function numberFrom(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function formatError(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Unknown benchmark error';
}

async function getFmpTreasuryRates(apiKey: string): Promise<TreasurySnapshot | null> {
  const url = new URL(FMP_URL);
  url.searchParams.set('apikey', apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FMP treasury rates request failed with ${response.status}`);
  }

  const payload = await response.json().catch(() => null);
  const latest = Array.isArray(payload) ? payload[0] : payload;
  if (!latest) return null;

  const year1 = numberFrom(latest.year1);
  const year3 = numberFrom(latest.year3);
  const year5 = numberFrom(latest.year5);
  const year10 = numberFrom(latest.year10);

  if ([year1, year3, year5, year10].some((value) => value == null)) {
    return null;
  }

  return {
    asOfDate: String(latest.date || new Date().toISOString().slice(0, 10)),
    year1: year1 as number,
    year3: year3 as number,
    year5: year5 as number,
    year10: year10 as number,
    source: 'Financial Modeling Prep Treasury Rates API',
    marketableAvgRate: null
  };
}

async function getTreasuryFallback(): Promise<TreasurySnapshot> {
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
  const asOfDate = String(latest?.record_date || new Date().toISOString().slice(0, 10));

  return {
    asOfDate,
    year1: marketableAvgRate - 0.2,
    year3: marketableAvgRate,
    year5: marketableAvgRate + 0.15,
    year10: marketableAvgRate + 0.3,
    source: 'U.S. Treasury Fiscal Data average marketable rates fallback',
    marketableAvgRate
  };
}

function buildBenchmarks(snapshot: TreasurySnapshot) {
  const treasury = {
    oneYear: snapshot.year1,
    threeYear: snapshot.year3,
    fiveYear: snapshot.year5,
    tenYear: snapshot.year10
  };

  return {
    asOfDate: snapshot.asOfDate,
    source: snapshot.source,
    marketableAvgRate: snapshot.marketableAvgRate ?? null,
    treasury,
    cdBenchmarks: {
      oneYear: treasury.oneYear + 0.35,
      threeYear: treasury.threeYear + 0.30,
      fiveYear: treasury.fiveYear + 0.20
    },
    bondLadder: {
      shortIntermediateBlend: ((treasury.oneYear + treasury.threeYear + treasury.fiveYear) / 3) - 0.15,
      longBlend: ((treasury.threeYear + treasury.fiveYear + treasury.tenYear) / 3) - 0.20
    }
  };
}

export const GET: APIRoute = async () => {
  const apiKey = import.meta.env.FMP_API_KEY;

  try {
    let snapshot: TreasurySnapshot | null = null;
    let warning: string | null = null;

    if (apiKey) {
      try {
        snapshot = await getFmpTreasuryRates(apiKey);
      } catch (error) {
        warning = formatError(error);
      }
    }

    if (!snapshot) {
      snapshot = await getTreasuryFallback();
    }

    return new Response(JSON.stringify({
      benchmarks: buildBenchmarks(snapshot),
      warning
    }), { status: 200, headers: DEFAULT_HEADERS });
  } catch (error) {
    return new Response(JSON.stringify({
      error: formatError(error)
    }), { status: 500, headers: DEFAULT_HEADERS });
  }
};
