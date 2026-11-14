import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, Search, BookOpen, RotateCcw } from 'lucide-react';
import { BookCard } from '@/components/BookCard';
import { SectionHeader } from '@/components/SectionHeader';
import { useLanguage } from '@/i18n/LanguageContext';
import { useBooks } from '@/services/supabase.hooks';
import { useSmartSearch } from '@/hooks/useSmartSearch';
import { useDiscovery } from '@/hooks/useDiscovery';

type SortOption = 'newest' | 'popular' | 'priceAsc' | 'priceDesc';
type GenreFilter = 'all' | 'Fantasy' | 'Sci-Fi' | 'Historical' | 'Horror' | 'Romance' | 'Adventure' | 'Literary' | 'Mystery';
type FormatFilter = 'all' | 'digital' | 'physical';

export function Store() {
  const { t, isRTL, language } = useLanguage();
  const { data: books, isLoading } = useBooks({ status: undefined });
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('all');
  const [selectedFormat, setSelectedFormat] = useState<FormatFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);

  const { results: searchResults } = useSmartSearch(search);
  const { trackSearch } = useDiscovery();

  const genres: GenreFilter[] = ['all', 'Literary', 'Historical', 'Fantasy', 'Sci-Fi', 'Romance', 'Adventure', 'Mystery'];
  const genreLabels: Record<GenreFilter, string> = {
    all: language === 'ar' ? 'جميع الإصدارات' : 'All Titles',
    Literary: language === 'ar' ? 'الروايات والأدب' : 'Literary Fiction',
    Historical: language === 'ar' ? 'التاريخ والتراث' : 'History & Heritage',
    Fantasy: language === 'ar' ? 'الفانتازيا والخيال' : 'Fantasy',
    'Sci-Fi': language === 'ar' ? 'الخيال العلمي' : 'Sci-Fi',
    Romance: language === 'ar' ? 'الأدب الوجداني' : 'Romance',
    Adventure: language === 'ar' ? 'المغامرة' : 'Adventure',
    Mystery: language === 'ar' ? 'الغموض والإثارة' : 'Mystery',
    Horror: language === 'ar' ? 'الرعب' : 'Horror',
  };

  const filteredBooks = useMemo(() => {
    let result = [...(books || [])];

    if (search.trim()) {
      result = searchResults;
      trackSearch(search);
    }

    if (selectedGenre !== 'all') {
      result = result.filter((b) => b.genre === selectedGenre);
    }

    if (selectedFormat !== 'all') {
      result = result.filter((b) => b.format === selectedFormat || b.format === 'both');
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.published_date || 0).getTime() - new Date(a.published_date || 0).getTime());
        break;
      case 'priceAsc':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'priceDesc':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.review_count || 0) - (a.review_count || 0));
        break;
    }

    return result;
  }, [books, search, searchResults, selectedGenre, selectedFormat, sortBy]);

  return (
    <div className="min-h-screen pt-28 pb-32 bg-[#F5F0E3] font-arabic">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#B49A63] tracking-widest uppercase block mb-2">
            {isRTL ? 'مكتبة دار الرحاب' : 'The Library of Dar Al-Rehab'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#23432E] tracking-tight mb-4">
            {isRTL ? 'إصدارات دار الرحاب' : 'Publications & Titles'}
          </h1>
          <p className="text-base text-[#777363] leading-relaxed">
            {isRTL
              ? 'تصفح باقة مختارة من أمهات الكتب والروايات والدراسات الفكرية المطبوعة بعناية استثنائية.'
              : 'Browse our curated collection of literature, history, and thought, bound with exquisite craftsmanship.'}
          </p>
        </div>

        {/* Search and Action Bar */}
        <div className={`flex flex-col lg:flex-row gap-4 mb-10 items-center ${isRTL ? 'lg:flex-row' : ''}`}>
          
          {/* Search Input */}
          <div className="relative flex-1 w-full group">
            <div className={`absolute inset-y-0 ${isRTL ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-[#777363] group-focus-within:text-[#B49A63] transition-colors`}>
              <Search size={18} />
            </div>
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRTL ? 'ابحث عن عنوان كتاب أو مؤلف...' : 'Search titles or authors...'}
              className={`w-full py-4 ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} bg-[#FFFDF7] border border-[#D6C6A8] rounded-full text-[#263A2C] font-semibold placeholder-[#777363]/60 focus:outline-none focus:border-[#B49A63] focus:ring-2 focus:ring-[#B49A63]/20 shadow-sm transition-all`}
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Filter Toggle Button */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2.5 px-6 py-4 rounded-full border transition-all font-bold text-xs shadow-sm ${
                showFilters 
                  ? 'bg-[#23432E] text-[#FFFDF7] border-[#23432E]' 
                  : 'bg-[#FFFDF7] border-[#D6C6A8] text-[#263A2C] hover:border-[#B49A63]'
              }`}
              whileTap={{ scale: 0.96 }}
            >
              <SlidersHorizontal size={16} className={showFilters ? 'text-[#B49A63]' : 'text-[#777363]'} />
              <span>{isRTL ? 'تصفية النتائج' : 'Filters'}</span>
            </motion.button>

            {/* Sort Select */}
            <div className="relative flex-1 lg:flex-none min-w-[170px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full appearance-none bg-[#FFFDF7] border border-[#D6C6A8] rounded-full px-5 py-4 font-bold text-xs text-[#263A2C] focus:outline-none focus:border-[#B49A63] cursor-pointer shadow-sm hover:border-[#B49A63] transition-colors"
              >
                <option value="popular">{isRTL ? 'الأكثر طلباً' : 'Most Popular'}</option>
                <option value="newest">{isRTL ? 'الأحدث إصداراً' : 'Newest'}</option>
                <option value="priceAsc">{isRTL ? 'السعر: من الأقل' : 'Price: Low to High'}</option>
                <option value="priceDesc">{isRTL ? 'السعر: من الأعلى' : 'Price: High to Low'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Drawer / Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-10 p-6 sm:p-8 bg-[#FFFDF7] rounded-3xl border border-[#D6C6A8] shadow-lg overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-bold text-[#B49A63] uppercase tracking-wider mb-4">
                    {isRTL ? 'تصنيف النشر' : 'Genre Categories'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGenre(g)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          selectedGenre === g 
                            ? 'bg-[#23432E] text-[#FFFDF7] shadow-sm' 
                            : 'bg-[#EDE5D4] text-[#777363] hover:text-[#23432E] hover:border-[#B49A63]'
                        }`}
                      >
                        {genreLabels[g]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#B49A63] uppercase tracking-wider mb-4">
                    {isRTL ? 'صيغة الكتاب' : 'Book Format'}
                  </h4>
                  <div className="flex gap-2">
                    {(['all', 'physical', 'digital'] as FormatFilter[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedFormat(f)}
                        className={`flex-1 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                          selectedFormat === f 
                            ? 'bg-[#23432E] text-[#FFFDF7] shadow-sm' 
                            : 'bg-[#EDE5D4] text-[#777363] hover:text-[#23432E]'
                        }`}
                      >
                        {f === 'all' 
                          ? (language === 'ar' ? 'الكل' : 'All') 
                          : f === 'physical' 
                            ? (language === 'ar' ? 'نسخة ورقية' : 'Hardcover') 
                            : (language === 'ar' ? 'نسخة رقمية' : 'Digital')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Counter & Reset */}
        <div className="flex items-center justify-between mb-8 text-xs font-bold text-[#777363]">
          <p>
            {isRTL ? 'يعرض' : 'Showing'} <span className="text-[#23432E] font-black">{filteredBooks.length}</span> {isRTL ? 'كتاباً' : 'titles'}
          </p>

          {(selectedGenre !== 'all' || selectedFormat !== 'all' || search) && (
            <button 
              onClick={() => { setSearch(''); setSelectedGenre('all'); setSelectedFormat('all'); }}
              className="text-[#B49A63] hover:text-[#23432E] transition-colors flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>{isRTL ? 'إعادة تعيين التصفية' : 'Reset Filters'}</span>
            </button>
          )}
        </div>

        {/* Books Grid */}
        <AnimatePresence mode="wait">
          {filteredBooks.length > 0 ? (
            <motion.div
              key="grid"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-[#EDE5D4] rounded-3xl animate-pulse" />
                ))
              ) : (
                filteredBooks.map((book, i) => (
                  <BookCard key={book.id} book={book} index={i} />
                ))
              )}
            </motion.div>
          ) : (
            <div className="py-28 text-center bg-[#FFFDF7] rounded-3xl border border-[#D6C6A8] p-8 max-w-xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#EDE5D4] flex items-center justify-center mx-auto mb-4 text-[#B49A63]">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#23432E] mb-2">
                {isRTL ? 'لم نعثر على كتب مطابقة' : 'No titles found'}
              </h3>
              <p className="text-sm text-[#777363] mb-6">
                {isRTL ? 'جرب البحث بكلمات أخرى أو اختر تصنيفاً آخر.' : 'Try adjusting your search terms or genre filter.'}
              </p>
              <button 
                onClick={() => { setSearch(''); setSelectedGenre('all'); setSelectedFormat('all'); }}
                className="px-6 py-2.5 bg-[#23432E] text-[#FFFDF7] font-bold text-xs rounded-full hover:bg-[#193A28] transition-all"
              >
                {isRTL ? 'عرض جميع الإصدارات' : 'Show All Titles'}
              </button>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
