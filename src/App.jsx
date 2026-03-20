import { useEffect, useReducer } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/Navbar'
import { LandingPage } from './pages/LandingPage'
import { CandidateAnalysisPage } from './pages/CandidateAnalysisPage'
import { AIReportPage } from './pages/AIReportPage'
import { DashboardPage } from './pages/DashboardPage'
import { VerificationPage } from './pages/VerificationPage'
import { simulateCandidateAnalysis } from './utils/aiMock'
import { generateFakeHash } from './utils/hash'
import { loadCandidates, saveCandidates } from './utils/storage'

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
    await new Promise((resolve) => {
      setTimeout(resolve, 1700)
    })

    const candidate = {
      id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      link: payload.link,
      resumeName: payload.resumeName,
      createdAt: new Date().toISOString(),
      analysis: simulateCandidateAnalysis(payload),
      verification: null,
    }

    dispatch({ type: 'ADD_ANALYSIS', payload: candidate })
    return candidate
  }

  const handleGenerateProof = (candidateId) => {
    dispatch({
      type: 'ADD_BLOCKCHAIN_PROOF',
      payload: {
        id: candidateId,
        hash: generateFakeHash(),
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
