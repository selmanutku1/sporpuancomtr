import re

with open('src/components/AdminPanel.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# I will just replace `          </div>\n        </div>\n      </>\n      )}` with `          </div>\n        </div>\n      )}` everywhere,
# and then manually add `</>` to the end of events and reviews.

text = text.replace("          </div>\n        </div>\n      </>\n      )}", "          </div>\n        </div>\n      )}")

with open('src/components/AdminPanel.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

