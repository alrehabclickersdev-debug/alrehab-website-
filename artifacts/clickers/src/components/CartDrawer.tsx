import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/i18n/LanguageContext';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const { isRTL, t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-[#193A28]/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-[#FFFDF7] border-${isRTL ? 'r' : 'l'} border-[#D6C6A8] shadow-2xl z-50 flex flex-col font-arabic text-[#263A2C]`}
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#D6C6A8] bg-[#EDE5D4]/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#23432E] text-[#B49A63] flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <h2 className="font-extrabold text-[#23432E] text-lg">
                  {isRTL ? 'سلة المقتنيات' : 'Your Book Cart'}
                </h2>
                {totalItems > 0 && (
                  <span className="w-5 h-5 bg-[#B49A63] text-[#193A28] rounded-full flex items-center justify-center text-xs font-bold">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full border border-[#D6C6A8] flex items-center justify-center text-[#777363] hover:text-[#23432E] hover:border-[#B49A63] transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#F5F0E3]/40">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="w-16 h-16 bg-[#EDE5D4] rounded-full flex items-center justify-center mb-4 text-[#B49A63]">
                    <ShoppingBag size={28} />
                  </div>
                  <p className="text-[#23432E] font-bold text-base mb-1">
                    {isRTL ? 'سلتك فارغة حالياً' : 'Your cart is empty'}
                  </p>
                  <p className="text-[#777363] text-xs max-w-xs mb-6">
                    {isRTL ? 'اختر من إصدارات دار الرحاب المميزة لتضيفها إلى سلتك.' : 'Discover our curated editions to add to your library.'}
                  </p>
                  <Link href="/store">
                    <button
                      onClick={closeCart}
                      className="px-6 py-3 bg-[#23432E] text-[#FFFDF7] font-bold rounded-full hover:bg-[#193A28] text-xs transition-all shadow-sm"
                    >
                      {isRTL ? 'تصفح الإصدارات' : 'Explore Books'}
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.bookId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      exit={{ opacity: 0, x: -30 }}
                      className="bg-[#FFFDF7] rounded-2xl p-4 border border-[#D6C6A8] shadow-sm"
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.coverUrl}
                          alt={item.title}
                          className="w-16 h-20 object-cover rounded-xl flex-shrink-0 shadow-sm bg-[#EDE5D4]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#23432E] text-sm line-clamp-2 mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs font-black text-[#B49A63] mb-3">
                            {item.price} {t.common.currency}
                          </p>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1.5 bg-[#EDE5D4] rounded-full p-1 border border-[#D6C6A8]/60">
                              <button
                                onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#FFFDF7] text-[#23432E] transition-all"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-[#23432E] font-bold text-xs w-5 text-center select-none">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#FFFDF7] text-[#23432E] transition-all"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.bookId)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#D6C6A8] bg-[#FFFDF7]">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[#777363] font-bold text-xs">
                    {isRTL ? 'إجمالي المشتريات' : 'Order Total'}
                  </span>
                  <span className="text-[#23432E] font-extrabold text-2xl">
                    {totalPrice.toFixed(2)}{' '}
                    <span className="text-sm font-bold text-[#B49A63]">{t.common.currency}</span>
                  </span>
                </div>
                <Link href="/checkout">
                  <motion.button
                    onClick={closeCart}
                    className="w-full py-4 bg-[#23432E] text-[#FFFDF7] font-bold rounded-full shadow-lg hover:bg-[#193A28] transition-all flex items-center justify-center gap-2 text-sm"
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{isRTL ? 'متابعة الشراء وإتمام الطلب' : 'Proceed to Checkout'}</span>
                    {isRTL ? <ArrowLeft size={16} className="text-[#B49A63]" /> : <ArrowRight size={16} className="text-[#B49A63]" />}
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
