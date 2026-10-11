import { Link, useParams } from 'react-router-dom'
import { FlowStepper } from '../components/FlowStepper'
import { ReportCard } from '../components/ReportCard'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function AIReportPage({ candidates }) {
  const { candidateId } = useParams()
  const candidate = candidates.find((item) => item.id === candidateId)

  if (!candidate) {
    return (
      <Card className="mx-auto max-w-2xl text-center">
        <p className="text-lg font-semibold text-ink-50">Candidate report not found</p>
        <p className="mt-2 text-sm text-ink-400">
          This report is not in the current recruiter workspace. It may have been cleared from the dashboard.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/dashboard"><Button type="button">Back to Dashboard</Button></Link>
          <Link to="/analyze"><Button type="button" variant="outline">Analyze a Candidate</Button></Link>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6 pb-14">
      <FlowStepper currentStep={2} />
      <ReportCard candidate={candidate} />
    </div>
  )
}
