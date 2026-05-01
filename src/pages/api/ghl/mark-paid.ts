import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const JSON_HEADERS = { 'Content-Type': 'application/json' };
const SECRET_HEADER = 'x-retirement-shield-webhook-secret';

function json(status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS
  });
}

function stringFrom(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
  }
  return null;
}

function booleanFrom(value: unknown) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', 'yes', '1', 'paid'].includes(normalized)) return true;
    if (['false', 'no', '0', 'unpaid'].includes(normalized)) return false;
  }
  if (typeof value === 'number') {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  return null;
}

export const POST: APIRoute = async ({ request }) => {
  const webhookSecret = import.meta.env.GHL_PAID_WEBHOOK_SECRET;
  const suppliedSecret = request.headers.get(SECRET_HEADER);

  if (!webhookSecret) {
    return json(500, { error: 'Server is missing GHL_PAID_WEBHOOK_SECRET.' });
  }

  if (!suppliedSecret || suppliedSecret !== webhookSecret) {
    return json(401, { error: 'Unauthorized webhook request.' });
  }

  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return json(400, { error: 'Invalid JSON body.' });
  }

  const email = stringFrom(payload.email, payload.Email, payload.contactEmail, payload.contact_email)?.toLowerCase();
  const paid = booleanFrom(payload.paid ?? payload.Paid ?? payload.paymentPaid ?? payload.payment_paid);

  if (!email || !email.includes('@')) {
    return json(400, { error: 'Missing valid email.' });
  }

  if (paid !== true) {
    return json(400, { error: 'Body must include paid: true.' });
  }

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { error: 'Server is missing Supabase service credentials.' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data, error } = await supabase
    .from('profiles')
    .update({ paid: true })
    .ilike('email', email)
    .select('id, email, paid');

  if (error) {
    console.error('GHL paid webhook update failed:', error);
    return json(500, { error: 'Failed to update paid status.' });
  }

  if (!data?.length) {
    return json(404, { error: 'No profile found for email.', email });
  }

  return json(200, {
    ok: true,
    updated: data.length,
    profile: data[0]
  });
};

export const GET: APIRoute = async () => json(405, { error: 'Use POST.' });
