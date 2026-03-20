import { randomBetween } from './helpers'

const strengthPool = [
  'Strong problem-solving approach',
  'Clean code architecture',
  'Excellent collaboration signals',
  'Good API design understanding',
  'Consistent project delivery',
  'Fast learning velocity',
]

const weaknessPool = [
  'Limited test coverage examples',
  'Needs deeper system design depth',
  'Inconsistent documentation detail',
  'Could improve performance profiling',
  'Sparse production deployment evidence',
  'Limited security hardening examples',
]

const pickRandom = (pool) => pool.sort(() => 0.5 - Math.random()).slice(0, 2)

export const simulateCandidateAnalysis = (candidateInput) => {
  const score = randomBetween(62, 97)
  const strengths = pickRandom(strengthPool)
  const weaknesses = pickRandom(weaknessPool)

  return {
    score,
    strengths,
    weaknesses,
    summary: `${candidateInput.name} shows solid technical alignment with modern product teams. AI confidence indicates ${score >= 80 ? 'high' : 'moderate'} readiness for interview progression with targeted follow-up on risk areas.`,
  }
}
