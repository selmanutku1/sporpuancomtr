const fs = require('fs');

let adminContent = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');
adminContent = adminContent.replace("date: '',", "date: '',\n                  time: '',\n                  ticketUrl: '',\n                  summary: '',");
fs.writeFileSync('src/components/AdminPanel.tsx', adminContent);

let editContent = fs.readFileSync('src/components/EditEventModal.tsx', 'utf8');
editContent = editContent.replace("time: time.trim(),", "time: (time || '').trim(),");
editContent = editContent.replace("date: date.trim(),", "date: (date || '').trim(),");
editContent = editContent.replace("city: city.trim(),", "city: (city || '').trim(),");
editContent = editContent.replace("venue: venue.trim(),", "venue: (venue || '').trim(),");
editContent = editContent.replace("title: title.trim(),", "title: (title || '').trim(),");
editContent = editContent.replace("organizer: organizer.trim() || event.organizer,", "organizer: (organizer || '').trim() || event.organizer,");
editContent = editContent.replace("summary: description.trim() || event.summary,", "summary: (description || '').trim() || event.summary,");
editContent = editContent.replace("ticketUrl: ticketUrl.trim() || event.ticketUrl,", "ticketUrl: (ticketUrl || '').trim() || event.ticketUrl,");
fs.writeFileSync('src/components/EditEventModal.tsx', editContent);

console.log('Fixed');
