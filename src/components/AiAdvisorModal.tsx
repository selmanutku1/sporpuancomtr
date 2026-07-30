import React, { useState } from 'react';
import { SportsEvent, AiAnalysisData } from '../types';
import { X, Sparkles, Send, Bot, User, CheckCircle2, AlertCircle, Loader2, Trophy, Star } from 'lucide-react';

interface AiAdvisorModalProps {
  events: SportsEvent[];
  onClose: () => void;
  onApplyAiAnalysis?: (eventId: string, analysis: AiAnalysisData) => void;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  events,
  onClose,
  onApplyAiAnalysis,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'evaluate'>('chat');

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text: 'Merhaba! Ben Sporpuan AI. Spor etkinlikleri puanlaması, stadyum atmosferleri, ulaşım tavsiyeleri veya maraton hazırlıkları hakkında bana istediğinizi sorabilirsiniz!',
      time: 'Şimdi',
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Evaluate State
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [customComments, setCustomComments] = useState('');
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalResult, setEvalResult] = useState<AiAnalysisData | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Handle Send Chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);

    setChatLoading(true);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userText }),
      });

      const data = await response.json();

      if (response.ok && data.answer) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.answer,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.error || 'Üzgünüm, şu an yanıt verirken bir aksaklık yaşandı.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Generate Evaluation
  const handleRunEvaluation = async () => {
    const targetEvent = events.find((e) => e.id === selectedEventId);
    if (!targetEvent) return;

    setEvalLoading(true);
    setEvalError(null);
    setEvalResult(null);

    try {
      const response = await fetch('/api/ai/analyze-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: targetEvent.title,
          category: targetEvent.category,
          location: targetEvent.city,
          venue: targetEvent.venue,
          description: targetEvent.description,
          price: targetEvent.ticketPriceRange,
          userComments: customComments || 'Genel seyirci geri bildirimleri',
        }),
      });

      const data = await response.json();

      if (response.ok && data.overallScore) {
        setEvalResult(data);
        if (onApplyAiAnalysis) {
          onApplyAiAnalysis(targetEvent.id, data);
        }
      } else {
        setEvalError(data.error || 'AI Analizi üretilemedi.');
      }
    } catch (err: any) {
      setEvalError(err.message || 'Sunucu bağlantı hatası.');
    } finally {
      setEvalLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl overflow-hidden flex flex-col shadow-2xl my-auto text-slate-800 animate-in fade-in zoom-in-95 duration-200 min-h-[580px] max-h-[88vh]">
        
        {/* Header */}
        <div className="bg-slate-50 p-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold shadow-2xs">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900">Sporpuan AI</h3>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                  Gemini 3.6
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">sporpuan akıllı etkinlik puanlama & soru-cevap motoru</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-center border-b-2 transition flex items-center justify-center gap-2 ${
              activeTab === 'chat'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>SporPuan AI Soru-Cevap Danışmanı</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluate')}
            className={`flex-1 py-3 text-center border-b-2 transition flex items-center justify-center gap-2 ${
              activeTab === 'evaluate'
                ? 'border-blue-600 text-blue-600 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Otomatik Etkinlik Puan Raporu Al</span>
          </button>
        </div>

        {/* TAB 1: CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 text-xs sm:text-sm ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white font-medium rounded-tr-none shadow-2xs'
                        : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`text-[10px] block text-right font-mono ${
                        msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-3 rounded-xl border border-blue-200 w-fit font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>AI SporPuan yanıtı hazırlanıyor...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-5 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0">
              <span className="text-slate-500 font-semibold shrink-0">Örnek Sorular:</span>
              {[
                'Derbi maçlarında stadyuma ne zaman gitmeli?',
                'Ataşehir Ülker Arena sesi nasıl?',
                'İlk maratonum için ne tavsiye edersin?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setChatInput(q)}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0 font-medium"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-4 bg-white border-t border-slate-200 flex gap-2 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Spor etkinliği, stadyum veya biletler hakkında bir şey sor..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Gönder</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: EVALUATE */}
        {activeTab === 'evaluate' && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
            
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block uppercase tracking-wider">
                Analiz Edilecek Etkinliği Seçin:
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.city} - {ev.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block uppercase tracking-wider">
                Ek Kullanıcı Notları / Şikayetler Veya Övgüler (İsteğe Bağlı):
              </label>
              <textarea
                rows={2}
                placeholder="Örn: Turnikelerde kuyruk vardı ama ses sistemi muazzamdı..."
                value={customComments}
                onChange={(e) => setCustomComments(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-normal"
              />
            </div>

            <button
              onClick={handleRunEvaluation}
              disabled={evalLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {evalLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini Yapay Zeka Analizi Yapılıyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>AI SporPuan Raporunu Oluştur</span>
                </>
              )}
            </button>

            {evalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{evalError}</span>
              </div>
            )}

            {evalResult && (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="font-black text-sm text-slate-900">
                      AI Tahmini SporPuan Skoru: {evalResult.overallScore.toFixed(1)} / 10
                    </span>
                  </div>
                  <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded text-xs font-bold border border-blue-200">
                    {evalResult.scoreCategory}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 font-normal">
                  {evalResult.summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <strong className="text-emerald-800 block mb-1">Artı Yönler:</strong>
                    <ul className="list-disc list-inside text-slate-700 space-y-0.5 font-medium">
                      {evalResult.pros.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>

                  <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
                    <strong className="text-rose-800 block mb-1">Eksi Yönler:</strong>
                    <ul className="list-disc list-inside text-slate-700 space-y-0.5 font-medium">
                      {evalResult.cons.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-1">
                  <strong className="text-blue-900 block font-bold">Taraftar İpucu:</strong>
                  <p className="text-slate-700 font-normal">{evalResult.fanAdvice}</p>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
