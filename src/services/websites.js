import { supabase } from '@/lib/supabase';

function stripProtocol(value) {
  return value.replace(/^https?:\/\//i, '');
}

function stripWww(value) {
  return value.replace(/^www\./i, '');
}

export function normalizeDomain(input) {
  const trimmed = String(input || '').trim();
  if (!trimmed) {
    return '';
  }

  const withoutProtocol = stripProtocol(trimmed);
  const withoutPath = withoutProtocol.split('/')[0].split('?')[0].split('#')[0];
  return stripWww(withoutPath).toLowerCase();
}

export function normalizeWebsiteUrl(input) {
  const domain = normalizeDomain(input);
  return domain ? `https://${domain}` : '';
}

export async function createWebsite(input) {
  const payload = {
    business_id: input.businessId,
    owner_id: input.ownerId,
    raw_url: input.rawUrl,
    normalized_domain: normalizeDomain(input.rawUrl),
    website_url: input.websiteUrl || normalizeWebsiteUrl(input.rawUrl),
    website_builder: input.websiteBuilder || null,
    contact_page_url: input.contactPageUrl || null,
    privacy_policy_url: input.privacyPolicyUrl || null,
    terms_policy_url: input.termsPolicyUrl || null,
    review_profile_url: input.reviewProfileUrl || null,
    ownership_status: input.ownershipStatus || 'pending',
    preview_status: input.previewStatus || 'not_started',
    verification_status: input.verificationStatus || 'not_started',
    badge_status: input.badgeStatus || 'unavailable',
    public_page_status: input.publicPageStatus || 'inactive',
    plan_coverage: input.planCoverage || 'free',
  };

  const { data, error } = await supabase
    .from('websites')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function listWebsitesByOwner(ownerId) {
  const { data, error } = await supabase
    .from('websites')
    .select('*, businesses(*)')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getLatestWebsiteForOwner(ownerId) {
  const { data, error } = await supabase
    .from('websites')
    .select('*, businesses(*)')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateWebsiteById(websiteId, updates, options = {}) {
  const { data, error } = await supabase.functions.invoke('update-website-status', {
    body: {
      websiteId,
      updates,
      operation: options.operation || 'metadata',
    },
  });

  if (error) {
    throw error;
  }

  return data?.website || null;
}
