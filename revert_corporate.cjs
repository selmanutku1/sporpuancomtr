const fs = require('fs');

let content = fs.readFileSync('src/components/CorporatePage.tsx', 'utf8');

// 1. Remove PartnerLoginForm component
const partnerLoginStart = content.indexOf('const PartnerLoginForm =');
if (partnerLoginStart !== -1) {
  const partnerLoginEnd = content.indexOf('interface CorporatePageProps {', partnerLoginStart);
  if (partnerLoginEnd !== -1) {
    content = content.substring(0, partnerLoginStart) + content.substring(partnerLoginEnd);
  }
}

// 2. Fix imports
content = content.replace("import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';", "import { doc, setDoc } from 'firebase/firestore';");
content = content.replace("import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth';\nimport { auth } from '../lib/firebase';\n\n", "");

// 3. Revert the embedded form in the render body
const authModalReplacementStr = `                {/* Embedded Partner Login Form */}
                <PartnerLoginForm onLoginSuccess={(user) => {
                  try {
                    localStorage.setItem('sporpuan_user', JSON.stringify(user));
                  } catch(e) {}
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
                </div>`;

const originalAuthModalTarget = `                <div className="space-y-2 max-w-lg mx-auto">
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
                </div>`;

if (content.includes(authModalReplacementStr)) {
  content = content.replace(authModalReplacementStr, originalAuthModalTarget);
} else {
    // maybe slight differences
    const targetStartStr = '{/* Embedded Partner Login Form */}';
    const targetStartIdx = content.indexOf(targetStartStr);
    
    if (targetStartIdx !== -1) {
        const targetEndStr = '<div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">';
        const targetEndIdx = content.indexOf(targetEndStr, targetStartIdx);
        
        if(targetEndIdx !== -1) {
             const toReplace = content.substring(targetStartIdx, targetEndIdx);
             content = content.replace(toReplace, originalAuthModalTarget + '\n                \n                ');
        }
    }
}

fs.writeFileSync('src/components/CorporatePage.tsx', content);
console.log('Reverted CorporatePage');

