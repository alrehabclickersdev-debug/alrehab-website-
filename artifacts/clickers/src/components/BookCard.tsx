import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Star, Eye, BookOpen } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';

interface BookCardProps {
  book: Record<string, any>;
  variant?: 'default' | 'compact' | 'featured';
  index?: number;
}

export function BookCard({ book, variant = 'default', index = 0 }: BookCardProps) {
  const { t, isRTL, language } = useLanguage();
  const queryClient = useQueryClient();

  // Prefetch book detail on hover
  const handlePrefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['book', book.id],
      queryFn: async () => {
        const { data } = await supabase
          .from('books')
          .select('*, authors(*), worlds(*)')
          .eq('id', book.id)
          .single();
        return data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };

  const title = language === 'ar' ? (book.title_ar || book.titleAr) : (book.title_en || book.titleEn);
  
  const authorData = Array.isArray(book.authors) ? book.authors[0] : book.authors;
  let authorName = authorData ? (language === 'ar' ? authorData.name_ar : authorData.name_en) : null;
  if (!authorName) {
    authorName = language === 'ar' ? book.authorNameAr : book.authorNameEn;
  }
  
  const discount = (book.original_price || book.originalPrice)
    ? Math.round((1 - book.price / (book.original_price || book.originalPrice)) * 100)
    : null;

  return (
    <motion.div
      className="group relative bg-[#FFFDF7] border border-[#D6C6A8] rounded-3xl p-3 shadow-[0_8px_24px_-8px_rgba(35,67,46,0.08)] hover:shadow-[0_16px_36px_-10px_rgba(35,67,46,0.14)] hover:border-[#B49A63] transition-all duration-300"
      data-testid={`card-book-${book.id}`}
      onMouseEnter={handlePrefetch}
      whileHover={{ y: -4 }}
    >
      <Link href={`/book/${book.id}`}>
        <div className="cursor-pointer">
          {/* Cover Image Container */}
          <div className={`relative overflow-hidden rounded-2xl bg-[#EDE5D4] mb-3.5 shadow-md group-hover:shadow-lg transition-all ${
            variant === 'compact' ? 'aspect-[2/3] h-48' : 'aspect-[2/3]'
          }`}>
            {book.cover_url || book.coverUrl ? (
              <img
                src={book.cover_url || book.coverUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#EDE5D4] text-[#B49A63]">
                <BookOpen size={36} />
              </div>
            )}
            
            {/* Price Tag Floating */}
            <div className={`absolute bottom-2.5 ${isRTL ? 'left-2.5' : 'right-2.5'}`}>
              <div className="bg-[#23432E]/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#B49A63]/60 shadow-md">
                <span className="text-[#FFFDF7] font-bold text-xs font-arabic">
                  {book.price} <span className="text-[10px] text-[#B49A63]">{t.common.currency}</span>
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className={`absolute top-2.5 ${isRTL ? 'right-2.5' : 'left-2.5'} flex flex-col gap-1.5`}>
              {(book.is_new || book.isNew) && (
                <span className="px-2.5 py-0.5 bg-[#B49A63] text-[#193A28] text-[10px] font-black rounded-full shadow-sm font-arabic">
                  {isRTL ? 'جديد' : 'NEW'}
                </span>
              )}
              {discount && (
                <span className="px-2 py-0.5 bg-[#A33B32] text-[#FFFDF7] text-[10px] font-bold rounded-full shadow-sm">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Hover View Detail Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[#23432E]/20 backdrop-blur-[2px]">
               <div className="w-11 h-11 bg-[#B49A63] text-[#193A28] rounded-full flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                 <Eye size={18} />
               </div>
            </div>
          </div>

          {/* Info Area */}
          <div className={`${isRTL ? 'text-right' : 'text-left'} px-1 pb-1 font-arabic`}>
            <p className="text-[#B49A63] font-bold text-xs mb-1 line-clamp-1">
              {authorName || (isRTL ? 'دار الرحاب' : 'Dar Al-Rehab')}
            </p>
            <h3 className="font-extrabold text-[#23432E] text-sm leading-snug line-clamp-1 mb-2 group-hover:text-[#B49A63] transition-colors">
              {title}
            </h3>
            
            {/* Rating & Format Footer */}
            <div className={`flex items-center justify-between text-xs pt-2 border-t border-[#D6C6A8]/40 ${isRTL ? 'flex-row' : ''}`}>
               <div className="flex items-center gap-1">
                 <Star size={12} className="fill-[#B49A63] text-[#B49A63]" />
                 <span className="font-bold text-[#23432E] text-[11px]">{book.rating || '5.0'}</span>
               </div>
               <span className="text-[11px] font-semibold text-[#777363]">
                 {book.genre_ar || book.genre || 'أدب'}
               </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
