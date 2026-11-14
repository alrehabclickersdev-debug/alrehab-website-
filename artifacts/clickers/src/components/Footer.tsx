import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { Mail, Phone, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export function Footer() {
  const { isRTL } = useLanguage();

  return (
    <footer
      className="relative text-[#FFFDF7] overflow-hidden"
      style={{
        backgroundColor: '#193A28',
        borderTop: '2px solid #B49A63',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Decorative Botanical & Gold Glow in Background */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-10 blur-3xl"
        style={{ background: '#B49A63' }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none opacity-10 blur-3xl"
        style={{ background: '#23432E' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 font-arabic">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

          {/* ── Brand Col (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Logo */}
              <Link href="/">
                <div className="flex items-center gap-3.5 mb-6 cursor-pointer w-fit group">
                  <img
                    src="/logo.png"
                    alt="دار الرحاب للنشر والتوزيع"
                    className="w-12 h-12 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300 border border-[#B49A63]/70 p-0.5 bg-[#23432E]"
                  />
                  <div className="flex flex-col">
                    <span className="font-arabic font-extrabold text-2xl text-[#FFFDF7] leading-none">
                      دار الرحاب
                    </span>
                    <span className="font-arabic text-xs font-bold text-[#B49A63] tracking-widest mt-1">
                      {isRTL ? 'للنشر والتوزيع' : 'Publishing & Distribution'}
                    </span>
                  </div>
                </div>
              </Link>

              <p className="text-sm leading-relaxed text-[#D6C6A8] max-w-md mb-8">
                {isRTL
                  ? 'من رحاب الفكرة... إلى خلود الحكاية. نمنح الكلمات بيتاً والأفكار طريقاً إلى القارئ، مع التزام تام بالتميز التحريري والجمالي في صناعة الكتاب العربي.'
                  : 'From the space of an idea to the eternity of a story. Providing ideas a home and stories an enduring path to readers with utmost editorial distinction.'}
              </p>

              {/* Contact Mini List */}
              <div className="space-y-2.5 text-xs text-[#D6C6A8]">
                <div className="flex items-center gap-3">
                  <Mail size={15} className="text-[#B49A63] flex-shrink-0" />
                  <span>contact@alrehab-publishing.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-[#B49A63] flex-shrink-0" />
                  <span dir="ltr">+20 100 000 0000</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={15} className="text-[#B49A63] flex-shrink-0" />
                  <span>{isRTL ? 'القاهرة — المعادي / الرياض — حي العليا' : 'Cairo / Riyadh'}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-8">
              {[
                { icon: FaTwitter, href: '#', label: 'Twitter' },
                { icon: FaInstagram, href: '#', label: 'Instagram' },
                { icon: FaFacebookF, href: '#', label: 'Facebook' },
                { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
                { icon: FaYoutube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 border border-[#B49A63]/30 bg-[#23432E] text-[#B49A63] hover:text-[#FFFDF7] hover:border-[#B49A63]"
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={label}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* ── Quick Links (3 cols) ── */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-[#B49A63] uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B49A63]" />
              <span>{isRTL ? 'أقسام الدار' : 'Navigation'}</span>
            </h4>
            <ul className="space-y-3.5 text-sm text-[#D6C6A8]">
              {[
                { href: '/', label: isRTL ? 'الرئيسية' : 'Home' },
                { href: '/store', label: isRTL ? 'أحدث الإصدارات' : 'Latest Releases' },
                { href: '/about', label: isRTL ? 'عن دار الرحاب' : 'About Dar Al-Rehab' },
                { href: '/authors', label: isRTL ? 'مؤلفو الدار' : 'Authors' },
                { href: '/blog', label: isRTL ? 'الأخبار والفعاليات' : 'News & Events' },
                { href: '/auth', label: isRTL ? 'انشر كتابك معنا' : 'Publish With Us' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="hover:text-[#FFFDF7] hover:translate-x-1 transition-all inline-block cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Newsletter & Support (4 cols) ── */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-bold text-[#B49A63] uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B49A63]" />
              <span>{isRTL ? 'النشرة الأدبية' : 'Literary Gazette'}</span>
            </h4>
            <p className="text-sm text-[#D6C6A8] leading-relaxed mb-5">
              {isRTL
                ? 'انضم إلى رواد دار الرحاب وكن أول من يطلع على إصداراتنا الحصرية وفعاليات توقيع الكتب.'
                : 'Subscribe to receive the latest releases, author dialogues, and literary event updates.'}
            </p>
            
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2 mb-6">
              <input
                type="email"
                placeholder={isRTL ? 'بريدك الإلكتروني...' : 'Your email address...'}
                className="px-4 py-3 rounded-full bg-[#23432E] border border-[#D6C6A8]/40 text-[#FFFDF7] placeholder-[#D6C6A8]/60 text-xs focus:outline-none focus:border-[#B49A63] flex-1"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#B49A63] text-[#193A28] font-bold text-xs hover:bg-[#C5AD7D] transition-colors flex items-center justify-center gap-1.5 flex-shrink-0"
              >
                <span>{isRTL ? 'اشتراك' : 'Join'}</span>
                {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
              </button>
            </form>

            <div className="p-4 rounded-2xl bg-[#23432E]/60 border border-[#D6C6A8]/20 text-xs text-[#D6C6A8] leading-relaxed">
              <span className="text-[#B49A63] font-bold block mb-1">
                {isRTL ? '✦ معايير النشر الرفيعة' : '✦ Refined Standards'}
              </span>
              {isRTL
                ? 'تخضع جميع المخطوطات للجنة تحكيم متخصصة لضمان جودة المحتوى وقيمته الفكرية والأدبية.'
                : 'All manuscripts undergo specialized editorial review to ensure intellectual and artistic excellence.'}
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 border-t border-[#D6C6A8]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D6C6A8]">
          <p>
            {isRTL
              ? '© 2026 دار الرحاب للنشر والتوزيع. جميع الحقوق محفوظة.'
              : '© 2026 Dar Al-Rehab Publishing House. All rights reserved.'}
          </p>
          <div className="flex gap-6">
            <Link href="/about">
              <span className="hover:text-[#FFFDF7] cursor-pointer">
                {isRTL ? 'سياسة النشر والخصوصية' : 'Publishing & Privacy Policy'}
              </span>
            </Link>
            <Link href="/about#contact">
              <span className="hover:text-[#FFFDF7] cursor-pointer">
                {isRTL ? 'شروط الخدمة' : 'Terms of Service'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
