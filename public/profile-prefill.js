const PROFILE_CLIENT_KEYS = [
  'afterDeathChecklistSupabase',
  'annuityXraySupabase',
  'dividendWatchSupabase',
  'emergencyBinderSupabase',
  'estateWatchSupabase',
  'familyPlanQuizSupabase',
  'homeEquitySupabase',
  'incomeShieldSupabase',
  'inflationVisualizerSupabase',
  'inheritanceCollisionSupabase',
  'irmaaGuardSupabase',
  'relocationSupabase',
  'retirementPaycheckSupabase',
  'retirementRunwaySupabase',
  'rmdCalendarSupabase',
  'shieldBriefSupabase',
  'unclaimedPropertySupabase',
  'widowsPlaybookSupabase'
];

function normalizeProfileValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+county$/, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ');
}

function findProfileClient() {
  return PROFILE_CLIENT_KEYS.map((key) => window[key]).find(Boolean) || null;
}

function findMatchingOption(select, value) {
  const normalized = normalizeProfileValue(value);
  if (!select || !normalized) return null;

  return [...select.options].find((option) => (
    normalizeProfileValue(option.value) === normalized ||
    normalizeProfileValue(option.textContent) === normalized
  )) || null;
}

function applyProfileState(profile) {
  const stateField = document.getElementById('stateSelect') || document.getElementById('stateName');
  if (!stateField || stateField.value || !profile?.state) return false;

  const option = findMatchingOption(stateField, profile.state);
  if (!option) return false;

  stateField.value = option.value;
  stateField.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

function applyProfileCounty(profile) {
  if (!profile?.county) return false;

  const countyInput = document.getElementById('countyName');
  if (countyInput && !countyInput.value) {
    countyInput.value = profile.county;
    countyInput.dispatchEvent(new Event('input', { bubbles: true }));
    countyInput.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  const countySelect = document.getElementById('countySelect');
  if (!countySelect || countySelect.value) return false;

  const option = findMatchingOption(countySelect, profile.county);
  if (!option) return false;

  countySelect.value = option.value;
  countySelect.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
}

function applyProfileName(profile) {
  const profileName = profile?.full_name || profile?.name || profile?.first_name || '';
  if (!profileName) return false;

  const nameFields = [
    document.getElementById('fullName'),
    document.getElementById('primaryName'),
    document.getElementById('firstName')
  ].filter(Boolean);

  for (const field of nameFields) {
    if (!field.value) {
      field.value = profileName;
      field.dataset.prefilled = 'true';
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
  }

  return false;
}

async function waitForProfileClient() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const client = findProfileClient();
    if (client) return client;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return null;
}

async function prefillProfileFields() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('utm');

  if (!userId || params.get('report') === 'latest') return;

  const supabase = await waitForProfileClient();
  if (!supabase) return;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (!profile) return;

  applyProfileName(profile);
  const stateChanged = applyProfileState(profile);
  applyProfileCounty(profile);

  if (stateChanged) {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      if (applyProfileCounty(profile)) return;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
}

prefillProfileFields().catch((error) => {
  console.warn('Profile prefill skipped:', error);
});
