# StudyVerse (Study Student Shop - SSS)

[![Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![EmailJS](https://img.shields.io/badge/Email-EmailJS%20Verified-FF6B6B)](https://emailjs.com/)

**StudyVerse** is the minimal, high-performance Indian university academic platform and textbook price aggregation engine. It combines real-time Google Books search with multi-vendor price comparison (Amazon, Flipkart, Bookswagon, SSS Marketplace), peer-to-peer campus book resale & barter, Google Gemini AI academic tutor & syllabus matcher, university CGPA calculation matrices, and DRM e-readers.

---

## 🌟 Key Platform Features

1. 🔍 **Live Google Books & Search Engine Price Aggregator**:
   - Live query across Google Books API with automatic price synthesis across Amazon, Flipkart, Bookswagon, and SSS Marketplace.
   - Guaranteed Lowest Price indicator, percentage savings badge, and instant delivery estimations.
   - Relevance-first ranking ensures exact-matched textbooks always appear at #1.

2. 🧠 **Google Gemini Flash AI Integration**:
   - **`✨ AI Syllabus Match`**: Analyzes syllabus requirements (e.g. *AKTU 4th sem OS*, *VTU Data Structures*, *GATE CSE*) and matches prescribed textbooks and authors.
   - **🤖 StudyVerse AI Tutor**: Interactive academic mentor for complex derivations, algorithmic proofs, and 75% attendance advice.
   - **📝 Note & Chapter Summarizer**: Condenses long notes into structured takeaways and university 2-mark & 10-mark exam questions.
   - **🃏 Active-Recall Flashcards**: Generates exam flashcards with question-answer pairs.

3. 🪪 **Smart Student Digital ID Pass & Profile Suite**:
   - Front/Back 3D interactive student identity card with verification hologram and campus drop-off QR code.
   - Comprehensive student profile editor (University, College, Degree, Branch, Year, Semester, USN/Roll Number, Hostel Room, and Target Exam).
   - Campus Wallet Center with instant UPI top-ups, refund guarantees, and real-time transaction ledger.

4. ✉️ **EmailJS Notification & Verification Engine**:
   - 6-digit OTP verification for university student emails.
   - Automated dropshipping dispatch & order confirmation emails.
   - Instant order cancellation & wallet refund notices.

5. 🎨 **Minimal SaaS Design System (Theme 5)**:
   - Light and Dark mode options adhering to modern high-contrast SaaS aesthetics.

---

## 🚀 Quick Start (Local Development)

### 1. Frontend React Client (Port 3000)
```bash
cd app
npm install
npm run dev
```
* **Local UI URL:** `http://localhost:3000`

### 2. Backend REST API Server (Port 5000)
```bash
cd backend
npm install
npm run dev
```
* **Local API URL:** `http://localhost:5000/api`
* **Health Check:** `http://localhost:5000/api/health`

---

## ☁️ Deploying to Cloudflare Pages

### Option A: Via Cloudflare Dashboard (Recommended)
1. Push this repository to GitHub: `https://github.com/zainul7abideen-sudo/Study_Verse`
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select the `Study_Verse` repository.
4. Set the Build configuration:
   - **Framework preset:** `Vite`
   - **Root directory:** `app`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**. Your site will be live on a global Cloudflare edge domain (`*.pages.dev`) with instant global CDN caching and SSL!

### Option B: Via Wrangler CLI
```bash
cd app
npm run build
npx wrangler pages deploy dist --project-name study-verse
```

---

## 🔑 Environment Keys & API Setup

| Service | Environment Variable | Role |
| :--- | :--- | :--- |
| **Google Gemini AI** | `VITE_GEMINI_API_KEY` / `GEMINI_API_KEY` | Powers AI Tutor, Note Summarizer & Syllabus Matcher |
| **EmailJS Public Key** | `IpvuIpdPsVjRYtrFx` | Client-side email dispatch |
| **EmailJS Private Key**| `xcG-bzRyHIGzFPEeXEIEe` | Server-side secure email dispatch |
| **EmailJS OTP Template**| `template_ebe35xs` | 6-digit OTP verification emails |
| **EmailJS Order Template**| `template_wd31c8a` | Dropship order confirmations & refunds |


---

## 🏛️ University Grading & CGPA Matrices Covered

- **AKTU** (Dr. A.P.J. Abdul Kalam Technical University, UP) — $Percentage = (SGPA - 0.75) \times 10$
- **VTU** (Visvesvaraya Technological University, Karnataka) — $Percentage = (SGPA - 0.75) \times 10$
- **DU** (University of Delhi) — $Percentage = SGPA \times 9.5$
- **SPPU** (Savitribai Phule Pune University) — 10-point credit matrix
- **Mumbai University (MU)** — 10-point absolute credit grading
- **Anna University Chennai** — 10-point relative grading scale
- **MAKAUT / WBUT** — West Bengal University matrix

---

## 📄 License
This project is licensed under the MIT License.
