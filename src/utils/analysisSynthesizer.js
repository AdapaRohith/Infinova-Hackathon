// Statuses that mean the audit never ran say nothing about the candidate, so
// they must not count as negative evidence. Single source of truth lives in
// serviceStatus so a new failure code cannot silently start scoring as "weak".
import { isServiceFailure } from './serviceStatus'

const getGithubEvidence = (githubVerification = {}) => {
  const status = githubVerification.status || 'UNAVAILABLE'
  const score = Number(githubVerification.score ?? 0)

  if (isServiceFailure(status)) {
    return {
      label: 'GitHub audit could not be completed — verification service unavailable',
      tone: 'caution',
    }
  }

  if (status === 'STRONG' || score >= 75) {
    return {
      label: 'Claims supported by public code evidence',
      tone: 'positive',
    }
  }

  if (status === 'NO_LINK') {
    return {
      label: 'No GitHub evidence available for claim verification',
      tone: 'negative',
    }
  }

  if (status === 'WEAK' || score <= 35) {
    return {
      label: 'Weak or unsupported GitHub claim evidence',
      tone: 'negative',
    }
  }

  return {
    label: 'GitHub evidence requires manual review',
    tone: 'caution',
  }
}

const getIdentityEvidence = (identityCheck = {}) => {
  if (identityCheck.status === 'MATCH') {
    return {
      label: 'Form, resume, and GitHub identity are aligned',
      tone: 'positive',
    }
  }

  if (identityCheck.status === 'MISMATCH') {
    return {
      label: identityCheck.allThreeDifferent
        ? 'All three identity sources point to different people'
        : 'Identity mismatch detected across submitted sources',
      tone: 'negative',
    }
  }

  if (identityCheck.status === 'PARTIAL') {
    return {
      label: 'Identity is similar but not strong enough for auto-trust',
      tone: 'caution',
    }
  }

  return {
    label: 'Identity evidence unavailable',
    tone: 'caution',
  }
}

export const synthesizeCandidateAssessment = ({
  analysis,
  identityCheck,
  githubVerification,
  candidate,
}) => {
  const score = Number(analysis?.score ?? 0)
  const githubScore = Number(githubVerification?.score ?? 0)
  const githubStatus = githubVerification?.status
  const hasStrongMismatch = identityCheck?.status === 'MISMATCH'
  const githubUnavailable = isServiceFailure(githubStatus)
  // An outage is missing evidence, not bad evidence — it downgrades confidence, not the candidate.
  const weakGithub =
    !githubUnavailable && (githubStatus === 'WEAK' || githubStatus === 'NO_LINK' || githubScore <= 35)
  const strongGithub = githubStatus === 'STRONG' || githubScore >= 75

  let verdict = 'Needs Review'
  let verdictTone = 'caution'
  let riskLevel = 'Medium'
  let confidence = 'Moderate'

  if (hasStrongMismatch || weakGithub) {
    verdict = 'High Risk'
    verdictTone = 'negative'
    riskLevel = 'High'
    confidence = 'High'
  } else if (githubUnavailable) {
    verdict = 'Needs Review'
    verdictTone = 'caution'
    riskLevel = 'Unknown'
    confidence = 'Low'
  } else if (score >= 80 && strongGithub && identityCheck?.status === 'MATCH') {
    verdict = 'Trusted'
    verdictTone = 'positive'
    riskLevel = 'Low'
    confidence = 'High'
  } else if (score < 55) {
    verdict = 'Needs Review'
    verdictTone = 'caution'
    riskLevel = 'Medium'
    confidence = 'Moderate'
  }

  const evidence = [
    getIdentityEvidence(identityCheck),
    getGithubEvidence(githubVerification),
    {
      label:
        score >= 80
          ? 'AI capability score indicates strong technical fit'
          : score >= 60
            ? 'AI capability score indicates partial fit with open questions'
            : 'AI capability score indicates weak fit or missing evidence',
      tone: score >= 80 ? 'positive' : score >= 60 ? 'caution' : 'negative',
    },
    {
      label:
        (candidate?.analysis?.skills || candidate?.skills || []).length >= 4
          ? 'Structured skill extraction found enough signal for recruiter review'
          : 'Limited structured skill signal extracted from the resume',
      tone:
        (candidate?.analysis?.skills || candidate?.skills || []).length >= 4
          ? 'positive'
          : 'caution',
    },
  ]

  const agentTrace = [
    {
      agent: 'Resume Agent',
      status: candidate?.resumeText?.trim() ? 'complete' : 'warning',
      summary: candidate?.resumeText?.trim()
        ? 'Parsed resume text, extracted skills, experience, and candidate metadata.'
        : 'Resume text could not be fully extracted; downstream analysis used partial inputs.',
    },
    {
      agent: 'Identity Agent',
      status:
        identityCheck?.status === 'MATCH'
          ? 'complete'
          : identityCheck?.status === 'MISMATCH'
            ? 'alert'
            : 'warning',
      summary: identityCheck?.details || 'Identity comparison not available.',
    },
    {
      agent: 'GitHub Agent',
      status:
        githubStatus === 'STRONG'
          ? 'complete'
          : !githubUnavailable && (githubStatus === 'WEAK' || githubStatus === 'NO_LINK')
            ? 'alert'
            : 'warning',
      summary: githubVerification?.details || 'GitHub verification not available.',
    },
    {
      agent: 'Decision Agent',
      status: verdictTone === 'positive' ? 'complete' : verdictTone === 'negative' ? 'alert' : 'warning',
      summary: `${verdict} verdict with ${riskLevel.toLowerCase()} risk and ${confidence.toLowerCase()} confidence.`,
    },
  ]

  return {
    verdict,
    verdictTone,
    riskLevel,
    confidence,
    evidence,
    agentTrace,
  }
}
