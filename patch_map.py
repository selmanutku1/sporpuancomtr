import re
with open('src/components/EventMapView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('src="${ev.image}"', 'src="${ev.image || \'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=200&auto=format&fit=crop\'}"')
with open('src/components/EventMapView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
