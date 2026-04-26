import { supabase } from '@/lib/supabase';

function slugifySegment(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function createPublicSlug(value) {
  return slugifySegment(value) || `site-${crypto.randomUUID().slice(0, 8)}`;
}

export async function getLatestBadgeForWebsite(websiteId) {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('website_id', websiteId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function invokeUpsertBadge(body) {
  const { data, error } = await supabase.functions.invoke('upsert-badge', { body });

  if (error) {
    throw error;
  }

  return data?.badge || null;
}

export async function updateBadgeById(badgeId, updates, options = {}) {
  if (!options.websiteId) {
    throw new Error('websiteId is required when updating a badge.');
  }

  return invokeUpsertBadge({
    websiteId: options.websiteId,
    badgeId,
    desiredStatus: updates.status,
    issuedAt: updates.issued_at,
    expiresAt: updates.expires_at,
    lastCheckedAt: updates.last_checked_at,
  });
}

export async function createBadgeForWebsite(input) {
  return invokeUpsertBadge({
    websiteId: input.websiteId,
    desiredStatus: input.status || 'active',
    publicSlugBase: input.publicSlug || input.normalizedDomain,
    normalizedDomain: input.normalizedDomain,
    issuedAt: input.issuedAt,
    expiresAt: input.expiresAt,
    lastCheckedAt: input.lastCheckedAt,
  });
}

export async function ensureBadgeForWebsite(input) {
  return invokeUpsertBadge({
    websiteId: input.websiteId,
    desiredStatus: input.status || 'active',
    publicSlugBase: input.publicSlugBase || input.normalizedDomain,
    normalizedDomain: input.normalizedDomain,
    issuedAt: input.issuedAt,
    expiresAt: input.expiresAt,
    lastCheckedAt: input.lastCheckedAt,
  });
}

export async function getPublicVerificationBySlug(publicSlug) {
  const { data, error } = await supabase.functions.invoke('public-verify', {
    body: { slug: publicSlug },
  });

  if (error) {
    throw error;
  }

  return data;
}
