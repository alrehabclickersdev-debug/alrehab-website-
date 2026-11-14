import { motion, useScroll, useSpring } from 'framer-motion';
import { Calendar, User, Clock, ArrowLeft, ChevronRight, Share2, Facebook, Twitter, Link2 } from 'lucide-react';
import { Link, useRoute } from 'wouter';
import { useLanguage } from '@/i18n/LanguageContext';
import { useBlogPost } from '@/services/supabase.hooks';
import { Button } from '@/components/ui/button';
import { sanitizeHTML } from '@/lib/sanitize';

export function BlogPostDetail() {
  const [, params] = useRoute('/blog/:id');
  const { isRTL, language } = useLanguage();
  const { data: post, isLoading } = useBlogPost(params?.id);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F0E3' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#D6C6A8', borderTopColor: '#23432E' }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-32" style={{ background: '#F5F0E3' }}>
        <h2 className="text-3xl font-bold mb-4 font-arabic" style={{ color: '#23432E' }}>
          {isRTL ? 'المقال غير متوفر' : 'Post not found'}
        </h2>
        <Link href="/blog">
          <button className="px-6 py-3 rounded-full font-bold font-arabic text-sm" style={{ background: '#23432E', color: '#FFFDF7' }}>
            {isRTL ? 'العودة للمدونة' : 'Back to Blog'}
          </button>
        </Link>
      </div>
    );
  }

  const title = language === 'ar' ? post.title_ar : post.title_en;
  const content = language === 'ar' ? post.content_ar : post.content_en;

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E3' }}>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 z-[100] origin-left"
        style={{ scaleX, background: '#B49A63' }}
      />

      {/* Hero Header */}
      <header className="relative pt-32 md:pt-40 pb-16">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-4 mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Link href="/blog">
              <button className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs font-arabic transition-all" style={{ color: '#B49A63' }}>
                {isRTL ? <ChevronRight size={14} /> : <ArrowLeft size={14} />}
                <span>{isRTL ? 'العودة للمدونة' : 'Editorial News'}</span>
              </button>
            </Link>
            <div className="h-px w-8" style={{ background: '#D6C6A8' }} />
            <span className="font-bold uppercase tracking-wider text-xs font-arabic" style={{ color: '#777363' }}>{post.category}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black leading-[1.2] mb-10 font-arabic"
            style={{ color: '#23432E' }}
          >
            {title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`flex items-center gap-8 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{ background: '#EDE5D4', border: '1px solid #D6C6A8' }}
              >
                {post.authors?.photo_url ? (
                  <img src={post.authors.photo_url} className="w-full h-full object-cover" alt="" />
                ) : (
                  <User size={24} style={{ color: '#B49A63' }} />
                )}
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-bold text-lg font-arabic" style={{ color: '#23432E' }}>
                  {language === 'ar' ? post.authors?.name_ar : post.authors?.name_en}
                </p>
                <p className="text-xs font-bold uppercase tracking-wider font-arabic" style={{ color: '#B49A63' }}>
                  {isRTL ? 'كاتب المقال' : 'Article Author'}
                </p>
              </div>
            </div>

            <div className="h-10 w-px hidden sm:block" style={{ background: '#D6C6A8' }} />

            <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Calendar size={16} style={{ color: '#B49A63' }} />
                <span className="font-bold text-xs font-arabic" style={{ color: '#777363' }}>
                  {post.published_at ? new Date(post.published_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'مؤخراً'}
                </span>
              </div>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock size={16} style={{ color: '#B49A63' }} />
                <span className="font-bold text-xs font-arabic" style={{ color: '#777363' }}>
                  {post.read_time} {isRTL ? 'قراءة' : 'read'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Featured Image */}
      {post.image_url && (
        <section className="px-4 mb-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative aspect-[21/9] rounded-[3rem] overflow-hidden"
              style={{
                border: '1px solid #D6C6A8',
                boxShadow: '0 20px 60px -15px rgba(35,67,46,0.15)'
              }}
            >
              <img src={post.image_url} className="absolute inset-0 w-full h-full object-cover" alt="" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 pb-32 flex flex-col md:flex-row gap-12">
        {/* Social Share (Desktop Sidebar) */}
        <div className="hidden md:flex flex-col gap-4 sticky top-32 h-fit">
          <button
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm"
            style={{ background: '#FFFDF7', border: '1px solid #D6C6A8', color: '#23432E' }}
          >
            <Facebook size={18} />
          </button>
          <button
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm"
            style={{ background: '#FFFDF7', border: '1px solid #D6C6A8', color: '#23432E' }}
          >
            <Twitter size={18} />
          </button>
          <button
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm"
            style={{ background: '#FFFDF7', border: '1px solid #D6C6A8', color: '#23432E' }}
          >
            <Link2 size={18} />
          </button>
          <div className="h-16 w-px mx-auto" style={{ background: '#D6C6A8' }} />
          <span className="[writing-mode:vertical-lr] text-[10px] font-bold uppercase tracking-wider rotate-180 font-arabic" style={{ color: '#777363' }}>
            {isRTL ? 'مشاركة' : 'Share'}
          </span>
        </div>

        {/* Main Text Content */}
        <div className="flex-1 min-w-0">
          <div
            className={`
              prose prose-stone max-w-none text-lg md:text-xl leading-[2]
              break-words overflow-wrap-anywhere
              ${isRTL ? 'font-arabic text-right' : ''}
            `}
            style={{ color: '#263A2C' }}
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(content || '') }}
          />

          {/* Footer Tags/Credits */}
          <div className="mt-20 pt-8 border-t flex flex-wrap items-center justify-between gap-6" style={{ borderColor: '#D6C6A8' }}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="font-bold text-xs uppercase tracking-wider font-arabic" style={{ color: '#777363' }}>
                {isRTL ? 'التصنيف:' : 'Category:'}
              </span>
              <span
                className="px-3.5 py-1 rounded-full text-xs font-bold font-arabic"
                style={{ background: '#EDE5D4', color: '#23432E', border: '1px solid #D6C6A8' }}
              >
                {post.category}
              </span>
            </div>

            <Button
              variant="outline"
              className="rounded-full gap-2 font-bold font-arabic px-6 py-2.5 h-auto transition-all"
              style={{ background: '#FFFDF7', border: '1px solid #D6C6A8', color: '#23432E' }}
            >
              <Share2 size={16} style={{ color: '#B49A63' }} />
              <span>{isRTL ? 'مشاركة هذا المقال' : 'Share article'}</span>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
