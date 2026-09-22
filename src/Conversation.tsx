import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ThinkingOrb } from 'thinking-orbs'
import './Conversation.css'
import {
  IconNewChat, IconProjects, IconAgent, IconWorkflow, IconMarket,
  IconResearch, IconApps, IconAdmin, IconSettings, IconPanel, IconChevron,
  IconSearch, IconBell, IconHelp, IconMic, IconSend, IconScope, IconFolderPlus,
  IconSpark, IconSun, IconMoon, IconClose, IconFolder, IconSliders, IconChat, IconFork,
  IconStar, IconGrid, IconBars, IconDownload, IconShare, IconSort, IconFile, IconRecords, IconClock,
  IconPalette, IconCode,
} from './icons'
import DesignLab from './DesignLab'
import ProjectDetail from './ProjectDetail'

type Row = { name: string; status: 'Open' | 'In Progress' | 'Completed'; date: string; units: string }

const PREVIEW_ROWS: Row[] = [
  { name: 'Zifo', status: 'Open', date: '05 Mar 2023', units: 'EUR' },
  { name: 'Maveric', status: 'In Progress', date: '05 Mar 2023', units: 'GBP' },
  { name: 'Stellium', status: 'Completed', date: '05 Mar 2023', units: 'EUR' },
  { name: 'Instellar', status: 'In Progress', date: '05 Mar 2023', units: 'EUR' },
  { name: 'Nest Digital', status: 'In Progress', date: '05 Mar 2023', units: 'EUR' },
  { name: 'Meta', status: 'Open', date: '05 Mar 2023', units: 'GBP' },
]
const statusClass = (s: Row['status']) =>
  s === 'Completed' ? 'completed' : s === 'In Progress' ? 'progress' : 'open'

type Msg = { id: number; role: 'user' | 'assistant'; text: string }

type Chat = { id: string; group: string; title: string; dot: string; fork?: boolean }

const CHATS: Chat[] = [
  { id: 'c1', group: 'Today', title: 'Fork · CDU-1 scope freez…', dot: '#b9c0ca', fork: true },
  { id: 'c2', group: 'Today', title: 'CDU-1 scope freeze exce…', dot: '#b9c0ca', fork: true },
  { id: 'c3', group: 'Today', title: 'E-1104 bundle delivery slip', dot: '#3aa828' },
  { id: 'c4', group: 'Today', title: 'Jubail pipeline ILI — top a…', dot: '#3aa828' },
  { id: 'c5', group: 'Yesterday', title: 'IR-2214 flange leak — roo…', dot: '#fa8c16' },
  { id: 'c6', group: 'Last Monday', title: 'IR-2214 flange leak — root …', dot: '#52c41a' },
]

/* Split a typed prompt into styled segments: /commands (blue) and @agents (orange). */
function renderPrompt(text: string) {
  return text.split(/(\s+)/).map((tok, i) => {
    if (/^\/\S/.test(tok)) return <span key={i} className="seg seg--cmd">{tok}</span>
    if (/^@\S/.test(tok)) return <span key={i} className="seg seg--agent">{tok}</span>
    return <span key={i}>{tok}</span>
  })
}

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem('keos-theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const A = '/assets'
const BUILD_LOGO = `${A}/keos-build-mark.svg`

type Item = { id: string; label: string; Icon: (p: { className?: string }) => JSX.Element }

const build: Item[] = [
  { id: 'codegenie', label: 'CodeGenie', Icon: IconCode },
  { id: 'agents', label: 'Agent Store', Icon: IconAgent },
  { id: 'workflows', label: 'Workflows', Icon: IconWorkflow },
  { id: 'market', label: 'Marketplace', Icon: IconMarket },
  { id: 'designlab', label: 'Design Lab', Icon: IconPalette },
]
const work: Item[] = [
  { id: 'research', label: 'Research', Icon: IconResearch },
  { id: 'apps', label: 'Apps & Artifacts', Icon: IconApps },
]
const control: Item[] = [
  { id: 'admin', label: 'Admin & Governance', Icon: IconAdmin },
  { id: 'settings', label: 'Setting', Icon: IconSettings },
]

export default function Conversation() {
  const [expanded, setExpanded] = useState(true)
  const [projectsOpen, setProjectsOpen] = useState(true)
  const [active, setActive] = useState('newchat')
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('keos-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const endRef = useRef<HTMLDivElement>(null)
  const hasThread = messages.length > 0

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const send = () => {
    const t = input.trim()
    if (!t) return
    const id = Date.now()
    setMessages((m) => [
      ...m,
      { id, role: 'user', text: t },
      { id: id + 1, role: 'assistant', text: '' },
    ])
    setInput('')
    // Document prompts open the Live Preview panel (slides in after "generating")
    if (/\b(pdf|docx?|document|prd|report|dashboard|preview|table)\b/i.test(t)) {
      setChatsOpen(false)
      window.setTimeout(() => setPreviewOpen(true), 650)
    }
  }

  const onComposerKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const [projects, setProjects] = useState([
    'Aramco Ras Tanura Turnaround (TAR…',
    'SABIC Jubail Expansion Project…',
  ])
  const removeProject = (i: number) =>
    setProjects((p) => p.filter((_, idx) => idx !== i))
  const addProject = () =>
    setProjects((p) => [...p, `New Project Scope ${p.length + 1}…`])

  const [chatsOpen, setChatsOpen] = useState(true)
  const [chatQuery, setChatQuery] = useState('')
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewView, setPreviewView] = useState<'table' | 'chart'>('table')
  const [listening, setListening] = useState(false)

  const filteredChats = CHATS.filter((c) => {
    const q = chatQuery.trim().toLowerCase()
    return !q || c.title.toLowerCase().includes(q)
  })
  const chatGroups = filteredChats.reduce<Record<string, Chat[]>>((acc, c) => {
    ;(acc[c.group] ??= []).push(c)
    return acc
  }, {})

  const openChat = (c: Chat) => {
    setActiveChatId(c.id)
    const id = Date.now()
    setMessages([
      { id, role: 'user', text: c.title },
      { id: id + 1, role: 'assistant', text: '' },
    ])
  }

  const newChat = () => {
    setMessages([])
    setInput('')
    setActiveChatId(null)
    setActive('newchat')
  }

  const [codeMode, setCodeMode] = useState<'chat' | 'code'>('chat')
  const newBuild = () => {
    setMessages([])
    setInput('')
    setActiveChatId(null)
    setActive('codegenie')
    setCodeMode('chat')
  }

  const composerBlock = (
    <>
      <div className="chips">
        <button className="chip">
          <IconScope className="chip__icon" />
          <span>Scope: Multi Project</span>
          <IconChevron className="chip__chev" />
        </button>
        {projects.map((name, i) => (
          <span key={i} className="chip chip--project">
            <IconFolder className="chip__icon" />
            <span>{name}</span>
            <button
              className="chip__remove"
              aria-label={`Remove ${name}`}
              onClick={() => removeProject(i)}
            >
              <IconClose className="chip__chev" />
            </button>
          </span>
        ))}
        <button className="chip chip--icon" aria-label="Add project scope" onClick={addProject}>
          <IconFolderPlus className="chip__icon" />
        </button>
      </div>

      <div className="composer">
        <textarea
          className="composer__input"
          placeholder="Message KEOS — use @ to mention an agent…"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onComposerKey}
        />
        <div className="composer__actions">
          <button className="composer__smart">
            <IconSpark className="composer__smart-icon" />
            <span>Smart</span>
            <IconChevron className="chip__chev" />
          </button>
          <button
            className={`composer__mic${listening ? ' is-listening' : ''}`}
            onClick={() => setListening((v) => !v)}
            aria-label={listening ? 'Stop listening' : 'Voice input'}
            aria-pressed={listening}
          >
            {listening ? <ThinkingOrb state="listening" size={20} /> : <IconMic />}
          </button>
          <button className="composer__send" aria-label="Send" onClick={send}>
            <IconSend />
          </button>
        </div>
      </div>
    </>
  )

  const NavBtn = ({ id, label, Icon }: Item) => (
    <button
      className={`nav__item${active === id ? ' is-active' : ''}`}
      onClick={() => setActive(id)}
      title={!expanded ? label : undefined}
    >
      <Icon className="nav__icon" />
      <span className="nav__label">{label}</span>
    </button>
  )

  return (
    <div className={`app${expanded ? ' is-expanded' : ' is-collapsed'}`}>
      {/* ===================== SIDEBAR ===================== */}
      <aside className="sidebar">
        <div className="sidebar__top">
          <img
            className="sidebar__logo"
            src={active === 'codegenie' ? BUILD_LOGO : `${A}/kframe.svg`}
            alt="KEOS"
          />
          <div className="sidebar__top-right">
            {expanded && active === 'codegenie' && (
              <div className="mode-toggle" role="radiogroup" aria-label="Chat or code mode">
                <button
                  className={`mode-toggle__btn${codeMode === 'chat' ? ' is-active' : ''}`}
                  onClick={() => setCodeMode('chat')}
                  role="radio"
                  aria-checked={codeMode === 'chat'}
                  aria-label="Chat mode"
                >
                  <IconChat className="mode-toggle__icon" />
                  <span className="mode-toggle__dot" />
                </button>
                <button
                  className={`mode-toggle__btn${codeMode === 'code' ? ' is-active' : ''}`}
                  onClick={() => setCodeMode('code')}
                  role="radio"
                  aria-checked={codeMode === 'code'}
                  aria-label="Code mode"
                >
                  <IconCode className="mode-toggle__icon" />
                </button>
              </div>
            )}
            <button
              className="sidebar__toggle"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <IconPanel />
            </button>
          </div>
        </div>

        <div className="sidebar__scroll">
          <button
            className={`nav__item nav__item--primary${active === 'newchat' || active === 'codegenie' ? ' is-active' : ''}`}
            onClick={active === 'codegenie' ? newBuild : newChat}
            title={!expanded ? (active === 'codegenie' ? 'New Build' : 'New Chat') : undefined}
          >
            <IconNewChat className="nav__icon" />
            <span className="nav__label">{active === 'codegenie' ? 'New Build' : 'New Chat'}</span>
          </button>

          {/* Projects (expandable) */}
          <button
            className="nav__item"
            onClick={() => (expanded ? setProjectsOpen((v) => !v) : setExpanded(true))}
            title={!expanded ? 'Projects' : undefined}
          >
            <IconProjects className="nav__icon" />
            <span className="nav__label">Projects</span>
            <IconChevron
              className={`nav__chevron${projectsOpen ? ' is-open' : ''}`}
            />
          </button>
          {expanded && projectsOpen && (
            <div className="nav__sub">
              <button className="nav__subitem" onClick={() => setActive('project')}>All Projects</button>
              <button className="nav__subitem">New Project</button>
            </div>
          )}

          <div className="nav__section">
            <span className="nav__section-label">Build</span>
            {build.map((it) => <NavBtn key={it.id} {...it} />)}
          </div>

          <div className="nav__section">
            <span className="nav__section-label">Work</span>
            {work.map((it) => <NavBtn key={it.id} {...it} />)}
          </div>

          <div className="nav__section">
            <span className="nav__section-label">Control</span>
            {control.map((it) => <NavBtn key={it.id} {...it} />)}
          </div>
        </div>

        <div className="sidebar__footer">
          <div className="rai" title="Responsible AI active">
            <IconAdmin className="rai__icon" />
            <span className="rai__text">
              <b>RAI Trust · 94%</b>
              <small>Responsible AI active</small>
            </span>
          </div>
          <div className="user">
            <span className="user__avatar">AB</span>
            <span className="user__text">
              <b>Aswini Bala</b>
              <small>KaarTech</small>
            </span>
          </div>
        </div>
      </aside>

      {/* ===================== CHATS PANEL ===================== */}
      {chatsOpen && active !== 'project' && (
        <aside className="chats">
          <div className="chats__head">
            <span className="chats__title">{active === 'codegenie' ? 'Sessions' : 'Chats'}</span>
            <button className="chats__icon" aria-label="Filter chats">
              <IconSliders />
            </button>
            <button
              className="chats__icon"
              aria-label="Close chats"
              onClick={() => setChatsOpen(false)}
            >
              <IconClose />
            </button>
          </div>

          <div className="chats__search">
            <IconSearch className="chats__search-icon" />
            <input
              className="chats__search-input"
              placeholder="Search Chats Or Projects"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
            />
          </div>

          <div className="chats__scroll">
            {filteredChats.length === 0 ? (
              <div className="chats__empty">
                <IconChat className="chats__empty-icon" />
                <p>{chatQuery ? 'No Chats Found' : 'Your Chats Will Show Up Here'}</p>
              </div>
            ) : (
              Object.entries(chatGroups).map(([group, items]) => (
                <div key={group} className="chats__group">
                  <span className="chats__group-label">{group}</span>
                  {items.map((c) => (
                    <button
                      key={c.id}
                      className={`chat-item${activeChatId === c.id ? ' is-active' : ''}`}
                      onClick={() => openChat(c)}
                    >
                      <span className="chat-item__dot" style={{ background: c.dot }} />
                      {c.fork && <IconFork className="chat-item__fork" />}
                      <span className="chat-item__title">{c.title}</span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </aside>
      )}

      {/* ===================== MAIN ===================== */}
      <main className="main">
        <header className="topbar">
          {!expanded && (
            <button
              className="topbar__toggle"
              onClick={() => setExpanded(true)}
              aria-label="Expand sidebar"
            >
              <IconPanel />
            </button>
          )}
          {active !== 'project' && (
            <button
              className={`topbar__chats${chatsOpen ? ' is-active' : ''}`}
              onClick={() => setChatsOpen((v) => !v)}
              aria-pressed={chatsOpen}
            >
              <IconChat className="topbar__chats-icon" />
              <span>{active === 'codegenie' ? 'Sessions' : 'Chats'}</span>
            </button>
          )}
          <nav className="crumbs">
            <span>KEOS</span>
            <span className="crumbs__sep">›</span>
            <span className={`crumbs__current${active === 'codegenie' ? ' crumbs__current--accent' : ''}`}>
              {active === 'project' ? 'All Projects' : active === 'codegenie' ? 'CodeGenie' : 'Chats'}
            </span>
          </nav>
          <div className="topbar__actions">
            <button aria-label="Search"><IconSearch /></button>
            <button aria-label="Notifications"><IconBell /></button>
            <button aria-label="Help"><IconHelp /></button>
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={theme === 'dark'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
            </button>
          </div>
        </header>

        <div className="main__split">
        {active === 'designlab' ? (
          <DesignLab />
        ) : active === 'project' ? (
          <ProjectDetail />
        ) : active === 'codegenie' && codeMode === 'code' ? (
          <section className="convo">
            <div className="convo__inner">
              <span className="codegenie-code__icon"><IconCode /></span>
              <h1 className="convo__title">Code Workspace</h1>
              <p className="convo__subtitle">Your CodeGenie build environment is coming soon.</p>
            </div>
          </section>
        ) : (
        <>
        <section className={`convo${hasThread ? ' is-thread' : ''}`}>
          {hasThread ? (
            <>
              <div className="thread">
                <div className="thread__inner">
                  {messages.map((m) =>
                    m.role === 'user' ? (
                      <div key={m.id} className="msg msg--user">
                        <div className="bubble">{renderPrompt(m.text)}</div>
                      </div>
                    ) : (
                      <AssistantReply key={m.id} onOpenDoc={() => setPreviewOpen(true)} />
                    ),
                  )}
                  <div ref={endRef} />
                </div>
              </div>
              <div className="dock">{composerBlock}</div>
            </>
          ) : (
            <div className="convo__inner">
              <img
                className="convo__logo"
                src={active === 'codegenie' ? BUILD_LOGO : `${A}/kframe.svg`}
                alt="KEOS"
              />
              <h1 className="convo__title">
                {active === 'codegenie' ? "Halfway there. Let's solve this, Aswini." : 'Welcome To Keos Conversation'}
              </h1>
              <p className="convo__subtitle">
                {active === 'codegenie' ? (
                  "Big goals take focus. Let's get to work."
                ) : (
                  <>Ask Anything Across Your Project's Knowledge — Or Type @<br />To Bring An Agent In.</>
                )}
              </p>
              <div className="dock dock--hero">{composerBlock}</div>
            </div>
          )}
        </section>

        {previewOpen && (
          <aside className="preview">
            <div className="preview__head">
              <span className="preview__title">Live Preview</span>
              <div className="preview__tools">
                <button className="preview__btn">
                  <IconStar /> <span>Mark as Fav</span>
                </button>
                <div className="preview__toggle">
                  <button
                    className={previewView === 'table' ? 'is-active' : ''}
                    onClick={() => setPreviewView('table')}
                    aria-label="Table view"
                  >
                    <IconGrid />
                  </button>
                  <button
                    className={previewView === 'chart' ? 'is-active' : ''}
                    onClick={() => setPreviewView('chart')}
                    aria-label="Chart view"
                  >
                    <IconBars />
                  </button>
                </div>
                <button className="preview__btn">
                  <IconDownload /> <span>Download</span>
                </button>
                <button className="preview__btn">
                  <IconShare /> <span>Share</span>
                </button>
                <button
                  className="preview__btn preview__close"
                  onClick={() => setPreviewOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="preview__body">
              <div className="preview__stats">
                <div className="stat">
                  <span className="stat__icon"><IconRecords /></span>
                  <div className="stat__text">
                    <small>Total Records</small>
                    <b>1200</b>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat__icon"><IconGrid /></span>
                  <div className="stat__text">
                    <small>Columns</small>
                    <b>5</b>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat__icon"><IconClock /></span>
                  <div className="stat__text">
                    <small>Last Updated</small>
                    <b>Now</b>
                  </div>
                </div>
              </div>

              {previewView === 'table' ? (
                <div className="preview__table-wrap">
                  <table className="ptable">
                    <thead>
                      <tr>
                        <th>Projects <IconSort className="ptable__sort" /></th>
                        <th>Status <IconSort className="ptable__sort" /></th>
                        <th>Start Date <IconSort className="ptable__sort" /></th>
                        <th>Units <IconSort className="ptable__sort" /></th>
                      </tr>
                    </thead>
                    <tbody>
                      {PREVIEW_ROWS.map((r) => (
                        <tr key={r.name}>
                          <td>{r.name}</td>
                          <td>
                            <span className={`pill pill--${statusClass(r.status)}`}>
                              {r.status} <IconChevron className="pill__chev" />
                            </span>
                          </td>
                          <td>{r.date}</td>
                          <td>{r.units}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="preview__chart">
                  {PREVIEW_ROWS.map((r, i) => (
                    <div className="preview__bar-col" key={r.name}>
                      <div
                        className={`preview__bar pill--${statusClass(r.status)}`}
                        style={{ height: `${40 + i * 12}%` }}
                      />
                      <span>{r.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}
        </>
        )}
        </div>
      </main>
    </div>
  )
}

const REPLY_SECTIONS = [
  'Executive Summary — Platform overview and MVP focus',
  'Problem Statement — Pain points: manual data work, delayed decisions, complex existing tools',
  'Solution Overview — No-code dashboard & report builder with pre-built connectors',
  'Target Users — Business users (finance/ops/sales managers) and data analysts',
  'Key Features — Data connectors (Salesforce, HubSpot, Stripe, databases), dashboard builder, automated reports, role-based sharing',
  'Success Metrics — Time-to-first-dashboard, activation rate, NPS targets',
  'Development Timeline — 12-week sprint roadmap (dashboard → connectors → reporting → polish)',
  'Risks & Assumptions — Key bets and mitigation strategies',
  'Out of Scope — What’s saved for post-MVP (SQL editing, AI insights, mobile, etc.)',
  'Definition of Done — Launch criteria (5 connectors, accessibility, 100 beta testers, NPS ≥ 40)',
]

function AssistantReply({ onOpenDoc }: { onOpenDoc: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="msg msg--assistant">
      <img className="reply__avatar" src={`${A}/kframe.svg`} alt="" aria-hidden />
      <div className="reply__body">
        <button
          className="reply__tools"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span>Ran 3 commands, viewed a file, read a file</span>
          <IconChevron className={`reply__tools-chev${open ? ' is-open' : ''}`} />
        </button>
        {open && (
          <ul className="reply__steps">
            <li>Read <code>brief/acme-mvp.md</code></li>
            <li>Ran <code>analyze --scope mvp</code></li>
            <li>Generated <code>prd/acme-mvp.md</code></li>
          </ul>
        )}

        <p className="reply__p">
          Done! I&rsquo;ve created a comprehensive PRD for Acme, an analytics and
          reporting SaaS platform currently in MVP development.
        </p>

        <h2 className="reply__h">What&rsquo;s Included:</h2>
        <p className="reply__note">
          <span className="reply__square" aria-hidden />
          10 sections covering:
        </p>
        <ol className="reply__list">
          {REPLY_SECTIONS.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>

        <p className="reply__p">
          The PRD is tailored to the analytics/reporting space with realistic
          personas, feature prioritization, and a concrete implementation timeline.
          Feel free to customize it for your specific use case, target markets, or
          roadmap adjustments.
        </p>

        <div className="reply__doc">
          <span className="reply__doc-thumb"><IconFile /></span>
          <div className="reply__doc-info">
            <b>Acme Prd</b>
            <small>Document · DOCX</small>
          </div>
          <button className="reply__doc-btn" onClick={onOpenDoc}>
            <IconDownload /> Download &amp; Open
          </button>
        </div>
      </div>
    </div>
  )
}
