import { useState } from 'react';

export function useEmailSettings() {
  const [email, setEmail] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const saveEmail = async () => {
    if (!email) return;

    setIsSaving(true);
    setError(null);

    try {
      // Call API to save email
      const response = await fetch('/api/settings/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save email');
      }

      setIsSuccess(true);

      // Reset success state after a delay
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save email');
    } finally {
      setIsSaving(false);
    }
  };

  const resetEmail = () => {
    setEmail('');
    setError(null);
    setIsSuccess(false);
  };

  return {
    email,
    setEmail,
    isSaving,
    isSuccess,
    error,
    saveEmail,
    resetEmail,
  };
}
