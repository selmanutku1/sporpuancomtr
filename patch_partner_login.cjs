const fs = require('fs');

let content = fs.readFileSync('src/components/CorporatePage.tsx', 'utf8');

const importAuth = `import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { auth } from '../lib/firebase';`;

if (!content.includes('signInWithEmailAndPassword')) {
  content = content.replace("import { doc, setDoc } from 'firebase/firestore';", 
  "import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';\n" + importAuth);
}

const loginFormStr = `
const PartnerLoginForm = ({ onLoginSuccess }: { onLoginSuccess: (user: UserProfile) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data() as UserProfile;
        if (userData.requiresPasswordChange) {
          setTempUser(userCredential.user);
          setNeedsPasswordChange(true);
        } else {
          onLoginSuccess(userData);
        }
      } else {
        setError('Kullanıcı profili bulunamadı.');
      }
    } catch (err: any) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }
    
    setLoading(true);
    try {
      if (tempUser) {
        await updatePassword(tempUser, newPassword);
        const userRef = doc(db, 'users', tempUser.uid);
        await updateDoc(userRef, { requiresPasswordChange: false });
        
        const updatedSnap = await getDoc(userRef);
        onLoginSuccess(updatedSnap.data() as UserProfile);
      }
    } catch (err: any) {
      setError('Şifre güncellenirken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (needsPasswordChange) {
    return (
      <div className="w-full max-w-md mx-auto space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Şifrenizi Güncelleyin</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">İlk girişiniz olduğu için lütfen şifrenizi değiştirin.</p>
        
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <input type="password" placeholder="Yeni Şifre" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
          </div>
          <div>
            <input type="password" placeholder="Yeni Şifre (Tekrar)" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50">
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle ve Giriş Yap'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Partner & Kurumsal Giriş</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">Size iletilen kurum bilgileriyle giriş yapabilirsiniz.</p>
      
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input type="email" placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
        </div>
        <div>
          <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50">
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
};
`;

if (!content.includes('PartnerLoginForm =')) {
  content = content.replace("interface CorporatePageProps {", loginFormStr + "\ninterface CorporatePageProps {");
}

const authModalReplacement = `{!currentUser ? (
              <div className="p-8 sm:p-14 text-center space-y-6">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                
                {/* Embedded Partner Login Form */}
                <PartnerLoginForm onLoginSuccess={(user) => {
                  // Simulate an onOpenAuthModal equivalent but just setting user?
                  // The parent handles currentUser state, but here we only have onOpenAuthModal.
                  // We need to trigger the parent's auth state update.
                  // Since onOpenAuthModal doesn't pass user, wait, App.tsx has onLoginSuccess ?
                  // The easiest is to just reload or if there is a callback...
                  window.location.reload();
                }} />

                <div className="pt-6">
                  <p className="text-sm text-slate-500 mb-3">Veya yeni kayıt oluşturmak için:</p>
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm rounded-xl transition inline-flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Bireysel / Yeni Kayıt</span>
                  </button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">`;

const authModalTarget = `{!currentUser ? (
              <div className="p-8 sm:p-14 text-center space-y-6">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2 max-w-lg mx-auto">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Kurumsal Üyelik Girişi Gereklidir
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    Kurumsal üyelik tesis kayıt formunu doldurabilmek için lütfen önce üye girişi yapınız veya yeni hesap oluşturunuz.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-600/20 inline-flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Giriş Yap / Üye Ol</span>
                  </button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">`;

if (content.includes(authModalTarget)) {
  content = content.replace(authModalTarget, authModalReplacement);
  fs.writeFileSync('src/components/CorporatePage.tsx', content);
  console.log('Successfully updated CorporatePage for Partner Login');
} else {
  console.log('Target string to replace not found.');
}

