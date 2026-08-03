const fs = require('fs');

let content = fs.readFileSync('src/components/CorporatePage.tsx', 'utf8');

const targetStr = `                <PartnerLoginForm onLoginSuccess={(user) => {
                  // Simulate an onOpenAuthModal equivalent but just setting user?
                  // The parent handles currentUser state, but here we only have onOpenAuthModal.
                  // We need to trigger the parent's auth state update.
                  // Since onOpenAuthModal doesn't pass user, wait, App.tsx has onLoginSuccess ?
                  // The easiest is to just reload or if there is a callback...
                  window.location.reload();
                }} />`;

const replaceStr = `                <PartnerLoginForm onLoginSuccess={(user) => {
                  try {
                    localStorage.setItem('sporpuan_user', JSON.stringify(user));
                  } catch(e) {}
                  window.location.reload();
                }} />`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync('src/components/CorporatePage.tsx', content);
  console.log('Fixed PartnerLoginForm onLoginSuccess');
} else {
  console.log('Target string not found');
}
