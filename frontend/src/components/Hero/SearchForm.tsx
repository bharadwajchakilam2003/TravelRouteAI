import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AutocompleteInput from '../common/AutocompleteInput';

export default function SearchForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    source: '',
    destination: '',
    travelDate: '',
    returnDate: '',
    travelers: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const warmed = useRef(false);

  useEffect(() => {
    if (warmed.current) return;
    if (form.source.length > 0 || form.destination.length > 0) {
      warmed.current = true;
      fetch('/api/health', { method: 'GET', cache: 'no-store' }).catch(() => {});
    }
  }, [form.source, form.destination]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.source.trim()) newErrors.source = 'Source is required';
    if (!form.destination.trim()) newErrors.destination = 'Destination is required';
    if (form.source.trim().toLowerCase() === form.destination.trim().toLowerCase()) {
      newErrors.destination = 'Destination must differ from source';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const today = new Date().toISOString().split('T')[0];
    const params = new URLSearchParams({
      source: form.source.trim(),
      destination: form.destination.trim(),
      travelDate: form.travelDate || today,
      ...(form.returnDate && { returnDate: form.returnDate }),
      travelers: form.travelers.toString(),
    });
    navigate(`/search?${params.toString()}`);
  };

  const handleSwap = () => {
    setForm((prev) => ({ ...prev, source: prev.destination, destination: prev.source }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="glass-card p-4 md:p-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="sm:col-span-2 lg:col-span-2 grid grid-cols-[1fr_auto_1fr] gap-2 relative">
            <AutocompleteInput
              label="From"
              icon="📍"
              placeholder="City"
              value={form.source}
              onChange={(v) => setForm({ ...form, source: v })}
              onSelect={(v) => setForm({ ...form, source: v })}
              error={errors.source}
            />
            <button
              type="button"
              onClick={handleSwap}
              className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg z-10 self-end mb-2"
            >
              ⇄
            </button>
            <AutocompleteInput
              label="To"
              icon="🎯"
              placeholder="City"
              value={form.destination}
              onChange={(v) => setForm({ ...form, destination: v })}
              onSelect={(v) => setForm({ ...form, destination: v })}
              error={errors.destination}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Travel Date</label>
            <input
              type="date"
              value={form.travelDate}
              onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
              className="input-field"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Return (Optional)</label>
            <input
              type="date"
              value={form.returnDate}
              onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
              className="input-field"
              min={form.travelDate || new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Travelers</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👥</span>
              <select
                value={form.travelers}
                onChange={(e) => setForm({ ...form, travelers: parseInt(e.target.value) })}
                className="input-field pl-10 appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full mt-4 text-lg py-4 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Routes
        </motion.button>
      </div>
    </form>
  );
}
