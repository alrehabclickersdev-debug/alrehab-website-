import { Link } from 'wouter';
import { BookOpen, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-32" style={{ background: '#F5F0E3' }}>
      <div
        className="max-w-md w-full text-center p-10 rounded-[3rem]"
        style={{
          background: '#FFFDF7',
          border: '1px solid #D6C6A8',
          boxShadow: '0 20px 60px rgba(35,67,46,0.06)'
        }}
      >
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm"
          style={{ background: '#EDE5D4', color: '#B49A63', border: '1px solid #D6C6A8' }}
        >
          <BookOpen size={36} />
        </div>

        <span className="font-mono text-4xl font-black block mb-2" style={{ color: '#B49A63' }}>
          404
        </span>

        <h1 className="text-2xl md:text-3xl font-black mb-3 font-arabic" style={{ color: '#23432E' }}>
          الصفحة غير موجودة
        </h1>

        <p className="font-arabic text-sm leading-relaxed mb-8" style={{ color: '#777363' }}>
          يبدو أن هذه الصفحة قد ضلت طريقها في فهارس مكتبتنا، أو نُقلت إلى رفّ أدبي آخر.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <button
              className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold font-arabic text-sm transition-all flex items-center justify-center gap-2 shadow-md"
              style={{ background: '#23432E', color: '#FFFDF7' }}
            >
              <Home size={16} />
              <span>الرئيسية</span>
            </button>
          </Link>

          <Link href="/store">
            <button
              className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold font-arabic text-sm transition-all flex items-center justify-center gap-2"
              style={{ background: '#EDE5D4', color: '#23432E', border: '1px solid #D6C6A8' }}
            >
              <span>تصفح الكتب</span>
              <ArrowRight size={16} className="rotate-180" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
