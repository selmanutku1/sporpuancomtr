const fs = require('fs');
let content = fs.readFileSync('src/components/SporpuanlilarNeDemis.tsx', 'utf8');

content = content.replace(
  /name=\{rev\.userName\}/g,
  'name={anonymizeUserName(rev.userName)}'
);

fs.writeFileSync('src/components/SporpuanlilarNeDemis.tsx', content);
console.log('Fixed Avatar in SporpuanlilarNeDemis');
