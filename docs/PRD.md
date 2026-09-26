# Study Student Shop (SSS) — Product Requirements Document (PRD)

**Document Version:** 2.4.0  
**Status:** Approved for Production Engineering  
**PDF Location:** `docs/SSS_Product_Requirements_Document.pdf`  
**Target Audience:** Indian Higher Education (Engineering, Medical, Arts, Commerce, Science) & Global Students

---

## 1. Executive Summary & Vision

**Study Student Shop (SSS)** is an intelligent, all-in-one student commerce and academic utility platform. College students frequently struggle to find affordable textbooks, trade course materials with campus peers, calculate complex university-specific CGPA/SGPA marks, and find the lowest price across fragmented e-commerce websites.

SSS addresses these challenges through five core pillars:
1. **P2P Used Book Resale & Exchange (Barter) Marketplace**: Students buy, sell, or trade used textbooks locally with condition grading and campus delivery.
2. **Real-time Price Aggregator & Live Search**: Instant multi-platform search across Amazon, Flipkart, Bookswagon, and Google Books with live price comparison.
3. **Automated Arbitrage / Lowest-Price Dropship Ordering Bot**: Students purchase directly through SSS, and our automated backend bot fulfills the order from whichever external site offers the lowest price.
4. **Digital Library & Web E-Reader**: Instant reading, preview, and purchase of academic e-books, notes, and previous year question papers (PYQs).
5. **Indian Universities Academic Engine**: Official CGPA, SGPA, and Marks calculation formulas customized for major Indian universities (AKTU, VTU, SPPU, MU, DU, Anna Univ, MAKAUT, JNTU, GTU, etc.) with end-sem target prediction and printable marksheets.
6. **Enterprise Admin Command Center**: Instant system maintenance guard, full User & RBAC Management (Admin, Moderator, Student, Verified Seller), real-time audit logs, and dropship order monitoring.

---

## 2. User Personas

| Persona | Needs & Goals | Pain Points | SSS Solution |
| :--- | :--- | :--- | :--- |
| **College Student (Buyer/Seller)** | Liquidate old textbooks, find cheap semester books. | High retail prices, hard to coordinate with seniors. | P2P listings with condition ratings, exchange proposals, and campus handovers. |
| **Smart Shopper (Bargain Hunter)** | Find new books at absolute lowest cost. | Time-consuming to compare 5+ websites manually. | Single search box comparing Amazon, Flipkart, etc. with Lowest Price tag. |
| **University Student** | Calculate SGPA/CGPA, convert CGPA to %, plan study goals. | Different conversion rules per university (e.g. `(CGPA - 0.75)*10` vs `CGPA * 9.5`). | Dedicated Indian University calculators with target grade predictors and PDF export. |
| **System Administrator** | Ensure uptime, manage users, prevent fraud, monitor bots. | Platform management friction, sudden maintenance needs. | Single-click maintenance mode with custom banner, RBAC, live audit logs, and auto-order tracker. |

---

## 3. Core Functional Modules

### 3.1 P2P Resell & Exchange Marketplace
- **Sell Used Books**: Students specify Title, Author, Edition, Course/Semester, Condition (`Like New`, `Good`, `Fair`, `Acceptable`), Original MRP, Selling Price, and Campus Pickup Location.
- **Book Exchange / Swap**: Students list books available for trade, tag desired target books/subjects.
- **Trade Request Flow**: Proposal system where Student B offers a book to Student A. Student A can `Accept`, `Decline`, or `Counter`.
- **Condition & Safety Checklist**: Student verification badge and physical book inspection guidelines.

### 3.2 Real-time Search & Multi-Platform Aggregator
- **Live Debounced Search**: Fast autocomplete (<150ms) using Google Books API + local cached database.
- **Price Matrix Comparison**: Real-time side-by-side pricing from:
  - Amazon India (`₹`)
  - Flipkart (`₹`)
  - Bookswagon (`₹`)
  - SSS Verified Used Sellers (`₹`)
- **Lowest Price Guarantee Badge**: Highlights the cheapest source and potential student savings.

### 3.3 Automated Dropshipping / Auto-Ordering Engine
- **One-Click Native Checkout**: Student pays natively on SSS via UPI, Card, NetBanking, or COD.
- **Auto-Purchase Pipeline**:
  1. User places order on SSS.
  2. Background worker identifies lowest price vendor (e.g., Amazon at ₹340 vs Flipkart at ₹399).
  3. Worker places order on external vendor using automated bot with student's shipping address.
  4. Stores external tracking ID and vendor invoice.
  5. Updates student order status: `Payment Received` -> `Auto-Ordered at Lowest Vendor` -> `Dispatched` -> `Out for Delivery` -> `Delivered`.
- **Failover**: If vendor goes out of stock during checkout, the bot automatically fails over to the next lowest vendor or initiates an instant refund.

### 3.4 E-Books & Digital Reading Suite
- **Interactive Web E-Reader**: In-browser reading interface with page navigation, zoom, dark mode, search, and bookmarks.
- **Instant Digital Download**: Option to purchase DRM-stamped PDF copies for offline study.

### 3.5 Indian Universities CGPA & Academic Engine
- **University Formulas**:
  - **AKTU (Dr. APJ Abdul Kalam Tech Univ)**: `Percentage = (CGPA - 0.75) * 10`
  - **VTU (Visvesvaraya Tech Univ)**: `Percentage = (CGPA - 0.75) * 10` (Pre-2022) / `CGPA * 10` (2022+)
  - **Delhi University (DU)**: `Percentage = CGPA * 9.5`
  - **Mumbai University (MU)**: `Percentage = 7.1 + 0.1 * (CGPA - 7) * 10` (for CGPA >= 7) or `CGPA * 7.25`
  - **SPPU (Pune University)**: `Percentage = (CGPA * 10) - 7.5` (for CGPA >= 7.0)
  - **Anna University (Chennai)**: `Percentage = CGPA * 10`
  - **MAKAUT (WBUT)**: `Percentage = (CGPA - 0.75) * 10`
  - **JNTU (Hyderabad/Kakinada)**: `Percentage = (CGPA - 0.5) * 10`
  - **GTU (Gujarat Tech Univ)**: `Percentage = (CPI - 0.5) * 10`
  - **Standard 10-Point & 4-Point Scales**: For autonomous colleges.
- **Internal Assessment & Target CGPA Predictor**: Calculates end-semester marks needed to hit a goal CGPA (e.g., 8.5/10).
- **Marksheet Export**: Download clean, official-style transcript report card.

### 3.6 User Profile & Dashboard
- Active Resale Listings & Sales Tracker.
- Incoming & Outgoing Exchange Request Manager.
- Order History with live automated tracking timeline.
- Digital Library of purchased E-books.
- Academic Records Vault.

### 3.7 Admin Command Center & Maintenance Guard
- **Site Maintenance Controller**: Toggle public site into Maintenance Mode with custom message, countdown timer, and admin bypass authentication.
- **User & Authority Management**: Create, edit, ban, delete users, and grant roles (`Admin`, `Moderator`, `Student`, `Verified Seller`).
- **Audit Logs Stream**: Timestamped log of all critical system actions (admin logins, role changes, maintenance activations, dropship dispatches).
- **Arbitrage & Dropship Fulfillment Monitor**: Live view of external vendor orders, failure alerts, retry triggers, and profit margin analytics.

---

## 4. Technical Non-Functional Requirements
- **Response Time**: Real-time search < 150ms.
- **Availability**: 99.9% uptime with automated maintenance splash screens.
- **Security**: Granular Role-Based Access Control (RBAC), sanitized inputs, encrypted tokens.
- **Scalability**: Stateless micro-service friendly API design with caching.
