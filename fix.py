import sys

with open('src/components/AdminPanel.tsx', 'r') as f:
    lines = f.read().splitlines()

with open('restore.ts', 'r') as f:
    restore_lines = f.read().splitlines()

# remove trailing handleSaveCorporateAppEdit from restore_lines
if 'handleSaveCorporateAppEdit' in restore_lines[-1]:
    restore_lines.pop()

# find where to start replacing
start_idx = -1
for i, line in enumerate(lines):
    if 'const handleCopyGeneratedLink = async () => {' in line:
        start_idx = i
        break

end_idx = -1
for i in range(start_idx, len(lines)):
    if 'return (' in lines[i]:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_lines = lines[:start_idx] + restore_lines + lines[end_idx:]
    with open('src/components/AdminPanel.tsx', 'w') as f:
        f.write('\n'.join(new_lines) + '\n')
    print("Fixed!")
else:
    print("Could not find bounds.")

