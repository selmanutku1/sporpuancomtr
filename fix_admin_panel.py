import re

with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# First we need to extract the filters to move them up
filters = """  // Event Filters
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('all');
  const [eventStatusFilter, setEventStatusFilter] = useState<'all' | 'active' | 'hidden'>('all');

  // Filters
  const [corporateFilter, setCorporateFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'suspended'>('all');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'published' | 'pending' | 'hidden'>('all');
  const [reviewSearchQuery, setReviewSearchQuery] = useState('');"""

# Remove them from their original locations
text = text.replace("  // Event Filters\n  const [eventSearchQuery, setEventSearchQuery] = useState('');\n  const [eventCategoryFilter, setEventCategoryFilter] = useState('all');\n  const [eventStatusFilter, setEventStatusFilter] = useState<'all' | 'active' | 'hidden'>('all');\n", "")

text = text.replace("  // Filters\n  const [corporateFilter, setCorporateFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'suspended'>('all');\n  const [reviewFilter, setReviewFilter] = useState<'all' | 'published' | 'pending' | 'hidden'>('all');\n  const [reviewSearchQuery, setReviewSearchQuery] = useState('');\n", "")

# Insert them after searchQuery
target = "  const [searchQuery, setSearchQuery] = useState('');\n"
if target in text:
    text = text.replace(target, target + "\n" + filters + "\n")
    with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Fixed admin panel")
else:
    print("Could not find insertion point")
