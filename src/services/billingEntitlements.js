import { supabase } from '@/lib/supabase';

export async function listActiveEntitlementsForOwner(ownerId) {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('billing_entitlements')
    .select('*')
    .eq('owner_id', ownerId)
    .eq('status', 'active')
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getActiveEntitlementForOwner(ownerId) {
  const entitlements = await listActiveEntitlementsForOwner(ownerId);
  const pro = entitlements.find((item) => item.entitlement_type === 'pro');
  if (pro) return pro;

  const oneTime = entitlements.find((item) => item.entitlement_type === 'one_time_site');
  if (oneTime) return oneTime;

  return entitlements[0] ?? null;
}

export async function setTemporaryPlanForWebsite(input) {
  const { data, error } = await supabase.functions.invoke('set-test-plan', {
    body: {
      websiteId: input.websiteId,
      plan: input.plan,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export function getEffectiveEntitlementForWebsite(websiteId, entitlements = [], fallbackPlanCoverage = 'free') {
  const pro = entitlements.find((item) => item.entitlement_type === 'pro');
  if (pro) return pro;

  const oneTime = entitlements.find(
    (item) => item.entitlement_type === 'one_time_site' && item.website_id === websiteId
  );
  if (oneTime) return oneTime;

  if (fallbackPlanCoverage === 'pro') {
    return { entitlement_type: 'pro', status: 'active', website_id: null };
  }

  if (fallbackPlanCoverage === 'one_time') {
    return { entitlement_type: 'one_time_site', status: 'active', website_id: websiteId };
  }

  return null;
}
