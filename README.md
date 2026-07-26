# MediStock — AI-Powered Pharmacy Inventory & Clinical POS System

[![Live Demo](https://img.shields.io/badge/Live%20Application-MediStock%20Portal-00A86B?style=for-the-badge&logo=react)](https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20TypeScript%20%7C%20Tailwind%20%7C%20Firebase%20%7C%20Gemini%202.5-blue?style=for-the-badge)](#tech-stack)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#license)

---

## 📌 Executive Summary

**MediStock** is an enterprise-grade, full-stack pharmacy inventory management and Point of Sale (POS) clinical application designed to streamline healthcare dispensary operations. Built for retail pharmacies, hospital dispensaries, and community drug stores, MediStock unifies **cloud-synchronized stock management**, **instant POS billing**, **FEFO (First-Expired, First-Out) expiration auditing**, **wholesaler distributor tracking**, **financial margin analytics**, and an **embedded Gemini 2.5 Flash Clinical AI Assistant** into a single, intuitive workspace.

MediStock eliminates operational friction by automating manual stock counts, preventing life-saving drug stockouts, enforcing strict expiration quarantine protocols, and providing pharmacists with instant clinical decision support right at the counter.

---

## 🎯 Problem Domain & Ground Reality

In fast-paced retail and hospital pharmacy environments, pharmacy staff routinely encounter five critical operational challenges:

1. **Life-Threatening Stockouts of Critical Drugs:** Running out of essential medicines (e.g., Insulin, Antibiotics, Antihypertensives, Anti-epileptics) due to delayed manual stocktaking rather than automated reorder triggers.
2. **Expired Stock Financial Losses & Safety Risks:** Dispensing expired stock due to batch-level tracking difficulties across thousands of SKUs. Without FEFO tracking, older batches deteriorate on back shelves while newer shipments are sold first.
3. **Counter Billing Bottlenecks:** Handwritten receipts or legacy slow desktop software lead to long patient queues, calculation errors, and lost sales during rush hours.
4. **On-the-Spot Clinical Knowledge Needs:** Pharmacists frequently need instant verification of generic substitutes, exact chemical composition, storage conditions (refrigerated vs. ambient), contraindications, and patient counselling points.
5. **Opaque Financial Margins & Revenue Losses:** Unclear visibility into actual gross sales vs. acquisition Cost of Goods Sold (COGS), leading to unmonitored profit leakages and inventory shrinkage.

**MediStock solves every one of these problems with its 7 core integrated modules.**

---

## 🌐 Live Deployed Application

Experience MediStock live in production:

- **Production URL:** [https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app](https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app)

*Accessible on desktop, tablet, or mobile browsers with real-time Firebase syncing and guest demo access.*

---

## 🏛️ System Architecture & Data Flow

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

### Core Architecture Highlights
- **Server-Side API Key Proxy:** All Gemini 2.5 Flash API calls are routed through a secure Express backend (`/api/chat`), strictly keeping API keys off the browser client.
- **Atomic POS Transactions:** Checkout actions atomically decrement stock in Firestore, create timestamped billing invoices, and update revenue analytics.
- **Offline-First Resilience:** Seamlessly syncs with Firebase Firestore when online, with fallback state retention during transient network drops.

---

## 🧩 Comprehensive Deep-Dive: The 7 Core System Modules

MediStock is structured into **7 complete, fully developed operational modules**:

### Module 1: 📊 Pharmacy Dashboard & Real-Time Analytics
The central command center providing immediate operational visibility:
- **Real-Time KPI Cards:** Displays Total Stock Quantity (units), Total Registered SKUs, Low Stock Alerts (<15 units), Expiring Soon Batches (90-day window), Today's Sales Revenue (Rs.), and Total Monthly Revenue.
- **Sales Performance Visualizer:** Interactive 7-day revenue trend bar chart built with Recharts.
- **Recent Checkout Feed:** Live invoice stream showing customer name, total amount, and transaction status.
- **Quick Action Trigger Bar:** One-click shortcuts to add new medicines, create sales invoices, run expiry audits, or consult the AI assistant.

### Module 2: 💊 Medicine & Stock Management Center
Comprehensive inventory database management for every pharmaceutical SKU:
- **11 Detailed SKU Parameters:** Product Name, Generic Formula, Brand, Therapeutic Category, Batch Number, Manufacturer, Available Stock, Purchase Price (Rs.), Retail Selling Price (Rs.), Expiration Date, and Rack/Shelf Location.
- **Bulk Spreadsheet Import (CSV/Excel):** Upload full pharmacy inventory files in one click. Features automated column mapping, drug category keyword detection, batch validation, and downloadable sample templates.
- **Multi-Field Search & Filter Engine:** Instant searching across trade names, generic formulas, brands, and batch codes, with filters for therapeutic category, stock depletion status, and expiration timeline.
- **Sorting & Pagination:** Instant column sorting by drug name, stock level, price, or expiry date, with clean 10-item pagination controls.
- **Contextual AI Bridge:** Direct "Consult AI" button on any drug card automatically pre-loads its pharmacology parameters into the Clinical AI Assistant.

### Module 3: 🛒 Point of Sale (POS) Billing Terminal
High-speed dispensing counter billing terminal:
- **Instant Search Bar:** Search medicines by brand name or active generic formula.
- **Live Inventory Safety Checks:** Real-time stock validation prevents adding or dispensing more units than currently available on shelves.
- **Cart & Tax Engine:** Adjust quantities on the fly, calculate subtotal, automatically apply configurable sales tax (default 8%), and compute total payable amount.
- **Atomic Inventory Deduction:** Finalizing an invoice decrements item quantities from the central inventory and generates a printable sales receipt with unique invoice IDs and attending pharmacist logs.

### Module 4: 📈 Audit Reports & Financial Analytics
In-depth financial ledger and compliance auditing tool:
- **Revenue & Profit Ledger:** Toggle between Daily Receipts and Monthly Sales summaries displaying gross dispensing revenue, estimated acquisition cost of goods sold (COGS), net profit amount, and percentage profit margin.
- **180-Day FEFO Expiry Audit:** Identifies expired medicines for immediate quarantine/disposal and flags drugs expiring within 6 months.
- **Low Stock Depletion Audit:** Specialized audit listing all items at risk of stockout.
- **CSV Data Export:** Export complete financial transaction sheets directly into CSV spreadsheet format for external accounting.

### Module 5: 🤖 Gemini 2.5 Flash Clinical AI Assistant
An embedded AI pharmacology assistant powered by Google Gemini 2.5 Flash:
- **Clinical Pharmacology Support:** Provides instant explanations of drug mechanisms of action, chemical classifications, indications, dosage schedules, side effects, and patient counselling points.
- **Strict Domain Guardrails:** Enforces system instructions to answer *only* pharmacy, medicine, or healthcare queries, politely declining off-topic questions.
- **Context Awareness:** Automatically ingests currently selected drug parameters from the UI to provide tailored clinical guidance.
- **Standard Medical Disclaimer:** Every clinical response includes a standard medical safety disclaimer.

### Module 6: 👥 Suppliers & Wholesalers Directory
Directory for tracking pharmaceutical distributors and procurement channels:
- **Distributor Profiles:** Maintains company names, primary contact persons, telephone numbers, order emails, warehouse addresses, and account status.
- **Direct Procurement Links:** Quick call and email links directly connected to low-stock alerts for immediate stock reordering.

### Module 7: 🔐 Authentication & Access Security
Role-based user security and session management:
- **Firebase Authentication:** Secure email and password registration, login, and encrypted session management.
- **Guest Demo Mode:** One-click evaluator access for immediate platform testing without credentials.
- **Multi-Tenant State Separation:** Isolated database persistence for individual pharmacy accounts.

---

## 🖼️ Interface Screenshots

Below are high-resolution screenshots illustrating MediStock in action:

### 1. Pharmacy Dashboard & Real-Time Analytics
<p align="center">
  <img src="screenshots/dashboard.jpg" alt="MediStock Pharmacy Dashboard" width="100%" />
</p>
*Real-time stock quantity metrics, low-stock warnings, 90-day expiry alert counts, today's sales tracking, and revenue performance charts.*

---

### 2. Point of Sale (POS) Billing Terminal
<p align="center">
  <img src="screenshots/pos.jpg" alt="MediStock POS Billing Terminal" width="100%" />
</p>
*Instant medicine search by brand or generic name, multi-item cart, live stock depletion safety checks, tax calculation, and instant receipt generation.*

---

### 3. Audit Reports & Financial Sales Ledger
<p align="center">
  <img src="screenshots/audit_reports.jpg" alt="MediStock Audit & Analytics Ledger" width="100%" />
</p>
*Financial sales audit showing gross dispensing revenue, estimated acquisition cost of goods sold (COGS), net profit margins, today's customer receipt logs, and CSV export.*

---

### 4. Gemini-Powered Clinical AI Assistant
<p align="center">
  <img src="screenshots/ai_assistant.jpg" alt="MediStock AI Clinical Assistant" width="100%" />
</p>
*Domain-bounded clinical AI assistant providing drug pharmacology explanations, chemical classification, dosage conversions, and patient counselling points.*

---

## 🤖 System Guardrail & AI Prompt Code

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

## 🛠️ Technical Stack & Dependencies

| Layer | Component | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 & TypeScript | Vite-powered SPA architecture with strict type safety |
| **Styling & Motion** | Tailwind CSS & Framer Motion | Fluid responsive design with micro-interactions |
| **Icons & Visuals** | Lucide React | Clean, standardized SVG interface icon system |
| **Charts & Analytics** | Recharts | Responsive revenue bar visualizers and pie charts |
| **Backend API Proxy** | Node.js, Express & `tsx` | Secure server handling Gemini API proxy and static builds |
| **Database & Auth** | Firebase Firestore & Auth | Real-time cloud persistence and encrypted authentication |
| **AI Engine** | Google Gemini 2.5 Flash | `@google/genai` SDK for clinical AI interactions |
| **Containerization** | Docker / Cloud Run | Port 3000 container deployment |

---

## 📤 Exporting Codebase to Public GitHub

Follow these exact steps to export and submit this project on GitHub:

### Step 1: Download ZIP from AI Studio
1. In the AI Studio top navigation menu, open **Project Settings** or **Export**.
2. Click **Download / Export Project (ZIP)** and extract the files on your local machine.

### Step 2: Create a Public GitHub Repository
1. Go to [GitHub.com](https://github.com) and click **New Repository**.
2. Name the repository: `medistock-pharmacy`
3. Set visibility to **Public** *(Required for evaluator verification)*.
4. **Do NOT** check "Initialize with README" (since `README.md` is included in the project).
5. Click **Create repository**.

### Step 3: Push Local Code to GitHub
Open your terminal in the unzipped folder and run:
```bash
git init
git add .
git commit -m "Initial Commit: MediStock Full-Stack Pharmacy Management System"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/medistock-pharmacy.git
git push -u origin main
```
*(Verify by opening `https://github.com/YOUR_GITHUB_USERNAME/medistock-pharmacy` in an incognito browser window).*

---

## 💻 Local Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **Gemini API Key**: Free API key from [Google AI Studio](https://aistudio.google.com/)

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
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch Development Server:**
   ```bash
   npm run dev
   ```

5. **Access Application:**
   Open your browser to `http://localhost:3000`

---

## 📄 License

This project is open-source under the [MIT License](LICENSE) — free to use, modify, and distribute for educational, research, and commercial pharmacy applications.

---
*MediStock — Modernizing Pharmacy Management with Intelligent AI Automation.*
