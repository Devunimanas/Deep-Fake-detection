const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper to inspect binary buffers for JPEG / PNG metadata signatures
function inspectImageBinary(buffer) {
  const result = {
    format: 'unknown',
    hasExif: false,
    cameraMetadata: {},
    aiSignatures: [],
    markers: [],
    suspiciousFlags: []
  };

  if (!buffer || buffer.length < 8) return result;

  // Check JPEG (starts with 0xFFD8)
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    result.format = 'jpeg';
    let offset = 2;
    while (offset < buffer.length - 4) {
      if (buffer[offset] !== 0xFF) {
        offset++;
        continue;
      }
      const marker = buffer[offset + 1];
      if (marker === 0xDA || marker === 0xD9) {
        // Start of scan or End of image
        break;
      }
      const length = buffer.readUInt16BE(offset + 2);
      
      // APP1: EXIF
      if (marker === 0xE1) {
        result.markers.push('APP1 (EXIF/XMP)');
        const data = buffer.slice(offset + 4, offset + 2 + length);
        const text = data.toString('latin1');
        if (text.includes('Exif')) {
          result.hasExif = true;
          // Look for camera make/model
          if (/Canon|Nikon|Sony|Apple|Samsung|Google|Fujifilm|Olympus|Panasonic/i.test(text)) {
            const match = text.match(/(Canon|Nikon|Sony|Apple|Samsung|Google|Fujifilm|Olympus|Panasonic)[\w\s\-]*/i);
            if (match) result.cameraMetadata.detectedMake = match[0].trim();
          }
        }
        if (text.includes('http://ns.adobe.com/xap/1.0/')) {
          result.markers.push('XMP');
        }
      }
      
      // COM: Comment marker
      if (marker === 0xFE) {
        result.markers.push('COM');
        const comment = buffer.slice(offset + 4, offset + 2 + length).toString('utf8');
        if (/Stable Diffusion|Midjourney|DALL-E|ComfyUI|NovelAI|Fooocus|InvokeAI/i.test(comment)) {
          result.aiSignatures.push(comment.trim());
        }
      }

      offset += 2 + length;
    }
  }

  // Check PNG (starts with 89 50 4E 47 0D 0A 1A 0A)
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    result.format = 'png';
    const textContent = buffer.toString('utf8');
    const aiKeywords = ['parameters', 'prompt', 'negative_prompt', 'Stable Diffusion', 'Midjourney', 'DALL-E', 'comfy', 'Steps:', 'Sampler:'];
    for (const kw of aiKeywords) {
      if (textContent.includes(kw)) {
        result.aiSignatures.push(`Found embedded generator token: "${kw}"`);
        break;
      }
    }
  }

  // Check general text search for synthetic indicators
  const fullText = buffer.toString('latin1');
  const syntheticGenerators = [
    'Adobe Firefly',
    'Midjourney',
    'StableDiffusion',
    'DALL·E',
    'DALL-E',
    'Civitai',
    'Automatic1111',
    'ComfyUI',
    'Kandinsky',
    'Flux.1'
  ];

  for (const gen of syntheticGenerators) {
    if (fullText.includes(gen) && !result.aiSignatures.includes(gen)) {
      result.aiSignatures.push(`Metadata mentions "${gen}"`);
    }
  }

  return result;
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // API Endpoints
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'operational',
      version: '1.0.0',
      system: 'Deepfake & Synthetic Image Forensics Engine',
      supportedEngines: [
        'Error Level Analysis (ELA)',
        '2D Fast Fourier Transform (FFT) Power Spectrum',
        'Spatial Laplacian Noise Residual (PRNU Approximation)',
        'Chrominance & YCbCr Discontinuity',
        'Binary EXIF/XMP Provenance & Prompt Signature Scanner'
      ],
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (pathname === '/api/analyze' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safeguard against gigantic payloads (> 25MB)
      if (body.length > 25 * 1024 * 1024) {
        req.destroy();
      }
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        let buffer;

        if (payload.dataUrl) {
          const match = payload.dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
          if (match) {
            buffer = Buffer.from(match[2], 'base64');
          } else {
            buffer = Buffer.from(payload.dataUrl.split(',')[1] || '', 'base64');
          }
        } else if (payload.base64) {
          buffer = Buffer.from(payload.base64, 'base64');
        }

        if (!buffer || buffer.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid or missing image data' }));
          return;
        }

        const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
        const binaryInspection = inspectImageBinary(buffer);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          sha256: sha256,
          fileSize: buffer.length,
          binaryInspection: binaryInspection,
          analyzedAt: new Date().toISOString()
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Analysis failed: ' + err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 404 Fallback
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Deepfake Image Detection System`);
  console.log(`  Forensics Server running at: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
