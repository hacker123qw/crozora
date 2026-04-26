import { supabase } from '@/lib/supabase';

export async function listAiReportMessagesForWebsite(websiteId) {
  const { data, error } = await supabase
    .from('ai_report_messages')
    .select('*')
    .eq('website_id', websiteId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createAiReportMessage(input) {
  const { data, error } = await supabase
    .from('ai_report_messages')
    .insert({
      website_id: input.websiteId,
      owner_id: input.ownerId,
      role: input.role,
      content: input.content,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
