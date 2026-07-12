// Fetches the current signed HLS stream URL for an EarthCam feed by scraping the
// public camera page. EarthCam embeds each camera's signed m3u8 in a JSON config
// block with JSON-escaped slashes (https:\/\/...), split across two keys:
//   "html5_streamingdomain":"https:\/\/videos-3.earthcam.com"
//   "html5_streampath":"\/fecnetwork\/50683.flv\/playlist.m3u8?t=<token>&td=<expiry>"
// The token is short-lived (~1h, see td=YYYYMMDDHHMM), so this is refetched on demand.

const EARTHCAM_PAGE = 'https://www.earthcam.com/usa/newyork/timessquare/?cam=tsnorth4k';
const DEFAULT_FEED = '50683'; // Times Square North 4K
const FALLBACK_DOMAIN = 'https://videos-3.earthcam.com';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

const unescapeJson = (s) => (s ? s.replace(/\\\//g, '/') : null);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const rawFeed = String(req.query?.feed ?? '');
  const feed = /^\d+$/.test(rawFeed) ? rawFeed : DEFAULT_FEED;

  try {
    const pageRes = await fetch(EARTHCAM_PAGE, { headers: HEADERS });
    if (!pageRes.ok) {
      return res.status(502).json({ error: `EarthCam page returned ${pageRes.status}` });
    }
    const html = await pageRes.text();

    // Debug probe: /api/stream-url?debug=1 reports exactly what THIS server received,
    // so we can tell whether EarthCam serves datacenter IPs a different/blocked page.
    if (req.query?.debug) {
      const lower = html.toLowerCase();
      return res.status(200).json({
        status: pageRes.status,
        htmlLength: html.length,
        has_feed_50683: html.includes('50683'),
        has_streampath: html.includes('html5_streampath'),
        has_fecnetwork: html.includes('fecnetwork'),
        looksBlocked:
          lower.includes('access denied') ||
          lower.includes('captcha') ||
          lower.includes('cf-browser-verification') ||
          lower.includes('are you a human') ||
          lower.includes('enable javascript to'),
        head: html.slice(0, 600),
      });
    }

    // Streaming domain (constant across cams, but read it live in case it changes).
    const domMatch = html.match(/"html5_streamingdomain":"(https:[^"]*earthcam[^"]*)"/);
    const domain = unescapeJson(domMatch?.[1]) ?? FALLBACK_DOMAIN;

    // Primary: reconstruct from the per-feed streampath.
    const pathRe = new RegExp(
      `"html5_streampath":"(\\\\/fecnetwork\\\\/${feed}\\.flv\\\\/playlist\\.m3u8[^"]*)"`
    );
    const pathMatch = html.match(pathRe);
    if (pathMatch) {
      const streamUrl = domain + unescapeJson(pathMatch[1]);
      return res.status(200).json({ streamUrl, feed, source: 'streampath' });
    }

    // Fallback: some cams carry a full pre-built "stream":"https:\/\/..." URL.
    const streamRe = new RegExp(
      `"stream":"(https:\\\\/\\\\/[^"]*${feed}\\.flv[^"]*\\.m3u8[^"]*)"`
    );
    const streamMatch = html.match(streamRe);
    if (streamMatch) {
      return res.status(200).json({
        streamUrl: unescapeJson(streamMatch[1]),
        feed,
        source: 'stream',
      });
    }

    return res.status(404).json({
      error: `Stream URL for feed ${feed} not found on the page. EarthCam may have changed their embed format.`,
    });
  } catch (err) {
    console.error('stream-url error:', err);
    return res.status(500).json({ error: err.message ?? 'Failed to fetch stream URL' });
  }
}
