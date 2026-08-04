const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

if (!content.includes('firebase/app')) {
  content = content.replace(
    "import express from 'express';",
    "import express from 'express';\nimport { initializeApp } from 'firebase/app';\nimport { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';"
  );
}

// Ensure Firebase is initialized inside startServer or globally
const firebaseConfigStr = `
const firebaseConfig = {
  apiKey: "AIzaSyALpsVjRPYQQHwV3rU--B2kmjtKBXJgkCI",
  authDomain: "gen-lang-client-0185853879.firebaseapp.com",
  projectId: "gen-lang-client-0185853879",
  storageBucket: "gen-lang-client-0185853879.firebasestorage.app",
  messagingSenderId: "794151489682",
  appId: "1:794151489682:web:77fb42aff2b3f8bf16564b"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, "ai-studio-sporpuan-584c3fa0-145e-4898-bad3-ca77311c7f56");
`;

if (!content.includes('const firebaseApp = initializeApp')) {
  content = content.replace(
    'async function startServer() {',
    `${firebaseConfigStr}\nasync function startServer() {`
  );
}

fs.writeFileSync('server.ts', content);
console.log('Patched server imports and firebase init');
