const fs = require('fs');

let content = fs.readFileSync('src/components/ShareExperienceCTA.tsx', 'utf8');

if (!content.includes("import { Avatar } from './Avatar';")) {
  content = "import { Avatar } from './Avatar';\n" + content;
  
  // replace <img src="https://i.pravatar.cc/100?img=33" ... /> with <Avatar name="U1" src="..." ... />
  content = content.replace(/<img src="https:\/\/i\.pravatar\.cc\/100\?img=33" alt="User" className="(.*?)" \/>/g, '<Avatar src="https://i.pravatar.cc/100?img=33" name="U1" className="$1" />');
  content = content.replace(/<img src="https:\/\/i\.pravatar\.cc\/100\?img=47" alt="User" className="(.*?)" \/>/g, '<Avatar src="https://i.pravatar.cc/100?img=47" name="U2" className="$1" />');
  content = content.replace(/<img src="https:\/\/i\.pravatar\.cc\/100\?img=12" alt="User" className="(.*?)" \/>/g, '<Avatar src="https://i.pravatar.cc/100?img=12" name="U3" className="$1" />');
  
  content = content.replace(/<img src="https:\/\/i\.pravatar\.cc\/150\?img=68" alt="Reviewer" className="(.*?)" \/>/g, '<Avatar src="https://i.pravatar.cc/150?img=68" name="Ayşe Yılmaz" className="$1" />');
  
  fs.writeFileSync('src/components/ShareExperienceCTA.tsx', content);
  console.log('Patched ShareExperienceCTA.tsx');
}

