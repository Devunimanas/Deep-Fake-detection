# Veritas // Deepfake & Synthetic Image Forensics System

A comprehensive, production-ready web application for detecting deepfakes, AI-synthesized media (Diffusion, GANs), and digital image manipulation (splicing, inpainting, face-swapping) using multi-layer forensic analysis.

![Deepfake Detection](public/style.css)

---

## 🔬 Forensic Detection Engines

Veritas integrates five independent, complementary digital forensic methodologies:

### 1. 2D Fast Fourier Transform (FFT) Spectral Analysis
* **Theory**: Upsampling operations in Generative Adversarial Networks (StyleGAN, ProGAN) and latent diffusion models (Stable Diffusion, Midjourney, DALL-E) introduce periodic checkerboard patterns and high-frequency spectral spikes in the frequency domain. Natural images adhere strictly to a smooth $1/f^\alpha$ power-law decay.
* **Implementation**: Cooley-Tukey Radix-2 2D FFT on image luminance, Hanning 2D windowing, DC-centering, and azimuthal (radial) power spectrum distribution tracking.
* **Output**: Real-time 2D Fourier power spectrum heatmap and high-frequency harmonic anomaly scoring.

### 2. Error Level Analysis (ELA) Compression Forensics
* **Theory**: Natural photographs saved as JPEG have uniform compression error rates across the entire frame. When an image is modified, spliced, or locally inpainted and resaved, the spliced regions compress at different rates than the background.
* **Implementation**: Standardized re-compression at 90% JPEG baseline, Euclidean pixel difference mapping, dynamic 10x–45x enhancement, and block-based ($16\times 16$) error variance standard deviation.
* **Output**: False-color ELA heatmap with interactive enhancement factor controls.

### 3. Spatial Laplacian Noise Residuals & PRNU Approximation
* **Theory**: Optical camera sensors produce physical Photo-Response Non-Uniformity (PRNU) and photon shot noise that is spatially stationary and uniform. In contrast, AI generators produce hyper-smooth skin textures and localized pseudo-noise that lacks physical sensor correlation.
* **Implementation**: $3\times 3$ discrete Laplacian high-pass operator with local block variance calculation and zero-noise smoothness ratio scoring.
* **Output**: High-pass noise residual visualization and inter-block noise inconsistency index.

### 4. Chrominance & YCbCr Discrepancy
* **Theory**: Evaluates cross-channel covariance between luminance ($Y$) and chrominance ($Cb, Cr$) channels to detect unnatural skin tone saturation and color gradient bleeding typical of generative models.

### 5. Provenance, Binary EXIF & AI Generator Signature Scanning
* **Theory**: Examines JPEG APP1/EXIF segments, XMP markers, and PNG text chunks for authentic hardware camera signatures (Canon, Nikon, Sony, Apple, Samsung) vs embedded AI generation parameters ("Stable Diffusion", "Midjourney", "ComfyUI", "DALL-E", "Civitai", "prompt:").

---

## 🚀 Key Features

* **Interactive Multi-Mode Viewport**:
  * Original Image View
  * Error Level Analysis (ELA) with live sensitivity slider
  * 2D Fourier Spectrum (FFT) Heatmap
  * Laplacian Noise (PRNU) Residual Map
  * **Split Comparator**: Side-by-side interactive draggable comparison slider between original and forensic overlays.
* **Instant Sample Library**:
  * 5 preloaded test images: AI Synthetic Portrait, Spliced Face-Swap, Authentic Canon DSLR, Authentic iPhone Photo, and AI Cityscape.
* **Live Webcam Snapshot Analysis**: Test real-time camera captures with authentic physical sensor noise.
* **Auditing & Reporting**:
  * **Printable / PDF Forensic Verification Audit Certificate** with SHA-256 image fingerprint, timestamp, and metrics.
  * **JSON Telemetry Export** for pipeline integration.
* **Zero External Dependencies**:
  * Runs on native Node.js (v18+) without requiring external npm packages!
  * 100% self-contained frontend with inline vector icons and zero CDN latency.

---

## 🛠️ How to Run

1. Open your terminal in the project directory:
   ```bash
   cd /Users/manasmudhiraj/.gemini/antigravity/scratch/deepfake-detector
   ```

2. Start the forensics server:
   ```bash
   npm start
   # or: node server.js
   ```

3. Open your browser at:
   ```
   http://localhost:3000
   ```
