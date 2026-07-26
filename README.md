# MediStock AI — Pharmacy Inventory & Clinical POS System

[![Live Demo](https://img.shields.io/badge/Live%20Application-MediStock%20Portal-00A86B?style=for-the-badge&logo=react)](https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20TypeScript%20%7C%20Tailwind%20%7C%20Firebase%20%7C%20Gemini%202.5-blue?style=for-the-badge)](#e-tools-services-and-ai-models-used)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#license)

---

## a. App Name, What It Does, and the Real Problem It Solves (and for Whom)

### **App Name:** 
**MediStock AI** — Smart Pharmacy Inventory & Clinical Point of Sale (POS) System

### **What It Does:**
**MediStock AI** is a comprehensive, full-stack pharmacy management platform designed to modernize daily retail dispensary and hospital pharmacy operations. It unifies **cloud-synchronized real-time stock management**, an **instant Point of Sale (POS) counter billing terminal**, **automated FEFO (First-Expired, First-Out) expiration auditing**, **wholesaler distributor management**, **profit margin accounting**, and an **embedded Gemini 2.5 Flash Clinical AI Assistant** into a single, intuitive dashboard.

### **The Real Problem It Solves:**
In retail pharmacies, community drug stores, and hospital dispensaries, pharmacy staff face five major operational friction points:

1. **Dangerous Stockouts of Critical Medicines:** Essential life-saving medications (such as Insulin, Broad-Spectrum Antibiotics, Anti-hypertensives, and Anti-epileptics) run out unexpectedly because store managers rely on manual logbooks rather than proactive automated low-stock warnings.
2. **Expired Drug Liabilities & Patient Safety Risks:** Dispensing expired stock due to batch-level tracking difficulties across thousands of SKUs. Without strict FEFO (First-Expired, First-Out) tracking, older batches rot on back shelves while newly delivered stock is sold first.
3. **Checkout Counter Bottlenecks:** Slow, legacy desktop software or handwritten paper receipts lead to long customer queues during peak hours, causing patient frustration and billing errors.
4. **On-the-Spot Clinical Information Needs:** Pharmacists frequently need instant, medically verified answers regarding active chemical generic substitutes, exact dosage conversions, storage conditions (refrigerated vs. room temperature), contraindications, and patient counselling guidelines while standing at the dispensing counter.
5. **Opaque Margins & Financial Leakage:** Store owners struggle to track gross dispensing revenue against acquisition Cost of Goods Sold (COGS), resulting in unmonitored profit leakage and accounting discrepancies.

### **For Whom:**
Designed specifically for **Community Pharmacists**, **Retail Drug Store Owners**, **Hospital Dispensary Managers**, and **Pharmacy Technicians** who require a fast, accurate, and secure operational workflow.

---

## b. The LIVE Deployed URL — Clickable and Working

Experience the fully functional application in production:

- 🚀 **Live Production Application:** [https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app](https://ais-pre-vgz2sbzjtvi4e6so6pwt4o-1065862164607.asia-southeast1.run.app)

*(No complex setup required — accessible on desktop, tablet, or mobile browsers with real-time Firebase cloud syncing and instant Guest Demo Mode).*

---

## c. Features List — Everything Your App Can Do

MediStock AI is packed with features designed for retail and clinical pharmacy workflows:

### 📊 1. Pharmacy Dashboard & Real-Time Analytics
- **Live Inventory Metric Cards:** Instant high-level metrics for Total Stock Quantity (Units), Total SKU Types, Low Stock Depletion Alerts (<15 units), Expiring Soon Batches (90-day window), Today's Sales Revenue (Rs.), and Total Monthly Sales.
- **Sales Performance Charting:** Interactive visual revenue trend bar charts rendered via Recharts for the last 7 active calendar days.
- **Recent Checkout Activity Stream:** Timestamped live feed showing customer invoice numbers, total billed amounts, and transaction status.
- **Quick Operational Shortcuts:** Rapid navigation controls to add new medicines, create sales invoices, trigger expiration audits, or consult the AI assistant.

### 💊 2. Medicine Stock & SKU Management
- **Comprehensive Drug Attributes:** Manages 11 parameters per SKU: Product Name, Generic Formula, Brand Name, Therapeutic Category, Batch Number, Manufacturer/Distributor, Available Quantity, Purchase Price (Rs.), Retail Selling Price (Rs.), Expiration Date, and Shelf/Rack Location.
- **1-Click Bulk Spreadsheet Import (CSV/Excel):** Upload full pharmacy stock lists instantly. Includes automated column header detection, drug category keyword matching, batch validation, and a downloadable CSV template.
- **Multi-Field Search & Filter Engine:** Filter medicines instantly by text query (Trade Name, Generic Composition, Brand, Batch SKU), Therapeutic Category, Stock Level (Low Stock, Out of Stock, Normal), or Expiration Timeline (Expired, Expiring within 180 days, Safe).
- **Sortable Data Columns & Pagination:** Reorder inventory by Drug Name, Quantity, Expiry Date, or Retail Price with clean 10-item pagination controls.
- **Contextual AI Bridge:** Clicking "Consult AI" on any medicine card pre-loads that drug's exact profile directly into the Clinical AI Assistant.

### 🛒 3. Point of Sale (POS) Counter Billing Terminal
- **Instant Product Search:** Fast auto-complete search across brand names and active generic formulas.
- **Real-Time Stock Depletion Protection:** Live cart validation prevents adding or dispensing quantities greater than available physical shelf stock.
- **Dynamic Pricing & Tax Engine:** Automatic subtotal calculation, configurable sales tax rate (default 8%), and total payable billing.
- **Atomic Stock Deduction:** Finalizing a bill automatically decrements item stock in the database and generates a printable invoice receipt with attending pharmacist details.

### 📈 4. Audit Reports & Financial Analytics
- **Financial Revenue & Profit Ledger:** Toggle between Daily Receipts and Monthly Sales summaries displaying gross revenue, estimated acquisition Cost of Goods Sold (COGS), net profit, and profit margin percentages.
- **180-Day FEFO Expiry Audit:** Specialized compliance report identifying expired stock for immediate quarantine/disposal and flagging items expiring within 6 months.
- **Critical Low Stock Audit:** Instant inventory filter isolating all items near stock exhaustion for bulk supplier reordering.
- **CSV Ledger Export:** Download complete transaction records directly into CSV spreadsheet files for store accounting.

### 🏢 5. Suppliers & Wholesalers Directory
- **Distributor Profiles:** Track supplier company names, primary contact persons, phone numbers, procurement emails, warehouse addresses, and active account status.
- **Direct Procurement Connectivity:** Direct phone and email action links integrated with low-stock warnings for fast reorder processing.

### 🔐 6. Authentication & Access Security
- **Firebase Authentication:** Encrypted email/password registration, login, and secure user session management.
- **Guest Demo Mode:** One-click evaluator access for immediate platform testing without registration.
- **Isolated Cloud Storage:** Real-time Firestore synchronization with multi-tenant data separation.

---

## d. The AI Feature — What It Does and the System Prompt Behind It

### **What the AI Feature Does:**
MediStock AI embeds **Google Gemini 2.5 Flash** as a dedicated **Clinical Pharmacy Assistant**. Available directly within the application workspace, it provides pharmacists and dispensary staff with on-the-spot clinical decision support, including:
- Explaining mechanisms of action and pharmacological profiles of prescribed drugs.
- Identifying generic equivalents and chemical composition.
- Advising on proper storage conditions (temperature, humidity, light sensitivity).
- Providing patient counselling guidelines (timing, food interactions, compliance advice).
- Summarizing common and rare adverse drug reactions.

### **Domain Guardrails:**
To maintain medical accuracy and safety, the AI Assistant is governed by strict system prompt instructions. It is strictly bounded to pharmacy and healthcare topics and politely declines non-medical queries (e.g., general trivia, sports, coding).

### **System Prompt Implementation:**
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

## e. Tools, Services, and AI Models Used

| Layer | Tool / Service / Model | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 & TypeScript | Modern, type-safe Single Page Application framework |
| **Build Tooling** | Vite & `tsx` | Ultra-fast HMR dev server and TypeScript execution engine |
| **Styling & UI Components** | Tailwind CSS & Framer Motion | Utility-first styling and smooth UI layout micro-interactions |
| **Icon System** | Lucide React | Clean, responsive UI vector icon library |
| **Data Visualization** | Recharts | Responsive revenue bar visualizers and analytics charts |
| **Backend API Server** | Node.js & Express | Proxy server keeping API keys secure and serving static builds |
| **Database & Auth** | Firebase Firestore & Auth | Real-time cloud database persistence and secure authentication |
| **AI Intelligence** | Google Gemini 2.5 Flash | Clinical AI assistant powered by the `@google/genai` TypeScript SDK |
| **Deployment Runtime** | Cloud Run / Docker | Port 3000 container deployment |

---

## f. Screenshots of the App in Action

Here are high-resolution screenshots demonstrating MediStock AI in action:

### 1. Pharmacy Dashboard & Real-Time Analytics
<p align="center">
  <img src="screenshots/dashboard.jpg" alt="MediStock Pharmacy Dashboard" width="100%" />
</p>

*Overview displaying total stock quantity metrics, low-stock warnings, 90-day expiry alert counts, today's sales tracking, and 7-day revenue performance charts.*

---

### 2. Point of Sale (POS) Counter Billing Terminal
<p align="center">
  <img src="screenshots/pos.jpg" alt="MediStock POS Billing Terminal" width="100%" />
</p>

*Instant medicine search by brand or generic formula, multi-item cart management, live inventory safety checks, sales tax calculation, and instant receipt generation.*

---

### 3. Financial Audit & Analytics Ledger
<p align="center">
  <img src="screenshots/audit_reports.jpg" alt="MediStock Audit & Analytics Ledger" width="100%" />
</p>

*Financial audit view showing gross dispensing revenue, estimated acquisition cost of goods sold (COGS), net profit margins, today's receipt logs, and CSV export.*

---

### 4. Gemini-Powered Clinical AI Assistant
<p align="center">
  <img src="screenshots/ai_assistant.jpg" alt="MediStock AI Clinical Assistant" width="100%" />
</p>

*Domain-bounded clinical AI assistant providing drug pharmacology explanations, chemical classification, dosage conversions, and patient counselling points.*

---

## g. How to Run the Project

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**
- **Gemini API Key**: Free API key obtained from [Google AI Studio](https://aistudio.google.com/)

---

### Local Installation & Running Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/medistock-pharmacy.git
   cd medistock-pharmacy
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the project root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Launch the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to `http://localhost:3000` to access the live application.

---

### How to Export & Push to Public GitHub

If you are submitting or hosting this repository on GitHub:

1. **Export Project Archive:**
   In AI Studio, open **Project Settings** or **Export** and click **Download / Export Project (ZIP)**.
2. **Create Public Repository:**
   Go to [GitHub.com](https://github.com), create a new repository named `medistock-pharmacy`, and select **Public**. Do not initialize with a new README.
3. **Push Code:**
   Open terminal inside the unzipped folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Complete MediStock AI Pharmacy Management System"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/medistock-pharmacy.git
   git push -u origin main
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and distribute for educational, research, and commercial pharmacy software applications.

---
*Developed with care for pharmacists, dispensaries, and healthcare professionals worldwide.*
