with open('src/data/mockEvents.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# I will just replace the problematic lines.
text = text.replace("'Türkiye'nin köklü voleybol kulübü", '"Türkiye\'nin köklü voleybol kulübü')
text = text.replace("voleybolcularını arıyor.',", 'voleybolcularını arıyor.",')

text = text.replace("'Dünya şampiyonu VakıfBank'ın altyapısında", '"Dünya şampiyonu VakıfBank\'ın altyapısında')
text = text.replace("kariyerine adım atın.',", 'kariyerine adım atın.",')

text = text.replace("'Ankara'nın en saygın basketbol", '"Ankara\'nın en saygın basketbol')
text = text.replace("spora başlama şansı.',", 'spora başlama şansı.",')

with open('src/data/mockEvents.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed quotes")
