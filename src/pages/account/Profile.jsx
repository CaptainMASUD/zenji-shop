import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/common/Button.jsx';

const EASE = [0.16, 1, 0.3, 1];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ ...(user ?? {}) });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ ...(user ?? {}) });
  }, [user]);

  const field = (key, label, type = 'text', autoComplete) => (
    <label>
      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-white/46">
        {label}
      </span>
      <input
        type={type}
        autoComplete={autoComplete}
        value={form[key] || ''}
        onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
        className="mt-2 min-h-[50px] w-full border border-white/[0.12] bg-[#080808] px-4 text-[14px] text-[#F4F0E8] outline-none transition-colors focus:border-crimson"
      />
    </label>
  );

  const save = (event) => {
    event.preventDefault();
    updateProfile(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <form onSubmit={save} className="text-[#F4F0E8]">
      <div className="flex flex-col gap-4 border-b border-white/[0.1] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-7 bg-crimson" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-white/52">
              PROFILE / EDIT
            </p>
          </div>
          <h1 className="mt-3 font-display text-[clamp(2.15rem,5vw,3.7rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
            Your identity.
          </h1>
        </div>
        <p className="max-w-sm text-[14px] leading-6 text-white/46 sm:text-right">
          Keep your contact details current for orders and delivery updates.
        </p>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="border-b border-white/[0.1] py-7 sm:py-8"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-crimson" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-crimson">
              IDENTITY DETAILS
            </p>
          </div>
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.11em] text-white/30">
            ACCOUNT PROFILE
          </span>
        </div>

        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          {field('name', 'Full name', 'text', 'name')}
          {field('email', 'Email', 'email', 'email')}
          {field('phone', 'Phone', 'tel', 'tel')}
          {field('dob', 'Date of birth', 'date')}
        </div>
      </motion.section>

      <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit">SAVE PROFILE</Button>
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.span
              key="saved"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-crimson"
              aria-live="polite"
            >
              PROFILE SAVED LOCALLY
            </motion.span>
          ) : (
            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/28">
              Changes apply to this demo account
            </span>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
