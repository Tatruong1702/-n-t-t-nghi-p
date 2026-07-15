export default function formatMoney(amount) {
  if (amount == null || amount === '') return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount))
}
