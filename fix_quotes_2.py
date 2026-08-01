import re

with open('src/data/mockEvents.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace all description: '...' with description: "..."
def replacer(match):
    content = match.group(1)
    return f'description: "{content}",'

text = re.sub(r"description:\s*'([^']*)',", replacer, text)

with open('src/data/mockEvents.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed quotes")
