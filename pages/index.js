import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white font-vazirmatn">
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-sky-900 mb-4">
              تحلیل هوشمند آزمایش خون
            </h1>
            <p className="text-lg text-sky-700 max-w-2xl mx-auto">
              با استفاده از هوش مصنوعی، نتایج آزمایش خون خود را به صورت دقیق و قابل فهم تحلیل کنید
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <Link href="/blood-test-analysis">
              <motion.div 
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl p-8 text-center cursor-pointer transform transition-all duration-300"
              >
                <div className="flex flex-col items-center">
                  <div className="bg-white/20 p-4 rounded-full mb-6">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">امتحان کنید</h2>
                  <p className="text-white/90 text-lg mb-6">
                    همین حالا شروع کنید و نتایج آزمایش خون خود را تحلیل کنید
                  </p>
                  <div className="bg-white/20 px-6 py-3 rounded-full text-white font-medium hover:bg-white/30 transition-colors">
                    شروع تحلیل
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-sky-100"
          >
            <h2 className="text-2xl font-bold text-sky-900 mb-6 text-center">مزایای استفاده از سرویس ما</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="text-center p-4"
              >
                <div className="text-sky-600 mb-4">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-sky-900 mb-2">تحلیل سریع</h3>
                <p className="text-sky-700">
                  دریافت نتایج تحلیل در کمترین زمان ممکن
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="text-center p-4"
              >
                <div className="text-sky-600 mb-4">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-sky-900 mb-2">دقت بالا</h3>
                <p className="text-sky-700">
                  استفاده از هوش مصنوعی برای تحلیل دقیق نتایج
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="text-center p-4"
              >
                <div className="text-sky-600 mb-4">
                  <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-sky-900 mb-2">به‌روزرسانی مداوم</h3>
                <p className="text-sky-700">
                  استفاده از جدیدترین متدهای تحلیل و تشخیص
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 