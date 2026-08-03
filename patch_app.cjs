const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('ShareExperienceCTA')) {
  // Add import
  content = content.replace("import { SporpuanlilarNeDemis } from './components/SporpuanlilarNeDemis';",
    "import { SporpuanlilarNeDemis } from './components/SporpuanlilarNeDemis';\nimport { ShareExperienceCTA } from './components/ShareExperienceCTA';");
    
  // Add component before Footer but inside Route element
  const targetStr = "              {/* Sporpuanlılar Ne Demiş Section */}\n              <SporpuanlilarNeDemis events={events} />\n            </>\n          } />";
  const replacementStr = `              {/* Sporpuanlılar Ne Demiş Section */}
              <SporpuanlilarNeDemis events={events} />

              <ShareExperienceCTA onOpenAddReview={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                  return;
                }
                window.scrollTo(0, 0);
                navigate('/yorum-yaz');
              }} />
            </>
          } />`;
          
  if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync('src/App.tsx', content);
    console.log('Added ShareExperienceCTA to App.tsx');
  } else {
    console.log('Target string not found for ShareExperienceCTA injection');
  }
} else {
  console.log('ShareExperienceCTA already imported');
}

