/* Minimal stroke icon set (24×24, currentColor).
   Stroke weight + corner style read from --icon-stroke / --icon-cap so a
   scoped subtree (e.g. Design Lab's sandbox) can retune icon character
   without swapping icon libraries. Defaults (1.7 / round) match the
   original hand-tuned look everywhere these vars aren't overridden. */
type P = { className?: string }
const iconStyle = {
  strokeWidth: 'var(--icon-stroke, 1.7)',
  strokeLinecap: 'var(--icon-cap, round)',
  strokeLinejoin: 'var(--icon-cap, round)',
} as unknown as import('react').CSSProperties

const S = (d: string) => ({ className }: P) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" style={iconStyle}>
    {d.split('|').map((p, i) => <path key={i} d={p} />)}
  </svg>
)

export const IconNewChat = S('M8 10h8|M8 14h5|M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 1 1 16.1-3.8z')
export const IconProjects = S('M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z')
export const IconAgent = S('M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z|M9 3V1|M15 3V1|M9 23v-2|M15 23v-2|M3 9h4|M3 15h4|M17 9h4|M17 15h4|M10 10h4v4h-4z')
export const IconWorkflow = S('M6 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z|M22 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z|M14 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0z|M4 6v4a2 2 0 0 0 2 2h6a2 2 0 0 1 2 2v2|M20 6v4a2 2 0 0 1-2 2h-4')
export const IconMarket = S('M3 9l1.5-5h15L21 9|M3 9h18v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5')
export const IconResearch = S('M9 2v6l-5 9a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-9V2|M8 2h8|M7.5 14h9')
export const IconApps = S('M12 3l9 5-9 5-9-5 9-5z|M3 12l9 5 9-5|M3 17l9 5 9-5')
export const IconAdmin = S('M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z|M9 12l2 2 4-4')
export const IconSettings = S('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z|M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1A2 2 0 1 1 6.9 4.6l.1.1a1.6 1.6 0 0 0 2.7-1.1V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z')
export const IconPanel = S('M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z|M9 3v18')
export const IconChevron = S('M6 9l6 6 6-6')
export const IconSearch = S('M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z|M21 21l-4.3-4.3')
export const IconBell = S('M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9|M13.7 21a2 2 0 0 1-3.4 0')
export const IconHelp = S('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z|M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3|M12 17h.01')
export const IconMic = S('M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z|M19 10a7 7 0 0 1-14 0|M12 19v3')
export const IconSend = S('M22 2L11 13|M22 2l-7 20-4-9-9-4z')
export const IconScope = S('M4 5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z|M14 3v5h5')
export const IconFolderPlus = S('M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z|M12 11v4|M10 13h4')
export const IconSpark = S('M12 3l1.8 4.9L18.7 9l-4.9 1.8L12 15.7l-1.8-4.9L5.3 9l4.9-1.8z|M19 14l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z')
export const IconMoon = S('M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z')
export const IconClose = S('M18 6L6 18|M6 6l12 12')
export const IconSliders = S('M4 21v-7|M4 10V4|M12 21v-9|M12 6V4|M20 21v-5|M20 12V4|M2 14h4|M10 6h4|M18 12h4')
export const IconChat = S('M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 1 1 16.1-3.8z')
export const IconFork = S('M6.5 4a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z|M17.5 4a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z|M12 15.6a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z|M6.5 8.4c0 3.4 5.5 3.2 5.5 7.2|M17.5 8.4c0 3.4-5.5 3.2-5.5 7.2')
export const IconStar = S('M12 3.5l2.47 5.01 5.53.8-4 3.9.94 5.5L12 16.1l-4.95 2.6.94-5.5-4-3.9 5.53-.8z')
export const IconGrid = S('M4 5h16v14H4z|M9.33 5v14|M14.66 5v14')
export const IconBars = S('M3 20h18|M6 20v-5|M12 20V8|M18 20v-9')
export const IconDownload = S('M12 4v11|M8 11l4 4 4-4|M5 20h14')
export const IconShare = S('M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6|M12 3v12|M8 7l4-4 4 4')
export const IconSort = S('M7 9l5-5 5 5|M7 15l5 5 5-5')
export const IconFile = S('M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z|M14 3v4h4|M9 13h6|M9 17h4')
export const IconRecords = S('M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z|M8 8h8|M8 12h3|M13 12h3|M8 16h3')
export const IconClock = S('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z|M12 8v4l3 2')
export const IconFolder = S('M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z')
export const IconSun = S('M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z|M12 1v2|M12 21v2|M4.2 4.2l1.4 1.4|M18.4 18.4l1.4 1.4|M1 12h2|M21 12h2|M4.2 19.8l1.4-1.4|M18.4 5.6l1.4-1.4')
export const IconPalette = S('M12 3a9 9 0 1 0 0 18c1 0 1.6-.6 1.6-1.5 0-.4-.2-.8-.4-1.1-.2-.3-.4-.6-.4-1 0-.8.6-1.4 1.4-1.4H16a4 4 0 0 0 4-4c0-5-3.6-9-8-9z|M7.5 12.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z|M9.5 8.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z|M14.5 8.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z|M16.5 12.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z')
export const IconImage = S('M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z|M9 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z|M20 16l-5-5-4 4-2-2-5 5')
export const IconRefresh = S('M4 4v5h5|M20 20v-5h-5|M4.5 15a8 8 0 0 0 14.9 2.6|M19.5 9a8 8 0 0 0-14.9-2.6')
export const IconCopy = S('M9 9h10v10H9z|M5 15V5a1 1 0 0 1 1-1h10')
export const IconType = S('M5 5h14|M12 5v14|M9 19h6')
export const IconBook = S('M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z|M4 19.5A2.5 2.5 0 0 1 6.5 17H20|M8 7h8|M8 10.5h8')
export const IconServer = S('M4 4h16v6H4z|M4 14h16v6H4z|M7.5 7h.01|M7.5 17h.01|M12 7h6|M12 17h6')
export const IconGavel = S('M13.5 5.5l5 5|M9.5 9.5l5 5|M4 21l7-7|M14.5 2.5l6 6-2.5 2.5-6-6z|M2.5 19.5l3-3 2 2-3 3z')
export const IconCalendar = S('M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z|M3 9h18|M8 3v3|M16 3v3|M8 14h.01|M12 14h.01|M16 14h.01')
export const IconExpand = S('M9 3H5a2 2 0 0 0-2 2v4|M15 3h4a2 2 0 0 1 2 2v4|M9 21H5a2 2 0 0 1-2-2v-4|M15 21h4a2 2 0 0 0 2-2v-4')
export const IconPlus = S('M12 5v14|M5 12h14')
export const IconMinus = S('M5 12h14')
export const IconExternal = S('M14 4h6v6|M20 4l-9 9|M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6')
