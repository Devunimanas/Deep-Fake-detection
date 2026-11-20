const crypto = require('crypto');

function inspectImageBinary(buffer) {
  const result = {
    format: 'unknown',
    hasExif: false,
    cameraMetadata: {},
    aiSignatures: [],
    markers: []
  };

  if (!buffer || buffer.length < 8) return result;

  // Check JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    result.format = 'jpeg';
    let offset = 2;
    while (offset < buffer.length - 4) {
      if (buffer[offset] !== 0xFF) { offset++; continue; }
      const marker = buffer[offset + 1];
      if (marker === 0xDA || marker === 0xD9) break;
      const length = buffer.readUInt16BE(offset + 2);
      
      if (marker === 0xE1) {
        result.markers.push('APP1 (EXIF)');
        const data = buffer.slice(offset + 4, offset + 2 + length);
        const text = data.toString('latin1');
        if (text.includes('Exif')) {
          result.hasExif = true;
          const match = text.match(/(Canon|Nikon|Sony|Apple|Samsung|Google|Fujifilm|Olympus|Panasonic)[\w\s\-]*/i);
          if (match) result.cameraMetadata.detectedMake = match[0].trim();
        }
      }
      offset += 2 + length;
    }
  }

  const fullText = buffer.toString('latin1');
  const syntheticGenerators = ['Adobe Firefly', 'Midjourney', 'StableDiffusion', 'Stable Diffusion', 'DALL·E', 'DALL-E', 'Civitai', 'Automatic1111', 'ComfyUI', 'Flux.1'];
  for (const gen of syntheticGenerators) {
    if (fullText.includes(gen)) {
      result.aiSignatures.push(`Metadata mentions "${gen}"`);
    }
  }

  return result;
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const payload = req.body || {};
    let buffer;

    if (payload.dataUrl) {
      const match = payload.dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      buffer = Buffer.from(match ? match[2] : payload.dataUrl.split(',')[1] || '', 'base64');
    } else if (payload.base64) {
      buffer = Buffer.from(payload.base64, 'base64');
    }

    if (!buffer || buffer.length === 0) {
      res.status(400).json({ error: 'Invalid or missing image payload' });
      return;
    }

    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const binaryInspection = inspectImageBinary(buffer);

    res.status(200).json({
      success: true,
      sha256,
      fileSize: buffer.length,
      binaryInspection,
      analyzedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Analysis failed: ' + err.message });
  }
};
