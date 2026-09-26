import React, { useState } from 'react';
import { 
  ShoppingCart, Trash2, Plus, Minus, Tag, Zap, 
  CreditCard, Smartphone, Building2, MapPin, CheckCircle2, 
  ArrowRight, ShieldCheck, Sparkles, X 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CartAndCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CartAndCheckoutModal: React.FC<CartAndCheckoutModalProps> = ({ 
  isOpen, onClose, onOrderSuccess 
}) => {
  const { 
    currentUser, cart, removeFromCart, updateCartQuantity, 
    cartTotal, cartSavings, checkoutOrder 
  } = useApp();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [couponCode, setCouponCode] = useState('STUDENT15');
  const [appliedCoupon, setAppliedCoupon] = useState('STUDENT15');
  
  // Checkout Form State
  const [name, setName] = useState(currentUser.name || 'Aarav Sharma');
  const [email, setEmail] = useState(currentUser.email || 'student@university.ac.in');
  const [phone, setPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [campus, setCampus] = useState(currentUser.collegeName || 'BMS College of Engineering, Bangalore');
  const [address, setAddress] = useState('Hostel Block B, Room 204, Campus Main Gate');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Cash on Campus Handover'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const discount = appliedCoupon.toUpperCase() === 'STUDENT15' ? Math.round(cartTotal * 0.15) : 0;
  const finalTotal = Math.max(0, cartTotal - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'STUDENT15' || couponCode.toUpperCase() === 'CAMPUSFREE') {
      setAppliedCoupon(couponCode.toUpperCase());
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const order = await checkoutOrder({
        name,
        email,
        phone,
        address,
        campus,
        paymentMethod,
        couponCode: appliedCoupon
      });
      setIsSubmitting(false);
      onClose();
      onOrderSuccess(order.id);
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="theme-card border theme-border rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b theme-border flex items-center justify-between theme-card-sub">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-xl">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold theme-text-heading">
                {step === 'cart' ? 'Your Unified Student Cart' : 'Instant Dropship & Campus Checkout'}
              </h2>
              <p className="text-[11px] theme-text-muted">
                {step === 'cart' ? `${cart.length} item(s) in basket` : 'Auto-order execution at lowest price'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 theme-text-muted hover:theme-text-heading rounded-full theme-card-sub border theme-border cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingCart className="w-12 h-12 theme-text-muted mx-auto" />
              <h3 className="text-base font-bold theme-text-heading">Your Cart is Empty</h3>
              <p className="text-xs theme-text-muted max-w-xs mx-auto">
                Search books to compare prices, browse used student listings, or explore digital e-books.
              </p>
            </div>
          ) : step === 'cart' ? (
            <>
              {/* Cart Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div 
                    key={item.id}
                    className="theme-card-sub border theme-border rounded-2xl p-3.5 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <img 
                      src={item.coverImage} 
                      alt={item.title} 
                      className="w-12 h-16 object-cover rounded-lg border theme-border flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          item.type === 'ebook' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300' :
                          item.type === 'used_resale' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' :
                          'bg-blue-500/20 text-blue-600 dark:text-blue-300'
                        }`}>
                          {item.type.replace('_', ' ')}
                        </span>
                        {item.vendorName && (
                          <span className="text-[10px] theme-text-muted font-medium truncate">
                            via {item.vendorName}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm theme-text-heading truncate mt-0.5">{item.title}</h4>
                      <div className="text-xs font-bold text-blue-500 dark:text-cyan-300 mt-1">₹{item.price} each</div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      {item.type !== 'ebook' && (
                        <div className="flex items-center theme-card border theme-border rounded-xl p-0.5 text-xs">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:opacity-80 theme-text-muted hover:theme-text-heading rounded cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold theme-text-heading text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:opacity-80 theme-text-muted hover:theme-text-heading rounded cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 theme-text-muted hover:text-rose-500 rounded-lg cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 theme-text-muted absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. STUDENT15)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl pl-8 pr-3 py-2 text-xs uppercase placeholder:opacity-60 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 theme-card-sub hover:opacity-80 theme-text-heading text-xs font-bold rounded-xl border theme-border cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {/* Price Summary Breakdown */}
              <div className="theme-card-sub border theme-border rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between theme-text-muted">
                  <span>Subtotal</span>
                  <span className="theme-text-heading font-semibold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Guaranteed Lowest Price Savings</span>
                  <span>-₹{Math.round(cartSavings)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-blue-500 dark:text-cyan-300 font-semibold">
                    <span>Student Coupon Discount ({appliedCoupon})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between theme-text-muted">
                  <span>Campus Delivery / Instant Download</span>
                  <span className="text-emerald-600 dark:text-emerald-400 uppercase font-bold">FREE</span>
                </div>
                <div className="pt-2 border-t theme-border flex justify-between text-sm font-black theme-text-heading">
                  <span>Total Payable</span>
                  <span className="text-blue-500 dark:text-cyan-300">₹{finalTotal}</span>
                </div>
              </div>
            </>
          ) : (
            /* STEP 2: CHECKOUT & ADDRESS FORM */
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 text-left">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold theme-text-heading mb-1">Mobile / WhatsApp No. *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">College / University Campus *</label>
                <input
                  type="text"
                  required
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-1">Hostel Room / Campus Delivery Address *</label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full theme-input theme-text-heading border theme-border rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold theme-text-heading mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'UPI', label: 'UPI / GPay / PhonePe', icon: Smartphone },
                    { id: 'Card', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'NetBanking', label: 'Net Banking', icon: Building2 },
                    { id: 'Cash on Campus Handover', label: 'Campus Cash Handover', icon: MapPin },
                  ].map(m => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                          paymentMethod === m.id
                            ? 'bg-blue-500/20 border-blue-500 theme-text-heading font-bold'
                            : 'theme-card-sub border theme-border theme-text-muted'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Auto Dropship Guarantee Note */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-[11px] theme-text-heading flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>
                  <b>SSS Automated Auto-Order Guarantee:</b> When you confirm, our automated bot fulfills your physical books from the lowest-priced supplier and dispatches directly to your campus address.
                </span>
              </div>

            </form>
          )}

        </div>

        {/* Modal Footer Controls */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 border-t theme-border flex items-center justify-between theme-card-sub">
            <div>
              <div className="text-[10px] theme-text-muted uppercase font-semibold">Total Amount</div>
              <div className="text-lg sm:text-xl font-black text-blue-500 dark:text-cyan-300">₹{finalTotal}</div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xl shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-2.5 theme-card border theme-border theme-text-heading text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Back
                </button>
                <button
                  form="checkout-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{isSubmitting ? 'Auto-Ordering...' : `Pay & Auto-Order (₹${finalTotal})`}</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
