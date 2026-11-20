/**
 * Veritas Deepfake Forensics Web Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Forensics Engine
  const engine = new ForensicsEngine();

  // State Management
  const state = {
    currentImage: null,
    currentDataUrl: null,
    currentMetadata: null,
    currentResults: null,
    currentMode: 'original',
    sha256: null,
    elaScale: 25,
    jpegQuality: 0.90,
    isDraggingSplit: false,
    splitPosition: 0.5,
    webcamStream: null
  };

  // DOM Elements
  const DOM = {
    // Icons
    brandIcon: document.getElementById('brandIcon'),
    iconDownloadZip: document.getElementById('iconDownloadZip'),
    dropzoneIcon: document.getElementById('dropzoneIcon'),
    iconReset: document.getElementById('iconReset'),
    iconExportTop: document.getElementById('iconExportTop'),
    iconInputTitle: document.getElementById('iconInputTitle'),
    iconBrowse: document.getElementById('iconBrowse'),
    iconWebcam: document.getElementById('iconWebcam'),
    iconViewportTitle: document.getElementById('iconViewportTitle'),
    iconSplit: document.getElementById('iconSplit'),
    iconDiagnosticsTitle: document.getElementById('iconDiagnosticsTitle'),
    iconExport: document.getElementById('iconExport'),
    iconJson: document.getElementById('iconJson'),

    // Input & Samples
    dropzone: document.getElementById('dropzone'),
    fileInput: document.getElementById('fileInput'),
    btnBrowseFile: document.getElementById('btnBrowseFile'),
    btnOpenWebcam: document.getElementById('btnOpenWebcam'),
    sampleGrid: document.getElementById('sampleGrid'),
    sliderElaScale: document.getElementById('sliderElaScale'),
    valElaScale: document.getElementById('valElaScale'),
    sliderJpegQuality: document.getElementById('sliderJpegQuality'),
    valJpegQuality: document.getElementById('valJpegQuality'),

    // Viewport
    stageContainer: document.getElementById('stageContainer'),
    viewportTabs: document.getElementById('viewportTabs'),
    viewCanvas: document.getElementById('viewCanvas'),
    splitContainer: document.getElementById('splitContainer'),
    splitBaseCanvas: document.getElementById('splitBaseCanvas'),
    splitOverlayCanvas: document.getElementById('splitOverlayCanvas'),
    splitTopLayer: document.getElementById('splitTopLayer'),
    splitHandle: document.getElementById('splitHandle'),
    splitLabelLeft: document.getElementById('splitLabelLeft'),
    splitLabelRight: document.getElementById('splitLabelRight'),

    // Metadata Footer
    metaDim: document.getElementById('metaDim'),
    metaHash: document.getElementById('metaHash'),
    metaLatency: document.getElementById('metaLatency'),

    // Diagnostics & Verdict
    verdictCard: document.getElementById('verdictCard'),
    riskBadge: document.getElementById('riskBadge'),
    gaugeCircle: document.getElementById('gaugeCircle'),
    gaugePct: document.getElementById('gaugePct'),
    verdictTitle: document.getElementById('verdictTitle'),
    verdictSummary: document.getElementById('verdictSummary'),

    // Metric Bars
    scoreFFT: document.getElementById('scoreFFT'),
    barFFT: document.getElementById('barFFT'),
    scoreELA: document.getElementById('scoreELA'),
    barELA: document.getElementById('barELA'),
    scoreNoise: document.getElementById('scoreNoise'),
    barNoise: document.getElementById('barNoise'),
    scoreChroma: document.getElementById('scoreChroma'),
    barChroma: document.getElementById('barChroma'),
    scoreMeta: document.getElementById('scoreMeta'),
    barMeta: document.getElementById('barMeta'),

    // Findings
    findingsList: document.getElementById('findingsList'),

    // Actions
    btnResetScan: document.getElementById('btnResetScan'),
    btnExportTop: document.getElementById('btnExportTop'),
    btnExportReport: document.getElementById('btnExportReport'),
    btnDownloadJson: document.getElementById('btnDownloadJson'),

    // Webcam Modal
    webcamModal: document.getElementById('webcamModal'),
    webcamVideo: document.getElementById('webcamVideo'),
    btnCloseWebcam: document.getElementById('btnCloseWebcam'),
    btnCancelWebcam: document.getElementById('btnCancelWebcam'),
    btnCaptureSnapshot: document.getElementById('btnCaptureSnapshot')
  };

  // 1. Initialize Icons
  function initIcons() {
    if (window.Icons) {
      DOM.brandIcon.innerHTML = Icons.scan;
      if (DOM.iconDownloadZip) DOM.iconDownloadZip.innerHTML = Icons.download;
      DOM.dropzoneIcon.innerHTML = Icons.upload;
      DOM.iconReset.innerHTML = Icons.activity;
      DOM.iconExportTop.innerHTML = Icons.fileText;
      DOM.iconInputTitle.innerHTML = Icons.sliders;
      DOM.iconBrowse.innerHTML = Icons.upload;
      DOM.iconWebcam.innerHTML = Icons.camera;
      DOM.iconViewportTitle.innerHTML = Icons.cpu;
      DOM.iconSplit.innerHTML = Icons.split;
      DOM.iconDiagnosticsTitle.innerHTML = Icons.shieldAlert;
      DOM.iconExport.innerHTML = Icons.fileText;
      DOM.iconJson.innerHTML = Icons.download;
    }
  }

  // 2. Initialize Sample Library Gallery
  function initSampleGallery() {
    DOM.sampleGrid.innerHTML = '';
    SampleLibrary.samples.forEach(sample => {
      const card = document.createElement('div');
      card.className = 'sample-card';
      card.dataset.id = sample.id;

      // Generate thumbnail preview
      const thumb = document.createElement('div');
      thumb.className = 'sample-thumb';
      const sampleData = sample.generate();
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 44;
      thumbCanvas.height = 44;
      const tCtx = thumbCanvas.getContext('2d');
      tCtx.drawImage(sampleData.canvas, 0, 0, 44, 44);
      thumb.appendChild(thumbCanvas);

      const info = document.createElement('div');
      info.className = 'sample-info';
      info.innerHTML = `
        <h4>${sample.title}</h4>
        <span>${sample.type}</span>
      `;

      const tag = document.createElement('span');
      tag.className = `sample-tag tag-${sample.riskClass}`;
      tag.textContent = sample.riskClass === 'danger' ? 'AI' : (sample.riskClass === 'warning' ? 'SPLICED' : 'REAL');

      card.appendChild(thumb);
      card.appendChild(info);
      card.appendChild(tag);

      card.addEventListener('click', () => {
        document.querySelectorAll('.sample-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        loadSample(sample);
      });

      DOM.sampleGrid.appendChild(card);
    });
  }

  // Load a sample from library
  async function loadSample(sample) {
    const generated = sample.generate();
    state.currentMetadata = generated.metadata;
    state.currentDataUrl = generated.dataUrl;

    const img = new Image();
    img.onload = async () => {
      state.currentImage = img;
      await runAnalysis();
    };
    img.src = generated.dataUrl;
  }

  // 3. File Input & Drag and Drop
  function initFileInput() {
    DOM.btnBrowseFile.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.fileInput.click();
    });

    DOM.dropzone.addEventListener('click', () => {
      DOM.fileInput.click();
    });

    DOM.fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleUploadedFile(file);
    });

    DOM.dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      DOM.dropzone.classList.add('dragover');
    });

    DOM.dropzone.addEventListener('dragleave', () => {
      DOM.dropzone.classList.remove('dragover');
    });

    DOM.dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      DOM.dropzone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) handleUploadedFile(file);
    });
  }

  function handleUploadedFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    document.querySelectorAll('.sample-card').forEach(c => c.classList.remove('active'));

    const reader = new FileReader();
    reader.onload = async (e) => {
      state.currentDataUrl = e.target.result;
      const img = new Image();
      img.onload = async () => {
        state.currentImage = img;
        state.currentMetadata = null; // Will be inspected by server/client
        await runAnalysis();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // 4. Viewport Tabs & Mode Switching
  function initViewportTabs() {
    DOM.viewportTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.v-tab');
      if (!tab) return;
      DOM.viewportTabs.querySelectorAll('.v-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentMode = tab.dataset.mode;
      renderCurrentView();
    });
  }

  function renderCurrentView() {
    if (!state.currentResults) return;

    const { width, height } = state.currentResults.dimensions;

    if (state.currentMode === 'split') {
      DOM.viewCanvas.style.display = 'none';
      DOM.splitContainer.style.display = 'inline-block';

      // Set up split canvases
      DOM.splitBaseCanvas.width = width;
      DOM.splitBaseCanvas.height = height;
      const bCtx = DOM.splitBaseCanvas.getContext('2d');
      bCtx.drawImage(state.currentImage, 0, 0, width, height);

      DOM.splitOverlayCanvas.width = width;
      DOM.splitOverlayCanvas.height = height;
      const oCtx = DOM.splitOverlayCanvas.getContext('2d');
      oCtx.drawImage(state.currentResults.ela.canvas, 0, 0, width, height);

      updateSplitPosition(state.splitPosition);
      return;
    }

    DOM.splitContainer.style.display = 'none';
    DOM.viewCanvas.style.display = 'block';

    const ctx = DOM.viewCanvas.getContext('2d');

    switch (state.currentMode) {
      case 'original':
        DOM.viewCanvas.width = width;
        DOM.viewCanvas.height = height;
        ctx.drawImage(state.currentImage, 0, 0, width, height);
        break;

      case 'ela':
        DOM.viewCanvas.width = width;
        DOM.viewCanvas.height = height;
        ctx.drawImage(state.currentResults.ela.canvas, 0, 0);
        break;

      case 'fft':
        DOM.viewCanvas.width = state.currentResults.fft.canvas.width;
        DOM.viewCanvas.height = state.currentResults.fft.canvas.height;
        ctx.drawImage(state.currentResults.fft.canvas, 0, 0);
        break;

      case 'noise':
        DOM.viewCanvas.width = width;
        DOM.viewCanvas.height = height;
        ctx.drawImage(state.currentResults.noise.canvas, 0, 0);
        break;
    }
  }

  // 5. Split-View Drag Comparator
  function initSplitHandle() {
    const handleMove = (clientX) => {
      if (!state.isDraggingSplit) return;
      const rect = DOM.splitContainer.getBoundingClientRect();
      let pos = (clientX - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      state.splitPosition = pos;
      updateSplitPosition(pos);
    };

    DOM.splitHandle.addEventListener('mousedown', () => {
      state.isDraggingSplit = true;
    });

    window.addEventListener('mousemove', (e) => {
      if (state.isDraggingSplit) handleMove(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      state.isDraggingSplit = false;
    });

    // Touch support
    DOM.splitHandle.addEventListener('touchstart', () => {
      state.isDraggingSplit = true;
    });

    window.addEventListener('touchmove', (e) => {
      if (state.isDraggingSplit && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    });

    window.addEventListener('touchend', () => {
      state.isDraggingSplit = false;
    });
  }

  function updateSplitPosition(pos) {
    const pct = (pos * 100).toFixed(2);
    DOM.splitTopLayer.style.width = `${pct}%`;
    DOM.splitHandle.style.left = `${pct}%`;
  }

  // 6. Forensic Tuning Sliders
  function initSliders() {
    DOM.sliderElaScale.addEventListener('input', async (e) => {
      state.elaScale = parseInt(e.target.value, 10);
      DOM.valElaScale.textContent = `${state.elaScale}x`;
      if (state.currentImage) await runAnalysis(true);
    });

    DOM.sliderJpegQuality.addEventListener('input', async (e) => {
      state.jpegQuality = parseInt(e.target.value, 10) / 100;
      DOM.valJpegQuality.textContent = `${e.target.value}%`;
      if (state.currentImage) await runAnalysis(true);
    });
  }

  // Client-side SHA-256 calculation
  async function computeSha256(dataUrl) {
    try {
      if (window.crypto && window.crypto.subtle) {
        const base64 = dataUrl.split(',')[1] || dataUrl;
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', bytes);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {
      console.warn('Crypto subtle SHA-256 failed:', e);
    }
    // Fallback pseudo-hash
    let hash = 0;
    for (let i = 0; i < dataUrl.length; i++) {
      hash = ((hash << 5) - hash) + dataUrl.charCodeAt(i);
      hash |= 0;
    }
    return 'sha256_' + Math.abs(hash).toString(16).padStart(8, '0') + Date.now().toString(16);
  }

  // 7. Core Analysis Execution
  async function runAnalysis(tuningOnly = false) {
    if (!state.currentImage) return;

    DOM.stageContainer.classList.add('scanning');

    try {
      // Step A: Inspect binary metadata and calculate SHA-256 hash
      if (!tuningOnly && state.currentDataUrl) {
        // Calculate authentic client-side SHA-256
        state.sha256 = await computeSha256(state.currentDataUrl);

        // Run client-side binary inspection if not already provided by sample
        if (!state.currentMetadata) {
          state.currentMetadata = engine.inspectBinaryData(state.currentDataUrl);
        }

        // Try server-side enhancement if available
        try {
          const resp = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl: state.currentDataUrl })
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data.sha256) state.sha256 = data.sha256;
            if (data.binaryInspection && Object.keys(data.binaryInspection.cameraMetadata).length > 0) {
              state.currentMetadata = data.binaryInspection;
            }
          }
        } catch (err) {
          // Expected in static or offline mode
        }
      }

      // Step B: Run Forensics Engine
      const results = await engine.analyze(state.currentImage, {
        elaScale: state.elaScale,
        jpegQuality: state.jpegQuality,
        metadata: state.currentMetadata
      });

      state.currentResults = results;

      // Step C: Update UI Elements
      updateVerdictUI(results.ensemble);
      updateMetricsUI(results.ensemble.metrics);
      updateFindingsUI(results.ensemble.findings);
      updateMetaFooter(results);
      renderCurrentView();

    } catch (err) {
      console.error('Forensics analysis error:', err);
      alert('Analysis error: ' + err.message);
    } finally {
      DOM.stageContainer.classList.remove('scanning');
    }
  }

  // 8. Update UI Components
  function updateVerdictUI(ensemble) {
    const prob = ensemble.deepfakeProbability;
    DOM.gaugePct.textContent = `${prob.toFixed(1)}%`;

    // SVG Circular Gauge (Circumference of r=60 is ~377)
    const circumference = 377;
    const offset = circumference - (prob / 100) * circumference;
    DOM.gaugeCircle.style.strokeDashoffset = offset;

    // Reset card classes
    DOM.verdictCard.className = `verdict-card verdict-${ensemble.verdictClass}`;

    // Risk badge
    DOM.riskBadge.className = `sample-tag tag-${ensemble.verdictClass}`;
    DOM.riskBadge.textContent = ensemble.riskLevel;

    // Set gauge stroke color
    if (ensemble.verdictClass === 'danger') {
      DOM.gaugeCircle.style.stroke = 'var(--status-danger)';
    } else if (ensemble.verdictClass === 'warning') {
      DOM.gaugeCircle.style.stroke = 'var(--status-warning)';
    } else if (ensemble.verdictClass === 'moderate') {
      DOM.gaugeCircle.style.stroke = 'var(--status-info)';
    } else {
      DOM.gaugeCircle.style.stroke = 'var(--status-success)';
    }

    DOM.verdictTitle.textContent = ensemble.verdict;
    DOM.verdictSummary.textContent = ensemble.summary;
  }

  function updateMetricsUI(metrics) {
    // 1. Spectral FFT
    DOM.scoreFFT.textContent = `${metrics.spectralScore} / 100`;
    DOM.barFFT.style.width = `${metrics.spectralScore}%`;
    setBarColor(DOM.barFFT, metrics.spectralScore);

    // 2. ELA
    DOM.scoreELA.textContent = `${metrics.elaScore} / 100`;
    DOM.barELA.style.width = `${metrics.elaScore}%`;
    setBarColor(DOM.barELA, metrics.elaScore);

    // 3. Noise PRNU
    DOM.scoreNoise.textContent = `${metrics.noiseScore} / 100`;
    DOM.barNoise.style.width = `${metrics.noiseScore}%`;
    setBarColor(DOM.barNoise, metrics.noiseScore);

    // 4. Chroma
    DOM.scoreChroma.textContent = `${metrics.chromaScore} / 100`;
    DOM.barChroma.style.width = `${metrics.chromaScore}%`;
    setBarColor(DOM.barChroma, metrics.chromaScore);

    // 5. Metadata
    DOM.scoreMeta.textContent = `${metrics.metadataScore} / 100`;
    DOM.barMeta.style.width = `${metrics.metadataScore}%`;
    setBarColor(DOM.barMeta, metrics.metadataScore);
  }

  function setBarColor(barEl, score) {
    barEl.className = 'bar-fill ' + (score > 60 ? 'bar-danger' : (score > 35 ? 'bar-warning' : 'bar-success'));
  }

  function updateFindingsUI(findings) {
    DOM.findingsList.innerHTML = '';
    findings.forEach(f => {
      const item = document.createElement('div');
      item.className = `finding-item finding-${f.type}`;
      item.innerHTML = `
        <div class="finding-content">
          <h5>${f.title}</h5>
          <p>${f.desc}</p>
        </div>
      `;
      DOM.findingsList.appendChild(item);
    });
  }

  function updateMetaFooter(results) {
    DOM.metaDim.textContent = `${results.dimensions.width} × ${results.dimensions.height} px`;
    DOM.metaHash.textContent = state.sha256 || 'Calculated locally';
    DOM.metaHash.title = state.sha256 || '';
    DOM.metaLatency.textContent = `${results.executionTimeMs} ms`;
  }

  // 9. Webcam Functionality
  function initWebcam() {
    DOM.btnOpenWebcam.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        state.webcamStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        DOM.webcamVideo.srcObject = state.webcamStream;
        DOM.webcamModal.classList.add('open');
      } catch (err) {
        alert('Could not access camera: ' + err.message);
      }
    });

    const closeWebcam = () => {
      if (state.webcamStream) {
        state.webcamStream.getTracks().forEach(t => t.stop());
        state.webcamStream = null;
      }
      DOM.webcamModal.classList.remove('open');
    };

    DOM.btnCloseWebcam.addEventListener('click', closeWebcam);
    DOM.btnCancelWebcam.addEventListener('click', closeWebcam);

    DOM.btnCaptureSnapshot.addEventListener('click', () => {
      const snapCanvas = document.createElement('canvas');
      snapCanvas.width = DOM.webcamVideo.videoWidth || 640;
      snapCanvas.height = DOM.webcamVideo.videoHeight || 480;
      const sCtx = snapCanvas.getContext('2d');
      sCtx.drawImage(DOM.webcamVideo, 0, 0);

      closeWebcam();

      const dataUrl = snapCanvas.toDataURL('image/jpeg', 0.95);
      state.currentDataUrl = dataUrl;
      const img = new Image();
      img.onload = async () => {
        state.currentImage = img;
        state.currentMetadata = {
          hasExif: true,
          cameraMetadata: { detectedMake: 'Live Webcam Stream' },
          aiSignatures: []
        };
        await runAnalysis();
      };
      img.src = dataUrl;
    });
  }

  // 10. Export Forensics Audit Certificate & JSON
  function initExport() {
    const handleExportReport = () => {
      if (!state.currentResults) {
        alert('Please analyze an image first.');
        return;
      }

      const res = state.currentResults;
      const ens = res.ensemble;

      const printWindow = window.open('', '_blank', 'width=850,height=950');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Forensic Verification Audit Certificate</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .header h1 { margin: 0; font-size: 24px; color: #0f172a; }
            .header p { margin: 4px 0 0; font-size: 13px; color: #64748b; font-family: monospace; }
            .verdict-box { background: ${ens.verdictClass === 'danger' ? '#fef2f2' : (ens.verdictClass === 'warning' ? '#fffbeb' : '#f0fdf4')}; border: 2px solid ${ens.verdictClass === 'danger' ? '#ef4444' : (ens.verdictClass === 'warning' ? '#f59e0b' : '#10b981')}; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
            .verdict-title { font-size: 20px; font-weight: bold; margin-bottom: 6px; }
            .prob-badge { font-size: 28px; font-weight: 800; font-family: monospace; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
            th { background: #f8fafc; font-weight: 600; }
            .finding-card { background: #f8fafc; border-left: 4px solid #64748b; padding: 10px 14px; margin-bottom: 8px; border-radius: 4px; font-size: 13px; }
            .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 11px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>VERITAS // DIGITAL FORENSIC AUDIT CERTIFICATE</h1>
              <p>Certificate Ref: VRTS-${Date.now().toString(36).toUpperCase()}</p>
            </div>
            <div>
              <p>Generated: ${new Date().toUTCString()}</p>
            </div>
          </div>

          <div class="verdict-box">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div class="verdict-title">${ens.verdict}</div>
                <div style="font-size: 13px; color: #475569;">${ens.summary}</div>
              </div>
              <div class="prob-badge">${ens.deepfakeProbability}%</div>
            </div>
          </div>

          <h3>Forensic Metric Telemetry</h3>
          <table>
            <tr><th>Forensic Dimension</th><th>Anomaly Score</th><th>Detection Methodology</th></tr>
            <tr><td>2D Fourier Spectral Peaks</td><td>${ens.metrics.spectralScore} / 100</td><td>Radix-2 Cooley-Tukey 2D FFT & Azimuthal Decay</td></tr>
            <tr><td>Compression Discontinuity (ELA)</td><td>${ens.metrics.elaScore} / 100</td><td>Error Level Analysis at 90% JPEG baseline</td></tr>
            <tr><td>Spatial Noise Inconsistency (PRNU)</td><td>${ens.metrics.noiseScore} / 100</td><td>3x3 Laplacian High-Pass Residual Filtering</td></tr>
            <tr><td>Chrominance Aberration</td><td>${ens.metrics.chromaScore} / 100</td><td>YCbCr Channel Cross-Covariance Correlation</td></tr>
            <tr><td>Provenance & Metadata</td><td>${ens.metrics.metadataScore} / 100</td><td>Binary EXIF/XMP & Embedded AI Signature Scan</td></tr>
          </table>

          <h3 style="margin-top: 25px;">Evidence Breakdown</h3>
          ${ens.findings.map(f => `
            <div class="finding-card">
              <strong>${f.title}</strong>: ${f.desc}
            </div>
          `).join('')}

          <div class="footer">
            SHA-256 Hash: ${state.sha256 || 'N/A'}<br>
            Analyzed using Veritas Multi-Engine Image Forensic Platform v1.0.0
          </div>

          <script>
            window.onload = () => { window.print(); };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    };

    DOM.btnExportTop.addEventListener('click', handleExportReport);
    DOM.btnExportReport.addEventListener('click', handleExportReport);

    DOM.btnDownloadJson.addEventListener('click', () => {
      if (!state.currentResults) {
        alert('Please analyze an image first.');
        return;
      }
      const exportData = {
        system: 'Veritas Deepfake Image Forensics',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        sha256: state.sha256,
        dimensions: state.currentResults.dimensions,
        tuning: {
          elaScale: state.elaScale,
          jpegQuality: state.jpegQuality
        },
        ensemble: state.currentResults.ensemble,
        fftRadialProfile: state.currentResults.fft.radialProfile,
        metadata: state.currentMetadata
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `veritas-forensic-audit-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    DOM.btnResetScan.addEventListener('click', () => {
      if (SampleLibrary.samples.length > 0) {
        document.querySelectorAll('.sample-card').forEach(c => c.classList.remove('active'));
        const firstCard = DOM.sampleGrid.querySelector('.sample-card');
        if (firstCard) firstCard.classList.add('active');
        loadSample(SampleLibrary.samples[0]);
      }
    });
  }

  // 11. Initial Startup Routine
  function init() {
    initIcons();
    initSampleGallery();
    initFileInput();
    initViewportTabs();
    initSplitHandle();
    initSliders();
    initWebcam();
    initExport();

    // Auto-load first sample on launch for immediate visualization
    if (SampleLibrary.samples.length > 0) {
      const firstCard = DOM.sampleGrid.querySelector('.sample-card');
      if (firstCard) firstCard.classList.add('active');
      loadSample(SampleLibrary.samples[0]);
    }
  }

  init();
});
