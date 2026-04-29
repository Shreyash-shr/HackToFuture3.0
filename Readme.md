# MediScan AI — Chest Diagnosis & Patient Chat Assistant

### AI-04 · KLS Gogte Institute of Technology Hackathon

---

## Project Overview

MediScan AI is a web-based medical imaging assistant that:

- Detects 14+ chest diseases from X-ray/CT images using AI
- Provides multi-label confidence scoring per disease
- Includes a patient-facing chatbot that explains results in plain language
- Maintains full scan history per user

---

## Tech Stack

| Layer          | Technology                                                  |
| -------------- | ----------------------------------------------------------- |
| Frontend       | React 18 + React Router v6                                  |
| Styling        | Pure CSS with CSS variables (no library)                    |
| AI Chatbot     | Claude claude-sonnet-4-20250514 via Anthropic API           |
| AI Model (sim) | Simulated DenseNet-121 inference (swap for real ONNX model) |
| State          | React Context + localStorage                                |
| Fonts          | DM Serif Display + Outfit + JetBrains Mono                  |

---

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Set Anthropic API key

The chatbot uses the Anthropic API. The fetch call is in `src/pages/ChatBot.js`.
For production, proxy this through a backend — never expose API keys client-side.

### 3. Run development server

```bash
npm start
```

Opens at http://localhost:3000

### 4. Build for production

```bash
npm run build
```

---

## Pages & Features

| Page      | Route        | Description                                  |
| --------- | ------------ | -------------------------------------------- |
| Landing   | `/`          | Hero page with features and stats            |
| Login     | `/login`     | Email + password authentication              |
| Signup    | `/signup`    | 2-step registration with role selection      |
| Dashboard | `/dashboard` | Overview, stats, quick actions               |
| Scanner   | `/scan`      | Drag & drop upload + animated AI analysis    |
| Results   | `/results`   | Confidence bars, findings, disease info      |
| History   | `/history`   | All past scans with search and filter        |
| Chatbot   | `/chat`      | AI assistant for plain-language explanations |

---

## Demo Account

- Email: `demo@mediscan.ai`
- Password: `demo123`

(Create this account via Signup first, or click "Use Demo Account" on Login)

---

## Connecting a Real AI Model

Replace `simulateAnalysis()` in `src/pages/Scanner.js` with a real API call:

```javascript
const response = await fetch("http://your-backend.com/api/analyze", {
  method: "POST",
  body: formData, // contains the image file
});
const { findings } = await response.json();
```

Backend should return:

```json
{
  "findings": [
    { "name": "Pneumonia", "confidence": 0.87, "category": "Infection", "severity": "High" },
    ...
  ]
}
```

---

## Medical Disclaimer

This software is for educational and informational purposes only.
It does NOT provide medical diagnosis. Always consult a licensed physician.

---

## Team

KLS Gogte Institute of Technology, Belagavi
Hackathon 3.0 · Problem ID: AI-04
