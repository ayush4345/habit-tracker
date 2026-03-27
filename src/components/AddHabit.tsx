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
        className="flex-1 bg-white border border-zinc-200 px-3 py-1.5 text-sm focus:border-indigo-600 outline-none transition-colors"
      />
      <button
        type="submit"
        className="bg-zinc-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-black transition-colors"
      >
        Add
      </button>
    </form>
  );
}
