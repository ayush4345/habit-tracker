'use client';

import { addHabit } from '@/app/actions';
import { useRef } from 'react';

export default function AddHabit() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await addHabit(formData);
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2 w-full mt-2">
      <input
        type="text"
        name="name"
        placeholder="New habit..."
        required
        className="flex-1 bg-background border border-border px-3 py-1.5 text-sm focus:border-primary outline-none transition-colors text-foreground"
      />
      <button
        type="submit"
        className="bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-colors"
      >
        Add
      </button>
    </form>
  );
}
