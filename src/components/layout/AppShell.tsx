import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button, Icon, Silk, cx } from '@/components/ui'
import { useProgress } from '@/store/progress'
import { useResolvedTheme, useTheme } from '@/hooks/useTheme'
import { reviewCount } from '@/lib/review'
import { search as runSearch, KIND_LABEL } from '@/lib/search'

/* ============================================================================
   The shell IS the board.

   Power rails run down both edges of the viewport and bleed off the top and
   bottom, exactly as they do on a breadboard that is longer than the piece you
   are looking at. The content column sits on the hole field between them.
   ========================================================================== */

const NAV = [
  { to: '/', label: 'Bench', icon: 'grid', end: true },
  { to: '/path', label: 'Course', icon: 'book' },
  { to: '/practice', label: 'Practice', icon: 'target' },
  { to: '/review', label: 'Review', icon: 'refresh' },
  { to: '/lab', label: 'Lab', icon: 'flask' },
  { to: '/exam', label: 'Exam prep', icon: 'paper' },
  { to: '/glossary', label: 'Glossary', icon: 'note' },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme()
  const resolved = useResolvedTheme()
  const concepts = useProgress((s) => s.concepts)
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const due = reviewCount(concepts)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Cmd/Ctrl-K opens search from anywhere, which is what anyone who has used a
  // modern tool will try first.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Cycle from what is actually rendered, not from the stored preference, so
  // the first click always visibly changes something even when following the
  // system theme. Third state returns to following the system.
  const nextTheme: 'light' | 'dark' | null =
    theme === null ? (resolved === 'dark' ? 'light' : 'dark') : theme === resolved ? null : null
  const themeLabel =
    theme === null
      ? `Switch to the ${resolved === 'dark' ? 'white' : 'black'} board`
      : 'Follow the system theme'

  return (
    <div className="min-h-dvh flex flex-col">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <PowerRails />

      <header className="sticky top-0 z-30 border-b border-plastic-edge bg-[color-mix(in_srgb,var(--plastic)_88%,transparent)] backdrop-blur-md">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0 rounded-sm focus-visible:outline-3"
              aria-label="The Bench, home"
            >
              <BenchMark />
              <span className="hidden sm:block leading-none">
                <span className="block text-body font-bold tracking-tight">The Bench</span>
                <Silk className="block mt-0.5 text-micro">A/L ICT</Silk>
              </span>
            </Link>

            <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5 ml-4">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cx(
                      'relative flex items-center gap-1.5 px-3 h-9 rounded-sm text-small font-medium transition-colors',
                      isActive
                        ? 'text-ink bg-plastic-raised shadow-[var(--lift-1)]'
                        : 'text-ink-3 hover:text-ink hover:bg-plastic-raised',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon name={item.icon} size={15} />
                      {item.label}
                      {item.to === '/review' && due > 0 && (
                        <span
                          className="num ml-0.5 px-1.5 h-[18px] min-w-[18px] inline-flex items-center justify-center rounded-full bg-signal-high text-white text-micro font-bold"
                          aria-label={`${due} concepts due for review`}
                        >
                          {due}
                        </span>
                      )}
                      {isActive && (
                        <span
                          aria-hidden
                          className="absolute -bottom-[1px] left-3 right-3 h-[2px] bg-ink rounded-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 h-9 px-3 rounded-sm border border-plastic-edge bg-plastic-sunk text-ink-3 hover:text-ink hover:border-ink-faint transition-colors"
                aria-label="Search the course"
              >
                <Icon name="search" size={15} />
                <span className="hidden md:inline text-fine">Search</span>
                <kbd className="hidden md:inline num text-silk px-1.5 py-0.5 rounded-[2px] bg-plastic-raised border border-plastic-edge text-ink-faint">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => setTheme(nextTheme)}
                className="w-9 h-9 grid place-items-center rounded-sm text-ink-3 hover:text-ink hover:bg-plastic-raised transition-colors"
                aria-label={themeLabel}
                title={themeLabel}
              >
                <Icon name={resolved === 'dark' ? 'moon' : 'sun'} size={17} />
              </button>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="lg:hidden w-9 h-9 grid place-items-center rounded-sm text-ink-2 hover:bg-plastic-raised"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
              >
                <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-nav"
            aria-label="Primary, mobile"
            className="lg:hidden border-t border-plastic-edge bg-plastic-raised"
          >
            <div className="mx-auto max-w-[1180px] px-4 py-2 grid grid-cols-2 gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cx(
                      'flex items-center gap-2.5 px-3 h-12 rounded-md text-body font-medium',
                      isActive ? 'bg-plastic-sunk text-ink' : 'text-ink-2',
                    )
                  }
                >
                  <Icon name={item.icon} size={17} />
                  {item.label}
                  {item.to === '/review' && due > 0 && (
                    <span className="num ml-auto px-1.5 h-[18px] min-w-[18px] inline-flex items-center justify-center rounded-full bg-signal-high text-white text-micro font-bold">
                      {due}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1 relative">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-6 sm:py-10">{children}</div>
      </main>

      <Footer />

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </div>
  )
}

/* ------------------------------------------------------- power rails ---- */

/** The board's power rails, bleeding off the top and bottom of the viewport.
 *  Fixed, decorative, and hidden from assistive technology: they are the
 *  material the page is made of, not content. */
function PowerRails() {
  return (
    <div aria-hidden className="pointer-events-none fixed top-16 bottom-0 left-0 right-0 z-0">
      <Rail side="left" />
      <Rail side="right" />
    </div>
  )
}

function Rail({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={cx(
        'absolute inset-y-0 w-[38px] sm:w-[52px] hidden sm:flex flex-col justify-between',
        side === 'left' ? 'left-0' : 'right-0',
      )}
      style={{
        background: 'var(--plastic)',
        borderRight: side === 'left' ? '1px solid var(--plastic-edge)' : undefined,
        borderLeft: side === 'right' ? '1px solid var(--plastic-edge)' : undefined,
      }}
    >
      {/* + rail */}
      <div className="relative flex-1 flex flex-col items-center pt-4">
        <span
          className="silk text-silk mb-2"
          style={{ color: 'var(--rail-pos)', writingMode: 'vertical-rl' }}
        >
          + 5V
        </span>
        <span
          className="w-[2px] flex-1"
          style={{
            background: `linear-gradient(to bottom, transparent, var(--rail-pos) 8%, var(--rail-pos) 92%, transparent)`,
            opacity: 0.55,
          }}
        />
      </div>
      {/* hole column between the rails */}
      <div
        className="h-[38%] w-full holes opacity-60"
        style={{ backgroundSize: '20px 20px' }}
      />
      {/* − rail */}
      <div className="relative flex-1 flex flex-col items-center pb-4">
        <span
          className="w-[2px] flex-1"
          style={{
            background: `linear-gradient(to top, transparent, var(--rail-neg) 8%, var(--rail-neg) 92%, transparent)`,
            opacity: 0.55,
          }}
        />
        <span
          className="silk text-silk mt-2"
          style={{ color: 'var(--rail-neg)', writingMode: 'vertical-rl' }}
        >
          − GND
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- mark ----- */

/** The product mark: a 2×3 fragment of hole matrix with one hole occupied by a
 *  seated lead. Drawn, not lettered, so it reads at 24px on a phone. */
function BenchMark() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      aria-hidden
      className="shrink-0"
      style={{ filter: 'drop-shadow(0 1px 1px var(--plastic-shadow))' }}
    >
      <rect x="0.5" y="0.5" width="29" height="29" rx="6" fill="var(--plastic-raised)" stroke="var(--plastic-edge)" />
      {[9, 15, 21].map((y) =>
        [9, 21].map((x) => (
          <rect key={`${x}-${y}`} x={x - 2} y={y - 2} width="4" height="4" rx="1" fill="var(--hole)" />
        )),
      )}
      <rect x="13" y="7" width="4" height="4" rx="1" fill="var(--signal-high)" />
      <path d="M15 11v8" stroke="var(--signal-high)" strokeWidth="2" strokeLinecap="round" />
      <rect x="13" y="19" width="4" height="4" rx="1" fill="var(--signal-high)" />
    </svg>
  )
}

/* ----------------------------------------------------------- footer ----- */

function Footer() {
  return (
    <footer className="border-t border-plastic-edge mt-10 no-print">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div>
          <Silk className="block mb-1.5">Source</Silk>
          <p className="text-fine text-ink-3 max-w-lg leading-relaxed">
            Course content follows the supplied G.C.E. A/L ICT syllabus unit on IoT, embedded
            systems and Arduino. Practice questions written for this course are labelled
            &ldquo;A/L-style&rdquo; and are not past-paper questions.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button to="/progress" variant="ghost" size="sm">
            Your progress
          </Button>
          <Button to="/notes" variant="ghost" size="sm">
            Notes
          </Button>
        </div>
      </div>
    </footer>
  )
}

/* --------------------------------------------------------- search ------- */

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const results = query.trim().length >= 2 ? runSearch(query, 20) : []

  useEffect(() => {
    inputRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => setCursor(0), [query])

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(results.length - 1, c + 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(0, c - 1))
    }
    if (e.key === 'Enter' && results[cursor]) {
      e.preventDefault()
      navigate(results[cursor].href)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] px-4"
      style={{ background: 'rgb(10 14 18 / 0.55)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the course"
        className="w-full max-w-2xl bg-plastic-raised border border-plastic-edge rounded-lg shadow-[var(--lift-3)] overflow-hidden seat-in"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 px-4 h-14 border-b border-plastic-edge">
          <Icon name="search" size={18} className="text-ink-faint shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, terms and questions…"
            className="flex-1 bg-transparent outline-none text-body placeholder:text-ink-faint"
            aria-label="Search"
            aria-controls="search-results"
            role="combobox"
            aria-expanded={results.length > 0}
            autoComplete="off"
          />
          <kbd className="num text-silk px-1.5 py-0.5 rounded-[2px] bg-plastic-sunk border border-plastic-edge text-ink-faint">
            esc
          </kbd>
        </div>

        <div id="search-results" role="listbox" className="max-h-[56vh] overflow-y-auto">
          {query.trim().length < 2 && (
            <p className="px-4 py-8 text-center text-small text-ink-3">
              Type at least two letters. Try <em>pull-up</em>, <em>1023</em> or <em>Industry 4.0</em>.
            </p>
          )}
          {query.trim().length >= 2 && results.length === 0 && (
            <p className="px-4 py-8 text-center text-small text-ink-3">
              Nothing found for &ldquo;{query}&rdquo;. Check the spelling, or try a single word.
            </p>
          )}
          {results.map((r, i) => (
            <Link
              key={`${r.kind}-${r.id}`}
              to={r.href}
              role="option"
              aria-selected={i === cursor}
              onClick={onClose}
              onMouseEnter={() => setCursor(i)}
              className={cx(
                'block px-4 py-3 border-b border-plastic-edge last:border-0 transition-colors',
                i === cursor ? 'bg-plastic-sunk' : 'hover:bg-plastic-sunk',
              )}
            >
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-body font-semibold truncate">{r.title}</span>
                <Silk className="shrink-0 text-micro">{KIND_LABEL[r.kind]}</Silk>
              </div>
              <p className="text-fine text-ink-3 line-clamp-2 leading-snug">{r.snippet}</p>
              <p className="text-meta text-ink-faint mt-1">{r.context}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
