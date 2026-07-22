# MediStock — AI-Powered Pharmacy Management & POS System

[![Live App](https://img.shields.io/badge/Live%20Demo-MediStock%20App-00A86B?style=for-the-badge&logo=react)](https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Tailwind%20%7C%20Firebase%20%7C%20Gemini-blue?style=for-the-badge)](#tech-stack)

---

## 1. App Name, Purpose & Problem Solved

**App Name:** MediStock — Smart Pharmacy Operations & AI Clinical POS

### The Real Problem
Local community pharmacies and clinical dispensaries face severe operational risks every day:
1. **Critical Drug Stockouts:** Running out of life-saving medications (like insulin or antibiotics) without warning due to poor inventory tracking.
2. **Expired Drug Risks:** Accidental dispensing of expired medications due to manual, error-prone batch tracking.
3. **Complex Patient Counselling & Queries:** Pharmacists often need instant, authoritative guidance on drug mechanisms, contraindications, storage conditions, and dosage translation for patients during busy dispensing hours.
4. **Manual Ledger Errors:** Manual sales receipts lead to accounting mismatches and difficulty auditing net margins vs. acquisition costs.

### The Solution
**MediStock** is an end-to-end, full-stack pharmacy management platform designed for pharmacists, dispensary staff, and store owners. It unifies **real-time cloud inventory tracking**, an **instant POS dispensing terminal with automatic stock deduction**, **automated expiration & stock depletion audits**, **wholesaler distributor management**, and an **embedded Gemini-powered Clinical AI Pharmacist Assistant**.

---

## 2. Live Deployed URL

- **Public Live Application URL:** [https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app](https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app)

*(Open this link in any browser or private window to test the full live application without setup).*

---

## 3. Features List

### 📊 Real-Time Pharmacy Dashboard
- **Stock Metrics:** High-level overview of Total Medicine SKUs, Low Stock Depletion Alerts (<15 units), Expiring/Expired Drugs, and Total Registered Suppliers.
- **Quick Actions:** One-click shortcuts to Record Sales, Add Stock, Audit Expiries, or Consult the AI Assistant.
- **Stock Distribution Chart:** Category breakdown visualizing inventory allocation (Antibiotics, Analgesics, Cardiovascular, etc.).
- **Live Activity Feed:** Audit trail recording recent dispensing activities and inventory changes.

### 💊 Medicine & Inventory Manager
- **Full SKU Management:** Add, edit, and delete medicines with details including Generic Name, Brand Name, Category, Batch Code, Manufacturer, Quantity, Purchase Price, Selling Price, and Expiration Date.
- **Low Stock & Expiry Badges:** Color-coded status indicators highlighting out-of-stock, low-stock, and expired batches.
- **Direct AI Context Consultation:** Click "Consult AI" directly on any medicine card to automatically load that drug into the AI Assistant for instant clinical analysis.

### 🛒 Point of Sale (POS) & Invoice Checkout
- **Instant Search:** Fast auto-complete search across all available pharmacy stock.
- **Real-Time Stock Validation:** Prevents over-dispensing beyond current in-stock quantities.
- **Automated Calculations:** Automatically handles subtotal, configurable sales tax, and total billing amounts.
- **Stock Auto-Deduction:** Completing a sale automatically decrements inventory levels across the system and logs an invoice receipt in Firebase Firestore.

### 🏢 Supplier / Wholesaler Management
- **Vendor Directory:** Maintain distributor accounts with key contact representatives, phone lines, order emails, and warehouse HQ street addresses.
- **Reorder Linkage:** Easily reach out to wholesale distributors when inventory depletion warnings occur.

### 📑 Audit & Analytics Reports
- **Financial Sales Ledger:** Toggle between Daily Receipts and Monthly Sales Records, with calculation of Gross Revenue, Acquisition Cost of Goods, and Net Margin Profits.
- **CSV Data Export:** Export transaction logs directly into CSV file format for accounting audits.
- **Critical Stock Depletion Audit:** Dedicated view of all items at risk of running out.
- **Expiration Schedule Audit (180 Days):** Flags expired items for immediate disposal and highlights SKUs expiring within 6 months.

---

## 4. The AI Feature & System Prompt

### What It Does
The **MediStock AI Pharmacist Assistant** is an embedded clinical knowledge engine powered by **Google Gemini 2.5 Flash**. It provides instant, medically accurate answers for:
- Explaining drug mechanisms of action and generic alternatives.
- Recommending optimal temperature and humidity storage conditions.
- Patient counselling points (administration times, food/drug interactions).
- Summarizing side effects and translating technical dosage instructions into plain language for patients.
- Context-Aware Mode: When launched from a specific drug card, the AI automatically focuses on that specific medication.

### System Prompt & Instructions Behind It

```typescript
const systemInstruction = `You are a helpful, professional, and friendly AI Pharmacy Assistant for MediStock.
Your job is to answer ONLY pharmacy-related, medicine-related, pharmaceutical-store, or healthcare-related questions.
Examples of acceptable topics:
- Explaining a medicine (mechanism of action, active ingredients, generic alternatives).
- Suggesting proper medicine storage conditions.
- Providing patient counselling points (when to take, food interactions).
- Summarizing common side effects.
- Explaining dosage instructions in simple language.
- General pharmacy operations or drug class queries.

CRITICAL INSTRUCTION:
If the user's query is NOT related to pharmacy, medicines, pharmacology, health, store inventory, or pharmacy operations, you MUST politely and friendly decline to answer. For example, say: "I am your MediStock Pharmacy Assistant, so I can only answer pharmacy-related or medical queries. Please feel free to ask me about medicines, dosages, storage, or patient counselling!"

Keep answers concise, clear, and medically accurate. Always include a short, standard medical disclaimer at the very end of clinical advice advising patients to consult their doctor.

Current Medicine Selection Context (if user has opened or is viewing a specific medicine in the UI):
${currentMedicineContext ? JSON.stringify(currentMedicineContext) : "No specific medicine selected."}`;
```

---

## 5. Tools, Services & Tech Stack

| Category | Technology Used |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons, Motion |
| **Backend & Server** | Node.js, Express, `tsx` / `esbuild` |
| **Database & Auth** | Firebase Firestore (Real-time DB) & Firebase Authentication |
| **AI Model** | Google Gemini API (`gemini-2.5-flash` via `@google/genai` SDK) |
| **Hosting & Container** | Cloud Run / Vercel compatible Docker runtime |

---

## 6. Screenshots & Visual Interface

1. **Dashboard Overview:** Displays key metrics (Total SKUs, Low Stock, Expiring Drugs, Suppliers), stock distribution chart, and quick action buttons.
2. **Point of Sale (POS):** Clean billing interface with live stock search, item quantity selection, real-time tax/total calculation, and stock auto-deduction upon checkout.
3. **AI Pharmacy Assistant:** Interactive clinical chat assistant with context-aware drug loading, preset prompt chips, and medical advice formatting.

---

## 7. How to Run the Project Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**
- **Gemini API Key**: Get a key from [Google AI Studio](https://aistudio.google.com/)

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/medistock-pharmacy.git
   cd medistock-pharmacy
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root based on `.env.example`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000`

---

## 8. Build & Production Deployment

To build the application for production:
```bash
npm run build
npm start
```
This bundles the frontend assets into `dist/` and compiles the Node/Express backend into `dist/server.cjs` via `esbuild`.

---
*Built with ❤️ for pharmacists, healthcare workers, and pharmacy managers.*
