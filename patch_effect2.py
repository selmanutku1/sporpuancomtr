import sys

with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = """  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));"""

replacement = """  useEffect(() => {
    const q = query(collection(db, 'corporate_invite_requests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reqs: any[] = [];
      snapshot.forEach((doc) => {
        reqs.push({ id: doc.id, ...doc.data() });
      });
      setInviteRequests(reqs);
    }, (err) => {
      console.warn("Firestore invite requests listener error:", err);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));"""

if target in text:
    with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
        f.write(text.replace(target, replacement))
    print("Effect patched")
else:
    print("Target not found")
