import sys

with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target_reviews_state = """  const [searchQuery, setSearchQuery] = useState('');"""
replacement_reviews_state = """  const [searchQuery, setSearchQuery] = useState('');

  const allReviews = useMemo(() => {
    const list: (Review & { eventTitle: string; eventId: string })[] = [];
    events.forEach(ev => {
      ev.reviews.forEach(rev => {
        list.push({ ...rev, eventTitle: ev.title, eventId: ev.id });
      });
    });
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return list;
  }, [events]);"""

if target_reviews_state in text:
    text = text.replace(target_reviews_state, replacement_reviews_state)
    print("Added allReviews memo")


target_tabs = """      {activeTab === 'events' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          Etkinlik ve Tesis yönetimi paneli (Basitleştirilmiş görünüm)
        </div>
      )}
      
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
          Değerlendirme yönetimi paneli (Basitleştirilmiş görünüm)
        </div>
      )}"""

replacement_tabs = """      {activeTab === 'events' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Etkinlik/Tesis</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium">Şehir</th>
                  <th className="px-4 py-3 font-medium text-center">Puan</th>
                  <th className="px-4 py-3 font-medium text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map(ev => (
                  <tr key={ev.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{ev.title}</td>
                    <td className="px-4 py-3 text-slate-600">{ev.category}</td>
                    <td className="px-4 py-3 text-slate-600">{ev.city}</td>
                    <td className="px-4 py-3 text-slate-600 text-center font-bold text-blue-600">
                      {ev.overallScore > 0 ? ev.overallScore.toFixed(1) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <button 
                        onClick={() => onEditEvent(ev)} 
                        className="text-blue-500 hover:text-blue-700 font-bold transition"
                      >
                        Düzenle
                      </button>
                      <button 
                        onClick={() => {
                          setConfirmDialog({
                            message: `"${ev.title}" adlı tesisi silmek istediğinize emin misiniz?`,
                            onConfirm: () => onDeleteEvent(ev.id)
                          });
                        }} 
                        className="text-rose-500 hover:text-rose-700 font-bold transition"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Kayıt bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Tarih</th>
                  <th className="px-4 py-3 font-medium">Kullanıcı</th>
                  <th className="px-4 py-3 font-medium">Tesis/Etkinlik</th>
                  <th className="px-4 py-3 font-medium text-center">Puan</th>
                  <th className="px-4 py-3 font-medium w-1/3">Yorum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allReviews.map(rev => (
                  <tr key={rev.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {new Date(rev.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div className="flex items-center gap-2">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-medium text-xs">{rev.userName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium text-xs">{rev.eventTitle}</td>
                    <td className="px-4 py-3 text-slate-600 text-center font-bold text-amber-500">{rev.rating}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                       <p className="line-clamp-2" title={rev.comment}>{rev.comment}</p>
                    </td>
                  </tr>
                ))}
                {allReviews.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Değerlendirme bulunamadı.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}"""

if target_tabs in text:
    text = text.replace(target_tabs, replacement_tabs)
    print("Added tabs implementation")

with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

