import { supabase } from '@/lib/supabase';
import { normalizeDomain } from '@/services/websites';

function makeReadableToken(length = 10) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

export function buildVerificationRecord(rawUrl) {
  const domain = normalizeDomain(rawUrl);
  const token = `crozora_verify_${makeReadableToken(6)}_${makeReadableToken(10)}`;
  const dnsName = `_crozora.${domain}`;

  return {
    normalizedDomain: domain,
    dnsName,
    token,
    expectedValue: token,
    type: 'TXT',
  };
}

export async function createDomainVerification(input) {
  const record = input.record || buildVerificationRecord(input.rawUrl);

  const { data, error } = await supabase
    .from('domain_verifications')
    .insert({
      website_id: input.websiteId,
      owner_id: input.ownerId,
      dns_name: record.dnsName,
      token: record.token,
      expected_value: record.expectedValue,
      status: input.status || 'pending',
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    type: record.type,
  };
}

export async function getLatestDomainVerification(websiteId) {
  const { data, error } = await supabase
    .from('domain_verifications')
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

export async function checkDomainVerification(input) {
  const verificationId = input.verificationId || input.id || null;
  const websiteId = input.websiteId || null;

  if (!verificationId && !websiteId) {
    throw new Error('A verification id or website id is required.');
  }

  const { data, error } = await supabase.functions.invoke('check-domain-verification', {
    body: {
      verificationId,
      websiteId,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
