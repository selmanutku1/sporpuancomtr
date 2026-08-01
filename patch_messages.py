import sys

with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target1 = """  const handleShareWhatsApp = () => {
    const text = `Merhaba${invitePersonName ? ' ' + invitePersonName : ''},

${inviteTargetName ? inviteTargetName + ' tesisinizi ' : 'Tesisinizi '}Spor Puan platformuna eklemek için özel davetiyeniz oluşturuldu. Aşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:

${generatedInviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = `Spor Puan Kurumsal Davetiyesi${inviteTargetName ? ' - ' + inviteTargetName : ''}`;
    const body = `Merhaba${invitePersonName ? ' ' + invitePersonName : ''},

${inviteTargetName ? inviteTargetName + ' tesisinizi ' : 'Tesisinizi '}Spor Puan platformuna eklemek için özel davetiyeniz oluşturuldu.

Aşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:

${generatedInviteLink}

İyi çalışmalar,
Spor Puan Yönetimi`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };"""

replacement1 = """  const handleShareWhatsApp = () => {
    const text = `Merhaba${invitePersonName ? ' ' + invitePersonName : ''},\n\n${inviteTargetName ? inviteTargetName + ' tesisinizi ' : 'Tesisinizi '}Türkiye'nin Spor Değerlendirme ve İnceleme Platformuna eklemek için özel davetiyeniz oluşturuldu. Aşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:\n\n${generatedInviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = `Spor Puan Kurumsal Davetiyesi${inviteTargetName ? ' - ' + inviteTargetName : ''}`;
    const body = `Merhaba${invitePersonName ? ' ' + invitePersonName : ''},\n\n${inviteTargetName ? inviteTargetName + ' tesisinizi ' : 'Tesisinizi '}Türkiye'nin Spor Değerlendirme ve İnceleme Platformuna eklemek için özel davetiyeniz oluşturuldu.\n\nAşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:\n\n${generatedInviteLink}\n\nİyi çalışmalar,\nSpor Puan Yönetimi`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };"""

if target1 in text:
    text = text.replace(target1, replacement1)
    print("Replaced target1")

target2 = """                              if (isEmail) {
                                const subject = `Spor Puan Kurumsal Davetiyesi`;
                                const body = `Merhaba,\n\nTesisinizi Spor Puan platformuna eklemek için özel davetiyeniz oluşturuldu.\n\nAşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:\n\n${fullUrl}\n\nİyi çalışmalar,\nSpor Puan Yönetimi`;
                                window.open(`mailto:${req.contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                              } else {
                                let phone = req.contact.replace(/[^0-9]/g, '');
                                if (phone.length === 10) phone = '90' + phone;
                                if (phone.length === 11 && phone.startsWith('0')) phone = '90' + phone.substring(1);
                                
                                const text = `Merhaba,\n\nTesisinizi Spor Puan platformuna eklemek için özel davetiyeniz oluşturuldu. Aşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:\n\n${fullUrl}`;
                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
                              }"""

replacement2 = """                              if (isEmail) {
                                const subject = `Spor Puan Kurumsal Davetiyesi`;
                                const body = `Merhaba,\n\nTesisinizi Türkiye'nin Spor Değerlendirme ve İnceleme Platformuna eklemek için özel davetiyeniz oluşturuldu.\n\nAşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:\n\n${fullUrl}\n\nİyi çalışmalar,\nSpor Puan Yönetimi`;
                                window.open(`mailto:${req.contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                              } else {
                                let phone = req.contact.replace(/[^0-9]/g, '');
                                if (phone.length === 10) phone = '90' + phone;
                                if (phone.length === 11 && phone.startsWith('0')) phone = '90' + phone.substring(1);
                                
                                const text = `Merhaba,\n\nTesisinizi Türkiye'nin Spor Değerlendirme ve İnceleme Platformuna eklemek için özel davetiyeniz oluşturuldu. Aşağıdaki bağlantıya tıklayarak kurumsal başvurunuzu tamamlayabilir ve tesisinizi hemen yayınlayabilirsiniz:\n\n${fullUrl}`;
                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
                              }"""

if target2 in text:
    text = text.replace(target2, replacement2)
    print("Replaced target2")
    
with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

