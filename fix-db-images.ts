import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALpsVjRPYQQHwV3rU--B2kmjtKBXJgkCI",
  projectId: "gen-lang-client-0185853879",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-sporpuan-584c3fa0-145e-4898-bad3-ca77311c7f56");

async function fix() {
  const q = collection(db, "facilities");
  const snap = await getDocs(q);
  let updated = 0;
  for (const document of snap.docs) {
    const data = document.data();
    if (data.image && data.image.includes('places.googleapis.com')) {
       await updateDoc(doc(db, "facilities", document.id), {
         image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"
       });
       updated++;
    }
  }
  console.log('Fixed', updated, 'documents');
  process.exit(0);
}
fix();
