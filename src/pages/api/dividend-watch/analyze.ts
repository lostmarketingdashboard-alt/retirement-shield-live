import type { APIRoute } from 'astro';

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };
const FMP_BASE = 'https://financialmodelingprep.com/stable';

type HoldingInput = {
  ticker: string;
  shares: number;
};

type UnknownRecord = Record<string, any>;

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

function formatError(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Unknown dividend-watch error';
}

function currency(value: number | null) {
  if (value == null) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function buildFmpUrl(path: string, apiKey: string, params?: Record<string, string>) {
  const url = new URL(`${FMP_BASE}${path}`);
  url.searchParams.set('apikey', apiKey);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url;
}

async function fmpFetch(path: string, apiKey: string, params?: Record<string, string>) {
  const response = await fetch(buildFmpUrl(path, apiKey, params));
  if (!response.ok) {
    throw new Error(`FMP ${path} failed with ${response.status}`);
  }
  return response.json().catch(() => null);
}

function quarterMonth(dateText: string | null) {
  if (!dateText) return null;
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return null;
  return date.getUTCMonth() + 1;
}

function sameMonth(dateText: string | null, month: number) {
  return quarterMonth(dateText) === month;
}

function safeDateLabel(dateText: string | null) {
  if (!dateText) return 'Review needed';
  const date = new Date(dateText);
  if (Number.isNaN(date.getTime())) return dateText;
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function buildMonthlyCalendar(holdings: Array<any>) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2026, i, 1).toLocaleDateString('en-US', { month: 'long' }),
    income: 0,
    items: [] as string[]
  }));

  holdings.forEach((holding) => {
    (holding.expectedMonths || []).forEach((month: number) => {
      const idx = month - 1;
      if (!months[idx]) return;
      months[idx].income += holding.expectedMonthlyAmount ?? 0;
      months[idx].items.push(`${holding.ticker} ${currency(holding.expectedMonthlyAmount) ?? '—'}`);
    });
  });

  return months.map((month) => ({
    ...month,
    incomeLabel: currency(month.income) ?? '$0'
  }));
}

function changeSignal(dividends: Array<any>) {
  if (dividends.length < 2) {
    return { label: 'Limited history', tone: 'watch', copy: 'Not enough recent dividend records returned to score a trend confidently.' };
  }

  const latest = numberFrom(dividends[0]?.adjDividend, dividends[0]?.dividend);
  const prior = numberFrom(dividends[1]?.adjDividend, dividends[1]?.dividend);

  if (latest == null || prior == null || prior === 0) {
    return { label: 'Review needed', tone: 'watch', copy: 'Recent dividend records were incomplete, so trend direction needs manual review.' };
  }

  const delta = ((latest - prior) / prior) * 100;

  if (delta > 1) {
    return { label: 'Dividend increased', tone: 'good', copy: `The latest declared dividend is about ${delta.toFixed(1)}% above the prior comparable payment.` };
  }

  if (delta < -1) {
    return { label: 'Dividend cut risk realized', tone: 'risk', copy: `The latest declared dividend is about ${Math.abs(delta).toFixed(1)}% below the prior comparable payment.` };
  }

  return { label: 'Dividend held flat', tone: 'watch', copy: 'The latest dividend appears broadly unchanged versus the prior comparable payment.' };
}

function payoutSignal(payoutRatio: number | null) {
  if (payoutRatio == null) {
    return { label: 'Payout ratio unavailable', tone: 'watch', copy: 'Some ETFs, funds, and incomplete filings do not return a clean payout ratio.' };
  }
  if (payoutRatio >= 100) {
    return { label: 'Payout ratio critical', tone: 'risk', copy: `Payout ratio is around ${payoutRatio.toFixed(0)}%, which usually means the current dividend needs closer scrutiny.` };
  }
  if (payoutRatio >= 80) {
    return { label: 'Payout ratio elevated', tone: 'watch', copy: `Payout ratio is around ${payoutRatio.toFixed(0)}%, which is a softer warning that the dividend cushion may be thin.` };
  }
  return { label: 'Payout ratio looks manageable', tone: 'good', copy: `Payout ratio is around ${payoutRatio.toFixed(0)}%, which is more comfortable than the high-risk zone.` };
}

async function analyzeHolding(apiKey: string, holding: HoldingInput) {
  const ticker = holding.ticker.toUpperCase();

  const [quotePayload, ratiosPayload, dividendsPayload] = await Promise.all([
    fmpFetch('/quote', apiKey, { symbol: ticker }),
    fmpFetch('/ratios-ttm', apiKey, { symbol: ticker }).catch(() => null),
    fmpFetch('/dividends', apiKey, { symbol: ticker }).catch(() => null)
  ]);

  const quote = Array.isArray(quotePayload) ? quotePayload[0] : quotePayload;
  const ratios = Array.isArray(ratiosPayload) ? ratiosPayload[0] : ratiosPayload;
  const dividends = Array.isArray(dividendsPayload) ? dividendsPayload : [];

  const latestDividend = numberFrom(dividends[0]?.adjDividend, dividends[0]?.dividend, quote?.lastDividend);
  const dividendYield = numberFrom(quote?.dividendYield, quote?.yield);
  const payoutRatioRaw = numberFrom(ratios?.payoutRatioTTM, ratios?.payoutRatio);
  const payoutRatio = payoutRatioRaw != null && payoutRatioRaw <= 1 ? payoutRatioRaw * 100 : payoutRatioRaw;
  const annualDividendPerShare = latestDividend != null
    ? latestDividend * (String(dividends[0]?.frequency || '').toLowerCase().includes('month') ? 12 : 4)
    : null;
  const annualIncome = annualDividendPerShare != null ? annualDividendPerShare * holding.shares : null;

  const nextEvent = dividends.find((row: UnknownRecord) => {
    const exDate = stringFrom(row.exDate);
    if (!exDate) return false;
    const date = new Date(exDate);
    return !Number.isNaN(date.getTime()) && date >= new Date();
  }) || dividends[0] || null;

  const expectedMonths = dividends.length
    ? Array.from(new Set(dividends.slice(0, 8).map((row: UnknownRecord) => quarterMonth(stringFrom(row.paymentDate, row.recordDate, row.exDate))).filter(Boolean))).sort((a, b) => a - b)
    : [];

  const monthlyEstimate = annualIncome != null && expectedMonths.length ? annualIncome / expectedMonths.length : 0;
  const change = changeSignal(dividends);
  const payout = payoutSignal(payoutRatio);

  let healthScore = 72;
  if (change.tone === 'risk') healthScore -= 35;
  if (change.tone === 'watch') healthScore -= 8;
  if (payout.tone === 'risk') healthScore -= 28;
  if (payout.tone === 'watch') healthScore -= 12;
  if (!expectedMonths.length) healthScore -= 8;
  healthScore = Math.max(5, Math.min(98, healthScore));

  return {
    ticker,
    shares: holding.shares,
    name: stringFrom(quote?.name, ticker) || ticker,
    price: numberFrom(quote?.price),
    priceLabel: currency(numberFrom(quote?.price)),
    dividendYield,
    dividendYieldLabel: dividendYield != null ? `${dividendYield.toFixed(2)}%` : '—',
    payoutRatio,
    payoutRatioLabel: payoutRatio != null ? `${payoutRatio.toFixed(0)}%` : '—',
    annualDividendPerShare,
    annualDividendPerShareLabel: currency(annualDividendPerShare) ?? '—',
    annualIncome,
    annualIncomeLabel: currency(annualIncome) ?? '—',
    nextExDividendDate: stringFrom(nextEvent?.exDate),
    nextExDividendDateLabel: safeDateLabel(stringFrom(nextEvent?.exDate)),
    nextPaymentDate: stringFrom(nextEvent?.paymentDate),
    nextPaymentDateLabel: safeDateLabel(stringFrom(nextEvent?.paymentDate)),
    dividendChangeLabel: change.label,
    dividendChangeTone: change.tone,
    dividendChangeCopy: change.copy,
    payoutWarningLabel: payout.label,
    payoutWarningTone: payout.tone,
    payoutWarningCopy: payout.copy,
    expectedMonths,
    expectedMonthlyAmount: monthlyEstimate,
    expectedMonthlyAmountLabel: currency(monthlyEstimate) ?? '—',
    healthScore
  };
}

function aggregatePortfolio(holdings: Array<any>) {
  const supported = holdings.filter((holding) => holding.annualIncome != null);
  const annualIncome = supported.reduce((sum, holding) => sum + (holding.annualIncome ?? 0), 0);
  const averageMonthlyIncome = annualIncome / 12;
  const calendar = buildMonthlyCalendar(supported);
  const largestIncome = supported.reduce((best, holding) => {
    if (!best || (holding.annualIncome ?? 0) > (best.annualIncome ?? 0)) return holding;
    return best;
  }, null as any);
  const concentrationPct = largestIncome && annualIncome > 0 ? ((largestIncome.annualIncome / annualIncome) * 100) : null;

  let portfolioScore = supported.length ? supported.reduce((sum, holding) => sum + holding.healthScore, 0) / supported.length : 35;
  if ((concentrationPct ?? 0) > 35) portfolioScore -= 12;
  if (supported.length < 4) portfolioScore -= 8;
  portfolioScore = Math.max(5, Math.min(98, Math.round(portfolioScore)));

  const alerts = supported.flatMap((holding) => {
    const rows = [];
    if (holding.nextExDividendDate) {
      rows.push({
        type: 'ex-dividend',
        tone: 'watch',
        title: `${holding.ticker} ex-dividend date coming up`,
        copy: `${holding.name} goes ex-dividend on ${holding.nextExDividendDateLabel}.`
      });
    }
    if (holding.dividendChangeTone !== 'good') {
      rows.push({
        type: 'dividend-change',
        tone: holding.dividendChangeTone,
        title: `${holding.ticker} dividend change status`,
        copy: holding.dividendChangeCopy
      });
    }
    if (holding.payoutWarningTone !== 'good') {
      rows.push({
        type: 'payout-ratio',
        tone: holding.payoutWarningTone,
        title: `${holding.ticker} payout ratio warning`,
        copy: holding.payoutWarningCopy
      });
    }
    return rows;
  }).slice(0, 8);

  return {
    annualIncome,
    annualIncomeLabel: currency(annualIncome) ?? '$0',
    averageMonthlyIncome,
    averageMonthlyIncomeLabel: currency(averageMonthlyIncome) ?? '$0',
    calendar,
    portfolioScore,
    concentrationPct,
    concentrationLabel: concentrationPct != null ? `${concentrationPct.toFixed(0)}%` : '—',
    largestIncomeTicker: largestIncome?.ticker ?? null,
    alerts
  };
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.FMP_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing FMP_API_KEY server environment variable.' }), {
      status: 500,
      headers: DEFAULT_HEADERS
    });
  }

  const body = await request.json().catch(() => null);
  const holdings = (Array.isArray(body?.holdings) ? body.holdings : [])
    .map((row: UnknownRecord) => ({
      ticker: stringFrom(row?.ticker)?.toUpperCase() || '',
      shares: numberFrom(row?.shares) ?? 0
    }))
    .filter((row) => row.ticker && row.shares > 0)
    .slice(0, 15) as HoldingInput[];

  if (!holdings.length) {
    return new Response(JSON.stringify({ error: 'At least one holding with shares is required.' }), {
      status: 400,
      headers: DEFAULT_HEADERS
    });
  }

  try {
    const analyzed = await Promise.all(holdings.map((holding) => analyzeHolding(apiKey, holding)));
    const portfolio = aggregatePortfolio(analyzed);

    return new Response(JSON.stringify({
      portfolio: {
        ...portfolio,
        holdings: analyzed
      }
    }), {
      status: 200,
      headers: DEFAULT_HEADERS
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: formatError(error) }), {
      status: 500,
      headers: DEFAULT_HEADERS
    });
  }
};
