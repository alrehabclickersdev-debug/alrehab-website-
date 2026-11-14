import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Star } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface AuthorCardProps {
  author: Record<string, any>;
  index?: number;
}

export function AuthorCard({ author, index = 0 }: AuthorCardProps) {
  const { isRTL, language } = useLanguage();
  const name = language === 'ar' ? (author.name_ar || author.nameAr) : (author.name_en || author.nameEn);
  const bio = language === 'ar' ? (author.bio_ar || author.bioAr) : (author.bio_en || author.bioEn);

  return (
    <motion.div
      className="group font-arabic"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      data-testid={`card-author-${author.id}`}
      whileHover={{ y: -4 }}
    >
      <Link href={`/authors/${author.id}`}>
        <div className="cursor-pointer relative rounded-3xl overflow-hidden bg-[#FFFDF7] border border-[#D6C6A8] p-6 hover:border-[#B49A63] shadow-sm hover:shadow-md transition-all duration-300">
          <div className={`flex gap-4 mb-4 ${isRTL ? 'flex-row' : ''}`}>
            <div className="relative flex-shrink-0">
              <img
                src={author.photo_url || author.imageUrl || 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?auto=format&fit=crop&w=400&q=80'}
                alt={name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#B49A63]"
                loading="lazy"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#B49A63] text-[#193A28] rounded-full flex items-center justify-center shadow-sm">
                <Star size={10} fill="#193A28" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-[#23432E] text-base mb-0.5 group-hover:text-[#B49A63] transition-colors ${isRTL ? 'text-right' : ''}`}>
                {name}
              </h3>
              <p className="text-[#777363] text-xs">{author.nationality || (isRTL ? 'مؤلف وأديب' : 'Author')}</p>
              <div className={`flex items-center gap-1.5 mt-2 ${isRTL ? 'justify-start' : ''}`}>
                {(author.genres || ['أدب', 'رواية']).slice(0, 2).map((g: string) => (
                  <span key={g} className="px-2 py-0.5 bg-[#EDE5D4] text-[#23432E] text-[10px] font-bold rounded-full">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className={`text-[#777363] text-xs line-clamp-2 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
            {bio || (isRTL ? 'من مؤلفي دار الرحاب المتميزين في مجالات الأدب والفكر والسرد الروائي.' : 'Distinguished author at Dar Al-Rehab.')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
