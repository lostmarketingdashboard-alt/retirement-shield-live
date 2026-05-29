import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

const STATE_NAMES: Record<string, string> = {
  alabama: 'Alabama',
  alaska: 'Alaska',
  arizona: 'Arizona',
  arkansas: 'Arkansas',
  california: 'California',
  colorado: 'Colorado',
  connecticut: 'Connecticut',
  delaware: 'Delaware',
  florida: 'Florida',
  georgia: 'Georgia',
  hawaii: 'Hawaii',
  idaho: 'Idaho',
  illinois: 'Illinois',
  indiana: 'Indiana',
  iowa: 'Iowa',
  kansas: 'Kansas',
  kentucky: 'Kentucky',
  louisiana: 'Louisiana',
  maine: 'Maine',
  maryland: 'Maryland',
  massachusetts: 'Massachusetts',
  michigan: 'Michigan',
  minnesota: 'Minnesota',
  mississippi: 'Mississippi',
  missouri: 'Missouri',
  montana: 'Montana',
  nebraska: 'Nebraska',
  nevada: 'Nevada',
  'new-hampshire': 'New Hampshire',
  'new-jersey': 'New Jersey',
  'new-mexico': 'New Mexico',
  'new-york': 'New York',
  'north-carolina': 'North Carolina',
  'north-dakota': 'North Dakota',
  ohio: 'Ohio',
  oklahoma: 'Oklahoma',
  oregon: 'Oregon',
  pennsylvania: 'Pennsylvania',
  'rhode-island': 'Rhode Island',
  'south-carolina': 'South Carolina',
  'south-dakota': 'South Dakota',
  tennessee: 'Tennessee',
  texas: 'Texas',
  utah: 'Utah',
  vermont: 'Vermont',
  virginia: 'Virginia',
  washington: 'Washington',
  'west-virginia': 'West Virginia',
  wisconsin: 'Wisconsin',
  wyoming: 'Wyoming'
};

const RESERVED_FIRST_SEGMENTS = new Set([
  'api',
  'articles',
  'blog',
  'guide',
  'probate',
  'portal',
  'login',
  'register',
  'privacy-policy',
  'terms-of-use',
  'disclaimer'
]);

function json(status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS
  });
}

function noContent() {
  return new Response(null, { status: 204 });
}

function cleanText(value: unknown, max = 300) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function slugToTitle(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function inferLocation(pathname: string) {
  const segments = pathname.split('/').filter(Boolean).map(segment => segment.toLowerCase());
  let stateSlug: string | null = null;
  let countySlug: string | null = null;

  if ((segments[0] === 'guide' || segments[0] === 'probate') && STATE_NAMES[segments[1]]) {
    stateSlug = segments[1];
  } else if (segments[0] && STATE_NAMES[segments[0]] && !RESERVED_FIRST_SEGMENTS.has(segments[0])) {
    stateSlug = segments[0];
    countySlug = segments[1] || null;
  }

  return {
    state_slug: stateSlug,
    state_name: stateSlug ? STATE_NAMES[stateSlug] : null,
    county_slug: countySlug,
    county_name: countySlug ? `${slugToTitle(countySlug.replace(/-county$/, ''))} County` : null
  };
}

function getDeviceType(userAgent: string) {
  const ua = userAgent.toLowerCase();
  if (/bot|crawler|spider|preview|facebookexternalhit|slurp/.test(ua)) return 'bot';
  if (/ipad|tablet/.test(ua)) return 'tablet';
  if (/mobile|iphone|android/.test(ua)) return 'mobile';
  return 'desktop';
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { error: 'Server is missing Supabase service credentials.' });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid JSON body.' });
  }

  const pagePath = cleanText(body.page_path, 500);
  if (!pagePath || !pagePath.startsWith('/')) {
    return json(400, { error: 'Missing valid page path.' });
  }

  if (pagePath.startsWith('/api/') || pagePath.startsWith('/portal') || pagePath.startsWith('/login') || pagePath.startsWith('/register')) {
    return noContent();
  }

  const userAgent = cleanText(request.headers.get('user-agent'), 500) || '';
  const deviceType = getDeviceType(userAgent);
  if (deviceType === 'bot') return noContent();

  const normalizedPath = pagePath.replace(/\/+$/, '') || '/';
  const location = inferLocation(normalizedPath);
  const searchParams = typeof body.search === 'string' ? new URLSearchParams(body.search) : new URLSearchParams();

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { error } = await supabase
    .from('page_traffic_events')
    .insert({
      page_path: pagePath,
      normalized_path: normalizedPath,
      page_title: cleanText(body.page_title, 300),
      referrer: cleanText(body.referrer, 500),
      state_slug: location.state_slug,
      state_name: location.state_name,
      county_slug: location.county_slug,
      county_name: location.county_name,
      visitor_id: cleanText(body.visitor_id, 120),
      session_id: cleanText(body.session_id, 120),
      device_type: deviceType,
      source: cleanText(searchParams.get('utm_source'), 120),
      medium: cleanText(searchParams.get('utm_medium'), 120),
      campaign: cleanText(searchParams.get('utm_campaign'), 160),
      user_agent: userAgent
    });

  if (error) {
    console.error('Traffic tracking insert failed:', error);
    return json(500, { error: 'Unable to save traffic event.' });
  }

  return json(200, { ok: true });
};
