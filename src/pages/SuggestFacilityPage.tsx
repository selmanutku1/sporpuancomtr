import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { SEOHead } from '../components/SEOHead';
import { ArrowLeft, Send } from 'lucide-react';

export const SuggestFacilityPage: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [facilityName, setFacilityName] = useState('');
  const [category, setCategory] = useState('tesis');
  const [details, setDetails] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'facility_suggestions'), {
        facilityName,
        category,
        details,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 w-full flex-1">
      <SEOHead title="Tesis Öner" description="Sitemizde olmayan bir spor tesisini, spor okulunu veya etkinliği bize önerin." />
      
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
          <ArrowLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Tesis Öner</h1>
      </div>

      {submitted ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Öneriniz Alındı!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">İncelememiz için gönderdiğiniz tesis bilgileri için teşekkür ederiz.</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">Ana Sayfaya Dön</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tesis Adı</label>
            <input type="text" required value={facilityName} onChange={(e) => setFacilityName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kategori</label>
            <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition">
              <option value="tesis">Tesis</option>
              <option value="spor-okulu">Spor Okulu</option>
              <option value="spor-salonu">Spor Salonu</option>
              <option value="etkinlik">Etkinlik</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Detaylar / Konum</label>
            <textarea required rows={4} value={details} onChange={(e) => setDetails(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition"></textarea>
          </div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-lg">
            <Send className="w-5 h-5" />
            Öneriyi Gönder
          </button>
        </form>
      )}
    </div>
  );
};
