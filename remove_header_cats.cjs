const fs = require('fs');

let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

const targetStrStart = '{/* Desktop Center Space - Quick Category Shortcuts */}';
const targetStrEnd = '            </div>\n\n            {/* Desktop Right Actions Buttons */}';

const startIndex = content.indexOf(targetStrStart);
const endIndex = content.indexOf(targetStrEnd);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + content.substring(endIndex + 19);
  fs.writeFileSync('src/components/Header.tsx', content);
  console.log('Removed top categories in Header');
} else {
  console.log('Target string not found');
}
