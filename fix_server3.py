import re
with open('server.ts', 'r') as f:
    content = f.read()

pattern = r"(let photoUrl = null;\s*if \(photosList\.length > 0\) \{[\s\S]*?\} else \{[\s\S]*?\n\s*\})\s*\} else if \(detectedCategory === 'Spor Okulları'\) \{[\s\S]*?photoUrl = 'https:\/\/images\.unsplash\.com\/photo-1574629810360-7efbbe195018\?q=80&w=1470&auto=format&fit=crop';\n\s*\}"

content = re.sub(pattern, r"\1", content)

with open('server.ts', 'w') as f:
    f.write(content)

print("Fixed")
