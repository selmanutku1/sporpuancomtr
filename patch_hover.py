import sys

with open('src/components/CategoryFilter.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target1 = """                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 dark:bg-blue-500 text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}"""

replacement1 = """                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 dark:bg-blue-500 text-white font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-white hover:bg-blue-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}"""

text = text.replace(target1, replacement1)

target2 = """                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? 'bg-blue-800 dark:bg-blue-700 text-white font-bold'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >"""

replacement2 = """                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono transition-colors ${
                    isSelected
                      ? 'bg-blue-800 dark:bg-blue-700 text-white font-bold'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-blue-200 group-hover:text-blue-800 dark:group-hover:bg-slate-600 dark:group-hover:text-white'
                  }`}
                >"""

text = text.replace(target2, replacement2)

with open('src/components/CategoryFilter.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

with open('src/components/Header.tsx', 'r', encoding='utf-8') as f:
    text_header = f.read()

target_h = """                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700'
                    }`}"""

replacement_h = """                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-slate-700'
                    }`}"""

text_header = text_header.replace(target_h, replacement_h)

with open('src/components/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(text_header)
