import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(40, 800, "Study Student Shop (SSS) — Comprehensive Product Requirements Document (PRD)")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(40, 792, 555, 792)
            
        # Footer
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(555, 30, page_str)
        self.drawString(40, 30, "CONFIDENTIAL — SSS Next-Gen Academic & Commerce Ecosystem")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(40, 42, 555, 42)
        
        self.restoreState()

def build_prd_pdf(filename="docs/SSS_Product_Requirements_Document.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=55,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor("#1E3A8A")   # Deep Blue
    accent_color = colors.HexColor("#3B82F6")    # Blue
    dark_text = colors.HexColor("#0F172A")       # Slate 900
    muted_text = colors.HexColor("#475569")      # Slate 600
    bg_light = colors.HexColor("#F8FAFC")        # Slate 50
    border_color = colors.HexColor("#CBD5E1")    # Slate 300
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=8
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=muted_text,
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor("#1E40AF"),
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=dark_text,
        spaceAfter=6
    )
    
    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=dark_text,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )
    
    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=dark_text
    )

    story = []

    # Title & Metadata Banner
    story.append(Paragraph("Study Student Shop (SSS)", title_style))
    story.append(Paragraph("Comprehensive Product Requirements Document (PRD) & Technical Blueprint v2.4", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceAfter=12))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Document Version:</b> 2.4.0", table_cell_style), Paragraph("<b>Target Release:</b> Q4 2026", table_cell_style)],
        [Paragraph("<b>Product Status:</b> Ready for Engineering / Production", table_cell_style), Paragraph("<b>Target Market:</b> Indian Higher Education & Global Students", table_cell_style)],
        [Paragraph("<b>Authors:</b> SSS Core Architecture & Product Team", table_cell_style), Paragraph("<b>Confidentiality:</b> Tier-1 Internal / Stakeholders", table_cell_style)]
    ]
    t_meta = Table(meta_data, colWidths=[250, 265])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 14))

    # Executive Summary
    story.append(Paragraph("1. Executive Summary & Product Vision", h1_style))
    story.append(Paragraph(
        "<b>Study Student Shop (SSS)</b> is a unified, smart, all-in-one student commerce and academic utility ecosystem. "
        "Historically, college students across India and worldwide face severe friction when sourcing semester textbooks, "
        "calculating university-specific grades with irregular conversion formulas, liquidating used course materials, "
        "and hunting for the lowest-priced new textbooks across fragmented e-commerce platforms. SSS resolves this by merging "
        "a peer-to-peer (P2P) resale and exchange marketplace, a real-time multi-platform price aggregator (Amazon, Flipkart, Bookswagon, Google Books), "
        "an automated lowest-price dropshipping/auto-order fulfillment bot, an e-book digital library, and an official Indian Universities "
        "CGPA/Marks engine (supporting AKTU, VTU, SPPU, Mumbai Univ, DU, Anna Univ, MAKAUT, JNTU, GTU, etc.) under an enterprise-grade administrative governance framework.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # Key Value Propositions
    story.append(Paragraph("2. Strategic Value Propositions & Target Personas", h1_style))
    
    val_data = [
        [Paragraph("<b>Stakeholder / Persona</b>", table_header_style), Paragraph("<b>Core Pain Points</b>", table_header_style), Paragraph("<b>SSS Strategic Solution</b>", table_header_style)],
        [
            Paragraph("<b>College Student (Buyer/Seller)</b>", table_cell_style),
            Paragraph("High cost of new books, unorganized campus seniors resale, uncertainty about edition compatibility.", table_cell_style),
            Paragraph("Campus P2P resale/exchange portal with condition ratings, instant ISBN scan, and campus handover.", table_cell_style)
        ],
        [
            Paragraph("<b>Bargain Seeker & Researcher</b>", table_cell_style),
            Paragraph("Hours wasted comparing Amazon vs Flipkart vs Bookswagon vs Local stores for cheapest price.", table_cell_style),
            Paragraph("One-click live search with automated price comparisons, lowest price badge, and single-click automated order execution.", table_cell_style)
        ],
        [
            Paragraph("<b>Engineering/Medical/Arts Student</b>", table_cell_style),
            Paragraph("Confusing CGPA-to-percentage conversion rules across different Indian universities (e.g. (CGPA-0.75)*10 vs 9.5*CGPA).", table_cell_style),
            Paragraph("Automated University CGPA/SGPA engine with syllabus credit matrices, marks prediction, and downloadable marksheets.", table_cell_style)
        ],
        [
            Paragraph("<b>Platform Administrator</b>", table_cell_style),
            Paragraph("Downtime management, content moderation, fraud prevention, tracking dropship margins.", table_cell_style),
            Paragraph("Live Admin Command Center with Instant Maintenance Toggle, User RBAC, Real-time Scraper Logs, and Dropship monitor.", table_cell_style)
        ]
    ]
    t_val = Table(val_data, colWidths=[130, 180, 205])
    t_val.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_val)
    story.append(Spacer(1, 10))

    # Section 3: Detailed Functional Specifications
    story.append(Paragraph("3. Detailed Functional Modules & Feature Requirements", h1_style))
    
    # 3.1 P2P Resell & Exchange
    story.append(Paragraph("3.1 Peer-to-Peer (P2P) Book Resale & Book Exchange", h2_style))
    story.append(Paragraph("• <b>Book Resale Listing:</b> Students can list used textbooks specifying Title, Author, Edition, Subject, University/Branch, Condition (Like New, Good, Fair, Acceptable), Price, Original MRP, and campus handover location.", bullet_style))
    story.append(Paragraph("• <b>Book Exchange (Barter/Swap):</b> Students can mark books as 'Available for Exchange' and specify target books or subjects they need in return.", bullet_style))
    story.append(Paragraph("• <b>Exchange Proposal Workflow:</b> Student B sends an exchange request proposing one of their listed books. Student A can Accept, Decline, or Propose Counter-offer with automated chat and campus rendezvous setup.", bullet_style))
    story.append(Paragraph("• <b>Safety & Condition Badges:</b> Verified student badge, book condition photo gallery, condition verification checklist upon handover.", bullet_style))

    # 3.2 Real-Time Search & Aggregated Price Comparison
    story.append(Paragraph("3.2 Real-Time Google Books & Multi-Vendor Price Aggregator", h2_style))
    story.append(Paragraph("• <b>Ultra-Fast Live Search:</b> Debounced real-time search queries connecting to Google Books API + SSS Local Cache. Instant auto-complete with thumbnails, ISBN-10/13, publisher, author, and edition metadata.", bullet_style))
    story.append(Paragraph("• <b>Multi-Platform Price Intelligence:</b> Scrapes/aggregates live price and in-stock status across Amazon.in, Flipkart, Bookswagon, and SSS Verified Used Sellers.", bullet_style))
    story.append(Paragraph("• <b>Lowest Price Highlighting:</b> Visually pinpoints the lowest-cost vendor with price differentials, estimated delivery days, and savings badges.", bullet_style))

    # 3.3 Automated Drop-shipping & Auto-Order Execution Engine
    story.append(Paragraph("3.3 Automated Dropshipping / Arbitrage Auto-Ordering Engine", h2_style))
    story.append(Paragraph("• <b>Unified SSS Checkout:</b> User makes payment directly on SSS (Cards, UPI, NetBanking, Campus Pay).", bullet_style))
    story.append(Paragraph("• <b>Automated Order Bot:</b> An asynchronous backend worker receives the order, identifies the external platform currently offering the lowest price (e.g. Amazon at ₹320 vs Flipkart at ₹399), logs in via platform merchant/affiliate bot or API, places the order with the customer's shipping address, and captures external order ID.", bullet_style))
    story.append(Paragraph("• <b>Order Lifecycle Management:</b> User receives unified real-time tracking: [Payment Confirmed] → [Auto-Ordered at Lowest Vendor] → [Dispatched] → [Out for Delivery] → [Delivered].", bullet_style))
    story.append(Paragraph("• <b>Failsafe Fallback:</b> In case of vendor stockouts or price spikes, the auto-order queue alerts admin and switches to 2nd lowest vendor or initiates instant refund.", bullet_style))

    # 3.4 E-Books & Digital Reading Suite
    story.append(Paragraph("3.4 E-Books & Digital Library Suite", h2_style))
    story.append(Paragraph("• <b>Digital Catalog:</b> Instant access to academic e-books, lecture notes, lab manuals, and previous years' question papers (PYQs).", bullet_style))
    story.append(Paragraph("• <b>Interactive Web E-Reader:</b> In-browser reading interface with zoom, full-screen, page jump, night/sepia mode, and bookmarking.", bullet_style))
    story.append(Paragraph("• <b>Instant Purchase & Download:</b> E-books can be unlocked via instant micro-transactions and downloaded as DRM-stamped PDFs.", bullet_style))

    # 3.5 Academic Engine
    story.append(Paragraph("3.5 Indian Universities Academic Engine (CGPA, SGPA, Marks)", h2_style))
    story.append(Paragraph("• <b>Multi-University Grading Schemes:</b> Supports distinct grading formulas for major Indian Universities:", bullet_style))
    
    univ_data = [
        [Paragraph("<b>University / Board</b>", table_header_style), Paragraph("<b>Grading System / Formula</b>", table_header_style), Paragraph("<b>Percentage Conversion Formula</b>", table_header_style)],
        [Paragraph("<b>AKTU (Lucknow)</b>", table_cell_style), Paragraph("10-Point Absolute Grading (O, A+, A, B+, B, C, P, F)", table_cell_style), Paragraph("<code>Percentage = (CGPA - 0.75) * 10</code>", table_cell_style)],
        [Paragraph("<b>VTU (Karnataka)</b>", table_cell_style), Paragraph("10-Point CBCS Grade Points (S, A, B, C, D, E, F)", table_cell_style), Paragraph("<code>Percentage = (CGPA - 0.75) * 10</code> (Pre-2022) / <code>CGPA * 10</code> (2022+)", table_cell_style)],
        [Paragraph("<b>Delhi University (DU)</b>", table_cell_style), Paragraph("UGC-CBCS 10-Point Letter Scale", table_cell_style), Paragraph("<code>Percentage = CGPA * 9.5</code>", table_cell_style)],
        [Paragraph("<b>Mumbai University (MU)</b>", table_cell_style), Paragraph("7-Point & 10-Point CBSGS Scale", table_cell_style), Paragraph("<code>Percentage = 7.1 + 0.1 * (CGPA - 7) * 10</code> (for >=7.0) / <code>CGPA * 7.25</code>", table_cell_style)],
        [Paragraph("<b>SPPU (Pune Univ)</b>", table_cell_style), Paragraph("10-Point Credit System (O, A+, A, B+, B, C, D, F)", table_cell_style), Paragraph("<code>Percentage = (CGPA * 10) - 7.5</code> (for >= 7.0) or slab conversion", table_cell_style)],
        [Paragraph("<b>Anna University</b>", table_cell_style), Paragraph("10-Point Scale (O, A+, A, B+, B, RA)", table_cell_style), Paragraph("<code>Percentage = CGPA * 10</code>", table_cell_style)],
        [Paragraph("<b>MAKAUT (WBUT)</b>", table_cell_style), Paragraph("10-Point CBCS Engineering Scale", table_cell_style), Paragraph("<code>Percentage = (CGPA - 0.75) * 10</code>", table_cell_style)],
        [Paragraph("<b>JNTU (Hyderabad/Kakinada)</b>", table_cell_style), Paragraph("10-Point CBCS Scale", table_cell_style), Paragraph("<code>Percentage = (CGPA - 0.5) * 10</code>", table_cell_style)],
        [Paragraph("<b>GTU (Gujarat)</b>", table_cell_style), Paragraph("SPI / CPI 10-Point Scale", table_cell_style), Paragraph("<code>Percentage = (CPI - 0.5) * 10</code>", table_cell_style)]
    ]
    t_univ = Table(univ_data, colWidths=[120, 195, 200])
    t_univ.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1E3A8A")),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('PADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_univ)
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("• <b>Internal Marks & Target CGPA Predictor:</b> Calculates how many marks in End-Semester exams are required based on Mid-Term/Internal marks to achieve student's goal (e.g., 8.5 CGPA).", bullet_style))
    story.append(Paragraph("• <b>Exportable Marksheet PDF:</b> One-click generation of student SGPA/CGPA transcript with university header.", bullet_style))

    # 3.6 User Profile & Student Dashboard
    story.append(Paragraph("3.6 User Profile & Student Hub", h2_style))
    story.append(Paragraph("• <b>Active Resale Listings:</b> Manage prices, mark items as sold, toggle visibility.", bullet_style))
    story.append(Paragraph("• <b>Exchange Dashboard:</b> Inbox for trade offers with accept/reject/chat modals.", bullet_style))
    story.append(Paragraph("• <b>Order & Shipment History:</b> Real-time dropship order progression with tracking IDs.", bullet_style))
    story.append(Paragraph("• <b>Academic Vault:</b> Saved semester grade reports and target CGPA milestones.", bullet_style))

    # 3.7 Admin Command Center & Maintenance Guard
    story.append(Paragraph("3.7 Admin Command Center & Governance", h2_style))
    story.append(Paragraph("• <b>Site Maintenance Toggle:</b> Instantly place the application in Maintenance Mode with custom banner, estimated resolution ETA, and admin bypass authentication.", bullet_style))
    story.append(Paragraph("• <b>User & Role Management (RBAC):</b> Add, edit, ban, delete users, and assign granular roles (Admin, Moderator, Student, Verified Seller).", bullet_style))
    story.append(Paragraph("• <b>Live Audit Logs:</b> Detailed audit trail logging logins, role grants, maintenance state changes, auto-order dropship dispatches, and pricing scrapers.", bullet_style))
    story.append(Paragraph("• <b>Arbitrage & Auto-Order Monitor:</b> Live status of external vendor orders, margin tracker, and manual retry override.", bullet_style))

    # Section 4: System Architecture & Technical Specifications
    story.append(Paragraph("4. Technical & System Architecture", h1_style))
    story.append(Paragraph(
        "The SSS platform employs a modern modular, high-throughput full-stack architecture built on Next.js 14/15, "
        "Tailwind CSS, Express/Node.js API services, SQLite/PostgreSQL with Prisma ORM, Redis for live caching, "
        "and an asynchronous worker pipeline for the dropshipping auto-order execution engine.",
        body_style
    ))
    
    arch_data = [
        [Paragraph("<b>Layer</b>", table_header_style), Paragraph("<b>Technology Stack</b>", table_header_style), Paragraph("<b>Key Responsibilities</b>", table_header_style)],
        [Paragraph("<b>Frontend Presentation</b>", table_cell_style), Paragraph("Next.js / React, Tailwind CSS, Lucide Icons, Framer Motion, Canvas Confetti", table_cell_style), Paragraph("Responsive SPA/SSR, real-time debounced search, e-reader, academic calculators, and interactive admin control panel.", table_cell_style)],
        [Paragraph("<b>Application & API</b>", table_cell_style), Paragraph("Node.js / Express REST & Next.js API Routes", table_cell_style), Paragraph("Authentication (JWT), P2P matchmaking, maintenance guard middleware, order execution, university calculation algorithms.", table_cell_style)],
        [Paragraph("<b>Data & Persistence</b>", table_cell_style), Paragraph("Prisma ORM with SQLite / PostgreSQL, In-Memory Store", table_cell_style), Paragraph("User profiles, book listings, exchange proposals, order transactions, audit logs, and university syllabus templates.", table_cell_style)],
        [Paragraph("<b>External Integrations</b>", table_cell_style), Paragraph("Google Books API, E-commerce Price Scrapers / Adapters", table_cell_style), Paragraph("Live book metadata lookup, real-time price monitoring across Amazon, Flipkart, Bookswagon.", table_cell_style)],
        [Paragraph("<b>Worker & Automation</b>", table_cell_style), Paragraph("Async Auto-Order Queue / Simulated Dropship Bot", table_cell_style), Paragraph("Evaluates lowest priced vendor, auto-places purchase on behalf of user, generates tracking number and updates order state.", table_cell_style)]
    ]
    t_arch = Table(arch_data, colWidths=[110, 180, 225])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('BOX', (0,0), (-1,-1), 1, border_color),
        ('INNERGRID', (0,0), (-1,-1), 0.5, border_color),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_arch)
    story.append(Spacer(1, 10))

    # Section 5: Non-Functional Requirements & Security
    story.append(Paragraph("5. Non-Functional Requirements (NFR) & Security", h1_style))
    story.append(Paragraph("• <b>Performance:</b> Live book search response time < 150ms via debounced Google Books API + local caching.", bullet_style))
    story.append(Paragraph("• <b>High Availability & Maintenance Guard:</b> Graceful maintenance mode with 503 HTTP status code handling and zero data leakage.", bullet_style))
    story.append(Paragraph("• <b>Security:</b> Role-based access control (RBAC), bcrypt password hashing, sanitized inputs against XSS/SQLi.", bullet_style))
    story.append(Paragraph("• <b>Auditability:</b> Comprehensive immutable logging for all administrative modifications, user permission updates, and order dropship requests.", bullet_style))

    # Section 6: Roadmap & Milestones
    story.append(Paragraph("6. Release Roadmap & Success Metrics", h1_style))
    story.append(Paragraph("• <b>Milestone 1 (MVP - Current):</b> P2P Resell/Exchange, Live Price Aggregator, Auto-Order Dropship Engine, Academic Calculators, E-Reader, Maintenance Guard, Admin Dashboard.", bullet_style))
    story.append(Paragraph("• <b>Milestone 2:</b> Direct WhatsApp/SMS notifications for exchange requests and dropship delivery tracking.", bullet_style))
    story.append(Paragraph("• <b>Milestone 3:</b> AI-driven book condition grading from camera scans and personalized course syllabus book recommendations.", bullet_style))
    story.append(Paragraph("• <b>Success Metrics (KPIs):</b> Average savings per student (> 40% vs retail MRP), auto-order dropship success rate (> 99.2%), platform daily active users (DAU), CGPA calculation accuracy (100%).", bullet_style))

    story.append(Spacer(1, 12))
    story.append(Paragraph("<b>End of Product Requirements Document (PRD) — Study Student Shop (SSS)</b>", ParagraphStyle('EndDoc', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, textColor=primary_color, alignment=1)))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PRD PDF: {filename}")

if __name__ == "__main__":
    build_prd_pdf()
