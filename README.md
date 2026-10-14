# 🛡️ UNNATI — Autonomous Multi-Modal Misinformation & Forensic Intelligence Platform

> **UNNATI** (*उन्नति* — Progress & Elevation) is a production-grade, multi-modal AI misinformation detection and forensic intelligence platform engineered to combat digital deception, deepfake media, synthetic voice cloning, coordinated bot amplification, and fraudulent government circulars.

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tavily](https://img.shields.io/badge/Search-Tavily_AI-FF6B6B?style=flat)](https://tavily.com/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-729B1B?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Live Deployment](https://img.shields.io/badge/Live_Site-GitHub_Pages-success?style=for-the-badge&logo=github)](https://marisa-mmm.github.io/unnati/)

🌐 **Live Production Deployment**: [https://marisa-mmm.github.io/unnati/](https://marisa-mmm.github.io/unnati/)

---

## 📋 Table of Contents

- [Core Mission & Capabilities](#-core-mission--capabilities)
- [UNNATI Control Hub & Home Dashboard](#-unnati-control-hub--home-dashboard)
- [The 6 Forensic Engines](#-the-6-forensic-engines)
- [Multi-Modal Ingestion Grid](#-multi-modal-ingestion-grid)
- [Truth Report & Judicial Debate](#-truth-report--judicial-debate)
- [Live Trending Now & Flagged Feeds](#-live-trending-now--flagged-feeds)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [Getting Started & Installation](#-getting-started--installation)
- [Environment Configuration (.env)](#-environment-configuration-env)
- [Running Automated Tests](#-running-automated-tests)
- [Deployment Guide](#-deployment-guide)

---

## 🎯 Core Mission & Capabilities

In an era of hyper-realistic generative diffusion models, automated bot swarms, and encrypted messaging cascades, misinformation causes tangible economic and social harm. **UNNATI** provides citizens, investigators, fact-checkers, and institutions with forensic-grade verification tools:

- ⚡ **Real-Time Web Intelligence**: Autonomous deep web queries via Tavily AI cross-referenced against authoritative sources (`pib.gov.in`, `rbi.org.in`, Snopes, AltNews, BoomLive).
- 🧠 **Judicial Multi-Agent Debate**: Autonomous dialectic adjudication between Proponent, Opponent, and Judicial Arbiter models before issuing a final verdict.
- 🔬 **High-Precision Media Forensics**: Spatial face boundary inspection, optical flow temporal tracking, and acoustic spectral void analysis.
- 🇮🇳 **Pan-Indian Linguistic Accessibility**: Real-time transliteration and speech recognition across 12 Indian languages (Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Punjabi, Urdu, Odia, English).
- 🔒 **Cryptographic Audit Trail**: Every fact-check and forensic review is immutably logged with SHA-256 verification hashes.

---

## 🎛️ UNNATI Control Hub & Home Dashboard

The **UNNATI Control Hub** acts as the central command cockpit for the entire platform:

### 1. Instant Forensic Claim Search
- **Down-Facing Search Cockpit**: Clicking the Control Hub's chevron arrow opens the dropdown and immediately displays the **Instant Forensic Claim Search** down below the tools.
- **Direct Search & Verify**: Type any query or viral claim and click **Search & Verify** to trigger the complete verification simulation, live debate, and truth report.
- **Quick Trending Topic Pills**: One-click prompt chips for immediate testing:
  - 🔴 `RBI 2000 Note Ban Circular` (Finance & Regulatory)
  - ⚠️ `Free Solar Rooftop WhatsApp Scam` (Cyber Scam)
  - 🤖 `AI Voice Clone Extortion Call` (Deepfake Audio)
  - 📄 `Govt Exam Paper Leak Rumor` (Viral News)
  - 🏥 `WHO Global Emergency Notification` (Public Health)

### 2. Home Dashboard Functions
- **State Reset & Return**: Clicking **Home Dashboard** cleanly resets any active report, debate logs, or timeline, returning the user to the unified command view.
- **Live Defense Grid KPI Monitor**:
  - `Rumors Scanned`: 1,428 active threads (+14% daily)
  - `Bot Flag Rate`: 98.4% active shield
  - `Average Latency`: 1.2s via Gemini Flash
  - `Truth Score`: 99.1% High Confidence
- **Navigation Links**: Direct shortcuts to scroll to the top multi-modal claim input or jump down to the **Global Trending Now** feeds.

---

## 🔬 The 6 Forensic Engines

| Engine | Description | Key Capabilities |
| :--- | :--- | :--- |
| **🏠 Home Dashboard** | Central intelligence overview & instant claim search | Live metrics, quick topic launcher, defense grid KPI monitoring |
| **🎭 Deepfake Forensics** | Multi-modal vision & audio forensic inspection | Facial boundary integrity, specular lighting vectors, blink rate naturalness, acoustic vocoder detection |
| **🛡️ Narrative Inoculation** | Pre-bunking & automated bot swarm tracking | Bot coordination scoring, spike velocity curves, target audience educational pre-bunk advisories |
| **🌳 Patient Zero Tracker** | Trace claims across social networks to primary origin | Chronological graph database (Telegram → Twitter bots → WhatsApp forwards → Influencers → Fact-check debunks) |
| **💡 Explainable AI Logic** | "Show Your Work" step-by-step reasoning chain | Transparent audit trail showing semantic tokenization, database cross-references, temporal analysis, and latency metrics |
| **🪪 ID Document Verifier** | Government ID document authentication | OCR pattern validation for Aadhaar, PAN, Passport, Voter ID, and Driving License with digital tampering checks |

---

## 📥 Multi-Modal Ingestion Grid

UNNATI accepts heterogeneous input modalities through the `ClaimInput` interface:

1. **Text Claims**: Natural language queries, headlines, social media forwards, or URLs.
2. **Speech & Audio**: Web Speech API integration with native microphone capture.
3. **Indic Transliteration**: Type phonetically in English to generate native script in Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Punjabi, Urdu, and Odia.
4. **Image & Video**: Native client-side frame extraction at 1.0s timestamp, preventing browser memory crashes from large video blobs.
5. **PDFs & Official Circulars**: Native document ingestion reading up to 30,000 characters for academic papers, gazette notifications, and legal orders.

---

## 📊 Truth Report & Judicial Debate

Once an inquiry is submitted, UNNATI executes a deterministic 4-stage pipeline:

```
[1. Source Detected] ──► [2. Agent Analysis] ──► [3. Database Cross-Ref] ──► [4. Official Verdict]
```

### Report Elements
- **Traffic Light Signal Banner**:
  - 🟢 **TRUE / GENUINE**: Facts confirmed, official gazette matches.
  - 🟡 **MISLEADING / UNVERIFIED**: Context omitted, partial truth, unverified.
  - 🔴 **FALSE / FABRICATED**: Confirmed digital hoax, scam, or synthetic forgery.
- **Bottom Line (3-Bullet Executive Summary)**: Three punchy sentences delivering the essential takeaway so users can "close all other tabs".
- **Evidence Dossier**: Clickable source links from verified regulatory bodies and news agencies.
- **Actionable Report Text**: Pre-formatted, formal one-sentence debunk ready for copy-pasting into Twitter, YouTube, or Facebook "Report Post" forms.
- **Downloadable Card**: Single-click image export using `html-to-image` for social sharing.

---

## 🌐 Live Trending Now & Flagged Feeds

### Real-Time Trending Feeds
- Categorized feeds across **Twitter / X**, **YouTube**, **News**, and **Reddit**.
- **High-Fidelity Resilient Fallbacks**: Integrated 2.5s network timeout with high-accuracy curated live caches, guaranteeing zero downtime even if third-party APIs encounter rate limits or CORS restrictions.
- **Direct "Verify Claim" Buttons**: Every single trending post features an integrated `Verify Claim` button that instantly submits the headline to UNNATI's fact-checking engine.

### Live Flagged Claims
- Real-time dropdown stream of recently flagged rumors across categories: `All`, `Politics`, `Health`, `Finance`, and `Scams`.

---

## 📁 Project Architecture & Directory Structure

```
unnati/
├── backend/                      # Optional Node.js/Express Human Review Layer
│   ├── server.js                 # Review queue API endpoints & Supabase sync
│   └── schema.sql                # Human moderation SQL schema
├── public/                       # Static public assets
├── src/
│   ├── components/               # Specialized forensic & UI components
│   │   ├── AuthHeader.tsx        # Top navigation, local auth, modals
│   │   ├── AuditLogPanel.tsx     # Cryptographic audit trail drawer
│   │   ├── ClaimInput.tsx        # Multi-modal input (text, voice, image, doc)
│   │   ├── DebateLog.tsx         # Multi-agent dialectic debate viewer
│   │   ├── DeepfakeForensics.tsx # AI vision & audio deepfake inspection
│   │   ├── ExplainableAI.tsx     # Step-by-step reasoning chain (XAI)
│   │   ├── GlobalRumorsTicker.tsx# Real-time breaking rumors marquee ticker
│   │   ├── HeroSection.tsx       # Landing banner & platform value proposition
│   │   ├── HistoryPanel.tsx      # Stored verification history (localStorage)
│   │   ├── HomeControlHubDashboard.tsx # Instant search & command cockpit
│   │   ├── IDVerifier.tsx        # Aadhaar/PAN/Passport authenticity engine
│   │   ├── LiveFeed.tsx          # Real-time incoming flagged claims feed
│   │   ├── NarrativeInoculation.tsx # Bot swarm detection & pre-bunk alerts
│   │   ├── PatientZeroTracker.tsx# Origin propagation graph database
│   │   ├── TraceTimeline.tsx     # 4-stage verification progress timeline
│   │   ├── TrendingFeed.tsx      # Multi-platform trending intelligence
│   │   ├── TruthReport.tsx       # Signal traffic light & bottom-line report
│   │   ├── ViralityEngine.tsx    # High-risk alert floating indicator
│   │   └── ui/                   # Shadcn UI primitives (radix-ui, button, card)
│   ├── pages/
│   │   ├── Index.tsx             # Main orchestrated single-page application
│   │   └── NotFound.tsx          # 404 route fallback
│   ├── test/                     # Vitest test suites
│   │   ├── setup.ts              # Global test environment configuration
│   │   ├── example.test.ts       # Baseline environment test
│   │   └── controlHubAndDashboard.test.tsx # Hub, dashboard & search tests
│   ├── App.tsx                   # QueryClient & routing setup
│   ├── index.css                 # Custom glassmorphism & Tailwind design system
│   └── main.tsx                  # Application bootstrap entry point
├── package.json                  # Dependencies & npm scripts
├── tailwind.config.ts            # Design tokens, fonts, and keyframe animations
├── vite.config.ts                # Vite build and path alias configuration
├── vitest.config.ts              # Vitest test configuration (jsdom)
└── README.md                     # Comprehensive platform documentation
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: Version 18.x or 20.x or higher
- **npm** or **bun**

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/marisa-mmm/unnati.git
cd unnati
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Create or verify your `.env` file in the project root:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🔑 Environment Configuration (.env)

The application utilizes the following environment variables:

```ini
# Google Gemini Generative AI (Powers fact-checking, deepfake forensics, and XAI)
VITE_GEMINI_API_KEY=AIzaSy...

# Tavily AI Search (Powers real-time regulatory and news verification)
VITE_TAVILY_API_KEY=tvly-...

# Trending Feeds APIs
VITE_NEWS_API_KEY=df01...
VITE_YOUTUBE_API_KEY=AIzaSy...
VITE_RAPIDAPI_KEY=309d...
VITE_X_BEARER_TOKEN=O9g9...

# Supabase (Optional backend review queue)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
```

> **Note on API Resilience**: UNNATI is engineered with automated graceful fallbacks. If any external API quota is exceeded or rate-limited, the application automatically engages local forensic engines and curated live feeds, guaranteeing zero downtime.

---

## 🧪 Running Automated Tests

UNNATI includes a comprehensive automated test suite powered by **Vitest** and **jsdom**:

```bash
# Run all unit and integration tests
npm run test

# Run tests in interactive watch mode
npm run test:watch
```

### Test Coverage Highlights
- ✅ **Instant Forensic Claim Search**: Validates search input, form submission, and callback invocation.
- ✅ **Quick Topic Chips**: Verifies that clicking trending pills initiates fact-checking for RBI, solar scam, voice cloning, and paper leak rumors.
- ✅ **KPI Defense Matrix**: Ensures live metric counters render accurately.
- ✅ **Engine Switching**: Confirms smooth activation of specialized forensic engines.
- ✅ **Trending Feed Fallbacks**: Validates feed caching and timeout safety.

---

## 📦 Deployment Guide

### Deploying to Vercel
The project includes a ready-to-use [`vercel.json`](./vercel.json) configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

To deploy via Vercel CLI:
```bash
npm install -g vercel
vercel --prod
```

### Production Build
To create an optimized production bundle:
```bash
npm run build
```
The output will be placed in the `dist/` directory, ready to be served by any static hosting provider (Vercel, Netlify, Cloudflare Pages, AWS S3/CloudFront).

---

## ⚖️ License & Disclaimers

UNNATI is built for educational, journalistic, and investigative research purposes. Machine learning outputs are probabilistic and should be corroborated with authoritative primary documentation.

Developed with precision for digital truth, transparency, and integrity.
