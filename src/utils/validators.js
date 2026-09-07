export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isStrongEnoughPassword = (value) =>
  String(value || "").length >= 6;
