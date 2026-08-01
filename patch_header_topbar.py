import re

with open('src/components/Header.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

start_marker = "      {/* Top Header Contact & Announcement Bar */}"
end_marker = "      <header className=\"sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm transition-colors duration-200\">"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_text = text[:start_idx] + text[end_idx:]
    with open('src/components/Header.tsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Top bar removed successfully")
else:
    print("Top bar markers not found")
