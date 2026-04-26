import { supabase } from '@/lib/supabase';

export async function createBusiness(input) {
  const payload = {
    owner_id: input.ownerId,
    business_name: input.businessName,
    business_email: input.businessEmail || null,
    category: input.category || null,
    service_type: input.serviceType || 'online',
    country: input.country || null,
    state_region: input.stateRegion || null,
    city: input.city || null,
  };

  const { data, error } = await supabase
    .from('businesses')
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function listBusinessesByOwner(ownerId) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}
