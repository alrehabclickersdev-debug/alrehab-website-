import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { BookOpen, Award, Sparkles, Feather, Globe, Users, ArrowLeft, ArrowRight, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { SEO } from '@/components/SEO';

export function AboutPage() {
  const { isRTL } = useLanguage();

  return (
    <>
      <SEO 
        title={isRTL ? 'عن دار الرحاب للنشر والتوزيع — من رحاب الفكرة إلى خلود الحكاية' : 'About Us | Dar Al-Rehab Publishing'}
        description={isRTL ? 'تعرف على دار الرحاب للنشر والتوزيع، رسالتنا في صناعة الكتاب العربي الرفيع ودعم الفكر والأدب الأصيل.' : 'Discover Dar Al-Rehab Publishing House, our editorial commitment, and fine Arabic bookmaking.'}
      />

      <div className="min-h-screen pt-28 pb-32 bg-[#F5F0E3] font-arabic text-[#263A2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ─── HERO HEADER ────────────────────────────────────────────── */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#B49A63]/50 bg-[#EDE5D4] mb-6 shadow-sm"
            >
              <Sparkles size={16} className="text-[#B49A63]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#B49A63]">
                {isRTL ? 'عن الدار ورسالتها' : 'Our Legacy & Mission'}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#23432E] leading-tight mb-6"
            >
              {isRTL ? (
                <>
                  دار الرحاب <span className="text-[#B49A63]">للنشر والتوزيع</span>
                </>
              ) : (
                <>
                  Dar Al-Rehab <span className="text-[#B49A63]">Publishing House</span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-[#777363] leading-relaxed"
            >
              {isRTL
                ? 'من رحاب الفكرة... إلى خلود الحكاية. نمنح الكلمات بيتاً والأفكار طريقاً إلى القارئ، حاملين راية النشر العربي الرصين والمحتوى الأصيل.'
                : 'From the space of an idea to the eternity of a story. Providing words a sanctuary, and ideas an enduring path to readers.'}
            </motion.p>
          </div>

          {/* ─── EDITORIAL STORY & MANIFESTO ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 bg-[#FFFDF7] rounded-[2.5rem] p-8 sm:p-14 border border-[#D6C6A8] shadow-lg relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Visual Emblem */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-[#EDE5D4] p-3 border border-[#D6C6A8] shadow-md">
                  <img
                    src="/دار الرحاب_ من الفكرة للحكاية.png"
                    alt="دار الرحاب للنشر والتوزيع"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="mt-3 text-center text-xs font-bold text-[#B49A63]">
                    {isRTL ? '✦ دار الرحاب — مهد الحكاية والفكر ✦' : '✦ Dar Al-Rehab ✦'}
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative */}
              <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-[#263A2C]/90 leading-relaxed">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#B49A63] uppercase tracking-wider mb-2">
                  <Feather size={16} />
                  <span>{isRTL ? 'بيان الدار التحريري' : 'Editorial Manifesto'}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23432E]">
                  {isRTL ? 'نؤمن أن كل كتاب عظيم يستحق أن يُصنع كأثر خالد' : 'Every Great Book Deserves to Endure'}
                </h2>

                <p>
                  تأسست <strong>دار الرحاب للنشر والتوزيع</strong> لتكون موئلاً للأدباء والمفكرين وأصحاب الرؤى الفريدة. لم نكن يوماً مجرد مطبعة، بل نحن شركاء إبداع نرافق المؤلف منذ تخلق الفكرة الأولى وحتى إخراجها إلى النور في أبهى حلة تليق باللغة العربية وعراقتها.
                </p>

                <p>
                  نضع معايير صارمة في تحكيم المخطوطات والتدقيق اللغوي والإخراج الفني؛ فاختيار نوع الورق، وأوزان الأحرف، وتناغم الألوان على الغلاف، كلها أدوات نستخدمها لنقدم للقارئ العربي تجربة قرائية حسية لا تُنسى.
                </p>

                {/* Metric Badges */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#D6C6A8]/60 text-center">
                  <div className="p-4 rounded-2xl bg-[#EDE5D4]/40 border border-[#D6C6A8]">
                    <div className="text-xl sm:text-2xl font-black text-[#23432E]">+120</div>
                    <div className="text-[11px] font-bold text-[#777363] mt-1">{isRTL ? 'إصداراً أدبياً' : 'Titles'}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#EDE5D4]/40 border border-[#D6C6A8]">
                    <div className="text-xl sm:text-2xl font-black text-[#23432E]">18</div>
                    <div className="text-[11px] font-bold text-[#777363] mt-1">{isRTL ? 'معرضاً دولياً' : 'Book Fairs'}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#EDE5D4]/40 border border-[#D6C6A8]">
                    <div className="text-xl sm:text-2xl font-black text-[#B49A63]">100%</div>
                    <div className="text-[11px] font-bold text-[#777363] mt-1">{isRTL ? 'عناية وإتقان' : 'Dedication'}</div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* ─── PILLARS / VALUES ────────────────────────────────────── */}
          <div className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold text-[#B49A63] uppercase tracking-widest block mb-2">
                {isRTL ? 'قيمنا التأسيسية' : 'Core Principles'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#23432E]">
                {isRTL ? 'ركائز النشر في دار الرحاب' : 'Publishing Pillars'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Award,
                  title: isRTL ? 'الأصالة والتحكيم الأدبي' : 'Authenticity & Peer Review',
                  desc: isRTL
                    ? 'تخضع جميع الأعمال للجنة قراءة وتحكيم متخصصة تضمن سلامة الفكر ورصانة اللغة وجماليات الأسلوب.'
                    : 'Specialized editorial reading ensuring conceptual depth, linguistic integrity, and stylistic elegance.',
                },
                {
                  icon: Feather,
                  title: isRTL ? 'حرفية الصنعة والإخراج' : 'Refined Bookmaking Craft',
                  desc: isRTL
                    ? 'نهتم بأدق تفاصيل الكتاب من توريق الحروف والطباعة الفاخرة وتجليد الأغلفة بجودة تدوم لأجيال.'
                    : 'Devoting meticulous care to typography, luxurious paper stocks, and archival-quality bookbinding.',
                },
                {
                  icon: Globe,
                  title: isRTL ? 'الانتشار والوصول العربي' : 'Wide Regional Reach',
                  desc: isRTL
                    ? 'حضور دائم في معارض الكتاب الدولية (القاهرة، الرياض، الشارقة، أبوظبي) مع شبكة توزيع للمكتبات الرائدة.'
                    : 'Active participation across major international book fairs with distribution to premier bookstores.',
                },
              ].map((pillar, i) => (
                <div
                  key={i}
                  className="bg-[#FFFDF7] p-8 rounded-3xl border border-[#D6C6A8] hover:border-[#B49A63] shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#EDE5D4] flex items-center justify-center text-[#B49A63] mb-6">
                    <pillar.icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-[#23432E] mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#777363] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── CONTACT SECTION (#contact) ────────────────────────────── */}
          <div id="contact" className="scroll-mt-32">
            <div className="bg-[#FFFDF7] rounded-[2.5rem] p-8 sm:p-14 border border-[#D6C6A8] shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Contact Info */}
                <div className="lg:col-span-5 space-y-6">
                  <span className="text-xs font-bold text-[#B49A63] uppercase tracking-wider block">
                    {isRTL ? 'تواصل معنا' : 'Get in Touch'}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#23432E]">
                    {isRTL ? 'يسعدنا دائماً الاستماع إلى قرائنا ومؤلفينا' : 'We Welcome Your Enquiries'}
                  </h2>
                  <p className="text-sm text-[#777363] leading-relaxed">
                    {isRTL
                      ? 'سواء كنت مؤلفاً تود تقديم مخطوطتك، أو قارئاً يبحث عن عنوان معين، أو جهة ترغب في التعاون الثقافي، فإن أبواب دار الرحاب مفتوحة دائماً.'
                      : 'Whether you are an author presenting your manuscript or a reader seeking special editions, our doors are open.'}
                  </p>

                  <div className="space-y-4 pt-4 text-sm text-[#23432E]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EDE5D4] flex items-center justify-center text-[#B49A63]">
                        <Mail size={16} />
                      </div>
                      <span>contact@alrehab-publishing.com</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EDE5D4] flex items-center justify-center text-[#B49A63]">
                        <Phone size={16} />
                      </div>
                      <span dir="ltr">+20 100 000 0000</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EDE5D4] flex items-center justify-center text-[#B49A63]">
                        <MapPin size={16} />
                      </div>
                      <span>{isRTL ? 'القاهرة — المعادي / الرياض — حي العليا' : 'Cairo & Riyadh'}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-7">
                  <form onSubmit={(e) => { e.preventDefault(); alert(isRTL ? 'شكراً لتواصلك! سنرد عليك قريباً.' : 'Thank you for reaching out!'); }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#23432E] mb-2">
                          {isRTL ? 'الاسم الكامل' : 'Full Name'}
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 rounded-2xl bg-[#EDE5D4]/30 border border-[#D6C6A8] text-sm text-[#263A2C] focus:outline-none focus:border-[#B49A63]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#23432E] mb-2">
                          {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-4 py-3 rounded-2xl bg-[#EDE5D4]/30 border border-[#D6C6A8] text-sm text-[#263A2C] focus:outline-none focus:border-[#B49A63]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#23432E] mb-2">
                        {isRTL ? 'موضوع الرسالة' : 'Subject'}
                      </label>
                      <input
                        type="text"
                        placeholder={isRTL ? 'استفسار عن نشر، طلب كتب، تعاون...' : 'Subject...'}
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDE5D4]/30 border border-[#D6C6A8] text-sm text-[#263A2C] focus:outline-none focus:border-[#B49A63]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#23432E] mb-2">
                        {isRTL ? 'الرسالة' : 'Message'}
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder={isRTL ? 'اكتب رسالتك هنا بالتفصيل...' : 'Write your message...'}
                        className="w-full px-4 py-3 rounded-2xl bg-[#EDE5D4]/30 border border-[#D6C6A8] text-sm text-[#263A2C] focus:outline-none focus:border-[#B49A63] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-full font-bold text-xs bg-[#23432E] text-[#FFFDF7] hover:bg-[#193A28] shadow-md transition-all inline-flex items-center gap-2"
                    >
                      <span>{isRTL ? 'إرسال الرسالة' : 'Send Message'}</span>
                      {isRTL ? <ArrowLeft size={14} className="text-[#B49A63]" /> : <ArrowRight size={14} className="text-[#B49A63]" />}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
