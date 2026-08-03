const fs = require('fs');

let content = fs.readFileSync('src/components/ReviewPage.tsx', 'utf8');

const startStr = '{/* Live Criteria Rings & Recommendation Rings */}';
const endStr = '</div>\n                </div>\n              </div>\n\n              {/* 1. CRITERIA SCORE SLIDERS */}';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  const originalPart = content.substring(startIdx, endIdx);
  const newPart = ``;
  content = content.replace(originalPart, newPart);
  fs.writeFileSync('src/components/ReviewPage.tsx', content);
  console.log('Removed rings in ReviewPage');
} else {
  console.log('Not found');
}
