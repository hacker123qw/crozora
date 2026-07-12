import { useEffect, useRef, useState, useCallback } from 'react';

const CAMERA_NAME = 'Times Square North 4K';
const CAMERA_LOCATION = 'New York City, NY';
const CAPTURE_WIDTH = 640;
const DEFAULT_CADENCE = 10;
const MIN_CADENCE = 3;
const MAX_CADENCE = 60;

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const hlsRef = useRef(null);
  const pendingRef = useRef(false);
  const intervalRef = useRef(null);
  const prevDescRef = useRef('');

  const [description, setDescription] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cadence, setCadence] = useState(DEFAULT_CADENCE);
  const [streamReady, setStreamReady] = useState(false);
  const [streamError, setStreamError] = useState('');
  const [streamStatus, setStreamStatus] = useState('Fetching stream URL…');
  const [apiError, setApiError] = useState('');
  const [analysisCount, setAnalysisCount] = useState(0);

  // Fetch a fresh signed stream URL from our serverless proxy, then boot HLS.js.
  // On fatal HLS error, refetch URL and reinitialise — handles token expiry automatically.
  const bootHls = useCallback(async (Hls) => {
    setStreamError('');
    setStreamStatus('Fetching stream URL…');

    let streamUrl;
    try {
      const res = await fetch('/api/stream-url');
      const json = await res.json();
      if (!res.ok || !json.streamUrl) throw new Error(json.error ?? 'No URL returned');
      streamUrl = json.streamUrl;
    } catch (err) {
      setStreamError(`Could not get stream URL: ${err.message}`);
      return;
    }

    // EarthCam's CDN blocks non-earthcam Referers, so we cannot load the stream
    // directly in the browser. Route it through our same-origin proxy, which adds
    // the earthcam Referer server-side. This also keeps the video same-origin so
    // canvas frame-capture works without CORS tainting.
    const proxied = `/api/proxy?u=${encodeURIComponent(streamUrl)}`;

    setStreamStatus('Connecting…');
    hlsRef.current?.destroy();

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;
      hls.loadSource(proxied);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setStreamReady(true);
        setStreamStatus('');
        videoRef.current?.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal) {
          // Token likely expired — refetch and reinitialise
          setStreamReady(false);
          setStreamStatus('Refreshing stream…');
          setTimeout(() => bootHls(Hls), 2000);
        }
      });
    } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = proxied;
      videoRef.current.crossOrigin = 'anonymous';
      videoRef.current.addEventListener('loadedmetadata', () => {
        setStreamReady(true);
        setStreamStatus('');
        videoRef.current?.play().catch(() => {});
      }, { once: true });
    } else {
      setStreamError('HLS is not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    let Hls;
    import('hls.js').then(({ default: H }) => {
      Hls = H;
      bootHls(Hls);
    });
    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [bootHls]);

  // Capture a frame and send to /api/analyze
  const captureAndAnalyze = useCallback(async () => {
    if (pendingRef.current) return; // skip if previous call still in flight
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    pendingRef.current = true;
    setIsAnalyzing(true);
    setApiError('');

    try {
      const ar = video.videoHeight / (video.videoWidth || 1);
      canvas.width = CAPTURE_WIDTH;
      canvas.height = Math.round(CAPTURE_WIDTH * ar) || 360;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const imageBase64 = dataUrl.split(',')[1];

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          previousDescription: prevDescRef.current || undefined,
          cameraName: CAMERA_NAME,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      const { description: newDesc } = await res.json();
      prevDescRef.current = newDesc;
      setDescription(newDesc);
      setLastUpdated(new Date());
      setAnalysisCount((n) => n + 1);
    } catch (err) {
      setApiError(err.message ?? 'Analysis failed');
    } finally {
      pendingRef.current = false;
      setIsAnalyzing(false);
    }
  }, []);

  // Restart the interval whenever cadence changes or stream becomes ready
  useEffect(() => {
    if (!streamReady) return;
    clearInterval(intervalRef.current);
    captureAndAnalyze(); // fire immediately
    intervalRef.current = setInterval(captureAndAnalyze, cadence * 1000);
    return () => clearInterval(intervalRef.current);
  }, [streamReady, cadence, captureAndAnalyze]);

  const fmt = (d) =>
    d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';

  return (
    <div style={styles.root}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>◉</span>
            <span style={styles.logoText}>SitAware</span>
          </div>
          <div style={styles.divider} />
          <div>
            <div style={styles.cameraName}>{CAMERA_NAME}</div>
            <div style={styles.cameraLocation}>{CAMERA_LOCATION}</div>
          </div>
        </div>
        <div style={styles.headerRight}>
          {streamReady && (
            <div style={styles.liveBadge}>
              <span style={styles.liveDot} />
              LIVE
            </div>
          )}
          <div style={styles.analysisCounter}>
            {analysisCount} reads
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        {/* Video panel */}
        <div style={styles.videoPanel}>
          <div style={styles.videoWrapper}>
            <video
              ref={videoRef}
              crossOrigin="anonymous"
              muted
              playsInline
              autoPlay
              style={styles.video}
            />
            {!streamReady && !streamError && (
              <div style={styles.videoOverlay}>
                <div style={styles.loadingSpinner} />
                <span style={styles.loadingText}>{streamStatus || 'Connecting…'}</span>
              </div>
            )}
            {streamError && (
              <div style={styles.videoOverlay}>
                <span style={{ color: '#f87171', fontSize: 14 }}>{streamError}</span>
              </div>
            )}
            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>

        {/* Analysis panel */}
        <div style={styles.analysisPanel}>
          {/* Status row */}
          <div style={styles.statusRow}>
            <div style={styles.statusLabel}>AI SCENE ANALYSIS</div>
            <div style={isAnalyzing ? styles.analyzeIndicatorActive : styles.analyzeIndicator}>
              {isAnalyzing ? '⬤ READING' : lastUpdated ? '● IDLE' : '○ WAITING'}
            </div>
          </div>

          {/* Description */}
          <div style={styles.descriptionBox}>
            {description ? (
              <p style={styles.descriptionText}>{description}</p>
            ) : (
              <p style={styles.descriptionPlaceholder}>
                {streamReady ? 'Capturing first frame…' : 'Waiting for stream…'}
              </p>
            )}
          </div>

          {/* Timestamp */}
          <div style={styles.timestamp}>
            Last updated: {fmt(lastUpdated)}
          </div>

          {apiError && (
            <div style={styles.errorBox}>
              ⚠ {apiError}
            </div>
          )}

          {/* Cadence control */}
          <div style={styles.cadenceSection}>
            <div style={styles.cadenceHeader}>
              <span style={styles.cadenceLabelText}>CADENCE</span>
              <span style={styles.cadenceValue}>{cadence}s</span>
            </div>
            <input
              type="range"
              min={MIN_CADENCE}
              max={MAX_CADENCE}
              step={1}
              value={cadence}
              onChange={(e) => setCadence(Number(e.target.value))}
              style={styles.slider}
            />
            <div style={styles.cadenceTicks}>
              <span>{MIN_CADENCE}s (hot)</span>
              <span>{MAX_CADENCE}s (quiet)</span>
            </div>
          </div>

          {/* Privacy notice */}
          <div style={styles.privacyNotice}>
            <span style={styles.privacyIcon}>⚑</span>
            Scene-level analysis only. No individual identification.
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  root: {
    minHeight: '100vh',
    background: '#050b18',
    color: '#e2e8f0',
    fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    borderBottom: '1px solid rgba(59,130,246,0.12)',
    background: 'rgba(5,11,24,0.95)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  logo: { display: 'flex', alignItems: 'center', gap: 8 },
  logoIcon: { color: '#3b82f6', fontSize: 20 },
  logoText: { color: '#fff', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' },
  divider: { width: 1, height: 28, background: 'rgba(148,163,184,0.15)' },
  cameraName: { color: '#f1f5f9', fontWeight: 600, fontSize: 14 },
  cameraLocation: { color: '#64748b', fontSize: 12, marginTop: 2 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 16 },
  liveBadge: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '4px 10px', borderRadius: 6,
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
  },
  liveDot: {
    display: 'inline-block', width: 6, height: 6,
    borderRadius: '50%', background: '#ef4444',
    boxShadow: '0 0 6px #ef4444',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  analysisCounter: { color: '#475569', fontSize: 12 },
  main: {
    flex: 1,
    display: 'flex',
    gap: 0,
    overflow: 'hidden',
  },
  videoPanel: {
    flex: '0 0 62%',
    display: 'flex',
    flexDirection: 'column',
    background: '#000',
  },
  videoWrapper: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  videoOverlay: {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 12,
    background: 'rgba(5,11,24,0.8)',
  },
  loadingSpinner: {
    width: 28, height: 28,
    border: '2px solid rgba(59,130,246,0.2)',
    borderTop: '2px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: { color: '#64748b', fontSize: 13 },
  analysisPanel: {
    flex: '0 0 38%',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 24,
    borderLeft: '1px solid rgba(59,130,246,0.1)',
    overflowY: 'auto',
  },
  statusRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  statusLabel: {
    color: '#475569', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
  },
  analyzeIndicator: {
    color: '#475569', fontSize: 11, fontWeight: 600,
  },
  analyzeIndicatorActive: {
    color: '#3b82f6', fontSize: 11, fontWeight: 600,
    animation: 'fadeIn 0.3s ease',
  },
  descriptionBox: {
    flex: 1,
    background: 'rgba(15,23,42,0.6)',
    border: '1px solid rgba(59,130,246,0.12)',
    borderRadius: 10,
    padding: '16px 18px',
    minHeight: 140,
  },
  descriptionText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 1.75,
    margin: 0,
  },
  descriptionPlaceholder: {
    color: '#334155',
    fontSize: 13,
    fontStyle: 'italic',
    margin: 0,
  },
  timestamp: {
    color: '#334155', fontSize: 11, textAlign: 'right',
  },
  errorBox: {
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#f87171',
    fontSize: 12,
  },
  cadenceSection: {
    borderTop: '1px solid rgba(59,130,246,0.08)',
    paddingTop: 16,
  },
  cadenceHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    marginBottom: 10,
  },
  cadenceLabelText: {
    color: '#475569', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
  },
  cadenceValue: {
    color: '#3b82f6', fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
  },
  slider: {
    width: '100%',
    accentColor: '#3b82f6',
    cursor: 'pointer',
  },
  cadenceTicks: {
    display: 'flex', justifyContent: 'space-between',
    color: '#334155', fontSize: 10, marginTop: 6,
  },
  privacyNotice: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(15,23,42,0.4)',
    border: '1px solid rgba(59,130,246,0.06)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#475569',
    fontSize: 11,
    marginTop: 'auto',
  },
  privacyIcon: { color: '#3b82f6', fontSize: 13 },
};
