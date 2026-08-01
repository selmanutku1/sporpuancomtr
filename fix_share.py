import sys
with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target_funcs = """  const handleCopyGeneratedLink = async () => {"""

replacement_funcs = """  const handleShareWhatsApp = () => {
    const text = `Merhaba${invitePersonName ? ' ' + invitePersonName : ''},\n\n${inviteTargetName ? inviteTargetName + ' tesisinizi ' : 'Tesisinizi '}Spor Puan platformuna eklemek için özel davetiyeniz oluşturuldu. Aşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:\n\n${generatedInviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = `Spor Puan Kurumsal Davetiyesi${inviteTargetName ? ' - ' + inviteTargetName : ''}`;
    const body = `Merhaba${invitePersonName ? ' ' + invitePersonName : ''},\n\n${inviteTargetName ? inviteTargetName + ' tesisinizi ' : 'Tesisinizi '}Spor Puan platformuna eklemek için özel davetiyeniz oluşturuldu.\n\nAşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:\n\n${generatedInviteLink}\n\nİyi çalışmalar,\nSpor Puan Yönetimi`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleCopyGeneratedLink = async () => {"""

if target_funcs in text:
    text = text.replace(target_funcs, replacement_funcs)
    print("Injected functions")
else:
    print("Could not find function insertion point")

target_ui = """          {generatedInviteLink && (
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <input 
                readOnly 
                value={generatedInviteLink}
                className="bg-slate-950 text-blue-300 font-mono text-xs p-2 rounded-lg w-full outline-none"
              />
              <button 
                onClick={handleCopyGeneratedLink}
                className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl whitespace-nowrap"
              >
                {copiedLink ? 'Kopyalandı!' : 'Kopyala'}
              </button>
            </div>
          )}"""

replacement_ui = """          {generatedInviteLink && (
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <input 
                  readOnly 
                  value={generatedInviteLink}
                  className="bg-slate-950 text-blue-300 font-mono text-xs p-2 rounded-lg w-full outline-none"
                />
                <button 
                  onClick={handleCopyGeneratedLink}
                  className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl whitespace-nowrap flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copiedLink ? 'Kopyalandı!' : 'Kopyala'}
                </button>
              </div>
              <div className="flex items-center gap-3 justify-end border-t border-slate-800 pt-3">
                <span className="text-slate-400 text-xs font-medium">Gönder:</span>
                <button 
                  onClick={handleShareWhatsApp}
                  className="px-4 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold text-xs rounded-xl whitespace-nowrap flex items-center gap-2 transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </button>
                <button 
                  onClick={handleShareEmail}
                  className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white font-bold text-xs rounded-xl whitespace-nowrap flex items-center gap-2 transition"
                >
                  <Mail className="w-4 h-4" />
                  E-Posta
                </button>
              </div>
            </div>
          )}"""

if target_ui in text:
    text = text.replace(target_ui, replacement_ui)
    print("Injected UI")
else:
    print("Could not find UI insertion point")

with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

