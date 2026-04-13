import type { APIRoute } from 'astro';

const RENTCAST_API_BASE = 'https://api.rentcast.io/v1';
const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

type UnknownRecord = Record<string, any>;

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

function currency(value: number | null) {
  if (value == null) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function numberLabel(value: number | null, suffix = '') {
  if (value == null) return null;
  const label = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value % 1 === 0 ? 0 : 1
  }).format(value);
  return suffix ? `${label}${suffix}` : label;
}

function percentLabel(value: number | null) {
  if (value == null) return null;
  return `${value.toFixed(1)}%`;
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function normalizeAddress(record: UnknownRecord, fallbackAddress: string) {
  const line = pickString(record.addressLine1, record.streetAddress, record.formattedAddress, fallbackAddress) ?? fallbackAddress;
  const city = pickString(record.city);
  const state = pickString(record.state);
  const zipCode = pickString(record.zipCode, record.zip, record.postalCode);
  const county = pickString(record.county, record.countyName);
  const parts = [line];
  const locality = [city, state].filter(Boolean).join(', ');
  if (locality) parts.push(locality);
  if (zipCode) parts.push(zipCode);

  return {
    shortAddress: line,
    fullAddress: parts.join(' ').replace(/\s+,/g, ',').trim(),
    county
  };
}

function buildComparable(item: UnknownRecord) {
  const address = normalizeAddress(item, 'Comparable property').fullAddress;
  const price =
    pickNumber(item.price, item.listPrice, item.rent, item.closePrice, item.salePrice, item.value) ??
    pickNumber(item.predictedValue, item.predictedRent);
  const distanceMiles = pickNumber(item.distance, item.distanceMiles, item.milesFromSubject);
  const squareFootage = pickNumber(item.squareFootage, item.livingArea, item.area);
  const beds = pickNumber(item.bedrooms, item.beds);
  const baths = pickNumber(item.bathrooms, item.baths);
  const date = pickString(item.listedDate, item.lastSaleDate, item.removedDate, item.date);

  const metaBits = [
    beds != null ? `${numberLabel(beds)} bd` : null,
    baths != null ? `${numberLabel(baths)} ba` : null,
    squareFootage != null ? `${numberLabel(squareFootage)} sqft` : null,
    date ? formatDate(date) : null
  ].filter(Boolean);

  return {
    address,
    priceLabel: currency(price) ?? '--',
    distanceLabel: distanceMiles != null ? `${distanceMiles.toFixed(1)} mi away` : null,
    meta: metaBits.join(' · ') || 'No additional details returned.'
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

function buildRangeLabel(low: number | null, high: number | null, center: number | null) {
  if (low != null && high != null) return `${currency(low)} - ${currency(high)}`;
  if (center != null) return currency(center);
  return '--';
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RENTCAST_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({
      error: 'Missing RENTCAST_API_KEY server environment variable.'
    }), { status: 500, headers: DEFAULT_HEADERS });
  }

  const body = await request.json().catch(() => null);
  const requestedAddress = pickString(body?.address);

  if (!requestedAddress) {
    return new Response(JSON.stringify({ error: 'Address is required.' }), {
      status: 400,
      headers: DEFAULT_HEADERS
    });
  }

  try {
    const propertyResults = await rentcastFetch('/properties', {
      address: requestedAddress,
      limit: '1',
      suppressLogging: 'true'
    }, apiKey);

    const propertyRecord = Array.isArray(propertyResults) ? propertyResults[0] : propertyResults?.results?.[0];

    if (!propertyRecord) {
      return new Response(JSON.stringify({
        error: 'No property record was found for that address in RentCast.'
      }), { status: 404, headers: DEFAULT_HEADERS });
    }

    const normalizedAddress = normalizeAddress(propertyRecord, requestedAddress);
    const canonicalAddress = normalizedAddress.fullAddress || requestedAddress;

    const [valueData, rentData] = await Promise.all([
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
      }, apiKey)
    ]);

    const valueEstimate = pickNumber(valueData?.price, valueData?.value, valueData?.estimate, valueData?.predictedValue);
    const valueLow = pickNumber(valueData?.priceRangeLow, valueData?.low, valueData?.valueRangeLow, valueData?.rentRangeLow);
    const valueHigh = pickNumber(valueData?.priceRangeHigh, valueData?.high, valueData?.valueRangeHigh, valueData?.rentRangeHigh);

    const rentEstimate = pickNumber(rentData?.rent, rentData?.price, rentData?.estimate, rentData?.predictedRent);
    const rentLow = pickNumber(rentData?.rentRangeLow, rentData?.low, rentData?.priceRangeLow);
    const rentHigh = pickNumber(rentData?.rentRangeHigh, rentData?.high, rentData?.priceRangeHigh);

    const bedrooms = pickNumber(
      propertyRecord.bedrooms,
      propertyRecord.beds,
      valueData?.subjectProperty?.bedrooms,
      rentData?.subjectProperty?.bedrooms
    );
    const bathrooms = pickNumber(
      propertyRecord.bathrooms,
      propertyRecord.baths,
      valueData?.subjectProperty?.bathrooms,
      rentData?.subjectProperty?.bathrooms
    );
    const squareFootage = pickNumber(
      propertyRecord.squareFootage,
      propertyRecord.livingArea,
      valueData?.subjectProperty?.squareFootage,
      rentData?.subjectProperty?.squareFootage
    );
    const lotSize = pickNumber(propertyRecord.lotSize, propertyRecord.lotSquareFootage);
    const yearBuilt = pickNumber(propertyRecord.yearBuilt, propertyRecord.yearConstructed);
    const lastSalePrice = pickNumber(propertyRecord.lastSalePrice, propertyRecord.salePrice);
    const lastSaleDate = pickString(propertyRecord.lastSaleDate, propertyRecord.saleDate);
    const assessedValue = pickNumber(
      propertyRecord.assessedValue,
      propertyRecord.taxAssessedValue,
      propertyRecord.assessmentValue
    );

    const appreciationAmount = valueEstimate != null && lastSalePrice != null ? valueEstimate - lastSalePrice : null;
    const appreciationPct = appreciationAmount != null && lastSalePrice ? (appreciationAmount / lastSalePrice) * 100 : null;
    const grossYield = valueEstimate && rentEstimate ? ((rentEstimate * 12) / valueEstimate) * 100 : null;
    const pricePerSquareFoot = valueEstimate && squareFootage ? valueEstimate / squareFootage : null;

    const salesComparables = Array.isArray(valueData?.comparables) ? valueData.comparables.slice(0, 5).map(buildComparable) : [];
    const rentComparables = Array.isArray(rentData?.comparables) ? rentData.comparables.slice(0, 5).map(buildComparable) : [];

    const now = new Date();
    const reportId = `RS-HEQ-${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`;

    const valueSummary = valueEstimate != null
      ? `${currency(valueEstimate)} estimate using ${salesComparables.length} comparable sale${salesComparables.length === 1 ? '' : 's'}.`
      : 'RentCast returned the property record, but not a value estimate.';
    const rentSummary = rentEstimate != null
      ? `${currency(rentEstimate)}/mo estimate using ${rentComparables.length} rental comparable${rentComparables.length === 1 ? '' : 's'}.`
      : 'RentCast returned the property record, but not a rent estimate.';

    const summaryHeadline = grossYield != null
      ? `This property is valued around ${currency(valueEstimate)} with an estimated gross rental yield near ${percentLabel(grossYield)}.`
      : `This property is valued around ${currency(valueEstimate) ?? '--'} with live RentCast record matching.`;
    const summarySubline = lastSalePrice != null && appreciationAmount != null
      ? `The latest recorded sale on file is ${currency(lastSalePrice)}${lastSaleDate ? ` on ${formatDate(lastSaleDate)}` : ''}, which implies about ${currency(appreciationAmount)} in price movement since that transaction.`
      : 'This page is limited to RentCast-backed property, value, rent, and comparable data, so it does not infer mortgage payoff or true owner equity.';

    return new Response(JSON.stringify({
      requestedAddress,
      reportId,
      generatedAtLabel: new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }).format(now),
      dataSourcesLabel: 'RentCast /properties, /avm/value, and /avm/rent/long-term',
      property: {
        shortAddress: normalizedAddress.shortAddress,
        addressLine: pickString(propertyRecord.addressLine1, propertyRecord.streetAddress),
        fullAddress: normalizedAddress.fullAddress,
        propertyType: pickString(propertyRecord.propertyType, valueData?.subjectProperty?.propertyType, rentData?.subjectProperty?.propertyType) ?? '--',
        bedsBaths: bedrooms != null || bathrooms != null
          ? `${numberLabel(bedrooms) ?? '--'} bd · ${numberLabel(bathrooms) ?? '--'} ba`
          : '--',
        squareFootageLabel: squareFootage != null ? `${numberLabel(squareFootage)} sqft` : '--',
        lotSizeLabel: lotSize != null ? `${numberLabel(lotSize)} sqft lot` : '--',
        yearBuiltLabel: yearBuilt != null ? String(yearBuilt) : '--',
        countyApnLabel: [normalizedAddress.county, pickString(propertyRecord.apn, propertyRecord.parcelNumber)]
          .filter(Boolean)
          .join(' · ') || '--',
        lastSaleLabel: lastSalePrice != null ? currency(lastSalePrice) : '--',
        lastSaleNote: lastSalePrice != null || lastSaleDate
          ? [lastSaleDate ? formatDate(lastSaleDate) : null, assessedValue != null ? `Assessed value ${currency(assessedValue)}` : null]
              .filter(Boolean)
              .join(' · ')
          : 'No recorded last-sale event was returned in the matched property record.'
      },
      value: {
        estimate: valueEstimate,
        low: valueLow,
        high: valueHigh,
        summary: valueSummary,
        rangeLabel: buildRangeLabel(valueLow, valueHigh, valueEstimate),
        rangeNote: valueLow != null && valueHigh != null
          ? 'Low and high estimate bounds returned by the RentCast AVM.'
          : 'RentCast returned a point estimate without a full visible range.',
        comparableCountLabel: salesComparables.length ? String(salesComparables.length) : '0',
        comparables: salesComparables
      },
      rent: {
        estimate: rentEstimate,
        summary: rentSummary,
        rangeLabel: buildRangeLabel(rentLow, rentHigh, rentEstimate),
        rangeNote: rentLow != null && rentHigh != null
          ? 'Low and high monthly rent bounds returned by the rent AVM.'
          : 'RentCast returned a point estimate without a full visible range.',
        comparableCountLabel: rentComparables.length ? String(rentComparables.length) : '0',
        comparables: rentComparables
      },
      derived: {
        grossYieldLabel: grossYield != null ? percentLabel(grossYield) : '--',
        pricePerSquareFootLabel: pricePerSquareFoot != null ? `${currency(pricePerSquareFoot)}/sqft` : '--',
        appreciationLabel: appreciationAmount != null
          ? `${currency(appreciationAmount)}${appreciationPct != null ? ` (${percentLabel(appreciationPct)})` : ''}`
          : '--',
        appreciationNote: appreciationAmount != null
          ? 'Compared with the most recent recorded sale price on the property record.'
          : 'A value-change calculation needs both a live estimate and a last recorded sale price.'
      },
      summary: {
        headline: summaryHeadline,
        subline: summarySubline
      }
    }), {
      status: 200,
      headers: DEFAULT_HEADERS
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unable to retrieve RentCast data.'
    }), {
      status: 502,
      headers: DEFAULT_HEADERS
    });
  }
};
