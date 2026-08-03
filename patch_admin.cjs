const fs = require('fs');

let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Add import * as XLSX from 'xlsx';
content = content.replace("import { db } from '../lib/firebase';", "import { db } from '../lib/firebase';\nimport * as XLSX from 'xlsx';");

// Add Download to lucide-react imports
content = content.replace("  ExternalLink\n} from 'lucide-react';", "  ExternalLink,\n  Download\n} from 'lucide-react';");

// Add export methods
const exportMethods = `
  const handleExportEvents = () => {
    const data = filteredEvents.map(ev => ({
      'ID': ev.id,
      'Tesis Adı': ev.title,
      'Kategori': ev.category,
      'Şehir': ev.city,
      'İlçe': ev.district,
      'Tesis Puanı (Rating)': ev.rating,
      'Yorum Sayısı': ev.reviewCount,
      'Adres': ev.location,
      'Telefon': ev.phone || '',
      'Durum': ev.isActive === false ? 'Pasif' : 'Aktif'
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Partnerler');
    XLSX.writeFile(workbook, 'Partnerler.xlsx');
  };

  const handleExportReviews = () => {
    const data = filteredReviews.map(rev => ({
      'ID': rev.id,
      'Tarih': formatAdminReviewDate(rev.date),
      'Kullanıcı': rev.userName,
      'Tesis Adı': rev.eventTitle,
      'Puan': rev.rating || rev.overallScore,
      'Yorum': rev.comment,
      'Durum': rev.status === 'hidden' ? 'Gizli' : (rev.status === 'approved' ? 'Onaylı' : 'Bekliyor')
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Degerlendirmeler');
    XLSX.writeFile(workbook, 'Degerlendirmeler.xlsx');
  };
`;

content = content.replace("const handleSyncFirebaseFacilitiesToSite = async () => {", exportMethods + "\n  const handleSyncFirebaseFacilitiesToSite = async () => {");

// Add Export button to Events tab
const eventsButtonSearch = `<button \n                onClick={handleSyncFirebaseFacilitiesToSite}`;
const eventsButtonReplace = `<button
                onClick={handleExportEvents}
                className="px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap shadow-sm"
              >
                <Download className="w-4 h-4" />
                Excel İndir
              </button>\n              <button \n                onClick={handleSyncFirebaseFacilitiesToSite}`;
content = content.replace(eventsButtonSearch, eventsButtonReplace);

// Add Export button to Reviews tab
const reviewsButtonSearch = `<select\n              value={reviewFilter}`;
const reviewsButtonReplace = `<button
              onClick={handleExportReviews}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap shadow-sm"
            >
              <Download className="w-4 h-4" />
              Excel İndir
            </button>\n            <select\n              value={reviewFilter}`;
content = content.replace(reviewsButtonSearch, reviewsButtonReplace);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
console.log('Done');
