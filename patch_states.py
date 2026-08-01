import sys

with open('src/components/CorporatePage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = """  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [refCode, setRefCode] = useState('');"""

replacement = """  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [refCode, setRefCode] = useState('');

  const [quickInviteContact, setQuickInviteContact] = useState('');
  const [quickInviteSent, setQuickInviteSent] = useState(false);
  const [isQuickInviteSubmitting, setIsQuickInviteSubmitting] = useState(false);

  const handleQuickInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInviteContact.trim()) return;
    setIsQuickInviteSubmitting(true);
    
    try {
      const generatedCode = 'REQ-' + Math.floor(10000 + Math.random() * 90000);
      const docRef = doc(db, 'corporate_invite_requests', generatedCode);
      await setDoc(docRef, {
        id: generatedCode,
        contact: quickInviteContact,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });
      setQuickInviteSent(true);
      setQuickInviteContact('');
    } catch (error) {
      console.error("Error submitting request", error);
      setQuickInviteSent(true);
      setQuickInviteContact('');
    } finally {
      setIsQuickInviteSubmitting(false);
    }
  };"""

if target in text:
    with open('src/components/CorporatePage.tsx', 'w', encoding='utf-8') as f:
        f.write(text.replace(target, replacement))
    print("States patched")
else:
    print("Target not found")
