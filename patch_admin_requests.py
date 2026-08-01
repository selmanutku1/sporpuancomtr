import sys

with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target_state = """  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events' | 'reviews' | 'corporate'>('overview');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [corporateApps, setCorporateApps] = useState<CorporateApplication[]>([]);"""

replacement_state = """  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'events' | 'reviews' | 'corporate' | 'invite-requests'>('overview');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [corporateApps, setCorporateApps] = useState<CorporateApplication[]>([]);
  const [inviteRequests, setInviteRequests] = useState<any[]>([]);"""

if target_state in text:
    text = text.replace(target_state, replacement_state)
    print("State patched")

target_effect = """  useEffect(() => {
    // 2. Fetch Users (Simplistic approach for admin panel display)
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));"""

replacement_effect = """  useEffect(() => {
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
    // 2. Fetch Users (Simplistic approach for admin panel display)
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));"""

if target_effect in text:
    text = text.replace(target_effect, replacement_effect)
    print("Effect patched")

target_tabs = """            {tab === 'corporate' && 'Kurumsal Başvurular'}"""

replacement_tabs = """            {tab === 'corporate' && 'Kurumsal Başvurular'}
            {tab === 'invite-requests' && 'Davetiye Talepleri'}"""

if target_tabs in text:
    text = text.replace(target_tabs, replacement_tabs)
    print("Tabs patched")

target_tabs_array = """        {(['overview', 'users', 'events', 'reviews', 'corporate'] as const).map(tab => ("""

replacement_tabs_array = """        {(['overview', 'users', 'events', 'reviews', 'corporate', 'invite-requests'] as const).map(tab => ("""

if target_tabs_array in text:
    text = text.replace(target_tabs_array, replacement_tabs_array)
    print("Tabs array patched")

target_ui = """      {/* Basic implementations for other tabs to keep it functional */}"""

replacement_ui = """      {activeTab === 'invite-requests' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Hızlı Davetiye Talepleri
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {inviteRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                Henüz davetiye talebi bulunmuyor.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {inviteRequests.map((req) => (
                  <div key={req.id} className="p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 text-sm">İletişim: <span className="text-blue-600">{req.contact}</span></div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(req.createdAt).toLocaleString('tr-TR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${req.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {req.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                      </span>
                      {req.status !== 'completed' && (
                        <button
                          onClick={async () => {
                            try {
                              await updateDoc(doc(db, 'corporate_invite_requests', req.id), { status: 'completed' });
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition"
                        >
                          İletişime Geçildi İşaretle
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Basic implementations for other tabs to keep it functional */}"""

if target_ui in text:
    text = text.replace(target_ui, replacement_ui)
    print("UI patched")

with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

