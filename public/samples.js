/**
 * Sample Image Generators for Deepfake Detection Testing
 * Provides 5 distinct test samples:
 * 1. AI-Generated Synthetic Portrait (GAN/Diffusion signatures)
 * 2. Face-Swapped Composite (Splicing & ELA boundary anomalies)
 * 3. Authentic DSLR Camera Capture (Natural PRNU & 1/f² spectral roll-off)
 * 4. Authentic Smartphone Street Photo (Real sensor noise profile)
 * 5. Generative AI Cyberpunk Scene (Diffusion latent grid artifacts)
 */

const SampleLibrary = {
  samples: [
    {
      id: 'ai-portrait',
      title: 'AI-Generated Portrait',
      type: 'Synthetic / Diffusion',
      expectedVerdict: 'High Probability Deepfake',
      riskClass: 'danger',
      description: 'Synthesized portrait with latent grid periodicity, smooth skin textures lacking physical PRNU noise, and synthetic chrominance.',
      tags: ['Diffusion', 'StyleGAN', 'Synthetic Face'],
      generate: () => SampleLibrary._generateAIPortrait()
    },
    {
      id: 'faceswap-composite',
      title: 'Face-Swapped Composite',
      type: 'Manipulated / Splice',
      expectedVerdict: 'Suspicious / Manipulated',
      riskClass: 'warning',
      description: 'Face spliced onto a different body/background with compression boundary discrepancy and edge gradient seams detectable via ELA.',
      tags: ['FaceSwap', 'Composite', 'Splicing'],
      generate: () => SampleLibrary._generateFaceSwap()
    },
    {
      id: 'authentic-dslr',
      title: 'Authentic DSLR Portrait',
      type: 'Authentic Photo',
      expectedVerdict: 'Authentic Digital Photograph',
      riskClass: 'success',
      description: 'Natural optical capture with continuous Poisson sensor shot noise, smooth 1/f² Fourier decay, and simulated Canon EOS R5 EXIF.',
      tags: ['DSLR', 'Canon EOS R5', 'Genuine Sensor'],
      generate: () => SampleLibrary._generateAuthenticDSLR()
    },
    {
      id: 'authentic-smartphone',
      title: 'Authentic Mobile Photo',
      type: 'Authentic Photo',
      expectedVerdict: 'Authentic Digital Photograph',
      riskClass: 'success',
      description: 'Genuine smartphone capture with consistent lens sharpness gradient, uniform PRNU sensor noise, and natural compression.',
      tags: ['Mobile', 'iPhone 15 Pro', 'Natural'],
      generate: () => SampleLibrary._generateAuthenticMobile()
    },
    {
      id: 'ai-landscape',
      title: 'AI Generative Cityscape',
      type: 'Synthetic / Midjourney',
      expectedVerdict: 'High Probability Deepfake',
      riskClass: 'danger',
      description: 'Generative landscape displaying high-frequency Fourier harmonics and chrominance clustering characteristic of text-to-image models.',
      tags: ['Midjourney', 'Latent Grid', 'Text-to-Image'],
      generate: () => SampleLibrary._generateAILandscape()
    }
  ],

  // 1. AI-Generated Synthetic Portrait
  _generateAIPortrait() {
    const W = 512, H = 512;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Gradient studio backdrop
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 350);
    bgGrad.addColorStop(0, '#2a3342');
    bgGrad.addColorStop(1, '#0e131f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Torso / Shoulders
    ctx.fillStyle = '#1c2430';
    ctx.beginPath();
    ctx.ellipse(W / 2, H + 60, 190, 160, 0, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.fillStyle = '#dfaa8a';
    ctx.fillRect(W / 2 - 40, 270, 80, 100);

    // Face Oval (Unnaturally flawless synthetic skin)
    const faceGrad = ctx.createLinearGradient(W / 2 - 100, 120, W / 2 + 100, 320);
    faceGrad.addColorStop(0, '#f8cfb5');
    faceGrad.addColorStop(0.5, '#ebb79b');
    faceGrad.addColorStop(1, '#d89b7b');
    ctx.fillStyle = faceGrad;
    ctx.beginPath();
    ctx.ellipse(W / 2, 230, 95, 125, 0, 0, Math.PI * 2);
    ctx.fill();

    // AI Hair (fine detailed strands)
    ctx.fillStyle = '#21130d';
    ctx.beginPath();
    ctx.arc(W / 2, 200, 115, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(W / 2 - 95, 230, 35, 90, 0.2, 0, Math.PI * 2);
    ctx.ellipse(W / 2 + 95, 230, 35, 90, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (slight synthetic asymmetry typical of earlier GANs/diffusion)
    // Left eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(W / 2 - 38, 215, 17, 9, 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2b5876';
    ctx.beginPath();
    ctx.arc(W / 2 - 38, 215, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(W / 2 - 38, 215, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // Catchlight (Left)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(W / 2 - 40, 213, 2, 0, Math.PI * 2);
    ctx.fill();

    // Right eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(W / 2 + 38, 215, 17, 9, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2b5876';
    ctx.beginPath();
    ctx.arc(W / 2 + 38, 215, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(W / 2 + 38, 215, 3.5, 0, Math.PI * 2);
    ctx.fill();
    // Catchlight (Right - slightly mismatched angle)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(W / 2 + 36, 212, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.strokeStyle = '#2b1b14';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(W / 2 - 38, 220, 24, Math.PI * 1.25, Math.PI * 1.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2 + 38, 220, 24, Math.PI * 1.2, Math.PI * 1.75);
    ctx.stroke();

    // Nose
    ctx.strokeStyle = '#c48663';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(W / 2, 215);
    ctx.lineTo(W / 2 - 4, 255);
    ctx.lineTo(W / 2 + 7, 258);
    ctx.stroke();

    // Lips
    ctx.fillStyle = '#c75b69';
    ctx.beginPath();
    ctx.ellipse(W / 2, 285, 24, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // EMBED SYNTHETIC FINGERPRINTS:
    // 1. Latent deconvolution checkerboard periodic modulation in pixel space
    // 2. Ultra-smooth face patches (absence of PRNU noise)
    const imgData = ctx.getImageData(0, 0, W, H);
    const data = imgData.data;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = (y * W + x) * 4;
        // Periodic high frequency grid pattern (characteristic of GAN deconvolution layers)
        const gridArtifact = Math.sin(x * 0.45) * Math.cos(y * 0.45) * 4.2;
        data[idx] = Math.max(0, Math.min(255, data[idx] + gridArtifact));
        data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + gridArtifact));
        data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + gridArtifact));
      }
    }
    ctx.putImageData(imgData, 0, 0);

    return {
      canvas,
      dataUrl: canvas.toDataURL('image/jpeg', 0.95),
      metadata: {
        hasExif: false,
        cameraMetadata: {},
        aiSignatures: ['Stable Diffusion XL (v1.0)', 'Prompt: 8k portrait photorealistic']
      }
    };
  },

  // 2. Face-Swapped Composite
  _generateFaceSwap() {
    const W = 512, H = 512;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Outdoor textured background
    ctx.fillStyle = '#3a5043';
    ctx.fillRect(0, 0, W, H);
    // Draw background texture with high compression artifacts
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(30, ${60 + (i % 30)}, 40, 0.4)`;
      ctx.fillRect((i * 19) % W, (i * 23) % H, 80, 80);
    }

    // Body & Jacket
    ctx.fillStyle = '#22222b';
    ctx.beginPath();
    ctx.ellipse(W / 2, H + 40, 180, 150, 0, 0, Math.PI * 2);
    ctx.fill();

    // Natural hair & ears of base image
    ctx.fillStyle = '#4a3b32';
    ctx.beginPath();
    ctx.ellipse(W / 2, 200, 120, 140, 0, 0, Math.PI * 2);
    ctx.fill();

    // SPLICED FACE INSERTION (with distinct boundary gradient mismatch)
    const spliceGrad = ctx.createRadialGradient(W / 2, 230, 20, W / 2, 230, 95);
    spliceGrad.addColorStop(0, '#f2d4be');
    spliceGrad.addColorStop(0.7, '#e8be9f');
    spliceGrad.addColorStop(1, '#b57a58'); // Noticeable edge mismatch
    ctx.fillStyle = spliceGrad;
    ctx.beginPath();
    ctx.ellipse(W / 2, 230, 80, 105, 0, 0, Math.PI * 2);
    ctx.fill();

    // Features on spliced face
    ctx.fillStyle = '#1c1c1c';
    ctx.beginPath();
    ctx.arc(W / 2 - 30, 215, 6, 0, Math.PI * 2);
    ctx.arc(W / 2 + 30, 215, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ab6b48';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(W / 2, 215);
    ctx.lineTo(W / 2 - 3, 250);
    ctx.lineTo(W / 2 + 5, 253);
    ctx.stroke();

    ctx.fillStyle = '#b84d5c';
    ctx.beginPath();
    ctx.ellipse(W / 2, 280, 20, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Simulate distinct secondary compression boundary along face seam
    ctx.strokeStyle = 'rgba(255, 120, 80, 0.08)';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Add noise to background only, leaving face smooth (classic splicing artifact)
    const imgData = ctx.getImageData(0, 0, W, H);
    const data = imgData.data;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const dx = (x - W / 2) / 80;
        const dy = (y - 230) / 105;
        const insideFace = (dx * dx + dy * dy) < 1.0;

        const idx = (y * W + x) * 4;
        if (!insideFace) {
          // Coarse background noise
          const n = (Math.random() - 0.5) * 16;
          data[idx] = Math.max(0, Math.min(255, data[idx] + n));
          data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + n));
          data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + n));
        } else {
          // Unnatural skin smoothing inside splice
          const smoothN = (Math.random() - 0.5) * 2;
          data[idx] = Math.max(0, Math.min(255, data[idx] + smoothN));
          data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + smoothN));
          data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + smoothN));
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    return {
      canvas,
      dataUrl: canvas.toDataURL('image/jpeg', 0.92),
      metadata: {
        hasExif: false,
        cameraMetadata: {},
        aiSignatures: []
      }
    };
  },

  // 3. Authentic DSLR Camera Capture
  _generateAuthenticDSLR() {
    const W = 512, H = 512;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Natural outdoor bokeh background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#596955');
    bg.addColorStop(0.5, '#788c6e');
    bg.addColorStop(1, '#4a5746');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Soft bokeh discs
    for (let i = 0; i < 16; i++) {
      ctx.fillStyle = `rgba(220, 235, 200, ${0.08 + (i % 5) * 0.02})`;
      ctx.beginPath();
      ctx.arc((i * 67 + 30) % W, (i * 49 + 20) % (H / 2), 25 + (i % 20), 0, Math.PI * 2);
      ctx.fill();
    }

    // Person in foreground
    ctx.fillStyle = '#2d2d38';
    ctx.beginPath();
    ctx.ellipse(W / 2, H + 50, 185, 150, 0, 0, Math.PI * 2);
    ctx.fill();

    // Natural skin with optical focus falloff
    ctx.fillStyle = '#e2ae88';
    ctx.beginPath();
    ctx.ellipse(W / 2, 230, 92, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    // Realistic hair
    ctx.fillStyle = '#342217';
    ctx.beginPath();
    ctx.arc(W / 2, 195, 110, Math.PI * 0.82, Math.PI * 2.18);
    ctx.fill();

    // Eyes with realistic corneal reflections from single directional light
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.ellipse(W / 2 - 36, 215, 16, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(W / 2 + 36, 215, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#422818';
    ctx.beginPath();
    ctx.arc(W / 2 - 36, 215, 6.5, 0, Math.PI * 2);
    ctx.arc(W / 2 + 36, 215, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Coherent twin catchlights from keylight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(W / 2 - 38, 213, 2, 0, Math.PI * 2);
    ctx.arc(W / 2 + 34, 213, 2, 0, Math.PI * 2);
    ctx.fill();

    // Natural features
    ctx.strokeStyle = '#b88362';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(W / 2, 215);
    ctx.lineTo(W / 2 - 3, 252);
    ctx.lineTo(W / 2 + 5, 255);
    ctx.stroke();

    ctx.fillStyle = '#b85a66';
    ctx.beginPath();
    ctx.ellipse(W / 2, 282, 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // ADD PHYSICAL SENSOR NOISE (PRNU + Poisson Shot Noise across full sensor)
    const imgData = ctx.getImageData(0, 0, W, H);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Gaussian distributed sensor noise
      const u1 = Math.random() || 0.001;
      const u2 = Math.random() || 0.001;
      const gauss = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const noise = gauss * 4.5;

      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 0.95));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise * 1.05));
    }
    ctx.putImageData(imgData, 0, 0);

    return {
      canvas,
      dataUrl: canvas.toDataURL('image/jpeg', 0.94),
      metadata: {
        hasExif: true,
        cameraMetadata: {
          detectedMake: 'Canon EOS R5',
          lens: 'RF 85mm F1.2 L USM',
          focalLength: '85mm',
          aperture: 'f/1.8',
          iso: 'ISO 200'
        },
        aiSignatures: []
      }
    };
  },

  // 4. Authentic Smartphone Street Photo
  _generateAuthenticMobile() {
    const W = 512, H = 512;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Sky & street horizon
    const sky = ctx.createLinearGradient(0, 0, 0, 300);
    sky.addColorStop(0, '#5a82a6');
    sky.addColorStop(1, '#c0d4e3');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 300);

    ctx.fillStyle = '#4f555c';
    ctx.fillRect(0, 300, W, 212);

    // City architecture silhouette
    ctx.fillStyle = '#2b3038';
    ctx.fillRect(40, 140, 70, 160);
    ctx.fillRect(130, 90, 90, 210);
    ctx.fillRect(240, 170, 60, 130);
    ctx.fillRect(320, 110, 110, 190);
    ctx.fillRect(450, 160, 50, 140);

    // Building windows
    ctx.fillStyle = '#e3cf8f';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillRect(145 + c * 25, 120 + r * 30, 14, 18);
        ctx.fillRect(340 + c * 25, 140 + r * 25, 12, 16);
      }
    }

    // Street markings
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(W / 2 - 10, 320);
    ctx.lineTo(W / 2 + 10, 320);
    ctx.lineTo(W / 2 + 40, H);
    ctx.lineTo(W / 2 - 40, H);
    ctx.fill();

    // Natural camera noise + tone mapping
    const imgData = ctx.getImageData(0, 0, W, H);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 8.0;
      data[i] = Math.max(0, Math.min(255, data[i] + n));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    return {
      canvas,
      dataUrl: canvas.toDataURL('image/jpeg', 0.90),
      metadata: {
        hasExif: true,
        cameraMetadata: {
          detectedMake: 'Apple iPhone 15 Pro',
          lens: 'Main Camera 24mm',
          focalLength: '24mm',
          aperture: 'f/1.78',
          iso: 'ISO 64'
        },
        aiSignatures: []
      }
    };
  },

  // 5. AI Generative Cityscape / Midjourney
  _generateAILandscape() {
    const W = 512, H = 512;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // Cyberpunk neon sky
    const sky = ctx.createLinearGradient(0, 0, W, H);
    sky.addColorStop(0, '#0f051d');
    sky.addColorStop(0.4, '#390b54');
    sky.addColorStop(0.7, '#880e4f');
    sky.addColorStop(1, '#ff4081');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Glowing neon towers with impossible geometric complexity
    ctx.fillStyle = '#080112';
    for (let i = 0; i < 7; i++) {
      const bx = i * 75 + 10;
      const bw = 55;
      const bh = 220 + (i * 37) % 180;
      ctx.fillRect(bx, H - bh, bw, bh);

      // Neon edge highlights
      ctx.strokeStyle = i % 2 === 0 ? '#00f2fe' : '#ff007f';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(bx, H - bh, bw, bh);
    }

    // High frequency sinusoidal grid in synthetic sky (diffusion latent signature)
    const imgData = ctx.getImageData(0, 0, W, H);
    const data = imgData.data;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const idx = (y * W + x) * 4;
        const synthRipple = Math.sin(x * 0.6) * Math.sin(y * 0.6) * 5.5;
        data[idx] = Math.max(0, Math.min(255, data[idx] + synthRipple));
        data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + synthRipple * 0.5));
        data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + synthRipple * 1.5));
      }
    }
    ctx.putImageData(imgData, 0, 0);

    return {
      canvas,
      dataUrl: canvas.toDataURL('image/jpeg', 0.95),
      metadata: {
        hasExif: false,
        cameraMetadata: {},
        aiSignatures: ['Midjourney v6.0', '--v 6 --style raw --ar 1:1']
      }
    };
  }
};

window.SampleLibrary = SampleLibrary;
