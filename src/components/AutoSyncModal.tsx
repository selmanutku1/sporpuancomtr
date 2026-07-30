import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Globe, 
  CheckCircle2, 
  Zap, 
  Radio, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Layers,
  ArrowRight,
  Database,
  Terminal,
  Activity
} from 'lucide-react';
import { EXTERNAL_PORTALS, performWebSync, SyncResult } from '../services/syncEngine';
import { SportsEvent } from '../types';

interface AutoSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: SportsEvent[];
  onSyncComplete: (newEvents: SportsEvent[]) => void;
  isAutoSyncEnabled: boolean;
  setIsAutoSyncEnabled: (val: boolean) => void;
}

export const AutoSyncModal: React.FC<AutoSyncModalProps> = ({
  isOpen,
  onClose,
  events,
  onSyncComplete,
  isAutoSyncEnabled,
  setIsAutoSyncEnabled
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    'Eş zamanlı web senkronizasyon modülü hazır.',
    'Bağlı servisler: Passo, Biletix, Spor İstanbul, TVF Biletinial, Red Bull.',
  ]);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [activeTab, setActiveTab] = useState<'portals' | 'logs'>('portals');

  if (!isOpen) return null;

  const handleRunSync = () => {
    setIsSyncing(true);
    setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString('tr-TR')}] Web portalları taranıyor ve API entegrasyonu tetiklendi...`]);

    setTimeout(() => {
      const result = performWebSync(events);
      setLastSyncResult(result);
      setSyncLogs(prev => [
        ...prev,
        ...result.logMessages,
        `[${new Date().toLocaleTimeString('tr-TR')}] Senkronizasyon tamamlandı: ${result.addedCount} yeni popüler etkinlik eklendi.`
      ]);
      setIsSyncing(false);
      if (result.addedCount > 0) {
        onSyncComplete(result.newEvents);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-slate-800">
        
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
              <RefreshCw className={`w-5 h-5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Otomatik Etkinlik Senkronizasyonu</h3>
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                  Eş Zamanlı Web Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Passo, Biletix, Spor İstanbul ve federasyon yayınlarından popüler etkinlikler otomatik çekilir.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Main Controls Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900">Eş Zamanlı Otomatik Senkronizasyon (Live Mod)</h4>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1 max-w-md">
                Açık tutulduğunda, popüler spor portallarına yeni bir derbi, maraton veya turnuva eklendiğinde sporpuan veritabanı anlık olarak güncellenir.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoSyncEnabled}
                  onChange={(e) => setIsAutoSyncEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-xs font-bold text-slate-700 font-mono">
                {isAutoSyncEnabled ? 'AKTİF' : 'PASİF'}
              </span>
            </div>
          </div>

          {/* Sync Trigger Button */}
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs font-bold text-blue-950">Anlık Portalları Tara ve Etkinlikleri Çek</p>
                <p className="text-[11px] text-blue-700 font-medium">Türkiye genelindeki 5 ana bilet ve etkinlik portalı sorgulanır.</p>
              </div>
            </div>

            <button
              onClick={handleRunSync}
              disabled={isSyncing}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-2xs flex items-center gap-2 shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Portallar Taranıyor...' : 'Şimdi Senkronize Et'}</span>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('portals')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'portals'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Entegre Spor Portalları ({EXTERNAL_PORTALS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'logs'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Canlı Senkron Günlüğü ({syncLogs.length})</span>
            </button>
          </div>

          {/* Tab 1: Portals List */}
          {activeTab === 'portals' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXTERNAL_PORTALS.map((portal) => (
                <div 
                  key={portal.id}
                  className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{portal.logo}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs font-bold text-slate-900">{portal.name}</h5>
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">{portal.category} • {portal.domain}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold block">
                      {portal.eventsCount} Etkinlik
                    </span>
                    <span className="text-[9px] text-slate-500 mt-1 block">
                      Son: {portal.lastSyncTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Live Console Logs */}
          {activeTab === 'logs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 space-y-1.5 max-h-56 overflow-y-auto">
              {syncLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 select-none">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Tüm veriler resmi etkinlik sağlayıcılarından 100% doğrulanarak aktarılır.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition shadow-2xs"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
