import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Spinner } from '@/components/ui'
import { Dashboard } from '@/pages/Dashboard'
import { useTheme } from '@/hooks/useTheme'

/* Route-level code splitting. The dashboard and the lesson page are what a
   student opens first, so they ship in the main bundle; the rest arrive when
   they are actually needed, which matters on a metered mobile connection. */
const LessonPage = lazy(() => import('@/pages/Lesson').then((m) => ({ default: m.LessonPage })))
const PathPage = lazy(() => import('@/pages/Path').then((m) => ({ default: m.PathPage })))
const PracticePage = lazy(() => import('@/pages/Practice').then((m) => ({ default: m.PracticePage })))
const ReviewPage = lazy(() => import('@/pages/Review').then((m) => ({ default: m.ReviewPage })))
const LabPage = lazy(() => import('@/pages/Lab').then((m) => ({ default: m.LabPage })))
const GlossaryPage = lazy(() => import('@/pages/Glossary').then((m) => ({ default: m.GlossaryPage })))
const ExamPage = lazy(() => import('@/pages/Exam').then((m) => ({ default: m.ExamPage })))
const ProgressPage = lazy(() => import('@/pages/Progress').then((m) => ({ default: m.ProgressPage })))
const NotesPage = lazy(() => import('@/pages/Notes').then((m) => ({ default: m.NotesPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFoundPage })))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // The lesson page manages its own scroll and focus, so leave it alone.
    if (!pathname.startsWith('/lesson/'))
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  useTheme()

  return (
    <AppShell>
      <ScrollToTop />
      <Suspense fallback={<Spinner label="Loading" />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/path" element={<PathPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}
