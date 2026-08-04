const fs = require('fs');
let content = fs.readFileSync('src/components/EventDetailModal.tsx', 'utf8');

content = content.replace(
  /alt=\{rev\.userName\}/g,
  'alt={anonymizeUserName(rev.userName)}'
);

content = content.replace(
  /rev\.userName\.charAt\(0\)/g,
  'anonymizeUserName(rev.userName).charAt(0)'
);

fs.writeFileSync('src/components/EventDetailModal.tsx', content);
console.log('Fixed Avatar alt/initial in EventDetailModal');
