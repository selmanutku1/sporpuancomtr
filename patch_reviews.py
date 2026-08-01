import re

with open('src/components/SporpuanlilarNeDemis.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

replacement = """  const allReviews = useMemo(() => {
    const list: (Review & { eventTitle: string })[] = [];
    events.forEach(ev => {
      ev.reviews.forEach(rev => {
        list.push({ ...rev, eventTitle: ev.title });
      });
    });
    const validReviews = list.filter(r => r.status !== 'hidden');
    if (validReviews.length < 4) {
      return [...validReviews, ...FALLBACK_REVIEWS];
    }
    return validReviews.sort(() => 0.5 - Math.random());
  }, [events]);"""

target = """  const allReviews = useMemo(() => {
    events.forEach(ev => {
      ev.reviews.forEach(rev => {
      });
    });
    const validReviews = list.filter(r => r.status !== 'hidden');
    if (validReviews.length < 4) {
      return [...validReviews, ...FALLBACK_REVIEWS];
    }
    return validReviews.sort(() => 0.5 - Math.random());
  }, [events]);"""

if target in text:
    text = text.replace(target, replacement)
else:
    print("Not found")

text = text.replace("eventTitle: 'Kürek Kano Festivali'", "eventTitle: 'Kürek Kano Festivali', verifiedAttendee: true")
text = text.replace("eventTitle: 'Bisiklet Festivali'", "eventTitle: 'Bisiklet Festivali', verifiedAttendee: true")
text = text.replace("eventTitle: 'İstanbul Maratonu'", "eventTitle: 'İstanbul Maratonu', verifiedAttendee: true")
text = text.replace("eventTitle: 'Grup Pilates Dersi'", "eventTitle: 'Grup Pilates Dersi', verifiedAttendee: true")

with open('src/components/SporpuanlilarNeDemis.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("done")
