import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Clock, Tag, Zap, Sparkles } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { useLanguage } from '@/i18n/LanguageContext';
import { offers } from '@/services/mock/offers';
import { getBookById } from '@/services/mock/books';

function Countdown({ endDate }: { endDate: string }) {
  const { t, isRTL } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const units = [
    { value: timeLeft.days, label: isRTL ? 'يوم' : 'Days' },
    { value: timeLeft.hours, label: isRTL ? 'ساعة' : 'Hours' },
    { value: timeLeft.minutes, label: isRTL ? 'دقيقة' : 'Mins' },
    { value: timeLeft.seconds, label: isRTL ? 'ثانية' : 'Secs' },
  ];

  return (
    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="text-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono"
              style={{ background: '#EDE5D4', color: '#23432E', border: '1px solid #D6C6A8' }}
            >
              {String(value).padStart(2, '0')}
            </div>
            <p className="text-[10px] font-bold font-arabic mt-1" style={{ color: '#777363' }}>{label}</p>
          </div>
          {i < 3 && <span className="font-bold mb-4" style={{ color: '#B49A63' }}>:</span>}
        </div>
      ))}
    </div>
  );
}

export function OffersPage() {
  const { t, isRTL, language } = useLanguage();

  const typeIcons = {
    bundle: Tag,
    seasonal: Clock,
    flash: Zap,
    launch: Sparkles,
  };

  return (
    <div className="min-h-screen pt-32 pb-24" style={{ background: '#F5F0E3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: '#B49A63' }} />
            <span className="font-bold uppercase tracking-[0.3em] text-xs font-arabic" style={{ color: '#B49A63' }}>
              {isRTL ? 'باقات وحزم حصرية' : 'Exclusive Deals'}
            </span>
            <div className="h-px w-8" style={{ background: '#B49A63' }} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-arabic mb-4" style={{ color: '#23432E' }}>
            {isRTL ? 'عروض وإصدارات خاصة' : 'Special Offers'}
          </h1>
          <p className="text-base md:text-lg font-arabic max-w-2xl mx-auto leading-relaxed" style={{ color: '#777363' }}>
            {isRTL
              ? 'اقتنِ باقاتك المفضلة من إصدارات دار الرحاب بأسعار تشجيعية وتوصيل مميز.'
              : 'Discover curated bundles and special publishing packages.'}
          </p>
        </div>

        <div className="space-y-8">
          {offers.map((offer, i) => {
            const Icon = typeIcons[offer.type as keyof typeof typeIcons] || Tag;
            const offerBooks = offer.bookIds?.map(getBookById).filter(Boolean) || [];

            return (
              <motion.div
                key={offer.id}
                className="rounded-3xl overflow-hidden transition-all duration-300"
                style={{
                  background: '#FFFDF7',
                  border: '1px solid #D6C6A8',
                  boxShadow: '0 8px 30px rgba(35,67,46,0.06)'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                data-testid={`offer-${offer.id}`}
              >
                {/* Banner */}
                <div className="relative h-48 md:h-60 overflow-hidden">
                  <img
                    src={offer.bannerUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: isRTL
                        ? 'linear-gradient(to left, rgba(255,253,247,0.96) 0%, rgba(255,253,247,0.85) 50%, rgba(255,253,247,0.3) 100%)'
                        : 'linear-gradient(to right, rgba(255,253,247,0.96) 0%, rgba(255,253,247,0.85) 50%, rgba(255,253,247,0.3) 100%)'
                    }}
                  />

                  <div className={`absolute inset-0 flex flex-col justify-center p-6 md:p-10 ${isRTL ? 'text-right items-end' : ''}`}>
                    <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-arabic"
                        style={{ background: '#23432E', color: '#FFFDF7' }}
                      >
                        <Icon size={12} style={{ color: '#B49A63' }} />
                        {offer.type === 'flash' ? (language === 'ar' ? 'عرض فوري' : 'Flash Sale') :
                         offer.type === 'bundle' ? (language === 'ar' ? 'حزمة كتب' : 'Curated Bundle') :
                         offer.type === 'launch' ? (language === 'ar' ? 'تدشين حصري' : 'New Launch') :
                         (language === 'ar' ? 'عرض موسمي' : 'Seasonal')}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold font-mono"
                        style={{ background: '#EDE5D4', color: '#23432E', border: '1px solid #D6C6A8' }}
                      >
                        خصم {offer.discountPercent}%
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black mb-2 font-arabic" style={{ color: '#23432E' }}>
                      {language === 'ar' ? offer.titleAr : offer.titleEn}
                    </h3>
                    <p className="text-sm md:text-base mb-4 max-w-xl font-arabic line-clamp-2" style={{ color: '#777363' }}>
                      {language === 'ar' ? offer.descriptionAr : offer.descriptionEn}
                    </p>

                    <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-2 text-xs font-bold font-arabic ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: '#23432E' }}>
                        <Clock size={14} style={{ color: '#B49A63' }} />
                        <span>ينتهي خلال:</span>
                        <Countdown endDate={offer.endDate} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 md:p-8 border-t" style={{ borderColor: '#EDE5D4' }}>
                  <div className={`flex flex-wrap items-center justify-between gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {offer.code && (
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm font-bold font-arabic" style={{ color: '#777363' }}>
                          {language === 'ar' ? 'كود الخصم المعتمد:' : 'Promo Code:'}
                        </span>
                        <span
                          className="px-4 py-2 font-mono font-bold text-sm rounded-xl tracking-wider"
                          style={{ background: '#EDE5D4', color: '#23432E', border: '1px solid #D6C6A8' }}
                        >
                          {offer.code}
                        </span>
                      </div>
                    )}
                    <Link href="/store">
                      <motion.button
                        className="px-7 py-3 rounded-full font-bold font-arabic text-sm shadow-md transition-all"
                        style={{ background: '#23432E', color: '#FFFDF7' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        data-testid={`claim-offer-${offer.id}`}
                      >
                        {isRTL ? 'استفد من العرض وتصفح' : 'Claim Offer'}
                      </motion.button>
                    </Link>
                  </div>

                  {offerBooks.length > 0 && (
                    <div>
                      <p className={`text-xs font-bold font-arabic uppercase tracking-wider mb-4 ${isRTL ? 'text-right' : ''}`} style={{ color: '#B49A63' }}>
                        {isRTL ? 'الكتب المشمولة ضمن هذا العرض:' : 'Included Publications:'}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {offerBooks.map((book, bi) => book && (
                          <BookCard key={book.id} book={book} index={bi} variant="compact" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
