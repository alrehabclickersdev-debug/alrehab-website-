import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, Layers, PenTool } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { useLanguage } from '@/i18n/LanguageContext';
import { useWorld, useBooks } from '@/services/supabase.hooks';
import { sanitizeHTML } from '@/lib/sanitize';

export function WorldDetail() {
  const { t, isRTL, language } = useLanguage();
  const [, params] = useRoute('/worlds/:id');
  const worldId = params?.id;

  const { data: world, isLoading: worldLoading } = useWorld(worldId);
  const { data: books, isLoading: booksLoading } = useBooks({ worldId });

  // Extract unique authors from books
  const writers = books ? Array.from(new Set(books.map(b => b.author_id))).map(id => {
    const book = books.find(b => b.author_id === id);
    return book?.authors;
  }).filter(Boolean) : [];

  if (worldLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24" style={{ background: '#F5F0E3' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#D6C6A8', borderTopColor: '#23432E' }} />
      </div>
    );
  }

  if (!world) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center" style={{ background: '#F5F0E3' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: '#EDE5D4', color: '#B49A63' }}>
          <Layers size={40} />
        </div>
        <h2 className="text-3xl font-black mb-4 font-arabic" style={{ color: '#23432E' }}>
          {isRTL ? 'السلسلة غير موجودة' : 'Not Found'}
        </h2>
        <Link href="/worlds">
          <button className="flex items-center gap-2 font-bold font-arabic text-sm transition-all" style={{ color: '#23432E' }}>
            {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            <span>{isRTL ? 'العودة إلى السلاسل' : 'Back to Worlds'}</span>
          </button>
        </Link>
      </div>
    );
  }

  const name = language === 'ar' ? world.name_ar : world.name_en;
  const description = language === 'ar' ? world.description_ar : world.description_en;

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E3' }}>
      {/* Banner */}
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden" style={{ background: '#193A28' }}>
        {world.banner_url ? (
          <motion.img
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={world.banner_url}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: world.color_primary || '#23432E' }} />
        )}

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(25,58,40,0.3) 0%, rgba(25,58,40,0.7) 60%, #F5F0E3 100%)'
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
          <div className="max-w-7xl mx-auto w-full">
            <Link href="/worlds">
              <motion.button
                className={`flex items-center gap-2 font-bold text-xs font-arabic mb-6 transition-all ${isRTL ? 'flex-row-reverse ml-auto' : ''}`}
                style={{ color: '#FFFDF7' }}
                whileHover={{ x: isRTL ? 3 : -3 }}
              >
                {isRTL ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                <span>{t.worlds.title}</span>
              </motion.button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className={isRTL ? 'text-right' : 'text-left'}
            >
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold font-arabic mb-4 shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{ background: '#B49A63', color: '#FFFDF7' }}
              >
                <Layers size={12} />
                <span>{isRTL ? 'سلسلة أدبية وفكرية' : 'Literary Collection'}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black mb-4 font-arabic leading-tight drop-shadow-md" style={{ color: '#FFFDF7' }}>
                {name}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-32">
        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[3rem] p-8 md:p-14 mb-20"
          style={{
            background: '#FFFDF7',
            border: '1px solid #D6C6A8',
            boxShadow: '0 10px 40px rgba(35,67,46,0.06)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Sidebar info */}
            <div className={`md:col-span-1 ${isRTL ? 'order-2 md:border-r md:pr-8 text-right' : 'md:border-l md:pl-8 text-left'}`} style={{ borderColor: '#EDE5D4' }}>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 font-arabic" style={{ color: '#B49A63' }}>
                  {isRTL ? 'إحصائيات السلسلة' : 'Collection Stats'}
                </p>
                <div className="space-y-4">
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EDE5D4', color: '#23432E' }}>
                      <BookOpen size={16} />
                    </div>
                    <span className="text-sm font-bold font-arabic" style={{ color: '#23432E' }}>
                      {books?.length || 0} {isRTL ? 'إصدارات منشورة' : 'Publications'}
                    </span>
                  </div>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#EDE5D4', color: '#23432E' }}>
                      <PenTool size={16} />
                    </div>
                    <span className="text-sm font-bold font-arabic" style={{ color: '#23432E' }}>
                      {writers.length} {isRTL ? 'مؤلفون ومبدعون' : 'Authors'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main text */}
            <div className={`md:col-span-2 ${isRTL ? 'order-1 text-right' : 'text-left'}`}>
              <h2 className="text-2xl font-black mb-6 font-arabic" style={{ color: '#23432E' }}>
                {isRTL ? 'عن هذه السلسلة الأدبية' : 'About this Collection'}
              </h2>
              <div
                className="text-base md:text-lg leading-[1.8] font-arabic space-y-4"
                style={{ color: '#263A2C' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(description?.replace(/\n/g, '<br/>') || '') }}
              />
            </div>
          </div>
        </motion.div>

        {/* Authors in this World */}
        {writers.length > 0 && (
          <section className="mb-24">
            <div className={`mb-10 ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="font-bold uppercase tracking-[0.2em] text-xs font-arabic" style={{ color: '#B49A63' }}>
                {isRTL ? 'أقلام السلسلة' : 'Contributors'}
              </span>
              <h2 className="text-3xl md:text-4xl font-black mt-1 font-arabic" style={{ color: '#23432E' }}>
                {isRTL ? 'مؤلفو السلسلة' : 'Authors of this Series'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {writers.map((writer: any, i: number) => (
                <motion.div
                  key={writer.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-3xl transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                  style={{
                    background: '#FFFDF7',
                    border: '1px solid #D6C6A8',
                    boxShadow: '0 4px 20px rgba(35,67,46,0.04)'
                  }}
                >
                  <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0" style={{ border: '2px solid #B49A63' }}>
                      <img src={writer.photo_url} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-arabic" style={{ color: '#23432E' }}>
                        {language === 'ar' ? writer.name_ar : writer.name_en}
                      </h3>
                      <p className="text-xs font-bold font-arabic" style={{ color: '#B49A63' }}>
                        {isRTL ? 'كاتب ومفكر' : 'Author'}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-arabic line-clamp-3 mb-4 leading-relaxed" style={{ color: '#777363' }}>
                    {language === 'ar' ? writer.bio_ar : writer.bio_en}
                  </p>

                  <Link href={`/authors/${writer.id}`}>
                    <button
                      className={`flex items-center gap-2 text-xs font-bold font-arabic transition-colors ${isRTL ? 'flex-row-reverse mr-auto' : ''}`}
                      style={{ color: '#23432E' }}
                    >
                      <span>{isRTL ? 'الملف الشخصي والكتب' : 'View Profile'}</span>
                      {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Books in this World */}
        <section>
          <div className={`mb-10 ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="font-bold uppercase tracking-[0.2em] text-xs font-arabic" style={{ color: '#B49A63' }}>
              {isRTL ? 'الكتالوج المتاح' : 'Publications'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black mt-1 font-arabic" style={{ color: '#23432E' }}>
              {isRTL ? 'إصدارات هذه السلسلة' : 'Series Publications'}
            </h2>
          </div>

          {booksLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="aspect-[2/3] rounded-3xl animate-pulse" style={{ background: '#FFFDF7', border: '1px solid #D6C6A8' }} />)}
            </div>
          ) : books && books.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-3xl" style={{ background: '#FFFDF7', border: '1px solid #D6C6A8' }}>
              <p className="font-bold font-arabic text-sm" style={{ color: '#777363' }}>
                {isRTL ? 'لم يتم إضافة كتب جديدة لهذه السلسلة بعد.' : 'No books have been added yet.'}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
