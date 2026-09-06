export function generateOrderId(date = new Date(), random = Math.random) {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const serial = String(Math.floor(random() * 10000)).padStart(4, '0');
  return `ZNJ-${yy}${mm}${dd}-${serial}`;
}
