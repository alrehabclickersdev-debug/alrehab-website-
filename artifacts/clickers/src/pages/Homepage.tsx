import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Feather, 
  Compass, 
  Award, 
  Scroll, 
  ArrowLeft, 
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useBooks, useAuthors } from '@/services/supabase.hooks';
import { SEO } from '@/components/SEO';

// ─── 1. HERO SECTION ──────────────────────────────────────────────────────────
function HeroSection() {
  const { isRTL } = useLanguage();

  return (
    <section 
      className="relative min-h-[90vh] lg:min-h-[96vh] flex items-center pt-28 pb-20 overflow-hidden bg-[#F5F0E3] bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/alrehab-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      {/* Subtle overlay for mobile contrast if needed */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#F5F0E3]/70 via-transparent to-transparent lg:hidden pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[60vh]">
          
          {/* Spacer for the Left Side where the 3D Books & Pedestal live in the background image */}
          <div className="hidden lg:block lg:col-span-6" />

          {/* Right Side: Interactive Action Area (aligned with the text in the background) */}
          <motion.div
            className={`lg:col-span-6 flex flex-col ${isRTL ? 'text-right items-start' : 'text-left items-start'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Mobile-only visible headline (since on small screens background text may be covered or small) */}
            <div className="block lg:hidden mb-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EDE5D4]/90 border border-[#B49A63]/50 mb-4 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#B49A63] animate-pulse" />
                <span className="font-arabic text-xs font-bold text-[#B49A63] tracking-wider">
                  {isRTL ? 'دار الرحاب للنشر والتوزيع' : 'Dar Al-Rehab Publishing House'}
                </span>
              </div>

              <h1 className="font-arabic font-extrabold text-4xl sm:text-5xl text-[#23432E] leading-[1.25] tracking-tight mb-4">
                <span className="block">
                  {isRTL ? 'من رحاب الفكرة...' : 'From the Realm of an Idea...'}
                </span>
                <span className="block text-[#B49A63] mt-2 font-serif italic">
                  {isRTL ? 'إلى خلود الحكاية' : 'To the Eternity of a Story'}
                </span>
              </h1>

              <p className="font-arabic text-base sm:text-lg text-[#263A2C]/80 leading-relaxed mb-6">
                {isRTL
                  ? 'نمنح الكلمات بيتاً، والأفكار طريقاً إلى القارئ. دار نشر أدبية عريقة تحتفي بجوهر الفكر، وسحر السرد، وبراعة الإبداع العربي.'
                  : 'Providing words a sanctuary, and ideas an enduring path to the reader.'}
              </p>
            </div>

            {/* Desktop Semantic Heading for SEO & Screen Readers */}
            <h1 className="sr-only">
              {isRTL ? 'دار الرحاب للنشر والتوزيع — من رحاب الفكرة إلى خلود الحكاية' : 'Dar Al-Rehab Publishing — From Idea to Story'}
            </h1>

            {/* Desktop spacer to push buttons right below the background graphic text */}
            <div className="hidden lg:block h-64 xl:h-72" />

            {/* CTA Buttons */}
            <div className={`flex flex-wrap items-center gap-4 ${isRTL ? 'flex-row' : ''}`}>
              <Link href="/store">
                <motion.span
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-arabic font-bold text-sm bg-[#23432E] text-[#FFFDF7] shadow-xl shadow-[#23432E]/25 hover:bg-[#193A28] cursor-pointer transition-all border border-[#B49A63]/30"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>{isRTL ? 'اكتشف إصداراتنا' : 'Explore Publications'}</span>
                  {isRTL ? <ArrowLeft size={16} className="text-[#B49A63]" /> : <ArrowRight size={16} className="text-[#B49A63]" />}
                </motion.span>
              </Link>

              <Link href="/about">
                <motion.span
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-arabic font-bold text-sm text-[#23432E] bg-[#FFFDF7]/80 backdrop-blur-md border border-[#B49A63]/60 hover:bg-[#EDE5D4] cursor-pointer transition-all shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Scroll size={16} className="text-[#B49A63]" />
                  <span>{isRTL ? 'تعرف على دار الرحاب' : 'About Dar Al-Rehab'}</span>
                </motion.span>
              </Link>
            </div>

            {/* Editorial Mini Credo */}
            <div className="mt-8 pt-5 border-t border-[#D6C6A8]/60 flex flex-wrap items-center gap-6 text-xs text-[#263A2C] font-arabic font-bold">
              <div className="flex items-center gap-2 bg-[#FFFDF7]/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#D6C6A8]/40 shadow-xs">
                <CheckCircle2 size={15} className="text-[#B49A63]" />
                <span>{isRTL ? 'طباعة فاخرة ومستدامة' : 'Fine Sustainable Printing'}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FFFDF7]/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#D6C6A8]/40 shadow-xs">
                <CheckCircle2 size={15} className="text-[#B49A63]" />
                <span>{isRTL ? 'تحكيم أدبي وفكري دقيق' : 'Rigorous Editorial Review'}</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─── 2. BRAND VALUES SECTION ──────────────────────────────────────────────────
function BrandValuesSection() {
  const { isRTL } = useLanguage();

  const values = [
    {
      title: isRTL ? 'إصدارات منتقاة' : 'Curated Publications',
      desc: isRTL ? 'نختار لكم أجود الأعمال الأدبية والفكرية والكلاسيكية بعناية فائقة.' : 'Meticulously selecting the finest literary, intellectual, and classic titles.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      title: isRTL ? 'رعاية الكلمة' : 'Guardianship of the Word',
      desc: isRTL ? 'نؤمن بقوة الكلمة في صناعة مستقبل أفضل وإثراء العقل الإنساني.' : 'Believing in the power of the word to build an enlightened and enduring future.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      title: isRTL ? 'رحلة مع المؤلف' : 'A Journey with the Author',
      desc: isRTL ? 'نرافق المبدعين في مسيرتهم الكاملة من لحظة الفكرة وحتى تمام النشر.' : 'Accompanying creators on their creative path from inception to distribution.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-14 bg-[#EDE5D4]/60 border-y border-[#D6C6A8]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[#D6C6A8]/60">
          {values.map((item, idx) => (
            <motion.div
              key={idx}
              className={`flex items-start gap-4 p-6 ${idx === 0 ? 'md:pr-0' : ''} ${idx === 2 ? 'md:pl-0' : ''} font-arabic`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
            >
              {/* Circular Antique-Gold Outlined Icon */}
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-[#B49A63] bg-[#FFFDF7] border-2 border-[#B49A63] shadow-sm"
              >
                {item.icon}
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#23432E] mb-1.5">
                  {item.title}
                </h3>
                <p className="text-sm text-[#777363] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 3. LATEST PUBLICATIONS SECTION ──────────────────────────────────────────
function LatestPublicationsSection() {
  const { isRTL, language } = useLanguage();
  const { data: booksData } = useBooks({ status: undefined });
  const books = (booksData ?? []).slice(0, 8);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[#F5F0E3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-arabic">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#B49A63] tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A63]" />
              <span>{isRTL ? 'إصدارات جديدة' : 'New Arrivals'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#23432E] tracking-tight">
              {isRTL ? 'أحدث إصداراتنا' : 'Latest Publications'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/store">
              <motion.span
                className="inline-flex items-center gap-2 text-sm font-bold text-[#23432E] hover:text-[#B49A63] transition-colors cursor-pointer"
                whileHover={{ x: isRTL ? -4 : 4 }}
              >
                <span>{isRTL ? 'استكشف جميع الإصدارات' : 'View All Publications'}</span>
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </motion.span>
            </Link>

            {/* Slider Nav Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll(isRTL ? 'right' : 'left')}
                className="w-10 h-10 rounded-full border border-[#D6C6A8] bg-[#FFFDF7] text-[#263A2C] hover:border-[#B49A63] hover:text-[#B49A63] flex items-center justify-center transition-colors shadow-sm"
                aria-label="Previous"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => scroll(isRTL ? 'left' : 'right')}
                className="w-10 h-10 rounded-full border border-[#D6C6A8] bg-[#FFFDF7] text-[#263A2C] hover:border-[#B49A63] hover:text-[#B49A63] flex items-center justify-center transition-colors shadow-sm"
                aria-label="Next"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Publications Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scroll-smooth scrollbar-hide"
        >
          {books.length > 0 ? (
            books.map((book, idx) => {
              const title = language === 'ar' ? book.title_ar : book.title_en;
              const author = (book as any).authors
                ? (language === 'ar' ? (book as any).authors.name_ar : (book as any).authors.name_en)
                : '';

              return (
                <motion.div
                  key={book.id}
                  className="flex-shrink-0 w-64 sm:w-72 bg-[#FFFDF7] rounded-3xl p-4 border border-[#D6C6A8] shadow-[0_8px_24px_-8px_rgba(35,67,46,0.08)] hover:shadow-[0_16px_36px_-10px_rgba(35,67,46,0.14)] hover:border-[#B49A63] transition-all duration-300 group flex flex-col justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Link href={`/book/${book.id}`}>
                    <div className="cursor-pointer">
                      {/* Cover Image Container */}
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#EDE5D4] mb-4 shadow-md group-hover:shadow-lg transition-shadow">
                        {book.cover_url ? (
                          <img
                            src={book.cover_url}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#EDE5D4] text-[#B49A63]">
                            <BookOpen size={40} />
                          </div>
                        )}

                        {/* Price Badge */}
                        <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} px-3 py-1 rounded-full bg-[#FFFDF7]/95 backdrop-blur-sm border border-[#D6C6A8] text-xs font-bold text-[#23432E] shadow-sm`}>
                          {book.price} ج.م
                        </div>
                      </div>

                      {/* Genre Tag */}
                      <span className="text-[11px] font-bold text-[#B49A63] uppercase tracking-wider block mb-1">
                        {book.genre_ar || book.genre || 'أدب'}
                      </span>

                      {/* Title */}
                      <h3 className="font-bold text-base text-[#23432E] line-clamp-1 mb-1 group-hover:text-[#B49A63] transition-colors">
                        {title}
                      </h3>

                      {/* Author */}
                      <p className="text-xs text-[#777363] mb-4">
                        {author || 'دار الرحاب'}
                      </p>
                    </div>
                  </Link>

                  {/* Card Action Link */}
                  <div className="pt-3 border-t border-[#D6C6A8]/40 flex items-center justify-between text-xs font-bold text-[#23432E]">
                    <Link href={`/book/${book.id}`}>
                      <span className="hover:text-[#B49A63] transition-colors cursor-pointer flex items-center gap-1.5">
                        <Eye size={14} className="text-[#B49A63]" />
                        <span>{isRTL ? 'تفاصيل الكتاب' : 'View Details'}</span>
                      </span>
                    </Link>
                    <span className="text-[#B49A63]">✦</span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            // Placeholder skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 sm:w-72 bg-[#FFFDF7] rounded-3xl p-4 border border-[#D6C6A8] animate-pulse">
                <div className="aspect-[3/4] rounded-2xl bg-[#EDE5D4] mb-4" />
                <div className="h-4 bg-[#EDE5D4] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#EDE5D4] rounded w-1/2" />
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}

// ─── 4. PUBLISHING CATEGORIES ────────────────────────────────────────────────
function PublishingCategoriesSection() {
  const { isRTL } = useLanguage();

  const categories = [
    {
      title: isRTL ? 'الروايات والقصص الأدبية' : 'Literary Fiction & Novels',
      desc: isRTL ? 'سرد رفيع ينبض بالعمق الإنساني والخيال الخلاب.' : 'Profound narratives resonating with human depth and imagination.',
      icon: '📖',
      genre: 'Literary',
    },
    {
      title: isRTL ? 'الفكر والفلسفة' : 'Thought & Philosophy',
      desc: isRTL ? 'مؤلفات تتناول الأسئلة الكبرى وتثري العقل العربي.' : 'Works engaging with life’s major intellectual enquiries.',
      icon: '🏛️',
      genre: 'Historical',
    },
    {
      title: isRTL ? 'التاريخ والتراث' : 'History & Heritage',
      desc: isRTL ? 'إضاءات موثقة على محطات التاريخ والذاكرة الحضارية.' : 'Documented insights across historical eras and cultural memory.',
      icon: '📜',
      genre: 'Historical',
    },
    {
      title: isRTL ? 'الشعر والدراسات النقدية' : 'Poetry & Critical Studies',
      desc: isRTL ? 'أرقى القصائد والدراسات اللغوية والأدبية المتخصصة.' : 'Exquisite verses and specialized critical literary analyses.',
      icon: '✒️',
      genre: 'Literary',
    },
  ];

  return (
    <section className="py-20 bg-[#EDE5D4]/40 border-t border-[#D6C6A8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-arabic">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#B49A63] uppercase tracking-widest block mb-2">
            {isRTL ? 'أبواب المعرفة' : 'Domains of Knowledge'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#23432E]">
            {isRTL ? 'تصنيفات النشر في دار الرحاب' : 'Publishing Categories'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link key={idx} href={`/store?genre=${cat.genre}`}>
              <motion.div
                className="bg-[#FFFDF7] p-8 rounded-3xl border border-[#D6C6A8] hover:border-[#B49A63] shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between h-full group"
                whileHover={{ y: -5 }}
              >
                <div>
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-lg text-[#23432E] mb-2 group-hover:text-[#B49A63] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-[#777363] leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#D6C6A8]/40 flex items-center justify-between text-xs font-bold text-[#23432E]">
                  <span>{isRTL ? 'تصفح القسم' : 'Browse'}</span>
                  {isRTL ? <ArrowLeft size={14} className="text-[#B49A63]" /> : <ArrowRight size={14} className="text-[#B49A63]" />}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 5. AUTHOR SPOTLIGHT ─────────────────────────────────────────────────────
function AuthorsSection() {
  const { isRTL, language } = useLanguage();
  const { data: authorsData } = useAuthors();
  const authors = (authorsData ?? []).slice(0, 6);

  return (
    <section className="py-24 bg-[#F5F0E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-arabic">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-xs font-bold text-[#B49A63] tracking-widest uppercase block mb-2">
              {isRTL ? 'نخبة الفكر والأدب' : 'Literary Minds'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#23432E]">
              {isRTL ? 'مؤلفو دار الرحاب' : 'Featured Authors'}
            </h2>
          </div>

          <Link href="/authors">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-[#23432E] hover:text-[#B49A63] transition-colors cursor-pointer">
              <span>{isRTL ? 'عرض جميع المؤلفين' : 'View All Authors'}</span>
              {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {authors.length > 0 ? (
            authors.map((author, idx) => {
              const name = language === 'ar' ? author.name_ar : author.name_en;
              return (
                <Link key={author.id} href={`/authors/${author.id}`}>
                  <motion.div
                    className="bg-[#FFFDF7] p-5 rounded-3xl border border-[#D6C6A8] hover:border-[#B49A63] text-center shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    whileHover={{ y: -4 }}
                  >
                    {/* Author Avatar with Antique-Gold Ring */}
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden p-1 border-2 border-[#B49A63] bg-[#EDE5D4]">
                      {author.photo_url ? (
                        <img
                          src={author.photo_url}
                          alt={name}
                          className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center font-bold text-xl text-[#23432E] bg-[#D6C6A8]">
                          {name[0] || 'أ'}
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-[#23432E] group-hover:text-[#B49A63] transition-colors line-clamp-1 mb-1">
                      {name}
                    </h4>
                    <span className="text-[11px] text-[#777363]">
                      {author.nationality || (isRTL ? 'كاتب وأديب' : 'Author')}
                    </span>
                  </motion.div>
                </Link>
              );
            })
          ) : (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#FFFDF7] p-5 rounded-3xl border border-[#D6C6A8] text-center animate-pulse">
                <div className="w-20 h-20 rounded-full bg-[#EDE5D4] mx-auto mb-3" />
                <div className="h-3 bg-[#EDE5D4] rounded w-3/4 mx-auto" />
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}

// ─── 6. CALL TO ACTION: PUBLISH WITH US ───────────────────────────────────────
function CTASection() {
  const { isRTL } = useLanguage();

  return (
    <section className="py-20 bg-[#F5F0E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-arabic">
        <div 
          className="relative rounded-[2.5rem] overflow-hidden p-10 sm:p-16 text-center text-[#FFFDF7] shadow-2xl border border-[#B49A63]"
          style={{
            backgroundColor: '#23432E',
            backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(180, 154, 99, 0.25) 0%, transparent 70%)',
          }}
        >
          {/* Subtle Decorative Golden Embellishment */}
          <div className="text-2xl text-[#B49A63] mb-4">✦ ✦ ✦</div>

          <h2 className="text-3xl sm:text-5xl font-extrabold leading-tight max-w-2xl mx-auto mb-6">
            {isRTL ? 'انشر كتابك مع دار الرحاب' : 'Publish Your Work with Dar Al-Rehab'}
          </h2>

          <p className="text-base sm:text-lg text-[#D6C6A8] max-w-2xl mx-auto leading-relaxed mb-10">
            {isRTL
              ? 'نرافق فكرتك بعناية فائقة، من مرحلة التدقيق والتحرير والتصميم الفني الفاخر، حتى تصل إلى أرفف المكتبات وأيدي القراء في كافة أرجاء الوطن العربي.'
              : 'From editorial refinement and luxury typography to worldwide distribution, we champion your literary voice with enduring distinction.'}
          </p>

          <div className={`flex flex-wrap items-center justify-center gap-4 ${isRTL ? 'flex-row' : ''}`}>
            <Link href="/auth">
              <motion.span
                className="px-9 py-4 rounded-full font-bold text-sm bg-[#B49A63] text-[#193A28] hover:bg-[#C5AD7D] shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{isRTL ? 'تقديم مخطوطة للنشر' : 'Submit Manuscript'}</span>
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </motion.span>
            </Link>

            <Link href="/about#contact">
              <motion.span
                className="px-8 py-4 rounded-full font-bold text-sm border border-[#D6C6A8] text-[#FFFDF7] hover:bg-[#193A28] transition-all cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isRTL ? 'تواصل مع لجنة التحكيم' : 'Contact Editorial Board'}
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MAIN HOMEPAGE COMPONENT ──────────────────────────────────────────────────
export function Homepage() {
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F5F0E3]">
      <SEO
        title={isRTL ? 'دار الرحاب للنشر والتوزيع — من رحاب الفكرة إلى خلود الحكاية' : 'Dar Al-Rehab Publishing House'}
        description={isRTL
          ? 'دار الرحاب للنشر والتوزيع — نمنح الكلمات بيتاً، والأفكار طريقاً إلى القارئ.'
          : 'Dar Al-Rehab Publishing House — Providing words a sanctuary, and ideas an enduring path to the reader.'}
        type="website"
      />
      <HeroSection />
      <BrandValuesSection />
      <LatestPublicationsSection />
      <PublishingCategoriesSection />
      <AuthorsSection />
      <CTASection />
    </div>
  );
}
