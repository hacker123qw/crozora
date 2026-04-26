import { supabase } from '@/lib/supabase';

export async function listReportsForWebsite(websiteId) {
  const { data, error } = await supabase
    .from('site_reports')
    .select('*')
    .eq('website_id', websiteId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getLatestReportForWebsite(websiteId) {
  const { data, error } = await supabase
    .from('site_reports')
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

export async function createSiteReport(input) {
  const { data, error } = await supabase
    .from('site_reports')
    .insert({
      website_id: input.websiteId,
      owner_id: input.ownerId,
      report_level: input.reportLevel,
      title: input.title,
      summary: input.summary,
      score: input.score ?? null,
      status: input.status || 'complete',
      sections: input.sections || [],
      recommendations: input.recommendations || [],
      ai_summary: input.aiSummary || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
