import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, CheckCircle, CreditCard, ArrowRight, AlertCircle, Copy, Check } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/useAuth';
import { useCreateOrder } from '@/services/supabase.hooks';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';

type Step = 'cart' | 'details' | 'confirmation';

export function CheckoutPage() {
  const { items, totalPrice, totalItems, clear } = useCart();
  const { profile } = useAuth();
  const { isRTL, t } = useLanguage();
  const createOrder = useCreateOrder();
  const [, navigate] = useLocation();

  const [step, setStep] = useState<Step>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone_cash'>('instapay');
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: profile?.full_name || '', phone: profile?.phone || '', address: '', notes: '' });

  const handlePlaceOrder = async () => {
    if (!profile) { navigate('/auth'); return; }
    try {
      if (formData.phone.trim()) {
        const { error: phoneErr } = await (supabase.from('profiles') as any)
          .update({ phone: formData.phone.trim() })
          .eq('id', profile.id);
        if (phoneErr) console.error('[Checkout] Failed to save phone:', phoneErr);
      }

      const order = await createOrder.mutateAsync({
        userId: profile.id,
        items: items.map((i) => ({ bookId: i.bookId, quantity: i.quantity })),
        paymentMethod,
        shippingAddress: formData.address,
        notes: formData.notes,
        transactionId: transactionId.trim() || undefined,
      });
      setOrderId(order.id as string);
      clear();
      setStep('confirmation');
    } catch (err) {
      console.error(err);
    }
  };

  const steps = [
    { key: 'cart', label: isRTL ? 'مراجعة السلة' : 'Review Cart', num: 1 },
    { key: 'details', label: isRTL ? 'تفاصيل الطلب' : 'Order Details', num: 2 },
    { key: 'confirmation', label: isRTL ? 'التأكيد' : 'Confirmation', num: 3 },
  ] as const;

  return (
    <div className="min-h-screen pt-32 pb-32" style={{ background: '#F5F0E3' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Progress Steps */}
        {step !== 'confirmation' && (
          <div className={`flex items-center justify-center gap-4 mb-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {steps.filter((s) => s.key !== 'confirmation').map((s, i, arr) => {
              const isCurrent = step === s.key;
              const isPassed = steps.findIndex(x => x.key === step) > i;
              return (
                <div key={s.key} className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                      style={{
                        background: isCurrent ? '#23432E' : isPassed ? '#B49A63' : '#EDE5D4',
                        color: isCurrent || isPassed ? '#FFFDF7' : '#777363',
                        border: `1px solid ${isCurrent ? '#23432E' : isPassed ? '#B49A63' : '#D6C6A8'}`
                      }}
                    >
                      {isPassed ? '✓' : s.num}
                    </div>
                    <span
                      className="font-bold text-sm font-arabic"
                      style={{ color: isCurrent ? '#23432E' : '#777363' }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && <div className="h-px w-12" style={{ background: '#D6C6A8' }} />}
                </div>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Cart Review */}
          {step === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="text-center mb-10">
                <span className="font-bold uppercase tracking-[0.3em] text-xs font-arabic" style={{ color: '#B49A63' }}>
                  {isRTL ? 'خطوة الشراء' : 'Checkout'}
                </span>
                <h1 className="text-4xl font-black mt-2 font-arabic" style={{ color: '#23432E' }}>
                  {isRTL ? 'مراجعة طلبك' : 'Review Your Order'}
                </h1>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-20 px-6 rounded-3xl" style={{ background: '#FFFDF7', border: '1px solid #D6C6A8' }}>
                  <ShoppingBag size={56} className="mx-auto mb-4" style={{ color: '#B49A63' }} />
                  <p className="font-bold text-xl mb-6 font-arabic" style={{ color: '#23432E' }}>
                    {isRTL ? 'سلة المشتريات فارغة' : 'Your cart is empty'}
                  </p>
                  <Link href="/store">
                    <button
                      className="px-8 py-3.5 rounded-full font-bold transition-all shadow-md font-arabic"
                      style={{ background: '#23432E', color: '#FFFDF7' }}
                    >
                      {isRTL ? 'تصفح إصداراتنا' : 'Browse Books'}
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.bookId}
                        className={`flex gap-5 p-5 rounded-2xl transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
                        style={{
                          background: '#FFFDF7',
                          border: '1px solid #D6C6A8',
                          boxShadow: '0 4px 20px rgba(35,67,46,0.04)'
                        }}
                      >
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-20 h-28 object-cover rounded-xl shadow-sm flex-shrink-0"
                          style={{ border: '1px solid #D6C6A8' }}
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h3 className={`font-bold text-lg mb-1 font-arabic ${isRTL ? 'text-right' : ''}`} style={{ color: '#23432E' }}>
                              {item.title}
                            </h3>
                            <p className={`text-xs font-bold font-arabic ${isRTL ? 'text-right' : ''}`} style={{ color: '#777363' }}>
                              {item.format === 'digital' ? (isRTL ? 'نسخة رقمية' : 'Digital Edition') : (isRTL ? 'نسخة ورقية فاخرة' : 'Hardcover / Physical')}
                            </p>
                          </div>
                          <div className={`flex items-center justify-between mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span className="font-black text-lg" style={{ color: '#23432E' }}>
                              {(item.price * item.quantity).toFixed(2)} <span className="text-xs font-normal" style={{ color: '#777363' }}>{t.common.currency}</span>
                            </span>
                            <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: '#EDE5D4', color: '#263A2C' }}>
                              × {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div
                    className="p-7 rounded-3xl h-fit sticky top-32"
                    style={{
                      background: '#FFFDF7',
                      border: '1px solid #D6C6A8',
                      boxShadow: '0 10px 30px rgba(35,67,46,0.06)'
                    }}
                  >
                    <h3 className={`text-lg font-black mb-6 font-arabic ${isRTL ? 'text-right' : ''}`} style={{ color: '#23432E' }}>
                      {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                    </h3>
                    <div className="space-y-4 mb-6">
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="font-bold text-sm font-arabic" style={{ color: '#777363' }}>
                          {isRTL ? `${totalItems} كتب مختارة` : `${totalItems} book(s)`}
                        </span>
                        <span className="font-bold text-sm" style={{ color: '#23432E' }}>
                          {totalPrice.toFixed(2)} {t.common.currency}
                        </span>
                      </div>
                      <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="font-bold text-sm font-arabic" style={{ color: '#777363' }}>
                          {isRTL ? 'خدمة الشحن' : 'Shipping'}
                        </span>
                        <span className="font-bold text-sm font-arabic" style={{ color: '#23432E' }}>
                          {isRTL ? 'شحن مميز مجاني' : 'Free Express'}
                        </span>
                      </div>
                      <div className="h-px" style={{ background: '#D6C6A8' }} />
                      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="font-black font-arabic text-base" style={{ color: '#23432E' }}>
                          {isRTL ? 'الإجمالي' : 'Total'}
                        </span>
                        <span className="font-black text-2xl" style={{ color: '#23432E' }}>
                          {totalPrice.toFixed(2)} <span className="text-sm font-normal" style={{ color: '#777363' }}>{t.common.currency}</span>
                        </span>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setStep('details')}
                      className={`w-full py-4 font-bold rounded-full transition-all flex items-center justify-center gap-3 font-arabic ${isRTL ? 'flex-row-reverse' : ''}`}
                      style={{
                        background: '#23432E',
                        color: '#FFFDF7',
                        boxShadow: '0 8px 20px rgba(35,67,46,0.25)'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{isRTL ? 'متابعة إلى إتمام الطلب' : 'Continue to Checkout'}</span>
                      <ArrowRight size={18} className={isRTL ? 'rotate-180' : ''} />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Details & Payment */}
          {step === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-10">
                <span className="font-bold uppercase tracking-[0.3em] text-xs font-arabic" style={{ color: '#B49A63' }}>
                  {isRTL ? 'بيانات الشحن والدفع' : 'Shipping & Payment'}
                </span>
                <h1 className="text-4xl font-black mt-2 font-arabic" style={{ color: '#23432E' }}>
                  {isRTL ? 'إتمام تفاصيل الطلب' : 'Order Details'}
                </h1>
              </div>

              {!profile && (
                <div
                  className={`flex items-start gap-3 p-5 rounded-2xl mb-8 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                  style={{ background: '#EDE5D4', border: '1px solid #B49A63' }}
                >
                  <AlertCircle className="flex-shrink-0 mt-0.5" size={20} style={{ color: '#B49A63' }} />
                  <div>
                    <p className="font-bold font-arabic text-sm" style={{ color: '#23432E' }}>
                      {isRTL ? 'يُرجى تسجيل الدخول أو إنشاء حساب لربط طلبك بمكتبتك' : 'Please sign in to link this order to your account'}
                    </p>
                    <Link href="/auth">
                      <span className="font-black text-sm underline cursor-pointer font-arabic" style={{ color: '#23432E' }}>
                        {isRTL ? 'تسجيل الدخول الآن' : 'Sign in now'}
                      </span>
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Shipping Form */}
                  <div
                    className="p-8 rounded-3xl"
                    style={{
                      background: '#FFFDF7',
                      border: '1px solid #D6C6A8',
                      boxShadow: '0 4px 20px rgba(35,67,46,0.04)'
                    }}
                  >
                    <h3 className={`text-lg font-bold font-arabic mb-6 pb-3 border-b ${isRTL ? 'text-right' : ''}`} style={{ color: '#23432E', borderColor: '#EDE5D4' }}>
                      {isRTL ? 'بيانات المستلم وعنوان التوصيل' : 'Recipient Details'}
                    </h3>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className={`block text-xs font-bold font-arabic mb-2 ${isRTL ? 'text-right' : ''}`} style={{ color: '#263A2C' }}>
                            {isRTL ? 'الاسم بالكامل' : 'Full Name'} <span style={{ color: '#B49A63' }}>*</span>
                          </label>
                          <input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                            dir={isRTL ? 'rtl' : 'ltr'}
                            placeholder={isRTL ? 'مثال: أحمد عبد الله' : 'e.g. John Doe'}
                            className="w-full px-4 py-3.5 rounded-xl font-bold font-arabic text-sm transition-all focus:outline-none"
                            style={{
                              background: '#F5F0E3',
                              border: '1px solid #D6C6A8',
                              color: '#263A2C'
                            }}
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-bold font-arabic mb-2 ${isRTL ? 'text-right' : ''}`} style={{ color: '#263A2C' }}>
                            {isRTL ? 'رقم الهاتف للتواصل' : 'Phone Number'} <span style={{ color: '#B49A63' }}>*</span>
                          </label>
                          <input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                            dir="ltr"
                            className="w-full px-4 py-3.5 rounded-xl font-bold text-sm transition-all focus:outline-none text-left"
                            style={{
                              background: '#F5F0E3',
                              border: '1px solid #D6C6A8',
                              color: '#263A2C'
                            }}
                            placeholder="+20 ..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs font-bold font-arabic mb-2 ${isRTL ? 'text-right' : ''}`} style={{ color: '#263A2C' }}>
                          {isRTL ? 'عنوان التوصيل التفصيلي' : 'Shipping Address'} <span style={{ color: '#B49A63' }}>*</span>
                        </label>
                        <textarea
                          required
                          value={formData.address}
                          onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                          rows={3}
                          dir={isRTL ? 'rtl' : 'ltr'}
                          className="w-full px-4 py-3.5 rounded-xl font-bold font-arabic text-sm transition-all focus:outline-none resize-none"
                          style={{
                            background: '#F5F0E3',
                            border: '1px solid #D6C6A8',
                            color: '#263A2C'
                          }}
                          placeholder={isRTL ? 'المدينة، الحي، اسم الشارع، رقم البناية...' : 'City, district, street, building...'}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold font-arabic mb-2 ${isRTL ? 'text-right' : ''}`} style={{ color: '#777363' }}>
                          {isRTL ? 'ملاحظات إضافية للمندوب (اختياري)' : 'Additional Notes (Optional)'}
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                          rows={2}
                          dir={isRTL ? 'rtl' : 'ltr'}
                          className="w-full px-4 py-3 rounded-xl font-arabic text-sm transition-all focus:outline-none resize-none"
                          style={{
                            background: '#F5F0E3',
                            border: '1px solid #D6C6A8',
                            color: '#263A2C'
                          }}
                          placeholder={isRTL ? 'توجيهات خاصة بالتوصيل أو الإهداء...' : 'Any special instructions...'}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Section */}
                  <div
                    className="p-8 rounded-3xl"
                    style={{
                      background: '#FFFDF7',
                      border: '1px solid #D6C6A8',
                      boxShadow: '0 4px 20px rgba(35,67,46,0.04)'
                    }}
                  >
                    <h3 className={`text-lg font-bold font-arabic mb-6 pb-3 border-b ${isRTL ? 'text-right' : ''}`} style={{ color: '#23432E', borderColor: '#EDE5D4' }}>
                      {isRTL ? 'طريقة الدفع المعتمدة' : 'Select Payment Method'}
                    </h3>

                    <div className="space-y-4">
                      {/* Method 1: InstaPay */}
                      <div
                        onClick={() => {
                          setPaymentMethod('instapay');
                          setCopied(false);
                        }}
                        className={`p-5 rounded-2xl flex items-center justify-between cursor-pointer border-2 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
                        style={{
                          borderColor: paymentMethod === 'instapay' ? '#23432E' : '#D6C6A8',
                          background: paymentMethod === 'instapay' ? 'rgba(35,67,46,0.05)' : '#FFFDF7'
                        }}
                      >
                        <div className={`flex items-center gap-3.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                            style={{ borderColor: paymentMethod === 'instapay' ? '#23432E' : '#D6C6A8' }}
                          >
                            {paymentMethod === 'instapay' && (
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#23432E' }} />
                            )}
                          </div>
                          <div className={isRTL ? 'text-right' : ''}>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-base font-arabic" style={{ color: '#23432E' }}>
                                {isRTL ? 'إنستاباي (InstaPay)' : 'InstaPay'}
                              </p>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE5D4] text-[#23432E]">
                                {isRTL ? 'تحويل فوري' : 'Instant'}
                              </span>
                            </div>
                            <p className="text-xs font-arabic text-[#777363] mt-0.5">
                              {isRTL ? 'تحويل فوري ومجاني عبر تطبيق إنستاباي' : 'Direct instant transfer via InstaPay app'}
                            </p>
                          </div>
                        </div>
                        <CreditCard size={22} style={{ color: paymentMethod === 'instapay' ? '#23432E' : '#B49A63' }} />
                      </div>

                      {/* Method 2: Vodafone Cash */}
                      <div
                        onClick={() => {
                          setPaymentMethod('vodafone_cash');
                          setCopied(false);
                        }}
                        className={`p-5 rounded-2xl flex items-center justify-between cursor-pointer border-2 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
                        style={{
                          borderColor: paymentMethod === 'vodafone_cash' ? '#23432E' : '#D6C6A8',
                          background: paymentMethod === 'vodafone_cash' ? 'rgba(35,67,46,0.05)' : '#FFFDF7'
                        }}
                      >
                        <div className={`flex items-center gap-3.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                            style={{ borderColor: paymentMethod === 'vodafone_cash' ? '#23432E' : '#D6C6A8' }}
                          >
                            {paymentMethod === 'vodafone_cash' && (
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#23432E' }} />
                            )}
                          </div>
                          <div className={isRTL ? 'text-right' : ''}>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-base font-arabic" style={{ color: '#23432E' }}>
                                {isRTL ? 'فودافون كاش (Vodafone Cash)' : 'Vodafone Cash'}
                              </p>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE5D4] text-[#23432E]">
                                {isRTL ? 'محفظة إلكترونية' : 'Wallet'}
                              </span>
                            </div>
                            <p className="text-xs font-arabic text-[#777363] mt-0.5">
                              {isRTL ? 'تحويل فوري ومباشر إلى محفظة فودافون كاش' : 'Direct transfer to Vodafone Cash wallet'}
                            </p>
                          </div>
                        </div>
                        <CreditCard size={22} style={{ color: paymentMethod === 'vodafone_cash' ? '#23432E' : '#B49A63' }} />
                      </div>

                      {/* Active Method Payment Steps */}
                      {(() => {
                        const activeNumber = paymentMethod === 'instapay' ? '01154761493' : '01062260194';
                        const activeLabel = paymentMethod === 'instapay'
                          ? (isRTL ? 'حساب إنستاباي دار الرحاب للنشر والتوزيع' : 'Dar Al-Rehab InstaPay Account')
                          : (isRTL ? 'محفظة فودافون كاش دار الرحاب للنشر والتوزيع' : 'Dar Al-Rehab Vodafone Cash Wallet');

                        return (
                          <div
                            className={`p-6 rounded-2xl ${isRTL ? 'text-right' : ''}`}
                            style={{ background: '#F5F0E3', border: '1px solid #D6C6A8' }}
                          >
                            <p className="text-xs font-bold font-arabic uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#23432E' }}>
                              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: '#B49A63', color: '#FFFDF7' }}>1</span>
                              {paymentMethod === 'instapay'
                                ? (isRTL ? 'حوّل المبلغ الإجمالي إلى حساب إنستاباي التالي:' : 'Transfer the total amount to this InstaPay number:')
                                : (isRTL ? 'حوّل المبلغ الإجمالي إلى رقم محفظة فودافون كاش:' : 'Transfer the total amount to this Vodafone Cash wallet:')}
                            </p>
                            <div
                              className={`flex items-center justify-between p-4 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}
                              style={{ background: '#FFFDF7', border: '1px solid #D6C6A8' }}
                            >
                              <div>
                                <p className="font-mono font-black text-2xl tracking-wider" style={{ color: '#23432E' }}>
                                  {activeNumber}
                                </p>
                                <p className="text-xs font-arabic font-bold text-[#777363] mt-0.5">
                                  {activeLabel}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(activeNumber);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold font-arabic transition-all shadow-xs"
                                style={{
                                  background: copied ? '#23432E' : '#EDE5D4',
                                  color: copied ? '#FFFDF7' : '#23432E',
                                  border: '1px solid #D6C6A8'
                                }}
                              >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                <span>{copied ? (isRTL ? 'تم النسخ!' : 'Copied!') : (isRTL ? 'نسخ الرقم' : 'Copy')}</span>
                              </button>
                            </div>

                            <div className="mt-5">
                              <label className="block text-xs font-bold font-arabic mb-2 flex items-center gap-2" style={{ color: '#23432E' }}>
                                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: '#23432E', color: '#FFFDF7' }}>2</span>
                                {paymentMethod === 'instapay'
                                  ? (isRTL ? 'أدخل الرقم المرجعي للتحويل (Reference No) من تطبيق إنستاباي' : 'Enter InstaPay Reference Number')
                                  : (isRTL ? 'أدخل رقم العملية / المرجع من رسالة فودافون كاش' : 'Enter Vodafone Cash Transaction ID')}{' '}
                                <span style={{ color: '#B49A63' }}>*</span>
                              </label>
                              <input
                                required
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                dir="ltr"
                                className="w-full px-4 py-3.5 rounded-xl font-bold text-sm transition-all focus:outline-none text-left"
                                style={{
                                  background: '#FFFDF7',
                                  border: '1px solid #D6C6A8',
                                  color: '#263A2C'
                                }}
                                placeholder={paymentMethod === 'instapay' ? (isRTL ? 'مثال: 948271038' : 'e.g. 948271038') : (isRTL ? 'مثال: TXN123456789' : 'e.g. TXN123456789')}
                              />
                              <p className="text-xs mt-2 font-arabic" style={{ color: '#777363' }}>
                                {paymentMethod === 'instapay'
                                  ? (isRTL ? 'ستجد الرقم المرجعي بعد إتمام التحويل في تطبيق إنستاباي.' : 'You will find the reference number on your InstaPay receipt.')
                                  : (isRTL ? 'ستجد رقم العملية في رسالة التأكيد النصية (SMS) المرسلة من فودافون كاش.' : 'You will find the transaction ID in the Vodafone Cash confirmation SMS.')}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Right Side Order Summary */}
                <div
                  className="p-7 rounded-3xl h-fit sticky top-32"
                  style={{
                    background: '#FFFDF7',
                    border: '1px solid #D6C6A8',
                    boxShadow: '0 10px 30px rgba(35,67,46,0.06)'
                  }}
                >
                  <h3 className={`text-lg font-black mb-6 font-arabic ${isRTL ? 'text-right' : ''}`} style={{ color: '#23432E' }}>
                    {isRTL ? 'ملخص الحساب' : 'Payment Summary'}
                  </h3>
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.bookId} className={`flex justify-between items-center text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`truncate flex-1 font-arabic ${isRTL ? 'text-right' : ''}`} style={{ color: '#777363' }}>
                          {item.title} × {item.quantity}
                        </span>
                        <span className="font-bold ml-3" style={{ color: '#23432E' }}>
                          {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="h-px pt-2" style={{ background: '#D6C6A8' }} />
                    <div className={`flex justify-between items-center pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="font-black font-arabic text-base" style={{ color: '#23432E' }}>
                        {isRTL ? 'المجموع المستحق' : 'Amount Due'}
                      </span>
                      <span className="font-black text-2xl" style={{ color: '#23432E' }}>
                        {totalPrice.toFixed(2)} <span className="text-sm font-normal" style={{ color: '#777363' }}>{t.common.currency}</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(() => {
                      const isPaymentIncomplete = !transactionId.trim();
                      const isDisabled = !profile || createOrder.isPending || !formData.address.trim() || !formData.phone.trim() || isPaymentIncomplete;

                      return (
                        <motion.button
                          onClick={handlePlaceOrder}
                          disabled={isDisabled}
                          className={`w-full py-4 font-bold rounded-full transition-all flex items-center justify-center gap-3 font-arabic ${isRTL ? 'flex-row-reverse' : ''}`}
                          style={{
                            background: isDisabled ? '#EDE5D4' : '#23432E',
                            color: isDisabled ? '#777363' : '#FFFDF7',
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            boxShadow: isDisabled ? 'none' : '0 8px 20px rgba(35,67,46,0.25)'
                          }}
                          whileTap={isDisabled ? {} : { scale: 0.98 }}
                        >
                          {createOrder.isPending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <span>{isRTL ? 'تأكيد وإرسال الطلب' : 'Place Order'}</span>
                              <ShoppingBag size={18} />
                            </>
                          )}
                        </motion.button>
                      );
                    })()}
                    <button
                      onClick={() => setStep('cart')}
                      className="w-full py-3 rounded-full font-bold font-arabic text-sm transition-all"
                      style={{
                        background: 'transparent',
                        border: '1px solid #D6C6A8',
                        color: '#263A2C'
                      }}
                    >
                      {isRTL ? 'العودة لتعديل السلة' : 'Back to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 'confirmation' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-6 max-w-lg mx-auto rounded-3xl"
              style={{
                background: '#FFFDF7',
                border: '1px solid #D6C6A8',
                boxShadow: '0 20px 60px rgba(35,67,46,0.08)'
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(35,67,46,0.1)', color: '#23432E' }}
              >
                <CheckCircle size={44} />
              </div>
              <h1 className="text-3xl font-black mb-3 font-arabic" style={{ color: '#23432E' }}>
                {isRTL ? 'تم استلام طلبكم بنجاح' : 'Order Received Successfully!'}
              </h1>
              <p className="text-base mb-4 font-arabic leading-relaxed" style={{ color: '#777363' }}>
                {isRTL
                  ? 'شكراً لثقتكم بدار الرحاب. سيقوم فريقنا بمراجعة تفاصيل التحويل والتواصل معكم لتسليم إصداراتكم.'
                  : 'Thank you for choosing Dar Al-Rehab. Our team will verify your transfer and arrange prompt delivery.'}
              </p>
              {orderId && (
                <div className="inline-block px-4 py-2 rounded-xl mb-8 font-mono text-xs font-bold" style={{ background: '#EDE5D4', color: '#23432E' }}>
                  {isRTL ? `رقم الطلب: ${orderId.slice(0, 8).toUpperCase()}` : `Order #${orderId.slice(0, 8).toUpperCase()}`}
                </div>
              )}
              <div className={`flex flex-col sm:flex-row gap-3 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <Link href="/my-orders">
                  <button
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold font-arabic transition-all"
                    style={{ background: '#23432E', color: '#FFFDF7' }}
                  >
                    {isRTL ? 'متابعة حالة الطلب' : 'Track My Orders'}
                  </button>
                </Link>
                <Link href="/store">
                  <button
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold font-arabic transition-all"
                    style={{ background: '#EDE5D4', color: '#23432E', border: '1px solid #D6C6A8' }}
                  >
                    {isRTL ? 'تصفح المزيد من الكتب' : 'Continue Browsing'}
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
