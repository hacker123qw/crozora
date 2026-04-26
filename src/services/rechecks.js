import { supabase } from '@/lib/supabase';

export async function listRecheckRequestsForWebsite(websiteId) {
  const { data, error } = await supabase
    .from('recheck_requests')
    .select('*')
    .eq('website_id', websiteId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getLatestRecheckRequestForWebsite(websiteId) {
  const { data, error } = await supabase
    .from('recheck_requests')
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

export async function createRecheckRequest(input) {
  const { data, error } = await supabase
    .from('recheck_requests')
    .insert({
      website_id: input.websiteId,
      owner_id: input.ownerId,
      message: input.message || '',
      status: input.status || 'requested',
      completed_at: input.completedAt || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateRecheckRequest(recheckId, updates) {
  const { data, error } = await supabase
    .from('recheck_requests')
    .update(updates)
    .eq('id', recheckId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
