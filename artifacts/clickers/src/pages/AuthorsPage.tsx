import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Star, BookOpen, ArrowLeft, ArrowRight, Globe, Instagram, Twitter, ShieldCheck } from 'lucide-react';
import { AuthorCard } from '@/components/AuthorCard';
import { BookCard } from '@/components/BookCard';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuthors, useAuthor, useBooks, useAuthorRating, useRateAuthor } from '@/services/supabase.hooks';
import { useState } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { useToast } from '@/hooks/use-toast';
import { sanitizeHTML } from '@/lib/sanitize';

export function AuthorsPage() {
  const { isRTL } = useLanguage();
  const { data: authors, isLoading } = useAuthors();

  return (
    <div className="min-h-screen pt-28 pb-32 bg-[#F5F0E3] font-arabic text-[#263A2C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#B49A63] tracking-widest uppercase block mb-2">
            {isRTL ? 'نخبة الأدب والفكر' : 'Literary Minds'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#23432E] tracking-tight mb-4">
            {isRTL ? 'مؤلفو دار الرحاب' : 'Authors of Dar Al-Rehab'}
          </h1>
          <p className="text-base text-[#777363] leading-relaxed">
            {isRTL
              ? 'نعتز بنخبة المبدعين والمفكرين الذين ائتمنوا دار الرحاب على نتاج أقلامهم ورؤاهم الأدبية.'
              : 'Celebrating the visionary authors and thinkers who have entrusted their literary legacy to Dar Al-Rehab.'}
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-[#EDE5D4] animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : authors && authors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((author, i) => (
              <AuthorCard key={author.id} author={author} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-[#FFFDF7] rounded-3xl border border-[#D6C6A8] max-w-md mx-auto p-8">
            <p className="text-[#777363] text-sm">
              {isRTL ? 'لم يتم تسجيل مؤلفين بعد.' : 'No authors recorded yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function AuthorDetail() {
  const { t, isRTL, language } = useLanguage();
  const [, params] = useRoute('/authors/:id');
  const authorId = params?.id;
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: author, isLoading: authorLoading } = useAuthor(authorId);
  const { data: books, isLoading: booksLoading } = useBooks({ authorId });
  const { data: rating } = useAuthorRating(authorId);
  const rateAuthor = useRateAuthor();

  const [hoverRating, setHoverRating] = useState(0);

  if (authorLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0E3] flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-[#D6C6A8] border-t-[#23432E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-[#F5F0E3] font-arabic">
        <div className="text-center p-8 bg-[#FFFDF7] rounded-3xl border border-[#D6C6A8]">
          <h2 className="text-2xl font-bold text-[#23432E] mb-4">{t.common.notFound}</h2>
          <Link href="/authors">
            <span className="text-[#B49A63] font-bold text-sm cursor-pointer hover:underline">
              {isRTL ? 'العودة لقائمة المؤلفين' : 'Back to Authors'}
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const name = language === 'ar' ? author.name_ar : author.name_en;
  const bio = language === 'ar' ? author.bio_ar : author.bio_en;

  const handleRate = async (value: number) => {
    if (!user?.id) {
      toast({ title: isRTL ? 'يرجى تسجيل الدخول للتقييم' : 'Please login to rate', variant: 'destructive' });
      return;
    }
    try {
      await rateAuthor.mutateAsync({ authorId: author.id as string, rating: value, userId: user.id as string });
      toast({ title: isRTL ? 'شكراً لتقييمك!' : 'Thank you for your rating!' });
    } catch (err) {
      toast({ title: isRTL ? 'تعذر حفظ التقييم' : 'Error submitting rating', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E3] pt-28 pb-32 font-arabic text-[#263A2C]">
      
      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <Link href="/authors">
          <motion.button
            className={`inline-flex items-center gap-2 text-xs font-bold text-[#777363] hover:text-[#23432E] transition-colors mb-10 ${isRTL ? 'flex-row' : ''}`}
            whileHover={{ x: isRTL ? 3 : -3 }}
          >
            {isRTL ? <ArrowRight size={14} className="text-[#B49A63]" /> : <ArrowLeft size={14} className="text-[#B49A63]" />}
            <span>{isRTL ? 'العودة لقائمة المؤلفين' : 'Back to Authors'}</span>
          </motion.button>
        </Link>

        <div className="bg-[#FFFDF7] rounded-[2.5rem] p-8 sm:p-12 border border-[#D6C6A8] shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center md:items-start">
            
            {/* Portrait */}
            <div className="relative flex-shrink-0">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-[#B49A63] bg-[#EDE5D4] shadow-md p-1">
                {author.photo_url ? (
                  <img src={author.photo_url} alt={name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#23432E]">
                    {name[0] || 'أ'}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-right space-y-4">
              <span className="text-xs font-bold text-[#B49A63] tracking-widest uppercase block">
                {isRTL ? 'أديب ومفكر' : 'Author Profile'}
              </span>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#23432E]">
                {name}
              </h1>

              <p className="text-sm text-[#777363] font-bold">
                {author.nationality || (isRTL ? 'مؤلف معتمد لدى دار الرحاب' : 'Author at Dar Al-Rehab')}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-8 pt-4 border-t border-[#D6C6A8]/50">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-[#B49A63]" />
                  <span className="font-bold text-sm text-[#23432E]">
                    {books?.length || 0} {isRTL ? 'إصدارات' : 'Works'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={18} className="fill-[#B49A63] text-[#B49A63]" />
                  <span className="font-bold text-sm text-[#23432E]">
                    {(rating?.average || 5).toFixed(1)} / 5
                  </span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                {author.instagram && (
                  <a href={author.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#EDE5D4] flex items-center justify-center text-[#23432E] hover:text-[#B49A63] transition-colors">
                    <Instagram size={16} />
                  </a>
                )}
                {author.twitter && (
                  <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#EDE5D4] flex items-center justify-center text-[#23432E] hover:text-[#B49A63] transition-colors">
                    <Twitter size={16} />
                  </a>
                )}
                {author.website && (
                  <a href={author.website} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#EDE5D4] flex items-center justify-center text-[#23432E] hover:text-[#B49A63] transition-colors">
                    <Globe size={16} />
                  </a>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Main Content: Bio & Bibliography */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Biography */}
        <div className="bg-[#FFFDF7] rounded-3xl p-8 sm:p-10 border border-[#D6C6A8] shadow-sm mb-16">
          <h2 className="text-xl font-bold text-[#23432E] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B49A63]" />
            <span>{isRTL ? 'السيرة الذاتية والمسيرة الأدبية' : 'Biography'}</span>
          </h2>
          <div 
            className="text-base text-[#263A2C]/90 leading-relaxed font-arabic"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(bio?.replace(/\n/g, '<br/>') || (isRTL ? 'من أبرز الأقلام الأدبية الصادرة عن دار الرحاب للنشر والتوزيع.' : 'Distinguished author.')) }}
          />
        </div>

        {/* Bibliography Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#23432E]">
              {isRTL ? 'مؤلفات الكاتب الصادرة عن دار الرحاب' : 'Published Works'}
            </h2>
            <span className="text-xs font-bold text-[#777363]">
              {books?.length || 0} {isRTL ? 'إصداراً' : 'titles'}
            </span>
          </div>

          {booksLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[2/3] bg-[#EDE5D4] rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : books && books.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {books.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#FFFDF7] rounded-3xl border border-[#D6C6A8] p-8">
              <p className="text-sm text-[#777363]">
                {isRTL ? 'لا توجد إصدارات مسجلة حالياً.' : 'No works registered yet.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
