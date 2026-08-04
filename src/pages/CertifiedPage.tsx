import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Target, Award, CheckCircle, Users, Dumbbell } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { CriteriaSection } from '../components/certified/CriteriaSection';
import { PricingSection } from '../components/certified/PricingSection';
import { FAQSection } from '../components/certified/FAQSection';
import { ApplicationForm } from '../components/certified/ApplicationForm';

export const CertifiedPage = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <SEOHead title="Sporpuan Kalite Akreditasyonu" description="Tesisinizin kalitesini bağımsız denetimle belgelendirin." />
      
      {/* Hero - Enhanced */}
      <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/30"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left space-y-6"
          >
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-4 py-1 rounded-full font-bold text-sm tracking-wide uppercase">
              <Award className="w-4 h-4" /> Profesyonel Akreditasyon
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white leading-tight">
              Sporpuan Kalite <span className="text-blue-600">Akreditasyonu</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Tesisinizin hijyen, güvenlik ve hizmet standartlarını bağımsız denetimle kanıtlayın. Sporpuan rozeti ile tesisinizin güvenilirliğini bir üst seviyeye taşıyın.
            </p>
            <div className="flex justify-center md:justify-start gap-4 pt-4">
               <a href="#basvuru" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg shadow-blue-600/20 transition-transform hover:scale-105">Başvuru Yap</a>
               <a href="#kriterler" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-full text-lg transition-transform hover:scale-105">Kriterleri İncele</a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full max-w-md"
          >
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl border-4 border-blue-600 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="border-2 border-dashed border-slate-200 p-6 flex flex-col items-center text-center gap-4">
                <Award className="w-16 h-16 text-blue-600" />
                <h3 className="text-xl font-black text-slate-900">PREMIUM KALİTE</h3>
                <p className="text-sm text-slate-500">Sporpuan Bağımsız Denetim Kurulu tarafından onaylanmıştır.</p>
                <div className="flex gap-2">
                  <Dumbbell className="w-6 h-6 text-slate-300" />
                  <Users className="w-6 h-6 text-slate-300" />
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Why & Transparency */}
      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
            { title: "Güven Kazanın", desc: "Kullanıcılar ve veliler için tesisinize olan güveni en üst düzeye çıkarın." },
            { title: "Görünürlük Artırın", desc: "Akredite tesis rozeti ile aramalarda ve listelemelerde öne çıkın." },
            { title: "Sürekli İyileştirin", desc: "Bağımsız denetim raporları ile eksiklerinizi belirleyin, hizmet kalitenizi artırın." }
        ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-colors"
            >
               <CheckCircle className="w-10 h-10 text-blue-600 mb-4" />
               <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{item.title}</h3>
               <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
            </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="bg-blue-50 dark:bg-blue-950 p-8 rounded-3xl text-center border border-blue-200 dark:border-blue-800">
          <p className="text-blue-900 dark:text-blue-200 font-semibold text-lg flex items-center justify-center gap-2">
            <ShieldCheck className="w-6 h-6" /> Akreditasyon süreci bağımsızdır ve tesis puanlamasını etkilemez.
          </p>
        </div>
      </div>

      <CriteriaSection />
      
      {/* Levels - Enhanced */}
      <div className="max-w-7xl mx-auto px-4 py-20">
          <h2 className="text-4xl font-black text-center mb-16 text-slate-900 dark:text-white">Akreditasyon Seviyeleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                  { title: "Doğrulanmış", color: "blue", desc: "Tesisinizin temel bilgileri ve belgeleri doğrulanmıştır. Yeni başlayanlar için ideal." },
                  { title: "Standart Sertifikalı", color: "amber", desc: "70+ puan ile yüksek hizmet standartlarını belgeleyin. Güvenin simgesi." },
                  { title: "Premium", color: "emerald", desc: "85+ puan ve üstün altyapı. Profesyonel lig ve okul standartları." }
              ].map((lvl, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200"
                  >
                      <div className={`w-16 h-16 rounded-2xl bg-${lvl.color}-100 text-${lvl.color}-600 flex items-center justify-center mb-6`}>
                        <Award className="w-8 h-8" />
                      </div>
                      <h3 className={`text-2xl font-bold mb-4 text-${lvl.color}-600`}>{lvl.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{lvl.desc}</p>
                  </motion.div>
              ))}
          </div>
      </div>

      <PricingSection />
      <FAQSection />
      <ApplicationForm />
    </div>
  );
};
