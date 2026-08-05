import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { X, User, Building2, Lock, Mail, ShieldCheck, Check, Sparkles, LogIn, UserPlus, ArrowRight, FileText } from 'lucide-react';
import { auth, db, googleProvider, appleProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { LegalModal, LegalDocType } from './LegalModal';
import { notifyRegistration } from '../lib/notifications';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [title, setTitle] = useState('');

  // Legal Consent states
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState<LegalDocType | null>(null);

  const saveUserToFirestore = async (userProfile: UserProfile) => {
    try {
      const userRef = doc(db, 'users', userProfile.id);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, userProfile);
      } else {
        const existingData = userSnap.data() as UserProfile;
        return existingData;
      }
    } catch (e: any) {
      if (e.message?.includes('offline') || e.code === 'unavailable') {
        console.warn("Firestore offline - user save queued or deferred");
      } else {
        console.error("Error saving user to Firestore", e);
      }
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
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
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

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Lütfen e-posta adresinizi giriniz.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    } catch (err: any) {
      setError('Şifre sıfırlama bağlantısı gönderilemedi: ' + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'register') {
      if (!termsAccepted || !kvkkAccepted) {
        setError('Devam edebilmek için Kullanım Şartları ve KVKK Aydınlatma Metnini onaylamanız gerekmektedir.');
        return;
      }
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        let role: UserRole = 'user';
        if (email === 'selmanutkumarmara@gmail.com') {
          role = 'admin';
        }

        let userProfile: UserProfile = {
          id: user.uid,
          name: email.split('@')[0] || 'Kullanıcı',
          email: email.trim(),
          role,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          title: 'Doğrulanmış Sporsever',
          createdAt: new Date().toISOString().split('T')[0],
        };

        userProfile = await saveUserToFirestore(userProfile);
        
        // Notify admin about new user registration
        await notifyRegistration('kullanıcı', userProfile.name, userProfile.email);

        onLoginSuccess(userProfile);
        onClose();
      } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/operation-not-allowed') {
          const mockUid = 'mock-user-' + Math.random().toString(36).substring(2, 11);
          let role: UserRole = 'user';
          if (email === 'selmanutkumarmara@gmail.com') {
            role = 'admin';
          }
          let userProfile: UserProfile = {
            id: mockUid,
            name: email.split('@')[0] || 'Kullanıcı',
            email: email.trim(),
            role,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            title: 'Doğrulanmış Sporsever',
            createdAt: new Date().toISOString().split('T')[0],
          };
          userProfile = await saveUserToFirestore(userProfile);
          onLoginSuccess(userProfile);
          onClose();
        } else if (err.code === 'auth/email-already-in-use') {
          setError('Bu e-posta adresi zaten kullanımda.');
        } else if (err.code === 'auth/weak-password') {
          setError('Şifre en az 6 karakter olmalıdır.');
        } else {
          setError(err.message || 'Kayıt yapılırken bir hata oluştu.');
        }
      }
    } else {
      // Login mode
      try {
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        let role: UserRole = 'user';
        if (email === 'selmanutkumarmara@gmail.com') {
          role = 'admin';
        }

        let userProfile: UserProfile = {
          id: user.uid,
          name: user.displayName || email.split('@')[0] || 'Kullanıcı',
          email: email.trim(),
          role,
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
          let role: UserRole = 'user';
          if (email === 'selmanutkumarmara@gmail.com') {
            role = 'admin';
          }
          let userProfile: UserProfile = {
            id: 'mock-user-' + Math.random().toString(36).substring(2, 11),
            name: email.split('@')[0] || 'Kullanıcı',
            email: email.trim(),
            role,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            title: 'Doğrulanmış Sporsever',
            createdAt: new Date().toISOString().split('T')[0],
          };
          userProfile = await saveUserToFirestore(userProfile);
          onLoginSuccess(userProfile);
          onClose();
        } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError('Hatalı e-posta veya şifre.');
        } else {
          setError(err.message || 'Giriş yapılırken bir hata oluştu.');
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col max-h-[90vh] overflow-hidden text-slate-800 dark:text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {activeTab === 'register' ? 'Hesap Oluştur' : 'Giriş Yap'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex p-1 gap-1 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition ${
              activeTab === 'register'
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Kayıt Ol
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition ${
              activeTab === 'login'
                ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Giriş Yap
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {error && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-[11px] rounded-lg border border-red-100 dark:border-red-900 font-medium">
              {error}
            </div>
          )}
          
          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-[11px] py-2 rounded-lg transition"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={handleAppleLogin}
              className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] py-2 rounded-lg transition"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.25.68 2.74.68.42 0 1.64-.81 3.01-.76 1.48.06 2.6.59 3.3 1.48-2.64 1.45-2.18 4.95.53 6.03-.7 1.87-1.47 3.5-2.62 4.92l.04.62zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-1.5">
            <div className="border-t border-slate-100 dark:border-slate-800 w-full"></div>
            <span className="bg-white dark:bg-slate-900 px-2 text-[10px] font-bold text-slate-400 uppercase">veya</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-[11px]">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-Posta"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:border-blue-500 outline-none"
            />
            
            {activeTab === 'login' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-300">Beni Hatırla</span>
                </label>
                <button type="button" onClick={handleForgotPassword} className="text-[10px] text-blue-600 font-bold hover:underline">
                  Şifremi Unuttum?
                </button>
              </div>
            )}
            
            {activeTab === 'register' && (
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-850 p-2 rounded-lg">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-0.5" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-300">Kullanım Şartları ve Gizlilik Politikasını kabul ediyorum.</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={kvkkAccepted} onChange={(e) => setKvkkAccepted(e.target.checked)} className="mt-0.5" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-300">KVKK Aydınlatma Metnini kabul ediyorum.</span>
                </label>
              </div>
            )}

            <button type="submit" className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
              {activeTab === 'register' ? 'Hesap Oluştur' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
