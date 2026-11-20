module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  res.status(200).json({
    status: 'operational',
    version: '1.0.0',
    system: 'Deepfake & Synthetic Image Forensics Engine',
    platform: 'Vercel Serverless Function',
    timestamp: new Date().toISOString()
  });
};
