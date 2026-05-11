import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const SITE_URL = 'https://www.retirementshield.io';

const STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['FL', 'Florida'], ['GA', 'Georgia'],
  ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'],
  ['KY', 'Kentucky'], ['LA', 'Louisiana'], ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'],
  ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'],
  ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'],
  ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'],
  ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'],
  ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'], ['DC', 'District of Columbia']
] as const;

const TOOLS = [
  { title: 'Life Expectancy by County', href: '/list', keywords: ['life expectancy', 'longevity', 'county life', 'how long'] },
  { title: 'Life Expectancy Calculator', href: '/lifeexpectancycalculator', keywords: ['calculator', 'life expectancy calculator', 'health profile'] },
  { title: 'Estate Planning Assessment', href: '/estateplanningquiz', keywords: ['estate quiz', 'assessment', 'estate planning assessment'] },
  { title: 'Emergency Binder Generator', href: '/emergency-binder-generator', keywords: ['binder', 'emergency binder', 'after i am gone'] },
  { title: '72-Hour Checklist', href: '/72-hour-checklist', keywords: ['72 hour', 'after death', 'death checklist'] },
  { title: 'Inheritance Collision Report', href: '/inheritance-collision-report', keywords: ['inheritance', 'blended family', 'stepchildren'] },
  { title: 'Family Plan Quiz', href: '/family-plan-quiz', keywords: ['parents', 'family plan', 'adult children'] },
  { title: 'Unclaimed Property Finder', href: '/unclaimed-property-finder', keywords: ['unclaimed', 'property finder', 'lost money'] },
  { title: 'Home Equity Intelligence Report', href: '/home-equity', keywords: ['home equity', 'house', 'property value', 'rentcast'] },
  { title: 'Retirement Relocation Calculator', href: '/retirement-relocation-calculator', keywords: ['relocation', 'move', 'should i move'] },
  { title: 'Retirement Paycheck', href: '/retirement-paycheck', keywords: ['dividend', 'paycheck', 'portfolio income'] },
  { title: 'Dividend Watch', href: '/dividend-watch', keywords: ['dividend watch', 'dividend alerts'] },
  { title: 'Inflation Erosion Visualizer', href: '/inflation-erosion-visualizer', keywords: ['inflation', 'purchasing power', 'cpi'] },
  { title: 'Retirement Runway', href: '/retirement-runway', keywords: ['runway', 'money last', 'savings last'] },
  { title: 'Income Shield', href: '/income-shield-test', keywords: ['income shield', 'stress test', 'spouse death', 'market crash'] },
  { title: 'IRMAA Guard', href: '/irmaa-guard', keywords: ['irmaa', 'medicare surcharge', 'part b', 'part d'] },
  { title: 'RMD Calendar + Tax Impact Estimator', href: '/rmd-calendar-tax-estimator', keywords: ['rmd', 'required minimum', 'ira withdrawal'] },
  { title: 'Annuity X-Ray Report', href: '/annuity-x-ray-report', keywords: ['annuity', 'x ray', 'surrender'] },
  { title: 'Shield Brief', href: '/shield-brief', keywords: ['monthly brief', 'weather report', 'shield brief'] },
  { title: 'Estate Watch', href: '/estate-watch', keywords: ['estate watch', 'law change', 'state law'] },
  { title: 'Widow’s Playbook', href: '/widows-playbook', keywords: ['widow', 'surviving spouse', 'spouse dies'] }
];

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

function slugify(value: string) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalize(value: string) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\b(county|parish|borough|census area|city and borough|municipality)\b/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleCase(value: string) {
  return String(value || '').replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function findState(message: string) {
  const normalized = normalize(message);
  return STATES.find(([code, name]) => {
    return normalized.includes(normalize(name)) || new RegExp(`\\b${code.toLowerCase()}\\b`).test(normalized);
  });
}

function absolute(href: string) {
  return `${SITE_URL}${href.startsWith('/') ? href : `/${href}`}`;
}

function getSupabase() {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !key) return null;
  return createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

function matchingTools(message: string) {
  const normalized = normalize(message);
  return TOOLS.filter((tool) => tool.keywords.some((keyword) => normalized.includes(normalize(keyword))))
    .slice(0, 4);
}

async function resolveCountyLink(message: string, stateName: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const stateNeedle = normalize(stateName);
  const countyNeedle = normalize(message).replace(stateNeedle, '').trim();
  const stopWords = new Set([
    'life', 'expectancy', 'longevity', 'show', 'send', 'link', 'url', 'page', 'for', 'in', 'state', 'county',
    'what', 'is', 'the', 'retirement', 'shield', 'please', 'can', 'you', 'me'
  ]);
  const queryTokens = countyNeedle.split(' ').filter((token) => token.length > 1 && !stopWords.has(token));

  if (!queryTokens.length) return null;

  const directNeedle = titleCase(queryTokens.join(' '));
  const { data: directRows, error: directError } = await supabase
    .from('counties')
    .select('State, County, "Life Expectancy (Years)"')
    .eq('State', stateName)
    .ilike('County', `%${directNeedle}%`)
    .limit(20);

  if (!directError && directRows?.length) {
    const uniqueRows = Array.from(
      new Map(directRows.map((row: any) => [`${row.State}-${row.County}`, row])).values()
    );
    const bestDirect = uniqueRows
      .map((row: any) => {
        const countyText = normalize(row.County);
        const score = queryTokens.reduce((sum, token) => sum + (countyText.includes(token) ? 1 : 0), 0);
        return { row, score, countyText };
      })
      .sort((a, b) => b.score - a.score || a.countyText.length - b.countyText.length)[0];

    if (bestDirect?.score > 0) {
      const href = `/${slugify(bestDirect.row.State)}/${slugify(String(bestDirect.row.County).replace(/\s+County$/i, ''))}`;
      const lifeExpectancy = typeof bestDirect.row['Life Expectancy (Years)'] === 'number'
        ? Number(bestDirect.row['Life Expectancy (Years)']).toFixed(1)
        : null;

      return {
        county: bestDirect.row.County,
        state: bestDirect.row.State,
        lifeExpectancy,
        href,
        url: absolute(href)
      };
    }
  }

  const { data, error } = await supabase
    .from('counties')
    .select('State, County, "Life Expectancy (Years)"')
    .eq('State', stateName)
    .limit(2000);

  if (error || !data?.length) return null;

  const scored = data.map((row: any) => {
    const countyText = normalize(row.County);
    const score = queryTokens.reduce((sum, token) => sum + (countyText.includes(token) ? 1 : 0), 0);
    return { row, score, countyText };
  }).sort((a, b) => b.score - a.score || a.countyText.length - b.countyText.length);

  const best = scored[0];
  if (!best || best.score === 0) return null;

  const href = `/${slugify(best.row.State)}/${slugify(String(best.row.County).replace(/\s+County$/i, ''))}`;
  const lifeExpectancy = typeof best.row['Life Expectancy (Years)'] === 'number'
    ? Number(best.row['Life Expectancy (Years)']).toFixed(1)
    : null;

  return {
    county: best.row.County,
    state: best.row.State,
    lifeExpectancy,
    href,
    url: absolute(href)
  };
}

async function getStateGuideSummary(stateName: string) {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from('state_guides')
    .select('state_name, state_slug, probate_cost_display, probate_timeline_display, state_estate_tax, state_inheritance_tax')
    .eq('state_slug', slugify(stateName))
    .maybeSingle();

  return data;
}

async function searchArticles(message: string) {
  const supabase = getSupabase();
  if (!supabase) return [];

  const terms = normalize(message).split(' ').filter((term) => term.length > 4).slice(0, 3);
  if (!terms.length) return [];

  const { data } = await supabase
    .from('articles')
    .select('slug, headline, lede, pillar')
    .ilike('headline', `%${terms[0]}%`)
    .limit(3);

  return data || [];
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const message = String(body.message || '').trim();
    const context = body.context || {};

    if (!message) {
      return json({
        reply: 'Ask me about a Retirement Shield tool, a state guide, or a county life expectancy page.',
        links: [],
        prompts: ['Life expectancy in Alaska, Aleutians West Census Area', 'Show me the IRMAA tool', 'What happens in probate in Florida?']
      });
    }

    const lower = normalize(message);
    const detectedState = findState(message);
    const state = detectedState || (context.stateName ? STATES.find(([, name]) => name === context.stateName) : null);
    const wantsLifeExpectancy = /life expectancy|longevity|county page|county url|county link/.test(lower) || context.intent === 'life_expectancy';
    const wantsStateGuide = /probate|estate|inheritance tax|estate tax|will|trust|medicaid|homestead/.test(lower);

    if (/all tools|show tools|list tools|retirement tools|features/.test(lower)) {
      return json({
        reply: 'Here are the main Retirement Shield tool areas people usually need first.',
        links: TOOLS.slice(0, 8).map((tool) => ({ label: tool.title, href: absolute(tool.href) })),
        prompts: ['Find a county life expectancy page', 'Show me IRMAA Guard', 'Show me RMD tools'],
        context: {}
      });
    }

    if (wantsLifeExpectancy) {
      if (!state) {
        return json({
          reply: 'I can send the county life expectancy page. What state and county should I use?',
          links: [{ label: 'Browse all life expectancy pages', href: absolute('/list') }],
          prompts: ['Alaska, Aleutians West Census Area', 'Florida, Palm Beach County'],
          context: { intent: 'life_expectancy' }
        });
      }

      const countyMatch = await resolveCountyLink(`${state[1]} ${message}`, state[1]);
      if (!countyMatch) {
        return json({
          reply: `I found ${state[1]}. Which county should I use for the life expectancy page?`,
          links: [{ label: `Browse ${state[1]} counties`, href: absolute('/list') }],
          prompts: [`${state[1]}, example county`, 'Show me the calculator instead'],
          context: { intent: 'life_expectancy', stateName: state[1], stateCode: state[0] }
        });
      }

      return json({
        reply: countyMatch.lifeExpectancy
          ? `${countyMatch.county}, ${countyMatch.state} has a county life expectancy estimate of about ${countyMatch.lifeExpectancy} years in the current county table. Here is the page.`
          : `Here is the county life expectancy page for ${countyMatch.county}, ${countyMatch.state}.`,
        links: [{ label: `${countyMatch.county}, ${countyMatch.state}`, href: countyMatch.url }],
        prompts: ['Open the life expectancy calculator', 'Show me retirement tools'],
        context: {}
      });
    }

    if (state && wantsStateGuide) {
      const guide = await getStateGuideSummary(state[1]);
      if (guide) {
        const bits = [
          guide.probate_timeline_display ? `Probate timeline: ${guide.probate_timeline_display}` : '',
          guide.probate_cost_display ? `Probate cost: ${guide.probate_cost_display}` : '',
          guide.state_estate_tax ? `Estate tax: ${guide.state_estate_tax}` : '',
          guide.state_inheritance_tax ? `Inheritance tax: ${guide.state_inheritance_tax}` : ''
        ].filter(Boolean);
        return json({
          reply: `${state[1]} guide snapshot: ${bits.join('. ') || 'the state guide is available for review.'}`,
          links: [
            { label: `${state[1]} estate planning guide`, href: absolute(`/guide/${guide.state_slug}`) },
            { label: `${state[1]} probate guide`, href: absolute(`/probate/${guide.state_slug}`) }
          ],
          prompts: ['Show me the emergency binder', 'Show me the inheritance tool']
        });
      }
    }

    const tools = matchingTools(message);
    if (tools.length) {
      return json({
        reply: tools.length === 1
          ? `The best match is ${tools[0].title}.`
          : `These Retirement Shield tools match what you asked for.`,
        links: tools.map((tool) => ({ label: tool.title, href: absolute(tool.href) })),
        prompts: ['Find a county life expectancy page', 'Show all tools']
      });
    }

    const articles = await searchArticles(message);
    if (articles.length) {
      return json({
        reply: 'I found related Retirement Shield article content.',
        links: articles.map((article: any) => ({ label: article.headline, href: absolute(`/articles/${article.slug}`) })),
        prompts: ['Show me tools for this topic', 'Find a state guide']
      });
    }

    return json({
      reply: 'I can help route you to Retirement Shield tools, county life expectancy pages, state probate guides, and articles. Try asking for a topic plus a state or county.',
      links: [
        { label: 'Life Expectancy Pages', href: absolute('/list') },
        { label: 'Estate Planning Assessment', href: absolute('/estateplanningquiz') },
        { label: 'Retirement Tools Portal', href: absolute('/portal') }
      ],
      prompts: ['Life expectancy in Alaska, Aleutians West Census Area', 'Show me RMD tools', 'Probate in California']
    });
  } catch (error) {
    console.error('Assistant route failed:', error);
    return json({
      reply: 'I had trouble answering that. Try asking for a specific tool, state, or county.',
      links: [{ label: 'Browse Retirement Shield', href: SITE_URL }],
      prompts: []
    }, 500);
  }
};
