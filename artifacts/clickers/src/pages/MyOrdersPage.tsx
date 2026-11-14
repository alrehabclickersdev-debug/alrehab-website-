import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/useAuth';
import { useMyOrders } from '@/services/supabase.hooks';
import { useLanguage } from '@/i18n/LanguageContext';

const STATUS_CONFIG = {
  pending: { label: 'Pending', labelAr: 'قيد الانتظار والمراجعة', icon: Clock, color: '#B49A63', bg: '#EDE5D4' },
  paid: { label: 'Confirmed', labelAr: 'تم تأكيد الدفع', icon: CheckCircle, color: '#23432E', bg: 'rgba(35,67,46,0.1)' },
  delivered: { label: 'Delivered', labelAr: 'تم التسليم للقارئ', icon: Package, color: '#23432E', bg: 'rgba(35,67,46,0.1)' },
  cancelled: { label: 'Cancelled', labelAr: 'طلب ملغي', icon: XCircle, color: '#DC2626', bg: '#FEF2F2' },
} as const;

export function MyOrdersPage() {
  const { profile } = useAuth();
  const { isRTL, t } = useLanguage();
  const { data: orders, isLoading } = useMyOrders(profile?.id);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 pb-32" style={{ background: '#F5F0E3' }}>
        <div className="text-center p-10 rounded-3xl max-w-md mx-4" style={{ background: '#FFFDF7', border: '1px solid #D6C6A8' }}>
          <ShoppingBag size={56} className="mx-auto mb-4" style={{ color: '#B49A63' }} />
          <p className="font-bold text-xl mb-6 font-arabic" style={{ color: '#23432E' }}>
            {isRTL ? 'يُرجى تسجيل الدخول لعرض أرشيف طلباتك' : 'Sign in to view your orders'}
          </p>
          <Link href="/auth">
            <button
              className="px-8 py-3.5 rounded-full font-bold font-arabic transition-all shadow-md"
              style={{ background: '#23432E', color: '#FFFDF7' }}
            >
              {isRTL ? 'تسجيل الدخول' : 'Sign In'}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-32" style={{ background: '#F5F0E3' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className={`mb-10 ${isRTL ? 'text-right' : ''}`}>
            <p className="font-bold uppercase tracking-[0.3em] text-xs mb-2 font-arabic" style={{ color: '#B49A63' }}>
              {isRTL ? 'سجل القارئ' : 'My Account'}
            </p>
            <h1 className="text-4xl md:text-5xl font-black font-arabic" style={{ color: '#23432E' }}>
              {isRTL ? 'أرشيف طلباتي' : 'My Orders'}
            </h1>
          </div>

          {/* Delivery Note */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mb-10 p-6 rounded-3xl flex flex-col sm:flex-row items-center sm:items-start gap-5 ${isRTL ? 'sm:flex-row-reverse text-center sm:text-right' : 'text-center sm:text-left'}`}
            style={{
              background: '#FFFDF7',
              border: '1px solid #D6C6A8',
              boxShadow: '0 4px 20px rgba(35,67,46,0.04)'
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: '#23432E', color: '#B49A63' }}
            >
              <Package size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1 font-arabic" style={{ color: '#23432E' }}>
                {isRTL ? 'معلومات الشحن والتوصيل' : 'Delivery Information'}
              </h3>
              <p className="font-arabic text-sm leading-relaxed" style={{ color: '#777363' }}>
                {isRTL
                  ? 'شكراً لثقتكم بدار الرحاب. مدة التوصيل القياسية لكافة المحافظات تتم خلال ٣ إلى ٥ أيام عمل كحد أقصى بعناية فائقة وتغليف مكتبي أنيق.'
                  : 'Thank you for your trust. Standard delivery takes 3 to 5 business days with premium editorial packaging.'}
              </p>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-3xl p-8 animate-pulse h-32" style={{ background: '#FFFDF7', border: '1px solid #D6C6A8' }} />
              ))}
            </div>
          ) : !orders?.length ? (
            <div className="text-center py-20 px-6 rounded-3xl" style={{ background: '#FFFDF7', border: '1px solid #D6C6A8' }}>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: '#EDE5D4', color: '#B49A63' }}
              >
                <ShoppingBag size={36} />
              </div>
              <p className="font-bold text-xl mb-4 font-arabic" style={{ color: '#23432E' }}>
                {isRTL ? 'لا توجد طلبات سابقة في سجلك حتى الآن' : 'No orders found yet'}
              </p>
              <p className="text-sm mb-6 font-arabic" style={{ color: '#777363' }}>
                {isRTL ? 'اكتشف مجموعتنا المختارة من الكتب والإصدارات الفكرية والأدبية.' : 'Explore our curated collection of literary works.'}
              </p>
              <Link href="/store">
                <button
                  className="px-8 py-3.5 rounded-full font-bold font-arabic transition-all shadow-md"
                  style={{ background: '#23432E', color: '#FFFDF7' }}
                >
                  {isRTL ? 'تصفح الإصدارات' : 'Browse Store'}
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, i) => {
                const status = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                const StatusIcon = status.icon;
                const orderItems = (order as Record<string, unknown> & { order_items?: Array<{ books?: { title_ar: string; title_en: string; cover_url?: string }; quantity: number; unit_price: number }> }).order_items ?? [];

                return (
                  <motion.div
                    key={order.id}
                    className="rounded-3xl overflow-hidden transition-all"
                    style={{
                      background: '#FFFDF7',
                      border: '1px solid #D6C6A8',
                      boxShadow: '0 4px 20px rgba(35,67,46,0.04)'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    {/* Order Header */}
                    <div className={`flex items-center justify-between p-6 border-b ${isRTL ? 'flex-row-reverse' : ''}`} style={{ borderColor: '#EDE5D4' }}>
                      <div className={isRTL ? 'text-right' : ''}>
                        <p className="font-mono text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#B49A63' }}>
                          {isRTL ? 'طلب رقم' : 'Order'} #{(order.id as string).slice(0, 8).toUpperCase()}
                        </p>
                        <p className="font-bold text-xs" style={{ color: '#777363' }}>
                          {format(new Date(order.created_at), 'dd MMMM yyyy — HH:mm')}
                        </p>
                      </div>
                      <div
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold text-xs font-arabic"
                        style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}30` }}
                      >
                        <StatusIcon size={14} />
                        <span>{isRTL ? status.labelAr : status.label}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-3 mb-6">
                        {orderItems.slice(0, 3).map((item, j) => (
                          <div key={j} className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {item.books?.cover_url && (
                              <img src={item.books.cover_url} alt="" className="w-12 h-16 object-cover rounded-lg shadow-sm flex-shrink-0" style={{ border: '1px solid #D6C6A8' }} />
                            )}
                            <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                              <p className="font-bold text-sm font-arabic" style={{ color: '#23432E' }}>
                                {isRTL ? item.books?.title_ar : item.books?.title_en}
                              </p>
                              <p className="text-xs font-arabic mt-0.5" style={{ color: '#777363' }}>
                                {item.quantity} × {(item.unit_price).toFixed(2)} {t.common.currency}
                              </p>
                            </div>
                          </div>
                        ))}
                        {orderItems.length > 3 && (
                          <p className="text-xs font-bold font-arabic" style={{ color: '#B49A63' }}>
                            +{orderItems.length - 3} {isRTL ? 'كتب أخرى ضمن الشحنة' : 'more items in this order'}
                          </p>
                        )}
                      </div>

                      <div className={`flex items-center justify-between pt-4 border-t ${isRTL ? 'flex-row-reverse' : ''}`} style={{ borderColor: '#EDE5D4' }}>
                        <span className="font-bold text-sm font-arabic" style={{ color: '#777363' }}>
                          {isRTL ? 'المجموع الكلي' : 'Total'}
                        </span>
                        <span className="font-black text-xl" style={{ color: '#23432E' }}>
                          {Number(order.total_amount).toFixed(2)} <span className="text-xs font-normal" style={{ color: '#777363' }}>{t.common.currency}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
