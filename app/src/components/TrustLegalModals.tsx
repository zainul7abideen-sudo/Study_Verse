import React, { useState } from 'react';
import { 
  X, ShieldCheck, FileText, HelpCircle, Mail, Phone, MapPin, 
  Send, CheckCircle2, Lock, Sparkles, Scale, AlertCircle, RefreshCw 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export type LegalModalTab = 'privacy' | 'terms' | 'contact';

interface TrustLegalModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalModalTab;
}

export const TrustLegalModals: React.FC<TrustLegalModalsProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy'
}) => {
  const { addToast, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<LegalModalTab>(initialTab);

  // Contact Form State
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [contactSubject, setContactSubject] = useState('Order & Delivery Support');
  const [contactUniversity, setContactUniversity] = useState(currentUser?.university || 'AKTU');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync initial tab when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setIsSubmitted(false);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      addToast(
        'success',
        'Support Ticket Created',
        `Ticket #SV-${Math.floor(100000 + Math.random() * 900000)} created. Our Campus Support Desk will respond within 2 hours.`
      );
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl theme-card border theme-border rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header with Navigation Tabs */}
        <div className="p-4 sm:p-6 border-b theme-border theme-card-sub flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600/10 text-blue-500">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold theme-text-heading">
                StudyVerse Trust & Transparency Center
              </h2>
            </div>
            <p className="text-xs theme-text-muted mt-0.5">
              Legal governance, privacy protections, and student support.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="flex items-center p-1 rounded-xl theme-input border theme-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('privacy')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'privacy' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'theme-text-muted hover:theme-text-heading'
                }`}
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('terms')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'terms' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'theme-text-muted hover:theme-text-heading'
                }`}
              >
                Terms
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'contact' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'theme-text-muted hover:theme-text-heading'
                }`}
              >
                Contact
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full theme-card-sub border theme-border hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-xs sm:text-sm theme-text-muted space-y-6 leading-relaxed">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 pb-2 border-b theme-border">
                <Lock className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm theme-text-heading">
                  StudyVerse Privacy Policy & Student Data Protection (DPDP Act 2023)
                </h3>
              </div>

              <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-xs text-blue-600 dark:text-blue-300">
                🔒 <b>Privacy Commitment:</b> StudyVerse is committed to student data dignity. We never sell student records, roll numbers, or academic transcripts to third-party ad networks.
              </div>

              <section className="space-y-2">
                <h4 className="font-bold theme-text-heading text-xs uppercase tracking-wider text-blue-500">
                  1. Information We Collect
                </h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li><strong className="theme-text-heading">Profile & Academic Data:</strong> Full name, verified campus email, WhatsApp contact, university board (e.g. AKTU, VTU, DU), degree program, branch, and current semester to personalize book recommendations and syllabus calculations.</li>
                  <li><strong className="theme-text-heading">Marketplace & Resale Listings:</strong> Textbook titles, edition numbers, photos, condition notes, pricing, and campus exchange preferences.</li>
                  <li><strong className="theme-text-heading">Search Engine Queries:</strong> When you search for books, queries are processed via anonymized backend aggregators (Google Books API / SerpAPI) without attaching your personal identity.</li>
                  <li><strong className="theme-text-heading">Device & Session Telemetry:</strong> Anonymized browser information, session cookies, and theme preference (light/dark mode) stored securely in local browser storage.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold theme-text-heading text-xs uppercase tracking-wider text-blue-500">
                  2. How We Use Your Information
                </h4>
                <p>We process your data strictly to deliver educational marketplace utilities:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Aggregating real-time lowest price offers across Amazon, Flipkart, and Bookswagon.</li>
                  <li>Connecting you with peers on your campus for 0-commission book barters.</li>
                  <li>Calculating semester SGPA, cumulative CGPA, and end-semester target marks using verified university grading scales.</li>
                  <li>Powering StudyVerse AI Academic Assistant guidance tailored to your course curriculum.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold theme-text-heading text-xs uppercase tracking-wider text-blue-500">
                  3. Cookies & Local Storage
                </h4>
                <p>
                  StudyVerse uses essential first-party cookies and <code>localStorage</code> to maintain authenticated sessions, offline cart contents, and personalized syllabus settings. No third-party behavioral tracking cookies are loaded.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold theme-text-heading text-xs uppercase tracking-wider text-blue-500">
                  4. Student Rights & Data Erasure
                </h4>
                <p>
                  Under India's <b>Digital Personal Data Protection (DPDP) Act 2023</b>, you hold full rights to view, export, or permanently delete your account and listed books at any time from your <span className="text-blue-500 font-semibold">User Profile</span> or by emailing <code>privacy@studyverse.in</code>.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 pb-2 border-b theme-border">
                <Scale className="w-4 h-4 text-indigo-500" />
                <h3 className="font-bold text-sm theme-text-heading">
                  StudyVerse Terms of Service & Campus Marketplace Agreement
                </h3>
              </div>

              <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-xs text-indigo-600 dark:text-indigo-300">
                📜 <b>Fair Use Agreement:</b> By using StudyVerse, you agree to treat fellow campus students respectfully, accurately describe book conditions, and observe academic integrity.
              </div>

              <section className="space-y-2">
                <h4 className="font-bold theme-text-heading text-xs uppercase tracking-wider text-indigo-500">
                  1. Peer-to-Peer Resale & Barter Rules
                </h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Sellers must provide accurate photos and honest condition classifications (Brand New, Like New, Good, Acceptable).</li>
                  <li>Counterfeit or illicit pirated photocopies of copyrighted textbooks are strictly prohibited.</li>
                  <li>Campus barter exchanges must be conducted in safe, public university premises (such as campus libraries or student union buildings).</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold theme-text-heading text-xs uppercase tracking-wider text-indigo-500">
                  2. Automated Lowest-Price Aggregation & Dropshipping
                </h4>
                <p>
                  StudyVerse operates real-time price comparison bots that query Google Books, Amazon, and Flipkart. When you place a multi-vendor dropship order, our worker dispatches the purchase through verified retail channels. Shipping timelines and courier dispatches adhere to standard partner delivery schedules (2–5 campus business days).
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold theme-text-heading text-xs uppercase tracking-wider text-indigo-500">
                  3. Cancellations & Instant Wallet Refunds
                </h4>
                <p>
                  Orders can be cancelled prior to warehouse dispatch directly from the <span className="text-blue-500 font-semibold">User Profile & Orders</span> section. All approved refunds are instantly credited to your <b>StudyVerse Campus Wallet</b> with 0% deduction fees.
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-bold theme-text-heading text-xs uppercase tracking-wider text-indigo-500">
                  4. Academic Calculators & AI Guidance Disclaimer
                </h4>
                <p>
                  CGPA engines and target predictors are calibrated to standard university regulations (AKTU Ordinance 2020, VTU CBCS 2021, DU UGCF 2022). While calculations are tested for precision, official degree classifications are governed exclusively by your university's Controller of Examinations. StudyVerse AI Assistant responses are for supplementary learning and study guidance.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: CONTACT US & SUPPORT FORM */}
          {activeTab === 'contact' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 pb-2 border-b theme-border">
                <HelpCircle className="w-4 h-4 text-emerald-500" />
                <h3 className="font-bold text-sm theme-text-heading">
                  StudyVerse Student Help Center & Campus Desk
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 theme-card-sub border theme-border rounded-2xl flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold theme-text-muted">Support Email</div>
                    <div className="font-semibold text-xs theme-text-heading">help@studyverse.in</div>
                  </div>
                </div>

                <div className="p-3 theme-card-sub border theme-border rounded-2xl flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold theme-text-muted">Campus Helpline</div>
                    <div className="font-semibold text-xs theme-text-heading">+91 98765 43210</div>
                  </div>
                </div>

                <div className="p-3 theme-card-sub border theme-border rounded-2xl flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold theme-text-muted">Average SLA</div>
                    <div className="font-semibold text-xs text-emerald-500">&lt; 2 Hours Resolution</div>
                  </div>
                </div>
              </div>

              {isSubmitted ? (
                <div className="p-6 theme-card-sub border theme-border rounded-3xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm theme-text-heading">Message Sent Successfully!</h4>
                  <p className="text-xs theme-text-muted max-w-md mx-auto">
                    Thank you for reaching out. A campus support lead has been assigned to ticket <b>#SV-{Math.floor(100000 + Math.random() * 900000)}</b> and will reply to <b>{contactEmail}</b> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setContactMessage('');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="contact-name-input" className="block text-xs font-semibold theme-text-heading mb-1">
                        Your Name *
                      </label>
                      <input
                        id="contact-name-input"
                        name="name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Ananya Sharma"
                        className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email-input" className="block text-xs font-semibold theme-text-heading mb-1">
                        Student Email *
                      </label>
                      <input
                        id="contact-email-input"
                        name="email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g. ananya@college.edu"
                        className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="contact-category-select" className="block text-xs font-semibold theme-text-heading mb-1">
                        Issue Category *
                      </label>
                      <select
                        id="contact-category-select"
                        name="category"
                        aria-label="Contact Issue Category"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none cursor-pointer"
                      >
                        <option value="Order & Delivery Support">📦 Order, Tracking & Delivery</option>
                        <option value="P2P Resale & Book Swap Dispute">🔄 P2P Resale / Exchange Dispute</option>
                        <option value="Wallet Refund / Payment Issue">💳 Wallet & Payment Top-up</option>
                        <option value="Academic CGPA Formula Correction">🎓 University CGPA Formula Query</option>
                        <option value="College Campus Ambassador Inquiry">🏫 College Campus Ambassador Inquiry</option>
                        <option value="General Feedback & Feature Request">💡 General Feedback / Feature Idea</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-university-input" className="block text-xs font-semibold theme-text-heading mb-1">
                        University / College
                      </label>
                      <input
                        id="contact-university-input"
                        name="university"
                        type="text"
                        value={contactUniversity}
                        onChange={(e) => setContactUniversity(e.target.value)}
                        placeholder="e.g. AKTU / VTU / Delhi University"
                        className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message-input" className="block text-xs font-semibold theme-text-heading mb-1">
                      Message / Problem Description *
                    </label>
                    <textarea
                      id="contact-message-input"
                      name="message"
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Please provide order IDs, book titles, or details so we can expedite resolution..."
                      className="w-full theme-input theme-text-heading border theme-border rounded-xl p-3 text-xs outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting Ticket...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Support Ticket</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t theme-border theme-card-sub flex items-center justify-between text-[11px] theme-text-muted">
          <span>Study Student Shop (SSS) Compliance Desk</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg theme-card border theme-border font-bold hover:theme-text-heading transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
};
