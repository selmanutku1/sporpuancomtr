with open('src/data/mockEvents.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("'Türk basketbolunun köklü altyapısı Darüşşafaka'da elit düzeyde eğitim imkanı.',", '"Türk basketbolunun köklü altyapısı Darüşşafaka\'da elit düzeyde eğitim imkanı.",')

with open('src/data/mockEvents.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed quotes")
