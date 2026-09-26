# Study Student Shop (SSS) — System Architecture & Technical Blueprint

**Version:** 2.4.0  
**Author:** SSS Engineering Architecture  
**Status:** Approved for Implementation

---

## 1. High-Level Architecture Overview

Study Student Shop (SSS) is designed as a modern, decoupled, reactive web application with a high-throughput API gateway, real-time external pricing adapters, an asynchronous dropshipping auto-order worker, and an academic calculation engine.

```mermaid
flowchart TB
    subgraph ClientLayer["Frontend Client (Next.js / React + Tailwind CSS)"]
        UI_Home["Landing & Realtime Book Search"]
        UI_Market["P2P Resale & Exchange Hub"]
        UI_Aggregator["Multi-Platform Price Comparison"]
        UI_Checkout["Cart & Unified Checkout"]
        UI_EReader["Interactive Web E-Reader"]
        UI_Academic["Indian Universities CGPA & Marks Engine"]
        UI_Profile["User Profile & Dashboard"]
        UI_Admin["Admin Command Center & Maintenance Guard"]
    end

    subgraph GatewayLayer["API & Middleware Layer"]
        MW_Maint["Maintenance Guard Middleware"]
        MW_Auth["JWT & RBAC Auth Middleware"]
        API_Books["/api/books (Google + Cached Aggregator)"]
        API_Exchange["/api/exchange (P2P Swap Workflow)"]
        API_Orders["/api/orders (Checkout & Dropship Dispatch)"]
        API_Academic["/api/academic (Univ Grading Matrix)"]
        API_Admin["/api/admin (RBAC, Logs, Site State)"]
    end

    subgraph ServiceLayer["Core Business Services & Workers"]
        SVC_Search["Real-time Search & Cache Service"]
        SVC_PriceAgg["Multi-Vendor Price Comparison Service"]
        SVC_Dropship["Automated Auto-Order Fulfillment Worker"]
        SVC_Univ["University Grade Formula Engine"]
        SVC_Audit["Audit Log & Security Service"]
    end

    subgraph ExternalServices["External APIs & Vendors"]
        EXT_GoogleBooks["Google Books API"]
        EXT_Amazon["Amazon India Merchant / API"]
        EXT_Flipkart["Flipkart Affiliate / Merchant"]
        EXT_Bookswagon["Bookswagon Scraping Adapter"]
    end

    subgraph PersistenceLayer["Data & State Storage"]
        DB_Core[("SQLite / PostgreSQL DB (Prisma ORM)")]
        Cache_Mem[("In-Memory / Redis Cache")]
    end

    ClientLayer --> MW_Maint
    MW_Maint --> MW_Auth
    MW_Auth --> API_Books & API_Exchange & API_Orders & API_Academic & API_Admin

    API_Books --> SVC_Search & SVC_PriceAgg
    API_Exchange --> DB_Core
    API_Orders --> SVC_Dropship
    API_Academic --> SVC_Univ
    API_Admin --> SVC_Audit & DB_Core

    SVC_Search --> EXT_GoogleBooks & Cache_Mem
    SVC_PriceAgg --> EXT_Amazon & EXT_Flipkart & EXT_Bookswagon
    SVC_Dropship --> EXT_Amazon & EXT_Flipkart & EXT_Bookswagon & DB_Core
    SVC_Audit --> DB_Core
```

---

## 2. Core Subsystems & Component Breakdown

### 2.1 P2P Resell & Exchange Engine
- **Resale Model**: Enables peer-to-peer textbook commerce between students on the same campus or nearby institutes.
- **Exchange Engine (Trade Protocol)**: State-machine driven swap system:
  - States: `PROPOSED` $\rightarrow$ `ACCEPTED` / `REJECTED` / `COUNTERED` $\rightarrow$ `HANDOVER_PENDING` $\rightarrow$ `COMPLETED` / `CANCELLED`.
- **Matchmaking**: Suggests book swap matches based on mutual semester/department needs.

### 2.2 Real-time Search & Multi-Platform Price Aggregator
- **Search Pipeline**:
  1. Real-time debounced query from user frontend.
  2. Query checks high-speed local cache.
  3. Cache miss queries Google Books API to fetch rich metadata (cover, ISBN, publisher, edition).
  4. Concurrently queries price adapters for Amazon, Flipkart, Bookswagon, and SSS Used Sellers.
  5. Ranks results by lowest price and stock availability.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant SearchUI as Frontend Search Bar
    participant Gateway as API Gateway / Search Service
    participant Cache as Cache Layer
    participant GBooks as Google Books API
    participant PriceFeeds as Multi-Vendor Price Feeds (Amazon, Flipkart, Bookswagon)

    Student->>SearchUI: Types book query (e.g., "Operating System Galvin")
    SearchUI->>Gateway: GET /api/books/search?q=Operating+System+Galvin (Debounced 250ms)
    Gateway->>Cache: Check Cached Results
    alt Cache Hit
        Cache-->>Gateway: Return Cached Price Matrix
    else Cache Miss
        Gateway->>GBooks: Fetch Book Metadata & ISBN
        GBooks-->>Gateway: Book Info (Title, Authors, Thumbnails, ISBN)
        Gateway->>PriceFeeds: Scrape / Fetch Live Pricing & Availability
        PriceFeeds-->>Gateway: Price Matrix: Amazon (₹420), Flipkart (₹380), Bookswagon (₹450)
        Gateway->>Cache: Save Results with 15min TTL
    end
    Gateway-->>SearchUI: Return Aggregated Response with "Lowest Price" Highlight (Flipkart ₹380)
    SearchUI-->>Student: Display Realtime Cards with Direct Purchase Button
```

---

### 2.3 Dropshipping & Lowest-Price Auto-Order Engine
- When a user places an order on SSS, the system transparently creates an automated dropship task.
- The worker executes an automated checkout on the vendor site having the lowest price with the user's delivery address.
- Returns vendor tracking ID, updates local order lifecycle, and generates an itemized invoice.

```mermaid
sequenceDiagram
    autonumber
    actor Buyer as Student Buyer
    participant SSS_App as SSS Frontend / Cart
    participant SSS_Backend as SSS Backend API
    participant OrderQueue as Auto-Order Dropship Queue
    participant BotWorker as Automated Purchasing Bot
    participant Vendor as Lowest-Price Vendor (e.g., Flipkart/Amazon)

    Buyer->>SSS_App: Place Order & Pay on SSS (₹380)
    SSS_App->>SSS_Backend: POST /api/orders
    SSS_Backend->>SSS_Backend: Create Order [Status: "PENDING_AUTO_ORDER"]
    SSS_Backend->>OrderQueue: Push Dropship Job (OrderId, ISBN, ShippingAddress)
    SSS_Backend-->>SSS_App: Return Order Confirmation #SSS-94821
    
    OrderQueue->>BotWorker: Process Job #SSS-94821
    BotWorker->>Vendor: Authenticate & Add ISBN to Cart with Buyer Address
    BotWorker->>Vendor: Confirm Purchase via SSS Corporate Card / Affiliate API
    Vendor-->>BotWorker: External Order ID: #FK-8829410, Tracking: #DLV-4491
    BotWorker->>SSS_Backend: Update Order [Status: "AUTO_ORDERED", Vendor: "Flipkart", ExtId: "FK-8829410"]
    SSS_Backend-->>Buyer: Push Status Update: "Your book has been auto-ordered at lowest price!"
```

---

### 2.4 Indian Universities Academic Calculation Engine

The engine encapsulates distinct university algorithms across Indian technical and general universities:

```mermaid
flowchart LR
    UnivSelect["Select Indian University\n(AKTU, VTU, SPPU, MU, DU, Anna, MAKAUT, JNTU, GTU)"] --> Inputs["Enter Semester Subject Marks / Grade Points / Credits"]
    Inputs --> SGPA_Calc["Calculate Semester SGPA\n∑(Credit × GradePoint) / ∑(Credits)"]
    Inputs --> CGPA_Calc["Calculate Cumulative CGPA\n∑(SGPA × SemCredits) / ∑(SemCredits)"]
    CGPA_Calc --> Univ_Conv["Apply University-Specific % Formula"]
    
    Univ_Conv --> AKTU["AKTU Formula: (CGPA - 0.75) × 10"]
    Univ_Conv --> VTU["VTU Formula: (CGPA - 0.75) × 10 / CGPA × 10"]
    Univ_Conv --> DU["DU Formula: CGPA × 9.5"]
    Univ_Conv --> MU["MU Formula: 7.1 + 0.1(CGPA-7)×10 or CGPA×7.25"]
    Univ_Conv --> SPPU["SPPU Formula: (CGPA × 10) - 7.5"]
    Univ_Conv --> GTU["GTU Formula: (CPI - 0.5) × 10"]
    Univ_Conv --> JNTU["JNTU Formula: (CGPA - 0.5) × 10"]
    Univ_Conv --> Anna["Anna Univ Formula: CGPA × 10"]
    
    Univ_Conv --> TargetPredictor["Internal Marks & Target CGPA Predictor"]
    TargetPredictor --> TranscriptPDF["Download / Print Official Marksheet PDF"]
```

---

## 3. Database Schema (Entity Relationship Diagram)

```mermaid
erDiagram
    USER ||--o{ BOOK_LISTING : "owns"
    USER ||--o{ EXCHANGE_REQUEST : "proposes / receives"
    USER ||--o{ ORDER : "places"
    USER ||--o{ ACADEMIC_RECORD : "stores"
    USER ||--o{ AUDIT_LOG : "triggers"
    
    ORDER ||--|{ ORDER_ITEM : "contains"
    ORDER ||--o| DROPSHIP_FULFILLMENT : "fulfilled_by"
    
    BOOK_LISTING ||--o{ EXCHANGE_REQUEST : "involved_in"

    USER {
        string id PK
        string name
        string email
        string passwordHash
        string role "ADMIN | MODERATOR | STUDENT | VERIFIED_SELLER"
        string university
        string collegeName
        string campusLocation
        boolean isBanned
        datetime createdAt
    }

    BOOK_LISTING {
        string id PK
        string sellerId FK
        string title
        string author
        string isbn
        string edition
        string condition "LIKE_NEW | GOOD | FAIR | ACCEPTABLE"
        float originalMrp
        float listingPrice
        boolean isForExchange
        string exchangeTarget
        string category
        string universityBranch
        string coverImage
        string status "AVAILABLE | IN_EXCHANGE | SOLD | INACTIVE"
        datetime createdAt
    }

    EXCHANGE_REQUEST {
        string id PK
        string senderId FK
        string receiverId FK
        string offeredBookId FK
        string requestedBookId FK
        string status "PENDING | ACCEPTED | REJECTED | COUNTERED | COMPLETED"
        string message
        string meetupLocation
        datetime createdAt
    }

    ORDER {
        string id PK
        string userId FK
        float totalAmount
        float studentSavings
        string shippingAddress
        string paymentMethod "UPI | CARD | NETBANKING | COD"
        string status "PENDING | AUTO_ORDERED | DISPATCHED | DELIVERED | CANCELLED"
        datetime createdAt
    }

    ORDER_ITEM {
        string id PK
        string orderId FK
        string bookTitle
        string isbn
        string itemType "PHYSICAL_USED | PHYSICAL_NEW | EBOOK"
        float price
        int quantity
    }

    DROPSHIP_FULFILLMENT {
        string id PK
        string orderId FK
        string vendorName "AMAZON | FLIPKART | BOOKSWAGON | SSS_MARKET"
        float vendorPrice
        string externalOrderId
        string trackingNumber
        string carrier
        string executionLog
        datetime autoOrderedAt
    }

    ACADEMIC_RECORD {
        string id PK
        string userId FK
        string universityCode
        int semester
        float sgpa
        float cgpa
        float percentage
        json subjectBreakdown
        datetime savedAt
    }

    AUDIT_LOG {
        string id PK
        string actorId FK
        string actionType "MAINTENANCE_TOGGLE | USER_ROLE_CHANGE | USER_BAN | AUTO_ORDER_EXEC | PRICE_SCRAPE"
        string details
        string ipAddress
        datetime timestamp
    }

    SYSTEM_STATE {
        string key PK
        boolean isMaintenanceMode
        string maintenanceMessage
        datetime estimatedUptime
        string updatedBy
        datetime updatedAt
    }
```

---

## 4. Admin Governance & Maintenance Guard

```mermaid
flowchart TD
    Req[Incoming HTTP Request] --> MaintCheck{Site in Maintenance Mode?}
    MaintCheck -- Yes --> RoleCheck{User is Admin or has Bypass Key?}
    RoleCheck -- Yes --> Proceed[Allow Access with Admin Maintenance Banner]
    RoleCheck -- No --> MaintenanceView[Display Dedicated Maintenance Screen with ETA Countdown & Support Link]
    MaintCheck -- No --> NormalFlow[Process Request Normally]
```

### RBAC Authority Matrix

| Permission / Action | Admin | Moderator | Verified Seller | Student |
| :--- | :---: | :---: | :---: | :---: |
| **Site Maintenance Mode Toggle** | ✅ | ❌ | ❌ | ❌ |
| **Create/Delete Users & Grant Roles** | ✅ | ❌ | ❌ | ❌ |
| **View Immutable Audit Logs** | ✅ | ❌ | ❌ | ❌ |
| **Manage Dropship Auto-Order Queue** | ✅ | ✅ | ❌ | ❌ |
| **Moderate P2P Used Book Listings** | ✅ | ✅ | ❌ | ❌ |
| **Create Resale/Exchange Listings** | ✅ | ✅ | ✅ | ✅ |
| **Instant Buy / Auto-Order Lowest Price** | ✅ | ✅ | ✅ | ✅ |
| **Calculate CGPA/SGPA & Download Report** | ✅ | ✅ | ✅ | ✅ |
| **Interactive E-Reader Access** | ✅ | ✅ | ✅ | ✅ |

---

## 5. Summary & Engineering Roadmap
- **Step 1: PRD PDF generated**: `docs/SSS_Product_Requirements_Document.pdf`
- **Step 2: Architecture Blueprint completed**: `docs/ARCHITECTURE.md`
- **Step 3: Implementation of Full-Stack Application**: Next.js 14+ / React UI, Tailwind CSS, Lucide icons, Express/Next API backend, SQLite/Prisma persistent data layer, auto-order simulation bot, university calculations, and comprehensive admin dashboard.
