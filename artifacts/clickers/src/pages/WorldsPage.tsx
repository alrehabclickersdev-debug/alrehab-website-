import { motion } from 'framer-motion';
import { WorldCard } from '@/components/WorldCard';
import { useLanguage } from '@/i18n/LanguageContext';
import { useWorlds } from '@/services/supabase.hooks';

export function WorldsPage() {
  const { t, isRTL } = useLanguage();
  const { data: worlds, isLoading } = useWorlds();

  return (
    <div className="min-h-screen pt-32 pb-24" style={{ background: '#F5F0E3' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: '#B49A63' }} />
            <span className="font-bold uppercase tracking-[0.3em] text-xs font-arabic" style={{ color: '#B49A63' }}>
              {isRTL ? 'عوالم وسلاسل دار الرحاب' : 'Literary Collections'}
            </span>
            <div className="h-px w-8" style={{ background: '#B49A63' }} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-arabic mb-4" style={{ color: '#23432E' }}>
            {t.worlds.title}
          </h1>
          <p className="text-base md:text-lg font-arabic max-w-2xl mx-auto leading-relaxed" style={{ color: '#777363' }}>
            {t.worlds.subtitle}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: '#D6C6A8', borderTopColor: '#23432E' }} />
          </div>
        ) : worlds && worlds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {worlds.map((world, i) => (
              <WorldCard key={world.id} world={world} index={i} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20 px-6 rounded-3xl"
            style={{ background: '#FFFDF7', border: '1px solid #D6C6A8' }}
          >
            <p className="font-bold font-arabic text-base" style={{ color: '#777363' }}>
              {isRTL ? 'لا توجد سلاسل مسجلة حالياً في الأرشيف.' : 'No worlds found in the archive yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
