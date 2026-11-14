import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import type { World } from '@/services/supabase.hooks';
import { useLanguage } from '@/i18n/LanguageContext';

interface WorldCardProps {
  world: World;
  index?: number;
}

export function WorldCard({ world, index = 0 }: WorldCardProps) {
  const { t, isRTL, language } = useLanguage();

  const name = language === 'ar' ? world.name_ar : world.name_en;
  const description = language === 'ar' ? world.description_ar : world.description_en;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
      data-testid={`card-world-${world.id}`}
    >
      <Link href={`/worlds/${world.id}`}>
        <div
          className="cursor-pointer relative rounded-[2.5rem] overflow-hidden aspect-[16/10] transition-all duration-700 hover:scale-[1.01]"
          style={{
            background: '#193A28',
            boxShadow: '0 20px 50px -10px rgba(35,67,46,0.3)',
            border: '1px solid rgba(180,154,99,0.3)'
          }}
        >
          {/* Background Image */}
          {world.banner_url ? (
            <img
              src={world.banner_url}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: world.color_primary || '#23432E' }} />
          )}

          {/* Sophisticated Gradients */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(25,58,40,0.95) 0%, rgba(25,58,40,0.6) 50%, rgba(25,58,40,0.2) 100%)'
            }}
          />

          {/* Top Detail Badge */}
          <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'}`}>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg"
              style={{ background: 'rgba(255,253,247,0.9)', backdropFilter: 'blur(8px)', border: '1px solid #D6C6A8' }}
            >
              <BookOpen size={14} style={{ color: '#23432E' }} />
              <span className="text-xs font-bold font-arabic" style={{ color: '#23432E' }}>
                {t.worlds.books}
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className={`absolute inset-0 flex flex-col justify-end p-8 md:p-10 ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="font-bold text-xs tracking-[0.3em] uppercase mb-2 font-arabic" style={{ color: '#B49A63' }}>
              {isRTL ? 'سلسلة أدبية' : 'Narrative Series'}
            </span>
            <h3 className="font-black text-2xl md:text-3xl mb-3 leading-tight font-arabic" style={{ color: '#FFFDF7' }}>
              {name}
            </h3>
            <p className={`text-sm line-clamp-2 mb-6 max-w-sm font-arabic leading-relaxed ${isRTL ? 'ml-auto' : 'mr-auto'}`} style={{ color: 'rgba(255,253,247,0.7)' }}>
              {description}
            </p>

            <motion.div
              className={`inline-flex items-center gap-3 text-sm font-bold font-arabic ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ color: '#B49A63' }}
            >
              <span>{t.worlds.explore}</span>
              <motion.div
                animate={{ x: isRTL ? [0, -4, 0] : [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
