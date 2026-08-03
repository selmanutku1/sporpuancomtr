import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALpsVjRPYQQHwV3rU--B2kmjtKBXJgkCI",
  projectId: "gen-lang-client-0185853879",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-sporpuan-584c3fa0-145e-4898-bad3-ca77311c7f56");

async function check() {
  const q = query(collection(db, "facilities"), limit(5));
  const snap = await getDocs(q);
  snap.forEach(doc => console.log(doc.id, doc.data().name, doc.data().image));
  process.exit(0);
}
check();
