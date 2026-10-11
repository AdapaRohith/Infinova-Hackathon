import { useEffect, useReducer } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/Navbar'
import { LandingPage } from './pages/LandingPage'
import { CandidateAnalysisPage } from './pages/CandidateAnalysisPage'
import { AIReportPage } from './pages/AIReportPage'
import { DashboardPage } from './pages/DashboardPage'
import { loadCandidates, saveCandidates } from './utils/storage'
import { normalizeResumePayload } from './utils/resumeNormalizer'
import { assessGithubEvidence, generateCandidateReport } from './utils/gemini'
import { verifyIdentity } from './utils/identityVerifier'
import { synthesizeCandidateAssessment } from './utils/analysisSynthesizer'
import {
  ServiceUnavailableError,
  classifyRequestError,
} from './utils/serviceStatus'

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ANALYSIS':
      return [action.payload, ...state]
    case 'CLEAR_CANDIDATES':
      return []
    default:
      return state
  }
}

const fetchGitHubData = async (link) => {
  try {
    const match = String(link).match(/github\.com\/([a-zA-Z0-9_-]+)/i)
    if (!match) return null

    const username = match[1]
    console.log('Fetching GitHub data for:', username)

    const [profileRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=15`),
    ])

    if (!profileRes.ok) {
      console.warn('GitHub profile API returned', profileRes.status)
      return null
    }

    const profile = await profileRes.json()
    const repos = reposRes.ok ? await reposRes.json() : []

    return {
      username: profile.login,
      login: profile.login,
      name: profile.name || '',
      bio: profile.bio || '',
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      repos: repos.map((repo) => ({
        name: repo.name,
        description: repo.description || '',
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        homepage: repo.homepage || '',
      })),
    }
  } catch (error) {
    console.warn('Failed to fetch GitHub data:', error)
    return null
  }
}

const verifyGitHubWithAI = async (link, skills, resumeText, githubDataInput = null) => {
  const githubData = githubDataInput || await fetchGitHubData(link)
  if (!githubData) {
    return { score: 0, status: 'REVIEW', details: 'No public GitHub profile data was available to review.', summary: '' }
  }

  try {
    const data = await assessGithubEvidence({ link, skills, resumeText, githubData })
    return {
      score: Number(data.github_score ?? 0),
      status: data.verdict || 'REVIEW',
      details: data.reason || 'Evidence review complete.',
      summary: data.detailed_summary || data.reason || '',
    }
  } catch (error) {
    console.error('GitHub evidence review failed:', error)
    return { score: 0, status: 'UNAVAILABLE', details: error?.message || 'GitHub evidence review is temporarily unavailable.', summary: '' }
  }
}

const analyzeCandidateWithAI = async (payload) => {
  try {
    const report = await generateCandidateReport(payload)
    return {
      score: Math.max(0, Math.min(100, Number(report.score ?? 0))),
      skills: Array.isArray(report.skills) ? report.skills : [],
      summary: String(report.summary ?? ''),
      strengths: Array.isArray(report.strengths) ? report.strengths : [],
      weaknesses: Array.isArray(report.weaknesses) ? report.weaknesses : [],
    }
  } catch (error) {
    console.error('Gemini candidate analysis failed:', error)
    throw new ServiceUnavailableError(classifyRequestError(error), error?.message || 'Gemini could not complete the candidate analysis. Please try again.', { cause: error })
  }
}
function App() {
  const [candidates, dispatch] = useReducer(reducer, [], loadCandidates)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    saveCandidates(candidates)
  }, [candidates])

  const handleAnalyzeCandidate = async (payload) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })

    let normalized
    try {
      normalized = await normalizeResumePayload(payload)
    } catch (error) {
      console.error('Resume normalization failed, using direct form payload.', error)
      normalized = {
        name: payload.name,
        email: payload.email,
        link: payload.link,
        resumeName: payload.resumeName,
        projects: payload.link ? [payload.link] : [],
        skills: [],
        experience: '',
        yearsOfExperience: 0,
        projectHighlights: payload.link ? [`Project link: ${payload.link}`] : [],
        education: [],
        certifications: [],
        resumeText: '',
      }
    }

    const aiInput = { ...normalized }
    const githubDataPromise = fetchGitHubData(normalized.link)
    const [aiReport, githubData] = await Promise.all([
      analyzeCandidateWithAI(aiInput),
      githubDataPromise,
    ])

    const [githubVerification, identityCheck] = await Promise.all([
      verifyGitHubWithAI(normalized.link, normalized.skills, normalized.resumeText, githubData),
      Promise.resolve(
        verifyIdentity({
          formName: normalized.name,
          resumeText: normalized.resumeText,
          githubProfile: githubData
            ? {
                name: githubData.name,
                login: githubData.login || githubData.username,
              }
            : null,
        }),
      ),
    ])

    const assessment = synthesizeCandidateAssessment({
      analysis: aiReport,
      identityCheck,
      githubVerification,
      candidate: {
        ...normalized,
        analysis: aiReport,
      },
    })

    const candidate = {
      id: crypto.randomUUID(),
      ...normalized,
      createdAt: new Date().toISOString(),
      analysis: {
        ...aiReport,
        skills: aiReport.skills?.length ? aiReport.skills : normalized.skills,
        githubVerification: githubVerification || {
          score: 0,
          status: 'UNAVAILABLE',
          details: 'GitHub evidence review could not be completed at this time. Please retry the analysis.',
          summary: '',
        },
        identityCheck,
        assessment,
      },
    }

    dispatch({ type: 'ADD_ANALYSIS', payload: candidate })
    return candidate
  }

  const handleClearCandidates = () => {
    dispatch({ type: 'CLEAR_CANDIDATES' })
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink-1000 text-ink-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/analyze"
            element={
              <CandidateAnalysisPage
                candidates={candidates}
                onAnalyzeCandidate={handleAnalyzeCandidate}
              />
            }
          />
          <Route
            path="/report/:candidateId"
            element={
              <AIReportPage
                candidates={candidates}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                candidates={candidates}
                onClearCandidates={handleClearCandidates}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="mt-16 border-t border-ink-800">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-ink-500 sm:px-6 lg:px-8">
          <p>Proof-of-Workforce — agentic hiring trust layer.</p>
          <p>Evidence-backed candidate analysis.</p>
        </div>
      </footer>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#141416',
            color: '#f7f7f8',
            border: '1px solid #2b2b30',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#6ee7a8', secondary: '#141416' } },
          error: { iconTheme: { primary: '#f08a8a', secondary: '#141416' } },
        }}
      />
    </div>
  )
}

export default App
