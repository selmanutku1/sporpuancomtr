import sys

with open('src/components/CorporatePage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target_helpers = """  const handleAmenityToggle = (amenity: string) => {"""

replacement_helpers = """  const getFacilityNameLabel = (cat: SportsCategory) => {
    switch(cat) {
      case 'Spor Salonları': return 'Salon Adı';
      case 'Spor Okulları': return 'Okul / Akademi Adı';
      case 'Spor Etkinlikleri': return 'Organizasyon / Firma Adı';
      default: return 'Tesis Adı';
    }
  };

  const getCapacityOptions = (cat: SportsCategory) => {
    if (cat === 'Spor Okulları') {
      return ['50 Öğrenciden Az', '50-100 Öğrenci', '100-250 Öğrenci', '250-500 Öğrenci', '500+ Öğrenci'];
    }
    if (cat === 'Spor Etkinlikleri') {
      return ['Küçük Çaplı (0-100 Katılımcı)', 'Orta Çaplı (100-500 Katılımcı)', 'Büyük Çaplı (500+ Katılımcı)', 'Uluslararası / Kapsamlı'];
    }
    return ['50 Kişiden Az', '50-100 Kişi', '100-250 Kişi', '250-500 Kişi', '500+ Kişi Kapasiteli'];
  };

  const getAmenitiesList = (cat: SportsCategory) => {
    if (cat === 'Spor Okulları') {
      return ['Servis İmkânı', 'Soyunma Odası', 'Duş İmkânı', 'Otopark', 'Kafeterya', 'Klima / İklimlendirme', 'Özel Ders', 'Lisans Çıkarma', 'Pedagojik Eğitimli Kadro'];
    }
    if (cat === 'Spor Etkinlikleri') {
      return ['Canlı Yayın', 'Sağlık / Ambulans', 'Madalya & Kupa Töreni', 'Hakem Organizasyonu', 'Otopark', 'Konaklama / Transfer', 'Sponsorluk Fırsatları', 'Güvenlik'];
    }
    return [
      'Soyunma Odası', 'Duş İmkânı', 'Otopark', 'Kafeterya / Kantin',
      'Klima / İklimlendirme', 'Özel Ders & Koçluk', 'Çocuk Oyun Alanı',
      'Yüzme Havuzu', 'Sauna / SPA', 'Tribün & Seyirci Alanı', 'Wi-Fi', 'Engelli Ulaşımına Uygun'
    ];
  };

  const handleAmenityToggle = (amenity: string) => {"""

if target_helpers in text:
    text = text.replace(target_helpers, replacement_helpers)
    print("Helpers patched")
else:
    print("Helpers target not found")
    
target_name = """                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tesis / Kurum Ticari veya Marka Adı <span className="text-red-500">*</span>
                    </label>"""

replacement_name = """                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {getFacilityNameLabel(formData.category)} <span className="text-red-500">*</span>
                    </label>"""

if target_name in text:
    text = text.replace(target_name, replacement_name)
    print("Name field patched")
else:
    print("Name target not found")

target_capacity = """                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kapasite / Tesis Büyüklüğü
                    </label>
                    <select
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="50 Kişiden Az">50 Kişiden Az</option>
                      <option value="50-100 Kişi">50 - 100 Kişi</option>
                      <option value="100-250 Kişi">100 - 250 Kişi</option>
                      <option value="250-500 Kişi">250 - 500 Kişi</option>
                      <option value="500+ Kişi Kapasiteli">500+ Kişi Kapasiteli</option>
                    </select>
                  </div>"""

replacement_capacity = """                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kapasite / Büyüklük
                    </label>
                    <select
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {getCapacityOptions(formData.category).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>"""

if target_capacity in text:
    text = text.replace(target_capacity, replacement_capacity)
    print("Capacity field patched")
else:
    print("Capacity target not found")

target_amenities = """                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Tesisinizde Bulunan Hizmetler & Özellikler
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Soyunma Odası', 
                      'Duş İmkânı', 
                      'Otopark', 
                      'Kafeterya / Kantin', 
                      'Klima / İklimlendirme', 
                      'Özel Ders & Koçluk', 
                      'Çocuk Oyun Alanı', 
                      'Yüzme Havuzu', 
                      'Sauna / SPA', 
                      'Tribün & Seyirci Alanı',
                      'Wi-Fi',
                      'Engelli Ulaşımına Uygun'
                    ].map((item) => {"""

replacement_amenities = """                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Sunulan Hizmetler & Özellikler
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getAmenitiesList(formData.category).map((item) => {"""

if target_amenities in text:
    text = text.replace(target_amenities, replacement_amenities)
    print("Amenities field patched")
else:
    print("Amenities target not found")

target_category_onchange = """                      onChange={(e) => setFormData({ ...formData, category: e.target.value as SportsCategory })}"""

replacement_category_onchange = """                      onChange={(e) => {
                        const newCat = e.target.value as SportsCategory;
                        const newCapacityOptions = getCapacityOptions(newCat);
                        setFormData({ 
                          ...formData, 
                          category: newCat,
                          capacity: newCapacityOptions[0], // Reset capacity to first valid option
                          amenities: [] // Reset amenities when category changes
                        });
                      }}"""

if target_category_onchange in text:
    text = text.replace(target_category_onchange, replacement_category_onchange)
    print("Category onChange patched")
else:
    print("Category onChange not found")

with open('src/components/CorporatePage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

