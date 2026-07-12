// HLS proxy for EarthCam feeds.
//
// EarthCam's CDN enforces Referer-based hotlink protection: it only serves the
// manifest/segments when the request claims Referer: earthcam.com. A browser
// cannot forge a cross-origin Referer, so it gets 403 on every segment. This
// serverless proxy fetches upstream WITH the earthcam Referer and streams the
// bytes back same-origin — which also un-taints the <video> for canvas capture.
//
// The target URL travels in ?u= as base64url (NOT percent-encoding): EarthCam's
// signed token contains %2B/%2F which both `new URL()` normalization and the
// platform's automatic query-decoding would corrupt. base64url has no %, +, /,
// or = characters, so it round-trips untouched.
//
// NOTE: all video bandwidth flows through Vercel. Fine for v1/one feed; for scale
// we'd move to an edge/media layer. Host allowlist prevents open-proxy abuse.

const ALLOWED_HOST = /^https:\/\/videos-\d+\.earthcam\.com\//;

const UPSTREAM_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  Referer: 'https://www.earthcam.com/',
  Origin: 'https://www.earthcam.com',
  Accept: '*/*',
};

const b64urlEncode = (s) =>
  Buffer.from(s, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const b64urlDecode = (s) => {
  let t = String(s).replace(/-/g, '+').replace(/_/g, '/');
  while (t.length % 4) t += '=';
  return Buffer.from(t, 'base64').toString('utf8');
};

const wrap = (absoluteUrl) => `/api/proxy?u=${b64urlEncode(absoluteUrl)}`;

// Resolve a manifest-relative reference WITHOUT touching its query string, so the
// signed token survives byte-for-byte (new URL().href would rewrite %2B -> +).
function resolveUrl(ref, manifestUrl) {
  if (/^https?:\/\//i.test(ref)) return ref;
  const basePath = manifestUrl.split('?')[0];
  const dir = basePath.slice(0, basePath.lastIndexOf('/') + 1);
  return dir + ref; // ref keeps its own ?t=...&td=... intact
}

function rewriteManifest(text, manifestUrl) {
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return line;
      if (trimmed.startsWith('#')) {
        return line.replace(/URI="([^"]+)"/g, (_m, uri) => `URI="${wrap(resolveUrl(uri, manifestUrl))}"`);
      }
      return wrap(resolveUrl(trimmed, manifestUrl));
    })
    .join('\n');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const u = req.query?.u;
  if (!u) return res.status(400).json({ error: 'missing u param' });

  let target;
  try {
    target = b64urlDecode(u);
  } catch {
    return res.status(400).json({ error: 'bad u param' });
  }

  if (!ALLOWED_HOST.test(target)) {
    return res.status(403).json({ error: 'host not allowed' });
  }

  try {
    const upstream = await fetch(target, { headers: UPSTREAM_HEADERS });
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `upstream ${upstream.status}` });
    }

    const contentType = upstream.headers.get('content-type') || '';
    const isManifest =
      target.split('?')[0].endsWith('.m3u8') || contentType.includes('mpegurl');

    if (isManifest) {
      const text = await upstream.text();
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).send(rewriteManifest(text, target));
    }

    // Binary segment (.ts) — stream bytes straight through
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', contentType || 'video/MP2T');
    res.setHeader('Cache-Control', 'public, max-age=2');
    return res.status(200).send(buf);
  } catch (err) {
    console.error('proxy error:', err);
    return res.status(502).json({ error: err.message ?? 'proxy failed' });
  }
}
