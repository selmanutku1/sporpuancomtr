const fs = require('fs');

let content = fs.readFileSync('src/lib/scoreUtils.ts', 'utf8');

// Spor Tesisleri
content = content.replace("label: 'Zemin & Saha Kalitesi'", "label: 'Zemin & Saha'");
content = content.replace("label: 'Soyunma Odası & Hijyen'", "label: 'Hijyen'");
content = content.replace("label: 'Aydınlatma & Ekipman'", "label: 'Aydınlatma'");
content = content.replace("label: 'Ulaşım & Otopark'", "label: 'Ulaşım'");
content = content.replace("label: 'Kiralama Ücreti & Personel'", "label: 'Fiyat'");

// Spor Salonları
content = content.replace("label: 'Ekipman & Alet Çeşitliliği'", "label: 'Ekipman'");
content = content.replace("label: 'Hijyen & İklimlendirme'", "label: 'Hijyen'");
content = content.replace("label: 'Antrenör & Eğitmen Desteği'", "label: 'Eğitmen'");
content = content.replace("label: 'Yoğunluk & Çalışma Alanı'", "label: 'Ferahlık'");
content = content.replace("label: 'Üyelik Fiyatı & Koşulları'", "label: 'Fiyat'");

// Spor Okulları
content = content.replace("label: 'Eğitmen & Pedagojik Kalite'", "label: 'Eğitmen'");
content = content.replace("label: 'Müfredat & Sporcu Gelişimi'", "label: 'Eğitim'");
content = content.replace("label: 'Güvenlik & Sağlık Önlemleri'", "label: 'Güvenlik'");
content = content.replace("label: 'Tesis & Yaşa Uygun Ekipman'", "label: 'Tesis'");
content = content.replace("label: 'Fiyat & Veli İletişimi'", "label: 'Fiyat'");

// Spor Etkinlikleri
content = content.replace("label: 'Organizasyon & Akış'", "label: 'Akış'");
content = content.replace("label: 'Parkur & Güvenlik Önlemleri'", "label: 'Güvenlik'");
content = content.replace("label: 'Etkinlik Kiti & Su/İkramlar'", "label: 'İkram'");
content = content.replace("label: 'Atmosfer & Seyir Zevki'", "label: 'Atmosfer'");
content = content.replace("label: 'Katılım Ücreti / Değer'", "label: 'Fiyat'");

fs.writeFileSync('src/lib/scoreUtils.ts', content);
console.log('Labels updated.');
