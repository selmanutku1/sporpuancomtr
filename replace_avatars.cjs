const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes("import { Avatar } from './Avatar';") && !content.includes("import { Avatar } from '../components/Avatar';")) {
    // add import at top (after React if possible)
    const importStr = filePath.includes('components') 
      ? "import { Avatar } from './Avatar';\n" 
      : "import { Avatar } from './components/Avatar';\n";
    content = importStr + content;
  }
  
  for (const rep of replacements) {
    content = content.replace(rep.search, rep.replace);
  }
  fs.writeFileSync(filePath, content);
}

// 1. Header.tsx
replaceInFile('src/components/Header.tsx', [
  {
    search: /<img referrerPolicy="no-referrer"[\s\S]*?src=\{currentUser\.avatar \|\| '.*?'\}[\s\S]*?alt=\{currentUser\.name\}[\s\S]*?className="(.*?)"[\s\S]*?\/>/g,
    replace: '<Avatar src={currentUser.avatar} name={currentUser.name} className="$1" />'
  }
]);

// 2. SporpuanlilarNeDemis.tsx
replaceInFile('src/components/SporpuanlilarNeDemis.tsx', [
  {
    search: /<img referrerPolicy="no-referrer" src=\{reviews\[0\]\.userAvatar \|\| '.*?'\} alt="" className="(.*?)" \/>/g,
    replace: '<Avatar src={reviews[0].userAvatar} name={reviews[0].userName} className="$1" />'
  },
  {
    search: /<img referrerPolicy="no-referrer" src=\{reviews\[1\]\.userAvatar \|\| '.*?'\} alt="" className="(.*?)" \/>/g,
    replace: '<Avatar src={reviews[1].userAvatar} name={reviews[1].userName} className="$1" />'
  },
  {
    search: /<img referrerPolicy="no-referrer" src=\{reviews\[2\]\.userAvatar \|\| '.*?'\} alt="" className="(.*?)" \/>/g,
    replace: '<Avatar src={reviews[2].userAvatar} name={reviews[2].userName} className="$1" />'
  },
  {
    search: /<img referrerPolicy="no-referrer" src=\{rev\.userAvatar \|\| '.*?'\} alt="" className="(.*?)" \/>/g,
    replace: '<Avatar src={rev.userAvatar} name={rev.userName} className="$1" />'
  }
]);

// 3. ReviewPage.tsx
replaceInFile('src/components/ReviewPage.tsx', [
  {
    search: /<img referrerPolicy="no-referrer" src=\{selectedReview\.userAvatar \|\| '.*?'\}[\s\S]*?alt=\{selectedReview\.userName\}[\s\S]*?className="(.*?)"[\s\S]*?\/>/g,
    replace: '<Avatar src={selectedReview.userAvatar} name={selectedReview.userName} className="$1" />'
  },
  {
    search: /<img referrerPolicy="no-referrer" src=\{rev\.userAvatar \|\| '.*?'\}[\s\S]*?alt=\{rev\.userName\}[\s\S]*?className="(.*?)"[\s\S]*?\/>/g,
    replace: '<Avatar src={rev.userAvatar} name={rev.userName} className="$1" />'
  }
]);

// 4. AdminPanel.tsx
replaceInFile('src/components/AdminPanel.tsx', [
  {
    search: /<img referrerPolicy="no-referrer" src=\{rev\.userAvatar \|\| '.*?'\}[\s\S]*?alt=\{rev\.userName\}[\s\S]*?className="(.*?)"[\s\S]*?\/>/g,
    replace: '<Avatar src={rev.userAvatar} name={rev.userName} className="$1" />'
  }
]);

// 5. EventDetailModal.tsx
replaceInFile('src/components/EventDetailModal.tsx', [
  {
    search: /<img referrerPolicy="no-referrer" src=\{rev\.userAvatar \|\| '.*?'\}[\s\S]*?alt=\{rev\.userName\}[\s\S]*?className="(.*?)"[\s\S]*?\/>/g,
    replace: '<Avatar src={rev.userAvatar} name={rev.userName} className="$1" />'
  }
]);
