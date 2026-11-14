import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useLanguage } from '@/i18n/LanguageContext';
import { useBlogPosts } from '@/services/supabase.hooks';

export default function Blog() {
  const { t, isRTL, language } = useLanguage();
  const { data: posts, isLoading } = useBlogPosts({ status: 'published' });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F0E3' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#D6C6A8', borderTopColor: '#23432E' }} />
      </div>
    );
  }

  const blogPosts = posts || [];
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  if (blogPosts.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-32" style={{ background: '#F5F0E3' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 font-arabic" style={{ color: '#23432E' }}>
            {isRTL ? 'لا توجد مقالات حالياً' : 'No posts yet'}
          </h2>
          <p style={{ color: '#777363' }}>
            {isRTL ? 'عد إلينا قريباً لمتابعة أحدث أخبار الدار.' : 'Check back soon for the latest literary insights.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-32" style={{ background: '#F5F0E3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-10" style={{ background: '#B49A63' }} />
            <span className="font-bold uppercase tracking-[0.4em] text-xs font-arabic" style={{ color: '#B49A63' }}>
              {isRTL ? 'مدونة الدار' : 'Editorial Journal'}
            </span>
            <div className="h-px w-10" style={{ background: '#B49A63' }} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 font-arabic" style={{ color: '#23432E' }}>
            {t.nav.blog}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-arabic" style={{ color: '#777363' }}>
            {isRTL
              ? 'رحلة بين الكلمات، وفصول من المعرفة بانتظارك.'
              : 'A journey between words, and chapters of knowledge awaiting you.'}
          </p>
        </motion.div>

        {/* Featured Story */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.id}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[3rem] overflow-hidden mb-32 group cursor-pointer"
              style={{
                background: '#193A28',
                boxShadow: '0 40px 80px -20px rgba(25,58,40,0.35)'
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                  <img
                    src={featuredPost.image_url || undefined}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt=""
                  />
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-0 transition-opacity duration-700" style={{ background: '#193A28' }} />
                </div>
                <div className="p-12 md:p-20 flex flex-col justify-center">
                  <span className="font-bold tracking-wider text-xs uppercase mb-6 block font-arabic" style={{ color: '#B49A63' }}>
                    {isRTL ? 'القصة المميزة' : 'Featured Story'}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-[1.2] font-arabic group-hover:opacity-80 transition-opacity" style={{ color: '#FFFDF7' }}>
                    {language === 'ar' ? featuredPost.title_ar : featuredPost.title_en}
                  </h2>
                  <p className="text-lg mb-12 line-clamp-3 leading-relaxed font-arabic" style={{ color: 'rgba(255,253,247,0.6)' }}>
                    {language === 'ar' ? featuredPost.excerpt_ar : featuredPost.excerpt_en}
                  </p>
                  <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: 'rgba(180,154,99,0.2)', border: '1px solid rgba(180,154,99,0.4)' }}>
                      {featuredPost.authors?.photo_url ? (
                        <img src={featuredPost.authors.photo_url} className="w-full h-full object-cover rounded-2xl" alt="" />
                      ) : (
                        <User size={24} style={{ color: '#B49A63' }} />
                      )}
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="font-bold text-lg" style={{ color: '#FFFDF7' }}>
                        {language === 'ar' ? featuredPost.authors?.name_ar : featuredPost.authors?.name_en}
                      </p>
                      <p className="text-sm font-bold uppercase tracking-wider" style={{ color: 'rgba(180,154,99,0.7)' }}>
                        {featuredPost.published_at
                          ? new Date(featuredPost.published_at).toLocaleDateString(
                              language === 'ar' ? 'ar-SA' : 'en-US',
                              { month: 'long', day: 'numeric', year: 'numeric' }
                            )
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main List */}
          <div className="lg:col-span-2 flex flex-col gap-16">
            {remainingPosts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.id}`}>
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group cursor-pointer"
                >
                  <div className="flex flex-col gap-8">
                    <div
                      className="relative aspect-[21/9] rounded-[2rem] overflow-hidden transition-all duration-700 group-hover:-translate-y-2"
                      style={{ boxShadow: '0 20px 60px -15px rgba(35,67,46,0.2)' }}
                    >
                      <img
                        src={post.image_url || undefined}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        alt=""
                      />
                      <div className="absolute inset-0 opacity-10 group-hover:opacity-0 transition-colors duration-500" style={{ background: '#23432E' }} />
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <div className={`flex items-center gap-6 mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="font-bold uppercase tracking-[0.2em] text-xs font-arabic" style={{ color: '#B49A63' }}>{post.category}</span>
                        <div className="h-4 w-px" style={{ background: '#D6C6A8' }} />
                        <span className="font-bold text-xs uppercase tracking-wider font-arabic" style={{ color: '#777363' }}>
                          {post.read_time} {isRTL ? 'قراءة' : 'Read'}
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold mb-5 leading-snug font-arabic group-hover:opacity-70 transition-opacity" style={{ color: '#23432E' }}>
                        {language === 'ar' ? post.title_ar : post.title_en}
                      </h3>
                      <p className="text-lg line-clamp-2 mb-8 font-arabic" style={{ color: '#777363' }}>
                        {language === 'ar' ? post.excerpt_ar : post.excerpt_en}
                      </p>
                      <div className={`flex items-center gap-3 font-bold group-hover:gap-5 transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: '#23432E' }}>
                        <span className="font-arabic">{isRTL ? 'اقرأ المزيد' : 'Read Full Story'}</span>
                        {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                      </div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:border-l lg:pl-12" style={{ borderColor: '#D6C6A8' }}>
            <div className="sticky top-32">
              <h3 className="text-2xl font-black mb-10 uppercase tracking-wider leading-none font-arabic" style={{ color: '#23432E' }}>
                {isRTL ? 'الأكثر قراءة' : 'Trending'}
              </h3>
              <div className="flex flex-col gap-10">
                {blogPosts.slice(0, 4).map((post, i) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <motion.div
                      className={`flex gap-5 ${isRTL ? 'flex-row-reverse' : ''} group cursor-pointer`}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span className="text-5xl font-black leading-none group-hover:opacity-40 transition-opacity" style={{ color: 'rgba(180,154,99,0.15)', fontVariantNumeric: 'tabular-nums' }}>
                        0{i + 1}
                      </span>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <p className="font-bold text-[11px] uppercase tracking-wider mb-1 font-arabic" style={{ color: '#B49A63' }}>{post.category}</p>
                        <h4 className="text-base font-bold mb-2 leading-snug group-hover:opacity-60 transition-opacity font-arabic" style={{ color: '#23432E' }}>
                          {language === 'ar' ? post.title_ar : post.title_en}
                        </h4>
                        <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${isRTL ? 'flex-row-reverse' : ''}`} style={{ color: '#777363' }}>
                          <span className="font-arabic">{language === 'ar' ? post.authors?.name_ar : post.authors?.name_en}</span>
                          <div className="w-1 h-1 rounded-full" style={{ background: '#D6C6A8' }} />
                          <span>{post.read_time}</span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
