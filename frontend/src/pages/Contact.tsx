import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all fields');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('https://formspree.io/f/mzzzqzzz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Message sent! We\'ll get back to you soon.');
        setForm({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send. Try emailing directly.');
      }
    } catch {
      toast.error('Failed to send. Email us at bharadwajchakilam2003@gmail.com');
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-16">
        <div className="container-wide text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-white">
            Contact Us
          </motion.h1>
          <p className="text-blue-200 mt-2">We'd love to hear from you</p>
        </div>
      </div>
      <div className="container-wide py-12 max-w-2xl">
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field w-full" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field w-full" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="input-field w-full resize-none" placeholder="How can we help?" />
            </div>
            <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2">
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            Or email us directly at{' '}
            <a href="mailto:bharadwajchakilam2003@gmail.com" className="text-blue-600 hover:underline">bharadwajchakilam2003@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}