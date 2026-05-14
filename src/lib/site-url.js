function normalizeBaseUrl(value) {
  if (!value) return '';
  return value.trim().replace(/\/+$/, '');
}

export function getPublicSiteUrl() {
  const configuredUrl = normalizeBaseUrl(
    import.meta.env.VITE_SITE_URL || import.meta.env.VITE_PUBLIC_SITE_URL || ''
  );

  if (configuredUrl) {
    return configuredUrl;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return '';
}

export function buildPublicSiteUrl(pathname = '') {
  const baseUrl = getPublicSiteUrl();
  if (!pathname) return baseUrl;

  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${baseUrl}${cleanPath}`;
}

// Returns only the explicitly configured site URL (VITE_SITE_URL / VITE_PUBLIC_SITE_URL).
// Never falls back to window.location.origin — use this for Supabase emailRedirectTo
// so we never send an unrecognised URL that GoTrue will reject.
export function getExplicitSiteUrl() {
  return normalizeBaseUrl(
    import.meta.env.VITE_SITE_URL || import.meta.env.VITE_PUBLIC_SITE_URL || ''
  );
}
