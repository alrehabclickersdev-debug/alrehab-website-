import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Music, Video, Clock, Filter, ExternalLink } from 'lucide-react';
import { useMedia, type Media } from '@/services/supabase.hooks';

const TYPE_CONFIG = {
  all: { label: 'كافة الوسائط', labelEn: 'All', icon: Filter },
  video: { label: 'المقاطع الوثائقية', labelEn: 'Videos', icon: Video },
  music: { label: 'المقطوعات الصوتية', labelEn: 'Music', icon: Music },
  trailer: { label: 'الإعلانات التشويقية', labelEn: 'Trailers', icon: Play },
};

function getYouTubeID(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function MediaPage() {
  const [filter, setFilter] = useState<'all' | 'video' | 'music' | 'trailer'>('all');
  const { data: media, isLoading } = useMedia(filter);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 overflow-hidden" style={{ background: '#F5F0E3' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Header */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="h-px w-8" style={{ background: '#B49A63' }} />
            <span className="font-bold uppercase tracking-[0.3em] text-xs font-arabic" style={{ color: '#B49A63' }}>
              أرشيف دار الرحاب
            </span>
            <div className="h-px w-8" style={{ background: '#B49A63' }} />
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl font-black font-arabic mb-4"
            style={{ color: '#23432E' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            الوسائط والإنتاج الفني
          </motion.h1>
          <motion.p
            className="text-base md:text-lg font-arabic max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#777363' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            إعلانات تشويقية لإصداراتنا، مقاطع حوارية مع المؤلفين، ومقطوعات أدبية مصاحبة للرحلة.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const isActive = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key as any)}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm font-arabic transition-all shadow-sm"
                style={{
                  background: isActive ? '#23432E' : '#FFFDF7',
                  color: isActive ? '#FFFDF7' : '#777363',
                  border: `1px solid ${isActive ? '#23432E' : '#D6C6A8'}`
                }}
              >
                <Icon size={16} style={{ color: isActive ? '#B49A63' : 'inherit' }} />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Media Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-video rounded-3xl animate-pulse" style={{ background: '#FFFDF7', border: '1px solid #D6C6A8' }} />
              ))}
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {(media ?? []).map((m: Media) => {
                const ytId = getYouTubeID(m.url);
                const cfg = TYPE_CONFIG[m.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.video;
                const TypeIcon = cfg.icon;

                return (
                  <motion.div
                    key={m.id}
                    variants={item}
                    className="group"
                  >
                    <div
                      className="rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                      style={{
                        background: '#FFFDF7',
                        border: '1px solid #D6C6A8',
                        boxShadow: '0 8px 30px rgba(35,67,46,0.05)'
                      }}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video overflow-hidden" style={{ background: '#193A28' }}>
                        {playingId === m.id ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                            className="w-full h-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          />
                        ) : (
                          <>
                            <img
                              src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as any).src = `https://img.youtube.com/vi/${ytId}/0.jpg`;
                              }}
                            />
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                              <button
                                onClick={() => setPlayingId(m.id)}
                                className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110"
                                style={{ background: '#23432E', color: '#B49A63', border: '1px solid #B49A63' }}
                              >
                                <Play fill="currentColor" size={22} className="ml-0.5" />
                              </button>
                            </div>
                            {/* Duration Badge */}
                            {m.duration && (
                              <div
                                className="absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1"
                                style={{ background: 'rgba(25,58,40,0.85)', color: '#FFFDF7' }}
                              >
                                <Clock size={12} />
                                {m.duration}
                              </div>
                            )}
                            {/* Type Badge */}
                            <div
                              className="absolute top-3 right-3 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-xs font-bold font-arabic"
                              style={{ background: '#EDE5D4', color: '#23432E', border: '1px solid #D6C6A8' }}
                            >
                              <TypeIcon size={12} style={{ color: '#B49A63' }} />
                              <span>{cfg.label}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-6">
                        <h3 className="font-bold text-lg line-clamp-1 mb-2 font-arabic" style={{ color: '#23432E' }} dir="rtl">
                          {m.title_ar}
                        </h3>
                        <p className="text-xs font-arabic line-clamp-2 leading-relaxed h-9" style={{ color: '#777363' }} dir="rtl">
                          {m.description_ar}
                        </p>

                        <div className="mt-4 pt-4 border-t flex items-center justify-between" style={{ borderColor: '#EDE5D4' }}>
                          <button
                            onClick={() => setPlayingId(m.id)}
                            className="text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 font-arabic"
                            style={{ color: '#23432E' }}
                          >
                            <Play size={12} fill="currentColor" style={{ color: '#B49A63' }} />
                            <span>{m.type === 'music' ? 'استماع للمقطع' : 'مشاهدة الآن'}</span>
                          </button>
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:opacity-70"
                            style={{ color: '#B49A63' }}
                          >
                            <ExternalLink size={15} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && (media ?? []).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <Video size={48} strokeWidth={1.5} className="mb-4" style={{ color: '#B49A63' }} />
            <p className="font-bold font-arabic text-base" style={{ color: '#777363' }}>
              لا توجد وسائط مسجلة حالياً ضمن هذا التصنيف
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
