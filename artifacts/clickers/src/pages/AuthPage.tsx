import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';
import { useLanguage } from '@/i18n/LanguageContext';

type Mode = 'login' | 'register' | 'forgot';

export function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const { user, profile, isAdmin, signIn, signUp, signOut, resetPassword } = useAuth();
  const { isRTL } = useLanguage();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.includes('Invalid login credentials')) {
          setError(isRTL ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : error);
        } else if (error.includes('Email not confirmed')) {
          setError(isRTL ? 'لم يتم تأكيد البريد الإلكتروني بعد. يرجى مراجعة بريدك الإلكتروني للتأكيد.' : error);
        } else {
          setError(error);
        }
      } else {
        navigate('/');
      }
    } else if (mode === 'register') {
      if (!fullName.trim()) {
        setError(isRTL ? 'يرجى إدخال اسمك الكامل' : 'Please enter your full name');
        setIsLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error);
      } else {
        setSuccess(isRTL ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!');
        navigate('/');
      }
    } else if (mode === 'forgot') {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error);
      } else {
        setSuccess(isRTL ? 'تم إرسال تعليمات استعادة كلمة المرور إلى بريدك الإلكتروني' : 'Password reset instructions have been sent to your email');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32" style={{ background: '#F5F0E3' }}>
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand Header */}
        <div className="text-center mb-10">
          <Link href="/">
            <div className="inline-flex items-center gap-3 cursor-pointer group">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
                style={{ background: '#23432E', border: '1px solid #B49A63' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B49A63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                  <path d="M6 14h6" />
                </svg>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-arabic font-extrabold text-2xl leading-none" style={{ color: '#23432E' }}>دار الرحاب</p>
                <p className="text-xs font-bold font-arabic mt-1" style={{ color: '#B49A63' }}>للنشر والتوزيع</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Card Box */}
        <div
          className="rounded-[2.5rem] overflow-hidden"
          style={{
            background: '#FFFDF7',
            border: '1px solid #D6C6A8',
            boxShadow: '0 20px 60px rgba(35,67,46,0.08)'
          }}
        >
          {user ? (
            /* Logged in state dashboard */
            <div className="p-8 text-center space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: 'rgba(35,67,46,0.1)', color: '#23432E', border: '1px solid #D6C6A8' }}
              >
                {isAdmin ? <ShieldCheck size={32} /> : <UserCheck size={32} />}
              </div>

              <div>
                <h3 className="text-xl font-bold font-arabic mb-1" style={{ color: '#23432E' }}>
                  {isRTL ? `أهلاً بك، ${profile?.full_name || 'قارئنا العزيز'}` : `Welcome, ${profile?.full_name || 'User'}`}
                </h3>
                <p className="text-xs font-mono" style={{ color: '#777363' }}>{user.email}</p>
                <div
                  className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold font-arabic"
                  style={{ background: '#EDE5D4', color: '#23432E', border: '1px solid #D6C6A8' }}
                >
                  {isAdmin ? (isRTL ? 'إدارة الدار (Admin)' : 'Admin Role') : (isRTL ? 'عضوية القارئ' : 'Reader Role')}
                </div>
              </div>

              {success && (
                <div className="text-sm font-bold p-3 rounded-xl font-arabic" style={{ background: 'rgba(35,67,46,0.1)', color: '#23432E' }}>
                  {success}
                </div>
              )}

              {error && (
                <div className="text-sm font-bold p-3 rounded-xl font-arabic bg-red-50 text-red-600 border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-3 pt-2">
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full py-3.5 rounded-full font-bold transition-all flex items-center justify-center gap-2 font-arabic text-sm shadow-md"
                    style={{ background: '#23432E', color: '#FFFDF7' }}
                  >
                    <LayoutDashboard size={18} />
                    <span>{isRTL ? 'الانتقال إلى لوحة إدارة الدار' : 'Go to Admin Panel'}</span>
                  </button>
                )}

                <button
                  onClick={() => signOut()}
                  className="w-full py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 font-arabic text-sm"
                  style={{ background: '#EDE5D4', color: '#777363', border: '1px solid #D6C6A8' }}
                >
                  <LogOut size={16} />
                  <span>{isRTL ? 'تسجيل الخروج' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Mode Tabs */}
              <div className="flex border-b" style={{ borderColor: '#D6C6A8' }}>
                {(['login', 'register'] as Mode[]).filter(m => m !== 'forgot').map((m) => {
                  const isActive = mode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                      className="flex-1 py-4 font-bold text-sm font-arabic transition-all"
                      style={{
                        background: isActive ? '#23432E' : '#EDE5D4',
                        color: isActive ? '#FFFDF7' : '#777363'
                      }}
                    >
                      {m === 'login'
                        ? (isRTL ? 'تسجيل الدخول' : 'Sign In')
                        : (isRTL ? 'حساب جديد' : 'Register')}
                    </button>
                  );
                })}
              </div>

              <div className="p-8">
                <AnimatePresence mode="wait">
                  <motion.form
                    key={mode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {mode === 'register' && (
                      <div>
                        <label className="block text-xs font-bold font-arabic mb-2" style={{ color: '#263A2C' }}>
                          {isRTL ? 'الاسم الكامل' : 'Full Name'}
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={isRTL ? 'مثال: عبد الرحمن محمد' : 'Your full name'}
                          required
                          className="w-full px-4 py-3 rounded-xl font-bold font-arabic text-sm transition-all focus:outline-none"
                          style={{
                            background: '#F5F0E3',
                            border: '1px solid #D6C6A8',
                            color: '#263A2C'
                          }}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold font-arabic mb-2" style={{ color: '#263A2C' }}>
                        {isRTL ? 'البريد الإلكتروني' : 'Email'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none text-left"
                        dir="ltr"
                        style={{
                          background: '#F5F0E3',
                          border: '1px solid #D6C6A8',
                          color: '#263A2C'
                        }}
                      />
                    </div>

                    {mode !== 'forgot' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold font-arabic" style={{ color: '#263A2C' }}>
                            {isRTL ? 'كلمة المرور' : 'Password'}
                          </label>
                          {mode === 'login' && (
                            <button
                              type="button"
                              onClick={() => { setMode('forgot'); setError(null); setSuccess(null); }}
                              className="text-xs font-bold font-arabic transition-colors"
                              style={{ color: '#B49A63' }}
                            >
                              {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            dir="ltr"
                            className="w-full px-4 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none pr-12 text-left"
                            style={{
                              background: '#F5F0E3',
                              border: '1px solid #D6C6A8',
                              color: '#263A2C'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 -translate-y-1/2 right-4 transition-colors"
                            style={{ color: '#777363' }}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-sm font-bold p-3 rounded-xl font-arabic ${isRTL ? 'text-right' : ''}`}
                        style={{ background: 'rgba(35,67,46,0.1)', color: '#23432E' }}
                      >
                        {success}
                      </motion.div>
                    )}

                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`text-sm font-bold p-3 rounded-xl font-arabic bg-red-50 text-red-600 border border-red-200 ${isRTL ? 'text-right' : ''}`}
                      >
                        {error}
                      </motion.p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 rounded-full font-bold font-arabic text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                      style={{
                        background: '#23432E',
                        color: '#FFFDF7',
                        boxShadow: '0 8px 20px rgba(35,67,46,0.2)'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>
                            {mode === 'login'
                              ? (isRTL ? 'تسجيل الدخول' : 'Sign In')
                              : mode === 'register'
                              ? (isRTL ? 'إنشاء حساب جديد' : 'Create Account')
                              : (isRTL ? 'إرسال رابط الاستعادة' : 'Send Reset Link')}
                          </span>
                          <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
                        </>
                      )}
                    </motion.button>

                    {mode === 'forgot' && (
                      <button
                        type="button"
                        onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                        className="w-full text-xs font-bold font-arabic transition-colors text-center mt-3"
                        style={{ color: '#777363' }}
                      >
                        {isRTL ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                      </button>
                    )}
                  </motion.form>
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
