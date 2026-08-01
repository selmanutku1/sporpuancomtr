import sys
with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "params.set('for', inviteTargetName.trim());" in line:
        lines.insert(i+2, "    if (invitePersonName.trim()) {\n      params.set('person', invitePersonName.trim());\n    }\n")
        break

with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print("Fixed!")
