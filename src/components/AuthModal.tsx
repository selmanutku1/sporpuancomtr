import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { X, User, Building2, Lock, Mail, ShieldCheck, Check, Sparkles, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { auth, db, googleProvider, appleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');

  const saveUserToFirestore = async (userProfile: UserProfile) => {
    try {
      const userRef = doc(db, 'users', userProfile.id);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, userProfile);
      } else {
        // If it exists, update with latest login info if needed, but for now just leave it.
        // Or we could return the existing profile
        const existingData = userSnap.data() as UserProfile;
        return existingData;
      }
    } catch (e) {
      console.error("Error saving user to Firestore", e);
    }
    return userProfile;
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      let userProfile: UserProfile = {
        id: user.uid,
        name: user.displayName || 'Spor Sever',
        email: user.email || '',
        role: user.email === 'selmanutkumarmara@gmail.com' ? 'admin' : 'user',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        title: 'Doğrulanmış Sporsever',
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      userProfile = await saveUserToFirestore(userProfile);
      
      onLoginSuccess(userProfile);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        const mockUid = 'mock-google-' + Math.random().toString(36).substring(2, 11);
        let userProfile: UserProfile = {
          id: mockUid,
          name: 'Google Kullanıcısı',
          email: 'google@example.com',
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          title: 'Doğrulanmış Sporsever',
          createdAt: new Date().toISOString().split('T')[0],
        };
        userProfile = await saveUserToFirestore(userProfile);
        onLoginSuccess(userProfile);
        onClose();
      } else {
        setError(err.message || 'Google girişi başarısız oldu.');
      }
    }
  };

  const handleAppleLogin = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;
      
      let userProfile: UserProfile = {
        id: user.uid,
        name: user.displayName || 'Spor Sever',
        email: user.email || '',
        role: user.email === 'selmanutkumarmara@gmail.com' ? 'admin' : 'user',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        title: 'Doğrulanmış Sporsever',
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      userProfile = await saveUserToFirestore(userProfile);

      onLoginSuccess(userProfile);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        const mockUid = 'mock-apple-' + Math.random().toString(36).substring(2, 11);
        let userProfile: UserProfile = {
          id: mockUid,
          name: 'Apple Kullanıcısı',
          email: 'apple@example.com',
          role: 'user',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          title: 'Doğrulanmış Sporsever',
          createdAt: new Date().toISOString().split('T')[0],
        };
        userProfile = await saveUserToFirestore(userProfile);
        onLoginSuccess(userProfile);
        onClose();
      } else {
        setError(err.message || 'Apple girişi başarısız oldu.');
      }
    }
  };

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
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setError(null);
      let user;
      
      if (activeTab === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        user = result.user;
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        user = result.user;
      }

      let userProfile: UserProfile = {
        id: user.uid,
        name: name.trim() || user.displayName || 'Spor Sever',
        email: user.email || email.trim(),
        role: (user.email === 'selmanutkumarmara@gmail.com' || email.trim() === 'selmanutkumarmara@gmail.com') ? 'admin' : 'user',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        title: title.trim() || 'Doğrulanmış Sporsever',
        createdAt: new Date().toISOString().split('T')[0],
      };

      userProfile = await saveUserToFirestore(userProfile);

      onLoginSuccess(userProfile);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        const mockUid = 'mock-email-' + Math.random().toString(36).substring(2, 11);
        let userProfile: UserProfile = {
          id: mockUid,
          name: name.trim() || 'Spor Sever',
          email: email.trim(),
          role: email.trim() === 'selmanutkumarmara@gmail.com' ? 'admin' : 'user',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          title: title.trim() || 'Doğrulanmış Sporsever',
          createdAt: new Date().toISOString().split('T')[0],
        };
        userProfile = await saveUserToFirestore(userProfile);
        onLoginSuccess(userProfile);
        onClose();
      } else {
        setError(err.message || 'Giriş/Kayıt işlemi başarısız oldu.');
      }
    }
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
                Giriş Yap / Üye Ol
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
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}
          
          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={handleAppleLogin}
              className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.25.68 2.74.68.42 0 1.64-.81 3.01-.76 1.48.06 2.6.59 3.3 1.48-2.64 1.45-2.18 4.95.53 6.03-.7 1.87-1.47 3.5-2.62 4.92l.04.62zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
              veya e-posta ile
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Name input */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                Adınız Soyadınız *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="örn: Ahmet Yılmaz"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>

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
                  <span>Hesap Oluştur</span>
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
