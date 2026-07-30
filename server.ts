import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to initialize GoogleGenAI safely
  const getAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY bulunamadı. Lütfen Ayarlar > Secrets bölümünden GEMINI_API_KEY tanımlayın.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Route: AI Spor Etkinliği Puan & Analiz Asistanı
  app.post('/api/ai/analyze-event', async (req, res) => {
    try {
      const { title, category, location, venue, description, price, userComments } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Etkinlik başlığı gereklidir.' });
      }

      const ai = getAIClient();

      const prompt = `Sen "sporpuan.com" platformunun baş spor etkinliği analistisin.
Aşağıdaki spor etkinliği bilgilerini incele ve objektif bir Puanlama & Değerlendirme Analizi raporu oluştur.

ETKİNLİK BİLGİLERİ:
- Başlık: ${title}
- Kategori: ${category || 'Genel Spor'}
- Şehir/Lokasyon: ${location || 'Belirtilmedi'}
- Tesis/Stadyum/Parkur: ${venue || 'Belirtilmedi'}
- Fiyat/Bilet Durumu: ${price || 'Belirtilmedi'}
- Açıklama/Detay: ${description || 'Belirtilmedi'}
- Kullanıcı Notları/Şikayetleri/Övgüleri: ${userComments || 'Yok'}

Senden aşağıdaki JSON formatında bir yanıt beklenmektedir:
{
  "overallScore": number (1.0 ile 10.0 arası, örn: 8.7),
  "scoreCategory": "Mükemmel" | "Çok İyi" | "Ortalama" | "Geliştirilmeli",
  "scores": {
    "organization": number (1.0 - 10.0),
    "valueForMoney": number (1.0 - 10.0),
    "amenities": number (1.0 - 10.0),
    "atmosphere": number (1.0 - 10.0),
    "accessibility": number (1.0 - 10.0)
  },
  "summary": "Etkinliğin genel değerlendirmesini özetleyen 2-3 cümlelik Türkçe profesyonel inceleme metni.",
  "pros": ["Artı yön 1", "Artı yön 2", "Artı yön 3"],
  "cons": ["Eksi/Geliştirilebilir yön 1", "Eksi/Geliştirilebilir yön 2"],
  "fanAdvice": "Etkinliğe katılacak spor severlere ve taraftarlara 1-2 cümlelik tavsiye.",
  "organizerAdvice": "Organizatörlere sonraki etkinlik için geliştirme tavsiyesi."
}

Yanıtı SADECE ve SADECE yukarıdaki JSON formatında ver, markdown kod bloğu içinde olmasın.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      return res.json(parsedData);
    } catch (error: any) {
      console.error('Gemini SporPuan Analiz Hatası:', error);
      return res.status(500).json({
        error: error.message || 'AI Analizi oluşturulurken bir hata meydana geldi.',
      });
    }
  });

  // API Route: AI Spor Etkinliği Danışmanı (Soru - Cevap)
  app.post('/api/ai/advisor', async (req, res) => {
    try {
      const { question, eventTitle } = req.body;

      if (!question) {
        return res.status(400).json({ error: 'Soru belirtilmedi.' });
      }

      const ai = getAIClient();

      const prompt = `Sen "sporpuan.com" Türkiye spor etkinlikleri uzmanı yapay zekasısın.
Spor etkinlikleri puanlaması, bilet seçimi, stadyum ulaşımı, organizasyon kalitesi, maraton hazırlığı, tribün atmosferi ve etkinlik incelemeleri konusunda yardımcı oluyorsun.

${eventTitle ? `Kullanıcı şu etkinlik hakkında soruyor: "${eventTitle}"` : ''}
Kullanıcının sorusu: "${question}"

Yanıtını dostane, bilgilendirici, objektif ve Türkçe olarak ver. Gerektiğinde maddeler halinde ipuçları sun. Maksimum 200 kelime.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      return res.json({ answer: response.text });
    } catch (error: any) {
      console.error('Gemini Advisor Hatası:', error);
      return res.status(500).json({
        error: error.message || 'Yanıt üretilirken bir hata oluştu.',
      });
    }
  });

  // Vite veya Static sunum
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SporPuan Server] Sunucu çalışıyor: http://0.0.0.0:${PORT}`);
  });
}

startServer();
