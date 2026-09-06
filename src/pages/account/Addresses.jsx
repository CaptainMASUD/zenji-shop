import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/common/Button.jsx';

const EASE = [0.16, 1, 0.3, 1];

const blank = {
  label: 'Home',
  fullName: '',
  phone: '',
  address: '',
  city: '',
  region: '',
  postalCode: '',
  country: 'Australia',
  isDefault: false,
};

const FIELD_LABELS = {
  label: 'Address label',
  fullName: 'Full name',
  phone: 'Phone',
  address: 'Street address',
  city: 'City',
  region: 'State / region',
  postalCode: 'Postcode',
  country: 'Country',
};

export default function Addresses() {
  const { addresses, addAddress, removeAddress, setDefaultAddress } = useAuth();
  const [form, setForm] = useState(blank);
  const [open, setOpen] = useState(false);

  const safeAddresses = Array.isArray(addresses) ? addresses : [];

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = (event) => {
    event.preventDefault();
    addAddress(form);
    setForm(blank);
    setOpen(false);
  };

  return (
    <div className="text-[#F4F0E8]">
      <div className="flex flex-col gap-5 border-b border-white/[0.1] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-7 bg-crimson" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-white/52">
              ADDRESS / BOOK
            </p>
          </div>
          <h1 className="mt-3 font-display text-[clamp(2.15rem,5vw,3.7rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
            Saved places.
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="inline-flex min-h-[44px] items-center justify-between gap-6 border border-white/[0.14] px-4 font-mono text-[9px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-crimson hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
        >
          {open ? 'CLOSE' : 'ADD ADDRESS'}
          <span aria-hidden="true">{open ? '×' : '+'}</span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            onSubmit={save}
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="overflow-hidden border-b border-white/[0.1]"
          >
            <div className="py-7 sm:py-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-crimson">
                    NEW / DESTINATION
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[-0.04em]">
                    Add address
                  </h2>
                </div>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/32">
                  REQUIRED FIELDS MARKED BY FORM
                </span>
              </div>

              <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                {Object.keys(blank)
                  .filter((key) => key !== 'isDefault')
                  .map((key) => (
                    <label key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-white/48">
                        {FIELD_LABELS[key]}
                      </span>
                      <input
                        value={form[key]}
                        onChange={(event) => updateField(key, event.target.value)}
                        className="mt-2 min-h-[48px] w-full border border-white/[0.12] bg-[#080808] px-4 text-[14px] text-[#F4F0E8] outline-none transition-colors placeholder:text-white/25 focus:border-crimson"
                        required={['fullName', 'address', 'city', 'country'].includes(key)}
                      />
                    </label>
                  ))}
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-3 border-y border-white/[0.08] py-4 text-[14px] text-white/66">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(event) => updateField('isDefault', event.target.checked)}
                  className="h-4 w-4 accent-[#D71920]"
                />
                Make this the default address
              </label>

              <div className="mt-6 flex justify-end">
                <Button type="submit">SAVE ADDRESS</Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {safeAddresses.length ? (
          safeAddresses.map((address, index) => (
            <motion.article
              key={address.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.04, ease: EASE }}
              className={`relative border p-5 sm:p-6 ${
                address.isDefault
                  ? 'border-crimson bg-crimson/[0.04]'
                  : 'border-white/[0.12] bg-[#080808]'
              }`}
            >
              <span className={`absolute left-0 top-0 h-[4px] ${address.isDefault ? 'w-1/3 bg-crimson' : 'w-10 bg-white/20'}`} />

              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">
                    SAVED LOCATION
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-semibold uppercase tracking-[-0.04em]">
                    {address.label || 'Address'}
                  </h2>
                </div>
                {address.isDefault && (
                  <span className="border border-crimson/50 bg-crimson/10 px-3 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.13em] text-crimson">
                    DEFAULT
                  </span>
                )}
              </div>

              <p className="mt-6 text-[14px] leading-7 text-white/62">
                {address.fullName}
                {address.phone ? <><br />{address.phone}</> : null}
                <br />
                {address.address}
                <br />
                {[address.city, address.region, address.postalCode].filter(Boolean).join(' ')}
                <br />
                {address.country}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/[0.1] pt-4">
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(address.id)}
                    className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-white/58 transition-colors hover:text-crimson"
                  >
                    SET DEFAULT
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAddress(address.id)}
                  className="font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-crimson transition-opacity hover:opacity-70"
                >
                  DELETE
                </button>
              </div>
            </motion.article>
          ))
        ) : (
          <div className="border-y border-white/[0.1] py-10 lg:col-span-2">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-crimson">
              NO SAVED DESTINATIONS
            </p>
            <p className="mt-3 text-[14px] leading-6 text-white/48">
              Add an address to make checkout faster next time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
