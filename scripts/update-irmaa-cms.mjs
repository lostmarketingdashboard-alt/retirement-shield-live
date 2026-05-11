import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const year = Number(process.argv[2] || new Date().getFullYear() + 1);
const url = `https://www.cms.gov/newsroom/fact-sheets/${year}-medicare-parts-b-premiums-and-deductibles`;
const outputPath = resolve(__dirname, `../src/data/irmaa-brackets.${year}.preview.json`);

function stripHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function money(value) {
  const parsed = Number(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function extractTables(html) {
  return [...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map((match) => match[0]);
}

function tableText(tableHtml) {
  return stripHtml(tableHtml);
}

function parseRows(tableHtml) {
  return [...tableHtml.matchAll(/<tr[\s\S]*?<\/tr>/gi)].map((rowMatch) => {
    return [...rowMatch[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => stripHtml(cell[1]));
  }).filter((row) => row.length);
}

function findIrmaaTables(html) {
  const tables = extractTables(html);
  return {
    partB: tables.find((table) => /part b/i.test(tableText(table)) && /income-related monthly adjustment amount|irmaa/i.test(tableText(table))),
    partD: tables.find((table) => /part d/i.test(tableText(table)) && /income-related monthly adjustment amount|irmaa/i.test(tableText(table)))
  };
}

function rowToBracket(row, type, filingStatus, standardPartB) {
  const numericCells = row.map(money).filter((value) => value !== null);
  if (numericCells.length < 2) return null;
  const totalPremium = type === 'part_b' ? numericCells[numericCells.length - 1] : undefined;
  const irmaaAmount = type === 'part_b' ? Number((totalPremium - standardPartB).toFixed(2)) : numericCells[numericCells.length - 1];

  return {
    type,
    filing_status: filingStatus,
    income_min: null,
    income_max: null,
    irmaa_amount: irmaaAmount,
    ...(type === 'part_b' ? { total_premium: totalPremium } : {}),
    label: 'CMS parsed tier',
    raw: row
  };
}

async function main() {
  const response = await fetch(url, {
    headers: { 'user-agent': 'RetirementShield-IRMAA-Yearly-Preview/1.0' }
  });

  if (!response.ok) {
    throw new Error(`CMS request failed with ${response.status} ${response.statusText}: ${url}`);
  }

  const html = await response.text();
  const { partB, partD } = findIrmaaTables(html);

  if (!partB || !partD) {
    throw new Error('Could not find both Part B and Part D IRMAA tables on the CMS page. Manual review required.');
  }

  const standardPartB = money(stripHtml(partB).match(/standard monthly premium[^$]*\$?([0-9,.]+)/i)?.[1]) || null;
  if (!standardPartB) {
    throw new Error('Could not identify the standard Part B premium. Manual review required.');
  }

  const preview = {
    year,
    lookback_tax_year: year - 2,
    standard_part_b_premium: standardPartB,
    source: {
      publisher: 'CMS',
      title: `${year} Medicare Parts A & B Premiums and Deductibles`,
      url,
      fetched_at: new Date().toISOString()
    },
    extraction_note: 'Preview only. Review income_min/income_max and labels against CMS before replacing src/data/irmaa-brackets.json.',
    brackets: [
      ...parseRows(partB).map((row) => rowToBracket(row, 'part_b', 'review_required', standardPartB)).filter(Boolean),
      ...parseRows(partD).map((row) => rowToBracket(row, 'part_d', 'review_required', standardPartB)).filter(Boolean)
    ]
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(preview, null, 2)}\n`);
  console.log(`Wrote CMS IRMAA preview: ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
