// Fetches the current signed HLS stream URL for the Times Square North 4K camera.
// EarthCam embeds a signed token in the m3u8 URL that expires; this refreshes it server-side.
const EARTHCAM_PAGE = 'https://www.earthcam.com/usa/newyork/timessquare/?cam=tsnorth4k';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const pageRes = await fetch(EARTHCAM_PAGE, { headers: HEADERS });

    if (!pageRes.ok) {
      return res.status(502).json({ error: `EarthCam page returned ${pageRes.status}` });
    }

    const html = await pageRes.text();

    // EarthCam embeds the stream URL in a JS config block; find the first signed m3u8 URL.
    const match = html.match(/https:\/\/videos[^"'\\]+\.m3u8[^"'\\]*/);
    if (match) {
      return res.status(200).json({ streamUrl: match[0] });
    }

    // Fallback: look for any .m3u8 on their CDN
    const fallback = html.match(/https?:\/\/[^"'\\]*earthcam[^"'\\]*\.m3u8[^"'\\]*/i);
    if (fallback) {
      return res.status(200).json({ streamUrl: fallback[0] });
    }

    return res.status(404).json({ error: 'Stream URL not found in page — EarthCam may have changed their embed format.' });
  } catch (err) {
    console.error('stream-url error:', err);
    return res.status(500).json({ error: err.message ?? 'Failed to fetch stream URL' });
  }
}
