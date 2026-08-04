const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, initializeFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyALpsVjRPYQQHwV3rU--B2kmjtKBXJgkCI",
  authDomain: "gen-lang-client-0185853879.firebaseapp.com",
  projectId: "gen-lang-client-0185853879",
  storageBucket: "gen-lang-client-0185853879.firebasestorage.app",
  messagingSenderId: "794151489682",
  appId: "1:794151489682:web:77fb42aff2b3f8bf16564b"
};

const app = initializeApp(firebaseConfig);
const databaseId = "ai-studio-sporpuan-584c3fa0-145e-4898-bad3-ca77311c7f56";
const db = getFirestore(app, databaseId);

async function run() {
  const querySnapshot = await getDocs(collection(db, "sports_events"));
  let slugs = [];
  querySnapshot.forEach((doc) => {
    slugs.push(doc.data().slug || doc.id);
  });
  console.log(slugs);
}
run();
