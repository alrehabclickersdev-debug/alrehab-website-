import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard, Compass, ChevronDown, User } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/contexts/useAuth';
import { useCart } from '@/contexts/CartContext';

// ── NAV LINK CONFIG ──────────────────────────────────────────────
const NAV_LINKS_AR = [
  { href: '/', label: 'الرئيسية' },
  { href: '/store', label: 'إصداراتنا' },
  { href: '/about', label: 'عن دار الرحاب' },
  { href: '/authors', label: 'المؤلفون' },
  { href: '/blog', label: 'الأخبار والمقالات' },
  { href: '/about#contact', label: 'تواصل معنا' },
];

const NAV_LINKS_EN = [
  { href: '/', label: 'Home' },
  { href: '/store', label: 'Publications' },
  { href: '/about', label: 'About Us' },
  { href: '/authors', label: 'Authors' },
  { href: '/blog', label: 'News & Articles' },
  { href: '/about#contact', label: 'Contact' },
];

export function Navbar() {
  const { isRTL, toggleLanguage } = useLanguage();
  const { profile, isAdmin, signOut } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [location] = useLocation();

  const navLinks = isRTL ? NAV_LINKS_AR : NAV_LINKS_EN;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const close = () => setShowUserMenu(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: isScrolled ? 'rgba(245, 240, 227, 0.94)' : 'rgba(245, 240, 227, 0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: isScrolled ? '1px solid rgba(214, 198, 168, 0.8)' : '1px solid rgba(214, 198, 168, 0.35)',
          boxShadow: isScrolled ? '0 4px 20px -2px rgba(35, 67, 46, 0.05)' : 'none',
        }}
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">

            {/* ── Brand Logo ── */}
            <Link href="/">
              <motion.div
                className={`flex items-center gap-3 cursor-pointer flex-shrink-0 ${isRTL ? 'flex-row' : ''}`}
                whileHover={{ scale: 1.02 }}
                data-testid="nav-logo"
              >
                {/* Emblem */}
                <img
                  src="/logo.png"
                  alt="دار الرحاب للنشر والتوزيع"
                  className="w-11 h-11 rounded-2xl object-cover shadow-sm flex-shrink-0 border border-[#B49A63]/60 p-0.5 bg-[#23432E]"
                />

                {/* Typography */}
                <div className={`flex flex-col leading-none ${isRTL ? 'text-right' : 'text-left'}`}>
                  <span className="font-arabic font-extrabold text-xl md:text-2xl text-[#23432E] tracking-tight">
                    دار الرحاب
                  </span>
                  <span className="font-arabic text-[11px] font-bold text-[#B49A63] tracking-widest mt-1">
                    {isRTL ? 'للنشر والتوزيع' : 'Publishing & Distribution'}
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* ── Centered Desktop Navigation Links ── */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2 justify-center">
              {navLinks.map((link) => {
                const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
                return (
                  <Link key={link.label} href={link.href}>
                    <motion.span
                      className={`relative px-4 py-2 text-sm font-semibold cursor-pointer transition-colors duration-200 font-arabic whitespace-nowrap ${
                        isActive ? 'text-[#23432E] font-bold' : 'text-[#777363] hover:text-[#23432E]'
                      }`}
                      data-testid={`nav-link-${link.label}`}
                    >
                      {link.label}
                      {/* Active delicate antique-gold underline */}
                      {isActive && (
                        <motion.div
                          layoutId="nav-active-indicator"
                          className="absolute -bottom-1 left-3 right-3 h-[2px] rounded-full"
                          style={{ backgroundColor: '#B49A63' }}
                        />
                      )}
                    </motion.span>
                  </Link>
                );
              })}
            </div>

            {/* ── Left Controls (Actions) ── */}
            <div className={`flex items-center gap-3 flex-shrink-0 ${isRTL ? 'mr-0' : 'ml-0'}`}>

              {/* Browse CTA Button */}
              <Link href="/store">
                <motion.span
                  className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer font-arabic shadow-sm"
                  style={{
                    backgroundColor: '#23432E',
                    color: '#FFFDF7',
                  }}
                  whileHover={{ backgroundColor: '#193A28', y: -1, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Compass size={14} className="text-[#B49A63]" />
                  <span>{isRTL ? 'تصفح الكتب' : 'Explore Books'}</span>
                </motion.span>
              </Link>

              {/* Shopping Cart Button */}
              <motion.button
                className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all border border-[#D6C6A8] hover:border-[#B49A63] bg-[#FFFDF7] text-[#263A2C]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCart}
                data-testid="cart-button"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-black rounded-full flex items-center justify-center text-[#193A28] shadow-sm"
                    style={{ backgroundColor: '#B49A63' }}
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </motion.button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="hidden sm:flex text-xs font-bold px-3 py-1.5 rounded-full border border-[#D6C6A8] text-[#777363] hover:text-[#23432E] hover:border-[#B49A63] bg-[#FFFDF7] transition-all"
              >
                {isRTL ? 'EN' : 'عربي'}
              </button>

              {/* User Authentication Menu */}
              {profile ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserMenu(!showUserMenu);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D6C6A8] bg-[#FFFDF7] text-[#263A2C] text-xs font-bold hover:border-[#B49A63] transition-all"
                  >
                    <User size={14} className="text-[#B49A63]" />
                    <span className="max-w-[80px] truncate">{profile.full_name || 'حسابي'}</span>
                    <ChevronDown size={12} className="text-[#777363]" />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute left-0 mt-2 w-48 rounded-2xl bg-[#FFFDF7] border border-[#D6C6A8] shadow-xl p-2 z-50 text-right font-arabic"
                      >
                        {isAdmin && (
                          <Link href="/admin">
                            <span className="flex items-center justify-between px-3 py-2 text-xs font-bold text-[#23432E] hover:bg-[#EDE5D4] rounded-xl cursor-pointer">
                              <span>لوحة التحكم</span>
                              <LayoutDashboard size={14} className="text-[#B49A63]" />
                            </span>
                          </Link>
                        )}
                        <Link href="/my-orders">
                          <span className="block px-3 py-2 text-xs text-[#263A2C] hover:bg-[#EDE5D4] rounded-xl cursor-pointer">
                            طلباتي
                          </span>
                        </Link>
                        <hr className="my-1 border-[#D6C6A8]/50" />
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 rounded-xl"
                        >
                          <span>تسجيل الخروج</span>
                          <LogOut size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/auth">
                  <span className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-[#23432E] hover:text-[#B49A63] cursor-pointer font-arabic transition-colors">
                    {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                  </span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#23432E] hover:bg-[#EDE5D4] transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

            </div>

          </div>
        </div>

        {/* ── Mobile Menu Dropdown ── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-[#FFFDF7] border-b border-[#D6C6A8] px-6 py-6 shadow-xl font-arabic"
            >
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link key={link.label} href={link.href}>
                    <span
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-2.5 text-base font-semibold border-b border-[#D6C6A8]/40 ${
                        location === link.href ? 'text-[#23432E] font-bold' : 'text-[#777363]'
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}

                <div className="pt-4 flex flex-col gap-3">
                  <Link href="/store">
                    <span
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold bg-[#23432E] text-[#FFFDF7]"
                    >
                      <Compass size={16} className="text-[#B49A63]" />
                      <span>{isRTL ? 'تصفح جميع الكتب' : 'Explore Books'}</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      toggleLanguage();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-full border border-[#D6C6A8] text-sm font-bold text-[#777363]"
                  >
                    {isRTL ? 'English Version' : 'النسخة العربية'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
