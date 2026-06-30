# Gomza — Premium Marketing Agency

Gomza is a high-performance, ultra-premium landing page built specifically for a full-service marketing agency targeting **Real Estate** and **SaaS** companies. The architecture is designed to reflect top-tier engineering standards, ensuring an uncompromising user experience across all devices.

## ⚡ Technical Architecture

Built with a focus on buttery-smooth performance and a premium feel:
- **Framework**: Astro (Zero-JS baseline for maximum performance)
- **Styling**: Vanilla CSS with strict, optimized layout boundaries
- **Animations**: GSAP (GreenSock) & Lenis Smooth Scrolling
- **3D Rendering**: Three.js WebGL volumetric grid background

## 🚀 Performance Highlights

The codebase employs advanced performance techniques typically reserved for high-end applications:
- **GPU Acceleration**: Heavy scroll reveals and animations are offloaded to the GPU using `will-change: transform, opacity`.
- **Hardware & Capability Detection**: The site dynamically scales its graphics engine based on the user's device specs (CPU cores, RAM). Low-tier devices automatically skip the heavy WebGL background and run at a capped 30fps to preserve battery.
- **Strict Mobile Optimization**: Intelligent layout locking and `ignoreMobileResize` configurations prevent GSAP layout thrashing when the mobile browser address bar hides/shows.
- **Ultra-Small Device Support**: Layouts are fluidly responsive down to `<360px` screens (e.g., JioPhones), aggressively stacking flex elements and stripping padding to maintain readability.

## 🛠️ Setup & Development

To run this project locally:

```bash
# Install dependencies
npm install

# Start the local development server
npm run dev

# Build for production
npm run build
```

## 🎨 Design Philosophy

Gomza rejects the standard "SaaS boilerplate" look. It utilizes deep, rich navy backgrounds (`#030712`), gold accents (`#FFB547`), and subtle glassmorphism to create an immersive, expensive aesthetic. The design is meticulously crafted to inspire trust and authority for high-ticket client acquisition.

## 📄 Documentation & Proof of Work

As part of the continuous optimization and development of the Gomza platform, several strategic plans, technical walkthroughs, and SEO audits have been documented. These serve as proof of work for the advanced capabilities engineered into this project.

- [Comprehensive SEO, AEO & GEO Audit](docs/seo_aeo_geo_audit.md): A deep-dive analysis of the site's semantic structure and Generative Engine Optimization readiness.
- [AEO & GEO Implementation Plan](docs/implementation_plan.md): The strategic proposal for capturing Google's "People Also Ask" snippets.
- [SEO Implementation Walkthrough](docs/walkthrough.md): The technical summary of the JSON-LD schemas and FAQ structural additions successfully deployed to production.
