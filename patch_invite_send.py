import sys

with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = """                      {req.status !== 'completed' && (
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
                      )}"""

replacement = """                      {req.status !== 'completed' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const isEmail = req.contact.includes('@');
                              const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
                              const baseUrl = window.location.origin + '/kurumsal';
                              const params = new URLSearchParams();
                              params.set('inviteCode', randomCode);
                              params.set('sender', 'Yönetici Ekibi');
                              const fullUrl = `${baseUrl}?${params.toString()}`;
                              
                              if (isEmail) {
                                const subject = `Spor Puan Kurumsal Davetiyesi`;
                                const body = `Merhaba,\n\nTesisinizi Spor Puan platformuna eklemek için özel davetiyeniz oluşturuldu.\n\nAşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:\n\n${fullUrl}\n\nİyi çalışmalar,\nSpor Puan Yönetimi`;
                                window.open(`mailto:${req.contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                              } else {
                                let phone = req.contact.replace(/[^0-9]/g, '');
                                if (phone.length === 10) phone = '90' + phone;
                                if (phone.length === 11 && phone.startsWith('0')) phone = '90' + phone.substring(1);
                                
                                const text = `Merhaba,\n\nTesisinizi Spor Puan platformuna eklemek için özel davetiyeniz oluşturuldu. Aşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:\n\n${fullUrl}`;
                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
                              }
                            }}
                            className={`px-3 py-1.5 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 ${req.contact.includes('@') ? 'bg-blue-500 hover:bg-blue-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                          >
                            {req.contact.includes('@') ? <Mail className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                            Davetiye Gönder
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                await updateDoc(doc(db, 'corporate_invite_requests', req.id), { status: 'completed' });
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-lg text-xs font-bold transition"
                          >
                            İşaretle
                          </button>
                        </div>
                      )}"""

if target in text:
    with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
        f.write(text.replace(target, replacement))
    print("Patched UI")
else:
    print("Target not found")
