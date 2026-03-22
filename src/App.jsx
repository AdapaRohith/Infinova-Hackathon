import { useEffect, useReducer } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Navbar } from './components/Navbar'
import { LandingPage } from './pages/LandingPage'
import { CandidateAnalysisPage } from './pages/CandidateAnalysisPage'
import { AIReportPage } from './pages/AIReportPage'
import { DashboardPage } from './pages/DashboardPage'
import { VerificationPage } from './pages/VerificationPage'
import { loadCandidates, saveCandidates } from './utils/storage'
import { generateHash } from './utils/hash'
import { storeHash } from './utils/blockchain'
import { normalizeResumePayload } from './utils/resumeNormalizer'

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
                txHash: action.payload.txHash,
                status: 'Verified on-chain',
                history: [
                  ...(candidate.verification?.history ?? []),
                  {
                    hash: action.payload.hash,
                    timestamp: action.payload.timestamp,
                    txHash: action.payload.txHash,
                  },
                ],
              },
            }
          : candidate,
      )
    default:
      return state
  }
}

const toStructuredAnalysis = (rawText = '') => {
  const text = String(rawText)

  const scoreMatch = text.match(/Score\s*:\s*(\d+)/i)
  const summaryMatch = text.match(/Summary\s*:\s*([\s\S]*?)(?:\n\s*(?:Strengths|Skills)\s*:|$)/i)
  const strengthsMatch = text.match(/Strengths\s*:\s*([\s\S]*?)(?:\n\s*(?:Weaknesses|Skills)\s*:|$)/i)
  const weaknessesMatch = text.match(/Weaknesses\s*:\s*([\s\S]*?)(?:\n\s*(?:Skills)\s*:|$)/i)
  const skillsMatch = text.match(/Skills\s*:\s*([\s\S]*)$/i)

  const parseBulletList = (sectionText) =>
    String(sectionText || '')
      .split(/[,\n•]/)
      .map((line) => line.replace(/^\s*[-•]\s*/, '').trim())
      .filter(Boolean)

  return {
    score: scoreMatch ? Number(scoreMatch[1]) : 0,
    summary: summaryMatch ? summaryMatch[1].trim() : text.trim(),
    strengths: parseBulletList(strengthsMatch?.[1]),
    weaknesses: parseBulletList(weaknessesMatch?.[1]),
    skills: parseBulletList(skillsMatch?.[1]),
  }
}

const verifyGitHubWithAI = async (link, skills, resumeText) => {
  console.log('Sending GitHub link to n8n verify-github webhook', link)

  try {
    const res = await fetch('https://n8n.avlokai.com/webhook/verify-github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ link, skills, resumeText }),
    })

    if (!res.ok) return null

    const rawBody = await res.text()
    if (!rawBody?.trim()) return null

    let rawData = JSON.parse(rawBody)
    let data = Array.isArray(rawData) ? rawData[0] : rawData

    // 🛡️ Robust Parsing: If n8n sends the raw OpenAI node output, find the JSON inside the text
    const aiText = data.output?.[0]?.text || data.text || '';
    if (aiText && typeof aiText === 'string') {
      try {
        const cleaned = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        data = { ...data, ...parsed };
      } catch (e) {
        console.warn('Could not parse AI text as JSON, using raw data');
      }
    }
    
    // Mapping your n8n output schema to the frontend state
    return {
      score: data.github_score || 0,
      status: data.verdict || 'PENDING', // STRONG, AVERAGE, WEAK
      details: data.reason || 'Verification complete.',
      summary: data.detailed_summary || data.reason || '' 
    }

  } catch (error) {
    console.error('GitHub verification failed:', error)
    return null
  }
}



const analyzeCandidateWithAI = async (payload) => {
  console.log('Sending payload to n8n analyze-candidate webhook', payload)

  const res = await fetch('https://n8n.avlokai.com/webhook/analyze-candidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`n8n webhook request failed with status ${res.status}`)
  }

  const rawBody = await res.text()
  if (!rawBody?.trim()) {
    throw new Error('n8n returned an empty response body. Check Respond to Webhook node output.')
  }

  let data
  try {
    const parsed = JSON.parse(rawBody)
    console.log('Raw data received from n8n:', parsed)
    data = Array.isArray(parsed) ? parsed[0] : parsed
  } catch {
    throw new Error('n8n returned non-JSON content. Ensure webhook response format is JSON.')
  }

  if (data?.report) {
    return {
      score: Number(data.report.score ?? 0),
      skills: Array.isArray(data.report.skills) ? data.report.skills : [],
      summary: String(data.report.summary ?? ''),
      strengths: Array.isArray(data.report.strengths) ? data.report.strengths : [],
      weaknesses: Array.isArray(data.report.weaknesses) ? data.report.weaknesses : [],
      agentSignature: data.report.agentSignature || null,
    }
  }

  const hasDirectFields = (data?.score !== undefined || data?.summary !== undefined)
  if (hasDirectFields) {
    return {
      score: Number(data.score ?? 0),
      skills: Array.isArray(data.skills) ? data.skills : [],
      summary: String(data.summary ?? ''),
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
      agentSignature: data.agentSignature || null,
    }
  }

  if (typeof data?.text === 'string' && data.text.trim()) {
    return toStructuredAnalysis(data.text)
  }

  throw new Error('n8n response is missing report payload')
}

function App() {
  const [candidates, dispatch] = useReducer(reducer, [], loadCandidates)

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

 // Start AI Analysis and GitHub Verification in parallel
 const [aiReport, githubVerification] = await Promise.all([
   analyzeCandidateWithAI(aiInput),
   verifyGitHubWithAI(normalized.link, normalized.skills, normalized.resumeText)
 ])

  const candidate = {
    id: crypto.randomUUID(),
    ...normalized,
    createdAt: new Date().toISOString(),
    analysis: {
      ...aiReport,
      // Merge AI skills with extracted skills if AI didn't provide any
      skills: aiReport.skills?.length ? aiReport.skills : normalized.skills,
      githubVerification: githubVerification || { status: 'Manual verification required', details: 'Scraper agent could not reach the provided link.' }
    },
    verification: null,
  }

  dispatch({ type: 'ADD_ANALYSIS', payload: candidate })
  return candidate
}


const handleGenerateProof = async (candidateId, onStatusChange) => {
  const candidate = candidates.find((item) => item.id === candidateId)
  if (!candidate) return null

  try {
    const hash = generateHash(candidate.analysis)

    const tx = await storeHash(candidateId, hash, onStatusChange)

    dispatch({
      type: 'ADD_BLOCKCHAIN_PROOF',
      payload: {
        id: candidateId,
        hash,
        txHash: tx.txHash,
        timestamp: tx.timestamp,
      },
    })

    return {
      hash,
      txHash: tx.txHash,
      timestamp: tx.timestamp,
    }
  } catch (error) {
    console.error('Blockchain error:', error)
    throw error
  }
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
