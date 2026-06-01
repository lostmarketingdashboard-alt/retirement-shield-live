import countyList from '../data/county-list.json';
import { supabase } from '../lib/supabase';

export const prerender = true;

const SITE_URL = 'https://retirementshield.io';
const TODAY = new Date().toISOString().slice(0, 10);

const staticPages = [
  '/',
  '/72-hour-checklist',
  '/annuity-x-ray-report',
  '/articleslist',
  '/blog',
  '/disclaimer',
  '/dividend-watch',
  '/emergency-binder-generator',
  '/estate-watch',
  '/estateplanningquiz',
  '/family-plan-quiz',
  '/guidelist',
  '/home-equity',
  '/income-shield-test',
  '/inflation-erosion-visualizer',
  '/inheritance-collision-report',
  '/irmaa-guard',
  '/lifeexpectancycalculator',
  '/list',
  '/privacy-policy',
  '/quiz',
  '/retirement-paycheck',
  '/retirement-relocation-calculator',
  '/retirement-runway',
  '/rmd-calendar-tax-estimator',
  '/shield-brief',
  '/terms-of-use',
  '/unclaimed-property-finder',
  '/widows-playbook',
];

const slugify = (value: string) => String(value || '')
  .toLowerCase()
  .trim()
  .replace(/\s+/g, '-');

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const toAbsoluteUrl = (path: string) => {
  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
  return `${SITE_URL}${normalizedPath}`;
};

type SitemapEntry = {
  loc: string;
  lastmod?: string | null;
  changefreq?: string;
  priority?: string;
};

const normalizeDate = (value: string | null | undefined) => {
  if (!value) return TODAY;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? TODAY : new Date(timestamp).toISOString().slice(0, 10);
};

async function getArticleEntries(): Promise<SitemapEntry[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('slug, updated_at, created_at')
    .not('slug', 'is', null);

  if (error || !data) {
    console.error('Unable to add Supabase articles to sitemap:', error);
    return [];
  }

  return data
    .filter((article) => article?.slug)
    .map((article) => ({
      loc: `/articles/${article.slug}`,
      lastmod: normalizeDate(article.updated_at || article.created_at),
      changefreq: 'monthly',
      priority: '0.6',
    }));
}

async function getBlogEntries(): Promise<SitemapEntry[]> {
  if (!import.meta.env.PUBLIC_STRAPI_URL) return [];

  const query = new URLSearchParams({
    'fields[0]': 'slug',
    'fields[1]': 'updatedAt',
    'fields[2]': 'createdAt',
    'pagination[pageSize]': '100',
  });

  try {
    const response = await fetch(`${import.meta.env.PUBLIC_STRAPI_URL}/api/articles?${query.toString()}`);
    if (!response.ok) throw new Error(`Strapi returned ${response.status}`);

    const json = await response.json();
    const articles = Array.isArray(json?.data) ? json.data : [];

    return articles
      .filter((article) => article?.slug)
      .map((article) => ({
        loc: `/blog/${article.slug}`,
        lastmod: normalizeDate(article.updatedAt || article.createdAt),
        changefreq: 'monthly',
        priority: '0.6',
      }));
  } catch (error) {
    console.error('Unable to add Strapi blog articles to sitemap:', error);
    return [];
  }
}

function buildLocalEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = staticPages.map((path) => ({
    loc: path,
    lastmod: TODAY,
    changefreq: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? '1.0' : '0.7',
  }));

  countyList.states.forEach((stateName) => {
    const stateSlug = slugify(stateName);
    entries.push(
      {
        loc: `/guide/${stateSlug}`,
        lastmod: TODAY,
        changefreq: 'monthly',
        priority: '0.8',
      },
      {
        loc: `/probate/${stateSlug}`,
        lastmod: TODAY,
        changefreq: 'monthly',
        priority: '0.8',
      }
    );

    const counties = countyList.stateMap[stateName] || [];
    counties.forEach((countyName) => {
      entries.push({
        loc: `/${stateSlug}/${slugify(countyName)}`,
        lastmod: TODAY,
        changefreq: 'monthly',
        priority: '0.7',
      });
    });
  });

  return entries;
}

function renderSitemap(entries: SitemapEntry[]) {
  const seen = new Set<string>();
  const urls = entries
    .filter((entry) => {
      const url = toAbsoluteUrl(entry.loc);
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    })
    .map((entry) => {
      const loc = escapeXml(toAbsoluteUrl(entry.loc));
      const lastmod = entry.lastmod || TODAY;

      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : '',
        entry.priority ? `    <priority>${entry.priority}</priority>` : '',
        '  </url>',
      ].filter(Boolean).join('\n');
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export async function GET() {
  const [articleEntries, blogEntries] = await Promise.all([
    getArticleEntries(),
    getBlogEntries(),
  ]);

  return new Response(renderSitemap([
    ...buildLocalEntries(),
    ...articleEntries,
    ...blogEntries,
  ]), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
