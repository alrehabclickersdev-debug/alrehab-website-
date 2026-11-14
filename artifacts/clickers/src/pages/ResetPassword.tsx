import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/useAuth';
import { useLanguage } from '@/i18n/LanguageContext';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { updatePassword } = useAuth();
  const { isRTL } = useLanguage();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    const { error } = await updatePassword(password);

    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/auth'), 3000);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-32" style={{ background: '#F5F0E3' }}>
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div
          className="rounded-[2.5rem] p-8 md:p-10"
          style={{
            background: '#FFFDF7',
            border: '1px solid #D6C6A8',
            boxShadow: '0 20px 60px rgba(35,67,46,0.06)'
          }}
        >
          <div className="text-center mb-6">
            <span className="font-bold uppercase tracking-[0.2em] text-xs font-arabic" style={{ color: '#B49A63' }}>
              {isRTL ? 'أمان الحساب' : 'Security'}
            </span>
            <h2 className="text-2xl font-black mt-1 font-arabic" style={{ color: '#23432E' }}>
              {isRTL ? 'تعيين كلمة مرور جديدة' : 'Reset Your Password'}
            </h2>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(35,67,46,0.1)', color: '#23432E' }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-bold font-arabic" style={{ color: '#23432E' }}>
                {isRTL ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully!'}
              </p>
              <p className="text-sm font-arabic" style={{ color: '#777363' }}>
                {isRTL ? 'سيتم تحويلك إلى صفحة الدخول تلقائياً...' : 'Redirecting to sign in...'}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
              <div>
                <label className="block text-xs font-bold font-arabic mb-2" style={{ color: '#263A2C' }}>
                  {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
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

              <div>
                <label className="block text-xs font-bold font-arabic mb-2" style={{ color: '#263A2C' }}>
                  {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl font-bold text-sm transition-all focus:outline-none text-left"
                  style={{
                    background: '#F5F0E3',
                    border: '1px solid #D6C6A8',
                    color: '#263A2C'
                  }}
                />
              </div>

              {error && (
                <p className="text-sm font-bold p-3 rounded-xl font-arabic bg-red-50 text-red-600 border border-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-full font-bold font-arabic text-sm shadow-md transition-all flex items-center justify-center gap-2"
                style={{
                  background: '#23432E',
                  color: '#FFFDF7'
                }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isRTL ? 'حفظ كلمة المرور الجديدة' : 'Save New Password'}</span>
                    <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
