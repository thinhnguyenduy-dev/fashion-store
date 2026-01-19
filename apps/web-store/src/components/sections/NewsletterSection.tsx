'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  return (
    <section className="px-6 lg:px-20 py-20 bg-background-light border-t border-gray-200">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">
          Stay Informed
        </h2>
        <p className="text-gray-500 mb-8 font-light italic">
          Join our community for early access to new collections and exclusive
          editorial content.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-4 rounded-lg bg-white border-none focus:ring-2 ring-primary/20 text-sm"
            placeholder="Email Address"
            required
          />
          <Button
            type="submit"
            className="uppercase tracking-widest text-sm hover:shadow-lg"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
