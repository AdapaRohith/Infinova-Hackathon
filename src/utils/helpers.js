export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const formatDateTime = (isoDate) => {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleString()
}
