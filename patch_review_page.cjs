const fs = require('fs');
let content = fs.readFileSync('src/components/ReviewPage.tsx', 'utf8');

// 1. Remove step state
content = content.replace(
  /const \[step, setStep\] = useState<1 \| 2 \| 3>\(initialEventId \? 2 : 1\);/,
  ''
);

// 2. Change targetEventId initialization and targetEvent resolution
content = content.replace(
  /const \[targetEventId, setTargetEventId\] = useState<string>\([\s\S]*?initialEventId \|\| \(events\.length > 0 \? events\[0\]\.id : ''\)[\s\S]*?\);[\s\S]*?const targetEvent = useMemo\(\(\) => \{[\s\S]*?return events\.find\(\(e\) => e\.id === targetEventId\) \|\| events\[0\];[\s\S]*?\}, \[events, targetEventId\]\);/,
`  // Selected Target Event
  const [targetEventId, setTargetEventId] = useState<string>(
    initialEventId || ''
  );

  const targetEvent = useMemo(() => {
    return events.find((e) => e.id === targetEventId) || null;
  }, [events, targetEventId]);`
);

// 3. Update handleSelectFacility
content = content.replace(
  /setTargetEventId\(evId\);\s*setStep\(2\);/,
  'setTargetEventId(evId);'
);

// 4. Remove step progress bar and change `{step === 1 && (`
content = content.replace(
  /\{\/\* STEP PROGRESS BAR \*\/\}[\s\S]*?\{\/\* ================= STEP 1: VENUE SEARCH & SELECTION ================= \*\/\}[\s\S]*?\{step === 1 && \(/,
  `{/* ================= VENUE SEARCH & SELECTION ================= */}
        {!submittedReview && !targetEvent && (`
);

// 5. Change step 2 condition and "Değiştir" button
content = content.replace(
  /\{\/\* ================= STEP 2: RATING & REVIEW FORM ================= \*\/\}[\s\S]*?\{step === 2 && targetEvent && \(/,
  `{/* ================= RATING & REVIEW FORM ================= */}
        {!submittedReview && targetEvent && (`
);

content = content.replace(
  /onClick=\{[^\}]*setStep\(1\)[^\}]*\}/g,
  `onClick={() => setTargetEventId('')}`
);

// 6. Change step 3 condition
content = content.replace(
  /\{\/\* ================= STEP 3: SUCCESS STATE ================= \*\/\}[\s\S]*?\{step === 3 && submittedReview && targetEvent && \(/,
  `{/* ================= SUCCESS STATE ================= */}
        {submittedReview && targetEvent && (`
);

fs.writeFileSync('src/components/ReviewPage.tsx', content);
console.log('Done replacing ReviewPage.tsx');
