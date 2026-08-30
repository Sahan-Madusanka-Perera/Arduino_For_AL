import { EmptyState, Button } from '@/components/ui'

export function NotFoundPage() {
  return (
    <div className="max-w-[680px] mx-auto py-8">
      <EmptyState
        title="That page does not exist"
        body="The address may have a typo in it, or the link may be out of date. The course path lists every lesson, and search will find any term."
        icon="search"
        action={
          <div className="flex gap-2 justify-center flex-wrap">
            <Button variant="primary" to="/">
              Go to the bench
            </Button>
            <Button to="/path">See the course</Button>
          </div>
        }
      />
    </div>
  )
}
