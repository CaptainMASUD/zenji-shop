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
      <div className="flex flex-col gap-4 border-b border-white/[0.1] pb-5 sm:flex-row sm:items-end sm:justify-between sm:pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-7 bg-crimson" />
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.17em] text-white/52">
              ADDRESS / BOOK
            </p>
          </div>
          <h1 className="mt-2 font-display text-[clamp(1.75rem,5vw,3.7rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
            Saved places.
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="inline-flex min-h-[40px] items-center justify-between gap-4 border border-white/[0.14] px-3.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-crimson hover:text-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson sm:min-h-[44px] sm:gap-6 sm:px-4"
        >
          <span>{open ? 'CLOSE' : 'ADD ADDRESS'}</span>
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
            <div className="py-5 sm:py-8">
              <div className="mb-5 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-crimson">
                    NEW / DESTINATION
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold uppercase tracking-[-0.04em] sm:mt-2 sm:text-2xl">
                    Add address
                  </h2>
                </div>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/32">
                  REQUIRED FIELDS MARKED BY FORM
                </span>
              </div>

              <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 sm:gap-y-5">
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
                        className="mt-2 min-h-[46px] w-full max-w-full min-w-0 border border-white/[0.12] bg-[#080808] px-3.5 text-[14px] text-[#F4F0E8] outline-none transition-colors placeholder:text-white/25 focus:border-crimson sm:min-h-[48px] sm:px-4"
                        required={['fullName', 'address', 'city', 'country'].includes(key)}
                      />
                    </label>
                  ))}
              </div>

              <label className="mt-4 flex cursor-pointer items-center gap-3 border-y border-white/[0.08] py-3.5 text-[13px] text-white/66 sm:mt-5 sm:py-4 sm:text-[14px]">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(event) => updateField('isDefault', event.target.checked)}
                  className="h-4 w-4 accent-[#D71920]"
                />
                Make this the default address
              </label>

              <div className="mt-5 flex justify-end sm:mt-6">
                <Button type="submit" className="w-full sm:w-auto">SAVE ADDRESS</Button>
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
              className={`relative border p-4 sm:p-6 ${
                address.isDefault
                  ? 'border-crimson bg-crimson/[0.04]'
                  : 'border-white/[0.12] bg-[#080808]'
              }`}
            >
              <span className={`absolute left-0 top-0 h-[4px] ${address.isDefault ? 'w-1/3 bg-crimson' : 'w-10 bg-white/20'}`} />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white/40">
                    SAVED LOCATION
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold uppercase tracking-[-0.04em] sm:mt-2 sm:text-2xl">
                    {address.label || 'Address'}
                  </h2>
                </div>
                {address.isDefault && (
                  <span className="border border-crimson/50 bg-crimson/10 px-2.5 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.13em] text-crimson sm:px-3 sm:py-2">
                    DEFAULT
                  </span>
                )}
              </div>

              <p className="mt-4 text-[13px] leading-6 text-white/62 sm:mt-6 sm:text-[14px] sm:leading-7">
                {address.fullName}
                {address.phone ? <><br />{address.phone}</> : null}
                <br />
                {address.address}
                <br />
                {[address.city, address.region, address.postalCode].filter(Boolean).join(' ')}
                <br />
                {address.country}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2.5 border-t border-white/[0.1] pt-3.5 sm:mt-6 sm:pt-4">
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(address.id)}
                    className="inline-flex min-h-8 items-center font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-white/58 transition-colors hover:text-crimson"
                  >
                    SET DEFAULT
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeAddress(address.id)}
                  className="inline-flex min-h-8 items-center font-mono text-[9px] font-bold uppercase tracking-[0.13em] text-crimson transition-opacity hover:opacity-70"
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
