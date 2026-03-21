import { useEffect, useReducer } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/Navbar'
import { LandingPage } from './pages/LandingPage'
import { CandidateAnalysisPage } from './pages/CandidateAnalysisPage'
import { AIReportPage } from './pages/AIReportPage'
import { DashboardPage } from './pages/DashboardPage'
import { VerificationPage } from './pages/VerificationPage'
// TODO: Replace with real API calls
import { loadCandidates, saveCandidates } from './utils/storage'

import { extractTextFromPDF } from './utils/pdfExtractor'

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ANALYSIS':
      return [action.payload, ...state]
    case 'ADD_BLOCKCHAIN_PROOF':
      return state.map((candidate) =>
        candidate.id === action.payload.id
          ? {
              ...candidate,
              verification: {
                hash: action.payload.hash,
                timestamp: action.payload.timestamp,
                status: 'Verified on-chain',
              },
            }
          : candidate,
      )
    default:
      return state
  }
}

function App() {
  const [candidates, dispatch] = useReducer(reducer, [], loadCandidates)

  useEffect(() => {
    saveCandidates(candidates)
  }, [candidates])

  const handleAnalyzeCandidate = async (payload) => {
    try {
      const resumeText = payload.resumeFile ? await extractTextFromPDF(payload.resumeFile) : ''
      
      const response = await fetch('https://n8n.avlokai.com/webhook/analyze-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          link: payload.link,
          resumeText,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze candidate')
      }

      const raw = await response.json()
      console.log('n8n raw response:', raw)

      // Handle all possible n8n response shapes:
      // 1. [{ report: {...} }]  – Respond to Webhook with array wrapper
      // 2. { report: {...} }    – Respond to Webhook as plain object
      // 3. { score, skills, strengths, weaknesses, summary } – flat report
      let report
      if (Array.isArray(raw)) {
        const first = raw[0]
        report = first?.report ?? first
      } else {
        report = raw?.report ?? raw
      }
      console.log('parsed report:', report)

      const candidate = {
        id: crypto.randomUUID(),
        name: payload.name,
        email: payload.email,
        link: payload.link,
        resumeName: payload.resumeName || payload.resumeFile?.name || 'resume.pdf',
        createdAt: new Date().toISOString(),
        analysis: {
          score: report?.score ?? 0,
          skills: report?.skills || [],
          strengths: report?.strengths || [],
          weaknesses: report?.weaknesses || [],
          summary: report?.summary || 'Analysis complete.',
        },
        verification: null,
      }

      dispatch({ type: 'ADD_ANALYSIS', payload: candidate })
      return candidate
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const handleGenerateProof = (candidateId) => {
    // TODO: Connect to real backend
    dispatch({
      type: 'ADD_BLOCKCHAIN_PROOF',
      payload: {
        id: candidateId,
        hash: 'pending_verification_hash',
        timestamp: new Date().toISOString(),
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pt-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/analyze"
            element={
              <CandidateAnalysisPage onAnalyzeCandidate={handleAnalyzeCandidate} />
            }
          />
          <Route
            path="/report/:candidateId"
            element={
              <AIReportPage
                candidates={candidates}
                onGenerateProof={handleGenerateProof}
              />
            }
          />
          <Route path="/dashboard" element={<DashboardPage candidates={candidates} />} />
          <Route path="/verify" element={<VerificationPage candidates={candidates} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#ffffff',
            border: '1px solid rgba(55, 65, 81, 1)',
          },
        }}
      />
    </div>
  )
}

export default App
