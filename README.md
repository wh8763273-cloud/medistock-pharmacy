# MediStock — AI-Powered Pharmacy Inventory & Clinical POS System

[![Live Demo](https://img.shields.io/badge/Live%20Application-MediStock%20Portal-00A86B?style=for-the-badge&logo=react)](https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20TypeScript%20%7C%20Tailwind%20%7C%20Firebase%20%7C%20Gemini%202.5-blue?style=for-the-badge)](#tech-stack)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#license)

---

## 📌 Executive Overview

**MediStock** is an end-to-end, full-stack pharmacy management platform designed to modernize daily retail and clinical dispensary operations. By seamlessly integrating **real-time cloud inventory tracking**, an **instant Point of Sale (POS) dispensing terminal**, **automated FEFO (First-Expired, First-Out) expiration audits**, **wholesaler distributor management**, and an **embedded Gemini 2.5 Flash Clinical AI Assistant**, MediStock empowers community pharmacists to operate with surgical precision, prevent stockouts of life-saving medications, eliminate expired drug liabilities, and maximize financial profitability.

---

## 🎯 Ground Reality & Problem Domain

### The Operational Challenge in Retail & Hospital Pharmacies
In fast-paced community pharmacies, hospital dispensaries, and retail drug outlets, pharmacy staff face constant operational friction:

1. **Dangerous Stockouts of Critical Medicines:** Running out of essential life-saving medications (such as Insulin, Broad-Spectrum Antibiotics, Anti-hypertensives, or Anti-epileptics) due to reactive manual stock counts rather than proactive reorder warnings.
2. **Expired Drug Financial Liabilities & Patient Safety Risks:** Dispensing drugs past their shelf life due to difficulty tracking batch-level expiration dates across hundreds of SKUs. Without FEFO tracking, older stock rots on back shelves while newer shipments are sold first.
3. **Dispensing Bottlenecks During Peak Hours:** Manual handwritten billing receipts or slow, legacy software create long queues at the counter, increasing patient frustration and risk of billing discrepancies.
4. **On-the-Spot Clinical Information Needs:** Pharmacists frequently need instant, verified answers regarding drug generic substitutes, dosage conversions, storage conditions (refrigerated vs. ambient), contraindications, and patient counselling points while attending patients at the counter.
5. **Lack of Clear Margin & Accounting Visibility:** Difficulty tracking actual gross revenue vs. acquisition cost of goods sold (COGS), leading to unmonitored profit leakages and accounting errors.

### The MediStock Solution
MediStock addresses these real-world pain points by unifying inventory management, billing, supplier ordering, and clinical decision support into a cohesive, responsive web application.

---

## 🌐 Live Deployed Application

Experience MediStock in live production:

- **Public Production Link:** [https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app](https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app)

*No local setup required — accessible on any desktop, tablet, or mobile browser with real-time Firebase syncing.*

---

## 🏗️ System Architecture & Data Flow

```
                                  +---------------------------------------+
                                  |            MediStock UI               |
                                  |   (React 18 + TypeScript + Motion)    |
                                  +-------------------+-------------------+
                                                      |
                                    +-----------------+-----------------+
                                    |                                   |
                                    v                                   v
                      +---------------------------+       +---------------------------+
                      |   Client State / Storage  |       |   Express Backend Server  |
                      |   (Firebase Auth & Local) |       |       (Node.js / tsx)     |
                      +-------------+-------------+       +-------------+-------------+
                                    |                                   |
                                    v                                   v
                      +---------------------------+       +---------------------------+
                      |   Firebase Firestore DB   |       |   Google Gemini 2.5 Flash |
                      | (Realtime Inventory/Sales)|       |   Clinical Knowledge AI   |
                      +---------------------------+       +---------------------------+
```

### Core Architectural Principles
- **Server-Side API Key Security:** All Gemini 2.5 Flash API calls pass through a secure backend proxy (`/api/chat`), preventing API key exposure to the client browser.
- **Atomic POS Transactions:** Completing an invoice atomically updates stock quantities in Firestore/Storage, records a timestamped sales invoice, and logs the activity in the real-time audit feed.
- **Resilient Offline-First Fallback:** Seamlessly operates with Firebase Firestore cloud sync when connected, with local caching for uninterrupted dispensing during transient network drops.

---

## ✨ Comprehensive Feature Suite

### 1. 📊 Real-Time Pharmacy Dashboard & Analytics
- **Live Inventory Health Metrics:** High-level overview displaying Total Registered SKUs, Low Stock Depletion Alerts (<15 units), Expiring/Expired Batches, and Active Supplier Accounts.
- **Visual Category Distribution:** Interactive Recharts visual breakdown illustrating stock allocation across therapeutic categories (Antibiotics, Analgesics, Gastrointestinal, Cardiovascular, etc.).
- **Real-Time Audit Trail:** Live activity log capturing stock additions, price updates, supplier additions, and sales transactions.
- **One-Click Operational Shortcuts:** Rapid navigation buttons for POS Checkout, Adding Stock, Expiry Audits, and AI Clinical Consultations.

### 2. 💊 Medicine & Inventory SKU Manager
- **Complete SKU Attributes:** Maintain detailed drug profiles including Trade Name, Generic Chemical Name, Brand, Therapeutic Class, Batch Code, Manufacturer/Distributor, Available Units, Purchase Price (Rs.), Retail Selling Price (Rs.), Expiration Date, and Shelf/Rack Location.
- **Bulk Spreadsheet Import (CSV/Excel):** Upload entire pharmacy stock files in one click! Automated parser auto-detects column headers, guesses drug categories via semantic keyword matching, validates batch numbers and expiry dates, and imports hundreds of records instantly.
- **Sample CSV Template Generator:** Built-in downloadable CSV template allowing store managers to prepare bulk inventory lists in Excel.
- **Multi-Field Search & Filter Engine:** Instant filtering by text query (Name, Generic Formula, Brand Name, Batch SKU), Therapeutic Category, Stock Level (Low Stock, Out of Stock, Normal), and Expiry Timeline (Expired, Expiring within 180 days, Safe).
- **Sortable Data Columns:** Reorder inventory by Drug Name, Stock Quantity, Expiration Date, or Selling Price with ascending/descending toggles.
- **Pagination & Grid Controls:** Clean 10-item pagination controls with page indicators and item count summaries.
- **Contextual AI Consultation:** Direct "Consult AI" action on any medicine card automatically loads that drug's parameters into the AI Clinical Assistant.

### 3. 🛒 Point of Sale (POS) & Smart Billing Terminal
- **Instant Search & Auto-Complete:** Search available medicines instantly by brand or generic name.
- **Real-Time Stock Protection:** Live cart validation prevents adding or dispensing quantities greater than available shelf stock.
- **Dynamic Pricing & Tax Calculations:** Real-time subtotal calculation, configurable sales tax rate (default 8%), and total billing amount.
- **Automatic Stock Deduction:** Finalizing an invoice decrements item quantities directly from inventory and generates a printable sales receipt with invoice numbers.
- **Customer & Pharmacist Logging:** Store customer name, walk-in status, and attending pharmacist details for audit transparency.

### 4. 🏢 Wholesaler & Supplier Management
- **Distributor Directory:** Maintain supplier records including Company Name, Primary Contact Person, Phone Number, Order Email, Warehouse Address, and Active Status.
- **Reorder Linkage:** Directly access distributor phone and email contacts when low stock warnings trigger.

### 5. 📑 Audit Ledger & Analytics Reports
- **Financial Sales Ledger:** Toggle between Daily Receipts and Monthly Sales summaries with gross revenue calculations, acquisition cost of goods sold (COGS), and calculated net profit margins.
- **Export Transaction Data:** Export complete sales logs directly into CSV spreadsheet format for store accounting.
- **Critical Depletion Audit:** Specialized report view filtering all items near stock exhaustion.
- **180-Day FEFO Expiry Audit:** Identifies expired stock for quarantine/disposal and flags drugs expiring within 6 months.

---

## 🤖 The AI Feature & System Guardrails

### Clinical AI Assistant (Gemini 2.5 Flash)
MediStock integrates **Google Gemini 2.5 Flash** via the `@google/genai` SDK as an embedded clinical knowledge engine. Pharmacists can ask natural language questions regarding pharmacology, dosage schedules, side effects, drug interactions, and storage guidelines.

### Strict Domain Guardrails
To maintain medical safety and prevent off-topic usage, the assistant is bounded by strict system instructions. If asked non-pharmaceutical questions (e.g., sports, coding, general trivia), it politely declines and redirects the user to pharmacy topics.

#### System Prompt Implementation
```typescript
const systemInstruction = `You are a helpful, professional, and friendly AI Pharmacy Assistant for MediStock.
Your job is to answer ONLY pharmacy-related, medicine-related, pharmaceutical-store, or healthcare-related questions.

Examples of acceptable topics:
- Explaining a medicine (mechanism of action, active ingredients, generic alternatives).
- Suggesting proper medicine storage conditions (temperature, humidity, light exposure).
- Providing patient counselling points (when to take, food interactions, compliance advice).
- Summarizing common and rare side effects.
- Explaining dosage instructions in simple, patient-friendly language.
- General pharmacy operations, drug classifications, or pharmaceutical queries.

CRITICAL INSTRUCTION:
If the user's query is NOT related to pharmacy, medicines, pharmacology, health, store inventory, or pharmacy operations, you MUST politely and friendly decline to answer. For example, say: "I am your MediStock Pharmacy Assistant, so I can only answer pharmacy-related or medical queries. Please feel free to ask me about medicines, dosages, storage, or patient counselling!"

Keep answers concise, clear, and medically accurate. Always include a short, standard medical disclaimer at the very end of clinical advice advising patients to consult their physician.

Current Medicine Selection Context (if user has opened or is viewing a specific medicine in the UI):
${currentMedicineContext ? JSON.stringify(currentMedicineContext) : "No specific medicine selected."}`;
```

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & UI Components** | Tailwind CSS, Lucide React Icons, Framer Motion |
| **Data Visualization** | Recharts (Responsive Pie Charts & Bar Visualizers) |
| **Backend & API Server** | Node.js, Express, `tsx` (TypeScript Execution) |
| **Database & Auth** | Firebase Firestore (Cloud Database) & Firebase Authentication |
| **AI Intelligence** | Google Gemini API (`gemini-2.5-flash` via `@google/genai`) |
| **Deployment Runtime** | Docker Container / Cloud Run on Port 3000 |

---

## 🖼️ Interface Screenshots

Below are high-resolution screenshots highlighting key workflows in MediStock:

### 1. Dashboard & Stock Analytics
<img src="./public/screenshots/dashboard.jpg" alt="MediStock Dashboard Overview" width="100%" />

*Real-time stock quantity metrics, low-stock warnings, 90-day expiry alert counts, today's sales tracking, and revenue performance charts.*

### 2. Point of Sale (POS) Terminal
<img src="./public/screenshots/pos.jpg" alt="MediStock POS Terminal" width="100%" />

*Instant medicine search by brand or generic name, multi-item cart, live stock depletion safety checks, tax calculation, and instant receipt generation.*

### 3. Audit & Analytics Reports
<img src="./public/screenshots/audit_reports.jpg" alt="MediStock Audit & Analytics Ledger" width="100%" />

*Financial sales audit showing gross dispensing revenue, estimated acquisition cost of goods sold (COGS), net profit margins, today's customer receipt logs, and CSV export.*

### 4. Gemini-Powered Clinical AI Assistant
<img src="./public/screenshots/ai_assistant.jpg" alt="MediStock AI Assistant" width="100%" />

*Domain-bounded clinical AI assistant providing drug pharmacology explanations, chemical classification, dosage conversions, and patient counselling points.*

---

## 🔐 User Authentication & Access

MediStock includes a full Firebase Authentication module:
1. Access the [Live Application URL](https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app).
2. Click **Register** to create a new pharmacy account with your email, password, and pharmacy name, or **Login** with existing credentials.
3. Authenticated sessions gain full real-time synchronization across all inventory, billing, supplier, and AI tools.

---

## 📤 Exporting Codebase to Public GitHub

To submit or showcase this project on GitHub:

### Step 1: Export ZIP from AI Studio
1. Open the AI Studio top navigation bar or settings menu.
2. Select **Export / Download Project (ZIP)** and save the package locally.
3. Extract the downloaded archive.

### Step 2: Create a Public GitHub Repository
1. Log in to [GitHub.com](https://github.com).
2. Click **New Repository** (`+` icon at the top right).
3. Set Repository Name: `medistock-pharmacy`
4. **Select Public** (Public visibility is required for project verification).
5. Do NOT check "Initialize with README" (since `README.md` is already included).
6. Click **Create repository**.

### Step 3: Push Local Code to GitHub
Open your terminal inside the unzipped project folder and execute:
```bash
git init
git add .
git commit -m "Initial commit: Complete MediStock Pharmacy Management & POS System"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/medistock-pharmacy.git
git push -u origin main
```
*(Verify by opening `https://github.com/YOUR_GITHUB_USERNAME/medistock-pharmacy` in a private browser tab to confirm public accessibility).*

---

## 💻 Local Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **Gemini API Key**: Obtain a free API key from [Google AI Studio](https://aistudio.google.com/)

### Step-by-Step Setup

1. **Clone Repository:**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/medistock-pharmacy.git
   cd medistock-pharmacy
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root based on `.env.example`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```

5. **Open Application:**
   Open your browser and navigate to `http://localhost:3000`

---

## 📄 License

This project is licensed under the MIT License — feel free to customize and expand for pharmacy software engineering research, educational demonstrations, and commercial dispensaries.

---
*Developed with dedication for pharmacists, dispensaries, and healthcare professionals.*
