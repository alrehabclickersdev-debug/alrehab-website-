import { useRoute, Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { 
  Star, ShoppingCart, BookOpen, Play, 
  ArrowLeft, ArrowRight, ShieldCheck, MessageCircle,
  BarChart3, X, Check
} from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { useLanguage } from '@/i18n/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useBook, useBooks, useBookRating, useRateBook, useBookReviews } from '@/services/supabase.hooks';
import { useAuth } from '@/contexts/useAuth';
import { useToast } from '@/hooks/use-toast';
import { sanitizeHTML } from '@/lib/sanitize';
import { SEO } from '@/components/SEO';
import { useDiscovery } from '@/hooks/useDiscovery';

// Extract YouTube ID Utility
function getYouTubeID(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function BookDetail() {
  const { t, isRTL, language } = useLanguage();
  const [, paramsBook] = useRoute('/book/:id');
  const [, paramsBooks] = useRoute('/books/:id');
  const bookId = paramsBook?.id || paramsBooks?.id;
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: book, isLoading: bookLoading } = useBook(bookId);
  const { addItem, openCart } = useCart();
  const { data: recommendedData } = useBooks({ genre: book?.genre });
  const { data: rating } = useBookRating(bookId);
  const { data: reviews, isLoading: reviewsLoading } = useBookReviews(bookId);
  const rateBook = useRateBook();

  const [hoverRating, setHoverRating] = useState(0);
  const [isRating, setIsRating] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const { trackView } = useDiscovery();

  useEffect(() => {
    if (book) trackView(book);
  }, [book, trackView]);

  const userReview = useMemo(() => {
    if (!user || !reviews) return { rating: 0, comment: '' };
    const myReview = (reviews as any[]).find((r: { user_id: string }) => r.user_id === user.id);
    return myReview ? { rating: myReview.rating, comment: myReview.comment || '' } : { rating: 0, comment: '' };
  }, [user, reviews]);

  const userRating = userReview.rating;
  const [draftRating, setDraftRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (userRating > 0) setDraftRating(userRating);
    if (userReview.comment) setReviewComment(userReview.comment);
  }, [userRating, userReview.comment]);

  const youtubeId = useMemo(() => book?.trailer_url ? getYouTubeID(book.trailer_url) : null, [book?.trailer_url]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowTrailer(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (bookLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#F5F0E3]">
        <div className="w-12 h-12 border-4 border-[#D6C6A8] border-t-[#23432E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#F5F0E3] font-arabic">
        <div className="text-center p-8 bg-[#FFFDF7] rounded-3xl border border-[#D6C6A8]">
          <h2 className="text-[#23432E] text-xl font-bold mb-4">{isRTL ? 'الكتاب غير موجود' : 'Book Not Found'}</h2>
          <Link href="/store">
            <span className="text-[#B49A63] font-bold text-sm cursor-pointer hover:underline">{t.common.backToHome}</span>
          </Link>
        </div>
      </div>
    );
  }

  const title = language === 'ar' ? book.title_ar : book.title_en;
  const authorRecord = Array.isArray(book.authors) ? book.authors[0] : book.authors;
  const authorName = authorRecord ? (language === 'ar' ? authorRecord.name_ar : authorRecord.name_en) : (isRTL ? 'دار الرحاب' : 'Dar Al-Rehab');
  const description = language === 'ar' ? book.description_ar : book.description_en;
  const recommended = (recommendedData ?? []).filter((b: any) => b.id !== book.id).slice(0, 4);
  const discount = book.original_price ? Math.round((1 - book.price / book.original_price) * 100) : null;

  const handleSubmitReview = async () => {
    if (!user?.id) {
      toast({ title: language === 'ar' ? 'سجّل دخولك للتقييم' : 'Please login to rate', variant: 'destructive' });
      return;
    }
    if (draftRating === 0) {
      toast({ title: language === 'ar' ? 'الرجاء اختيار تقييم' : 'Please select a star rating', variant: 'destructive' });
      return;
    }
    setIsRating(true);
    try {
      await rateBook.mutateAsync({ 
        bookId: book.id, 
        rating: draftRating, 
        userId: user.id as string,
        comment: reviewComment.trim()
      });
      toast({ title: language === 'ar' ? 'تم تسجيل تقييمك بنجاح!' : 'Your review has been recorded!' });
    } catch (err: any) {
      console.error('[Rating Error]', err?.message || err);
      toast({ title: err?.message || 'Failed to save review', variant: 'destructive' });
    } finally {
      setIsRating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-[#F5F0E3] pb-32 font-arabic text-[#263A2C]">
      
      {/* Video Trailer Modal */}
      <AnimatePresence>
        {showTrailer && youtubeId && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button 
              onClick={() => setShowTrailer(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all z-[110]"
            >
              <X size={24} />
            </button>
            <motion.div 
              className="w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black relative"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title="Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SEO
        title={`${title} — دار الرحاب للنشر والتوزيع`}
        description={language === 'ar'
          ? (book.description_ar?.slice(0, 160) || book.title_ar)
          : (book.description_en?.slice(0, 160) || book.title_en)}
        image={book.cover_url || undefined}
        type="book"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Breadcrumb Navigation */}
        <Link href="/store">
          <motion.button
            className={`inline-flex items-center gap-2 text-xs font-bold text-[#777363] hover:text-[#23432E] transition-colors mb-10 ${isRTL ? 'flex-row' : ''}`}
            whileHover={{ x: isRTL ? 3 : -3 }}
          >
            {isRTL ? <ArrowRight size={14} className="text-[#B49A63]" /> : <ArrowLeft size={14} className="text-[#B49A63]" />}
            <span>{isRTL ? 'العودة إلى متجر الكتب' : 'Back to Book Catalog'}</span>
          </motion.button>
        </Link>

        {/* Book Overview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          
          {/* Cover Art Column (5 cols) */}
          <motion.div
            className="lg:col-span-5 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative w-full max-w-sm">
              {/* Pedestal shadow and card */}
              <div className="relative rounded-[2rem] overflow-hidden bg-[#FFFDF7] p-3 border border-[#D6C6A8] shadow-[0_24px_50px_-15px_rgba(35,67,46,0.18)]">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#EDE5D4]">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#EDE5D4] text-[#B49A63]">
                      <BookOpen size={48} />
                    </div>
                  )}

                  {youtubeId && (
                    <button 
                      onClick={() => setShowTrailer(true)}
                      className="absolute inset-0 bg-[#23432E]/30 hover:bg-[#23432E]/40 transition-colors flex items-center justify-center group"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#FFFDF7] text-[#23432E] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play size={24} className="ml-0.5 text-[#B49A63]" fill="#B49A63" />
                      </div>
                    </button>
                  )}
                </div>

                {book.is_new && (
                  <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'} px-3.5 py-1 rounded-full bg-[#B49A63] text-[#193A28] text-xs font-bold shadow-md`}>
                    {isRTL ? 'إصدار حديث' : 'NEW'}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Book Information Column (7 cols) */}
          <motion.div
            className={`lg:col-span-7 ${isRTL ? 'text-right' : 'text-left'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {/* Genre & Discount Badges */}
            <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'justify-start' : ''}`}>
              <span className="px-3.5 py-1 rounded-full bg-[#EDE5D4] text-[#23432E] text-xs font-bold border border-[#D6C6A8]">
                {language === 'ar' ? (book.genre_ar || book.genre) : book.genre}
              </span>
              {discount && (
                <span className="px-3 py-1 rounded-full bg-[#A33B32] text-[#FFFDF7] text-xs font-bold">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#23432E] leading-tight mb-4 tracking-tight">
              {title}
            </h1>

            {/* Author */}
            {book.author_id ? (
              <Link href={`/authors/${book.author_id}`}>
                <p className="text-lg font-bold text-[#B49A63] mb-8 hover:text-[#23432E] transition-colors inline-flex items-center gap-2 cursor-pointer">
                  <ShieldCheck size={18} />
                  <span>{authorName}</span>
                </p>
              </Link>
            ) : (
              <p className="text-lg font-bold text-[#B49A63] mb-8">
                {authorName}
              </p>
            )}

            {/* Price and Cart Action */}
            <div className={`flex flex-wrap items-center gap-6 p-6 rounded-3xl bg-[#FFFDF7] border border-[#D6C6A8] shadow-sm mb-10 ${isRTL ? 'flex-row' : ''}`}>
              <div>
                <span className="text-xs text-[#777363] block mb-1">{isRTL ? 'السعر الرسمي' : 'Price'}</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#23432E]">
                    {book.price} <span className="text-sm text-[#B49A63] font-bold">{t.common.currency}</span>
                  </span>
                  {book.original_price && book.original_price > book.price && (
                    <span className="text-lg text-[#777363] line-through font-semibold">
                      {book.original_price} {t.common.currency}
                    </span>
                  )}
                </div>
              </div>

              <motion.button
                onClick={() => {
                  addItem({
                    bookId: book.id,
                    title: title,
                    coverUrl: book.cover_url || '',
                    price: Number(book.price),
                    quantity: 1,
                    format: (book.format as any) || 'both',
                  });
                  openCart();
                }}
                className="mr-auto inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm bg-[#23432E] text-[#FFFDF7] hover:bg-[#193A28] shadow-lg shadow-[#23432E]/15 transition-all"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart size={18} className="text-[#B49A63]" />
                <span>{isRTL ? 'أضف إلى السلة' : 'Add to Cart'}</span>
              </motion.button>
            </div>

            {/* Meta Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 text-center">
              {[
                { label: t.book.pages, value: `${book.pages || 0} ${isRTL ? 'صفحة' : 'Pages'}` },
                { label: isRTL ? 'التجليد' : 'Format', value: book.format === 'physical' ? 'ورقي فاخر' : book.format === 'digital' ? 'رقمي' : 'ورقي فاخر' },
                { label: isRTL ? 'سنة النشر' : 'Year', value: book.published_date ? new Date(book.published_date).getFullYear() : '2025' },
                { label: t.book.language, value: book.language === 'en' ? 'الإنجليزية' : 'العربية' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#FFFDF7] rounded-2xl p-4 border border-[#D6C6A8]">
                  <p className="text-[11px] font-bold text-[#777363] mb-1">{label}</p>
                  <p className="font-extrabold text-xs text-[#23432E]">{value}</p>
                </div>
              ))}
            </div>

            {/* Description & Synopsis */}
            <div className="bg-[#FFFDF7] rounded-3xl p-6 sm:p-8 border border-[#D6C6A8] shadow-sm mb-10">
              <h3 className="text-lg font-bold text-[#23432E] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B49A63]" />
                <span>{isRTL ? 'عن هذا الإصدار' : 'About This Book'}</span>
              </h3>
              <div 
                className="text-base text-[#263A2C]/90 leading-relaxed font-arabic"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(description?.replace(/\n/g, '<br/>') || '') }}
              />
            </div>

          </motion.div>

        </div>

        {/* Rating and Reviews Section */}
        <section className="mb-24">
          <div className="bg-[#FFFDF7] rounded-3xl p-8 sm:p-12 border border-[#D6C6A8] shadow-sm">
            <h3 className="text-2xl font-bold text-[#23432E] mb-8 flex items-center gap-3">
              <MessageCircle size={22} className="text-[#B49A63]" />
              <span>{isRTL ? 'تقييمات وآراء القراء' : 'Reader Reviews & Ratings'}</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Rating Summary */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#EDE5D4]/40 border border-[#D6C6A8]">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl font-black text-[#23432E]">
                    {(rating?.average || 5).toFixed(1)}
                  </span>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={16} className="fill-[#B49A63] text-[#B49A63]" />
                      ))}
                    </div>
                    <span className="text-xs text-[#777363] font-bold">
                      {rating?.count || 1} {isRTL ? 'تقييماً معتمداً' : 'Verified Reviews'}
                    </span>
                  </div>
                </div>

                {/* Rating Input Form */}
                <div className="pt-6 border-t border-[#D6C6A8]/60">
                  <p className="text-xs font-bold text-[#23432E] mb-3">
                    {userRating > 0 ? (isRTL ? 'تعديل تقييمك:' : 'Edit review:') : (isRTL ? 'أضف تقييمك ورأيك:' : 'Add your rating:')}
                  </p>
                  <div className="flex items-center gap-1.5 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setDraftRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={24}
                          className={`${
                            star <= (hoverRating || draftRating || 0)
                              ? 'fill-[#B49A63] text-[#B49A63]'
                              : 'text-[#D6C6A8]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={isRTL ? 'شاركنا انطباعك عن الكتاب...' : 'Share your impressions...'}
                    className="w-full bg-[#FFFDF7] border border-[#D6C6A8] rounded-xl p-3 text-sm text-[#263A2C] placeholder-[#777363]/60 focus:outline-none focus:border-[#B49A63] mb-3 resize-none"
                    rows={3}
                  />

                  <button
                    onClick={handleSubmitReview}
                    disabled={isRating}
                    className="w-full py-2.5 rounded-full font-bold text-xs bg-[#23432E] text-[#FFFDF7] hover:bg-[#193A28] transition-colors"
                  >
                    {isRating ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'إرسال التقييم' : 'Submit Review')}
                  </button>
                </div>
              </div>

              {/* Review List */}
              <div className="lg:col-span-7 space-y-4">
                {reviewsLoading ? (
                  <div className="h-28 bg-[#EDE5D4] rounded-2xl animate-pulse" />
                ) : reviews && (reviews as any[]).length > 0 ? (
                  (reviews as any[]).map((rev: any) => (
                    <div key={rev.id} className="p-5 rounded-2xl bg-[#EDE5D4]/20 border border-[#D6C6A8]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-[#23432E]">
                          {rev.profiles?.full_name || (isRTL ? 'قارئ موثوق' : 'Verified Reader')}
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              className={s <= rev.rating ? 'fill-[#B49A63] text-[#B49A63]' : 'text-[#D6C6A8]'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#263A2C]/80 leading-relaxed">
                        "{rev.comment || (isRTL ? 'إصدار استثنائي ومتقن الإخراج.' : 'Exceptional edition.')}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-[#EDE5D4]/20 rounded-2xl border border-[#D6C6A8]">
                    <p className="text-sm text-[#777363]">
                      {isRTL ? 'كن أول من يشاركنا انطباعه عن هذا الإصدار الرفيع.' : 'Be the first to share your review of this book.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Books Section */}
        {recommended.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-[#B49A63] tracking-widest uppercase block mb-1">
                  {isRTL ? 'مختارات مماثلة' : 'Related Titles'}
                </span>
                <h3 className="text-2xl font-bold text-[#23432E]">
                  {isRTL ? 'إصدارات قد تنال إعجابك' : 'You May Also Enjoy'}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommended.map((b: any, i: number) => (
                <BookCard key={b.id} book={b} index={i} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
