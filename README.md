# MediStock AI — Smart Pharmacy Inventory, POS & Clinical AI Assistant

[![Live Demo](https://img.shields.io/badge/Live%20App-Open%20MediStock-00A86B?style=for-the-badge)](https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app)
[![GitHub](https://img.shields.io/badge/Repository-Public-181717?style=for-the-badge&logo=github)](https://github.com/wh8763273-cloud/medistock-pharmacy)
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Firebase%20%7C%20Gemini-blue?style=for-the-badge)](#e-tools-services--ai-models-used)

---

## a. What is MediStock AI?

**MediStock AI** is a full-stack pharmacy management web application built for **community pharmacies and small drug retail outlets**. It replaces manual, paper-based stock registers and handwritten sales receipts with a single real-time system for inventory, billing, and clinical reference.

### The real problem it solves
Small and mid-size pharmacies typically track stock in notebooks or basic spreadsheets, which causes:
- **Stockouts of critical medicines** because no one is warned before a drug runs out.
- **Expired stock sitting on shelves** — expiry dates aren't tracked systematically, so expired or soon-to-expire drugs get missed (a safety and financial risk).
- **Slow, error-prone billing** at the counter using handwritten receipts.
- **No visibility into profit margins**, since purchase price vs. selling price is never compared in one place.
- **No quick clinical reference** at the counter when a pharmacist needs to double check a drug's use, dosage, or interactions.

MediStock AI solves this for **pharmacists, pharmacy owners, and dispensary staff** by combining inventory tracking, point-of-sale billing, supplier management, financial/expiry auditing, and an AI clinical assistant into one dashboard.

---

## b. Live Deployed Application

🔗 **[https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app](https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app)**

No installation needed — open the link in any browser. Use **Guest Demo Mode** on the login screen to explore immediately with sample data, or register a new account.

---

## c. Features

### 📊 Dashboard
- Live totals: total stock units, number of SKUs, low-stock alerts, medicines expiring within 90 days, today's sales revenue.
- Monthly revenue summary and a 7-day sales performance chart (Recharts).
- Recent sales / recent activity feed.
- Quick-action shortcuts to Add Medicine, Create Sale, etc.

### 💊 Medicine Stock Manager
- Full drug records: name, generic name, brand, therapeutic category, batch number, manufacturer, quantity, purchase price, selling price, expiry date, and shelf/rack location.
- Bulk import of stock from a CSV/Excel file, with a downloadable sample template.
- Search and filter by name/generic name/brand/batch, category, stock level, and expiry window.
- Sortable columns and pagination.
- "Consult AI" shortcut that opens the AI Assistant pre-loaded with the selected medicine's details.

### 🛒 Point of Sale (POS) / Billing
- Instant medicine search while building an invoice.
- Cart prevents adding more units than are actually in stock.
- Automatic subtotal, tax, and total calculation.
- Completing a sale automatically deducts sold quantities from inventory and generates an invoice.

### 🏢 Supplier Management
- Directory of distributors/suppliers with contact person, phone, email, and address, for quick reordering when stock runs low.

### 📑 Audit & Analytics Reports
- Daily/Monthly revenue ledger: gross revenue, estimated acquisition cost, and net profit margin.
- Low-stock report and a 6-month expiry (FEFO) report to flag drugs nearing expiration.
- CSV export of sales/receipt data.

### 🤖 AI Pharmacy Assistant
- Chat-based clinical assistant scoped strictly to pharmacy/medicine topics (see section **d** below).

### 🔐 Authentication
- Firebase Authentication with email/password sign-up and login, plus a **Guest Demo Mode** (anonymous sign-in) for quick evaluation.
- If Firebase isn't configured, the app gracefully falls back to browser LocalStorage so it still works end-to-end.

---

## d. The AI Feature

### What it does
The **AI Pharmacy Assistant** (`AI Pharmacy Assistant` tab) is a chat interface where a pharmacist can ask natural-language questions such as *"What is Amoxicillin, its chemical class, and generic alternatives?"* It answers with the drug's chemical class, mechanism of action, dosage guidance, side effects, and patient counselling points. If a specific medicine is selected in the Medicine Stock screen first, its details are passed along as context so the AI can answer about that exact item.

It is intentionally restricted to pharmacy/medical topics — anything unrelated (general trivia, coding, etc.) is politely declined, so the tool can't be misused as a general chatbot.

### System prompt / instructions behind it
The request goes through a backend endpoint (`/api/chat`) that calls the Gemini API, using this system instruction:

```
You are a helpful, professional, and friendly AI Pharmacy Assistant for MediStock.
Your job is to answer ONLY pharmacy-related, medicine-related, pharmaceutical-store, or healthcare-related questions.
Examples of acceptable topics:
- Explaining a medicine (mechanism of action, active ingredients, generic alternatives).
- Suggesting proper medicine storage conditions.
- Providing patient counselling points (when to take, food interactions).
- Summarizing common side effects.
- Explaining dosage instructions in simple language.
- General pharmacy operations or drug class queries.

CRITICAL INSTRUCTION:
If the user's query is NOT related to pharmacy, medicines, pharmacology, health,
store inventory, or pharmacy operations, you MUST politely decline to answer. Say:
"I am your MediStock Pharmacy Assistant, so I can only answer pharmacy-related or
medical queries. Please feel free to ask me about medicines, dosages, storage, or
patient counselling!"

Keep answers concise, clear, and medically accurate. Always include a short,
standard medical disclaimer at the very end of clinical advice advising patients
to consult their doctor.

Current Medicine Selection Context (if user has opened or is viewing a specific
medicine in the UI): <the selected medicine's data, if any>
```

The API key is kept **server-side only** (in an environment variable), so it is never exposed to the browser.

---

## e. Tools, Services & AI Models Used

| Layer | Technology |
| :--- | :--- |
| Frontend | React 19, TypeScript, Vite |
| Styling / UI | Tailwind CSS, Lucide React icons, Motion (animations) |
| Charts | Recharts |
| Backend | Node.js, Express (via `tsx`) |
| Database & Auth | Firebase Firestore + Firebase Authentication (falls back to browser LocalStorage if not configured) |
| AI Model | Google Gemini API (`@google/genai` SDK), model `gemini-3.6-flash` |
| Hosting | Google Cloud Run (built with Vite, bundled server via esbuild) |

---

## f. Screenshots

### 1. Pharmacy Dashboard
![Dashboard](./public/screenshots/dashboard.jpg)
*Live stock totals, low-stock and expiry alerts, today's sales, and monthly revenue trend.*

### 2. AI Pharmacy Assistant
![AI Assistant](./public/screenshots/ai_assistant.jpg)
*Chat-based clinical assistant answering a question about Amoxicillin's chemical class and use.*

### 3. Audit & Analytics Reports
![Audit Reports](./public/screenshots/audit_reports.jpg)
*Daily financial sales audit: gross revenue, acquisition cost, net margin, and itemized receipts.*

### 4. Point of Sale Terminal
![POS Terminal](./public/screenshots/pos.jpg)
*Medicine search, cart, live stock validation, and invoice generation.*

---

## g. How to Run the Project

### Option 1 — Just use the live app
Open the [live URL](https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app) — no setup needed. Use **Guest Demo Mode** to try it instantly.

### Option 2 — Run it locally

**Prerequisites:** Node.js v18+, npm, and a free [Gemini API key](https://aistudio.google.com/) if you want the AI Assistant to work.

```bash
# 1. Clone the repository
git clone https://github.com/wh8763273-cloud/medistock-pharmacy.git
cd medistock-pharmacy

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# then open .env and add your GEMINI_API_KEY
# (Firebase variables are optional — the app falls back to LocalStorage without them)

# 4. Run the development server
npm run dev
```

Then open **http://localhost:3000** in your browser.

To build for production:
```bash
npm run build
npm start
```

> ⚠️ **Never commit your real `.env` file or API keys.** Only `.env.example` (with placeholder values) should be in the repository — real keys belong in your hosting provider's environment variable settings.

---

## Repository

Public repo: **https://github.com/wh8763273-cloud/medistock-pharmacy**

---
*Built as an individual project — MediStock AI Pharmacy Management System.*
