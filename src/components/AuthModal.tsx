import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { X, User, Building2, Lock, Mail, ShieldCheck, Check, Sparkles, LogIn, UserPlus, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess,
  initialRole = 'user',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [role, setRole] = useState<UserRole>(initialRole);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [title, setTitle] = useState('');

  // Demo accounts
  const demoUsers: UserProfile[] = [
    {
      id: 'demo-user-1',
      name: 'Ahmet Yılmaz',
      email: 'ahmet@sporsever.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      title: 'Kıdemli Tribün Taraftarı',
      createdAt: '2025-01-15',
    },
    {
      id: 'demo-org-1',
      name: 'Mehmet Demir',
      email: 'organizasyon@maratonturkiye.com',
      role: 'organizer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      organizationName: 'Maraton Türkiye Derneği',
      title: 'Etkinlik Yöneticisi',
      createdAt: '2024-11-10',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim() || (role === 'organizer' ? organizationName || 'Organizatör Kulüp' : 'Spor Sever'),
      email: email.trim(),
      role,
      avatar: role === 'organizer'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      organizationName: role === 'organizer' ? (organizationName.trim() || name.trim()) : undefined,
      title: title.trim() || (role === 'organizer' ? 'Doğrulanmış Organizatör' : 'Doğrulanmış Sporsever'),
      createdAt: new Date().toISOString().split('T')[0],
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleDemoLogin = (demoUser: UserProfile) => {
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                sporpuan Hesap İşlemleri
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Organizatör veya sporsever olarak platforma katılın
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Kayıt Ol (Üye Ol)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Giriş Yap</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick Demo Login Cards */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-blue-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Hızlı Demo Hesap ile Tek Tıkla Bağlan:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoUsers.map((dUser) => (
                <button
                  key={dUser.id}
                  type="button"
                  onClick={() => handleDemoLogin(dUser)}
                  className="bg-white hover:bg-blue-100/50 border border-blue-200 hover:border-blue-400 p-2.5 rounded-xl text-left transition flex items-center gap-2.5 group"
                >
                  <img
                    src={dUser.avatar}
                    alt={dUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate flex items-center justify-between">
                      <span>{dUser.name}</span>
                      <ArrowRight className="w-3 h-3 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded inline-block">
                      {dUser.role === 'organizer' ? 'Organizatör' : 'Sporsever'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
              veya e-posta ile
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Account Type Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Üyelik Tipi *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    role === 'user'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <User className={`w-4 h-4 ${role === 'user' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold">Sporsever / Taraftar</div>
                    <div className="text-[10px] text-slate-500 font-normal">Yorum & Puan Ver</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('organizer')}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    role === 'organizer'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Building2 className={`w-4 h-4 ${role === 'organizer' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-bold">Organizatör / Kulüp</div>
                    <div className="text-[10px] text-slate-500 font-normal">Etkinlik Yayınla</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Name input */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                {role === 'organizer' ? 'Yetkili Adı Soyadı veya Kulüp Temsilcisi *' : 'Adınız Soyadınız *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'organizer' ? 'örn: Selman Utku' : 'örn: Ahmet Yılmaz'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>

            {/* Organization Name (If role === 'organizer') */}
            {role === 'organizer' && (
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Kulüp, Kurum veya Organizasyon Adı *
                </label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="örn: İstanbul Maratonu Derneği / Beşiktaş JK"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
            )}

            {/* Email input */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">E-Posta Adresi *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@domain.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Şifre *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition shadow-md shadow-blue-200 flex items-center justify-center gap-2 mt-2"
            >
              {activeTab === 'register' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{role === 'organizer' ? 'Organizatör Hesabı Oluştur' : 'Sporsever Hesabı Oluştur'}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Giriş Yap</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
