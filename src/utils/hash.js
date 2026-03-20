export const generateFakeHash = () => {
  const chars = 'abcdef0123456789'
  let hash = '0x'
  for (let index = 0; index < 64; index += 1) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}
