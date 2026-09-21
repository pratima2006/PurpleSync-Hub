import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Activity,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock3,
  ExternalLink,
  FileText,
  Flag,
  Globe2,
  Home,
  Info,
  Link2,
  ListFilter,
  MoreHorizontal,
  Radio,
  Search,
  ShieldCheck,
  Trophy,
  Vote,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Router as WouterRouter, useLocation } from 'wouter';

type PageKey = 'home' | 'voting' | 'schedule' | 'achievements' | 'updates' | 'links';

const navItems: { key: PageKey; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Briefing', icon: Home },
  { key: 'voting', label: 'Voting desk', icon: Vote },
  { key: 'schedule', label: 'Schedule', icon: CalendarDays },
  { key: 'achievements', label: 'Achievements', icon: Trophy },
  { key: 'updates', label: 'Updates', icon: FileText },
  { key: 'links', label: 'Official links', icon: Link2 },
];

const updates = [
  { id: 1, category: 'NOTICE', date: '18 JUN 2025', title: 'BTS WORLD TOUR “ARIRANG” — notice on ticketing details', summary: 'BIGHIT MUSIC has shared the first set of ticketing information for the Seoul dates. Keep the official notice close; details may update by region.', accent: 'plum' },
  { id: 2, category: 'RELEASE', date: '17 JUN 2025', title: '“Echoes of Tomorrow” enters its third week on the global chart', summary: 'The new single holds its position across 21 territories. A quiet, extraordinary run — and a reason to keep the signal clear.', accent: 'gold' },
  { id: 3, category: 'BROADCAST', date: '16 JUN 2025', title: 'BTS on KBS News 9: full interview now available', summary: 'A conversation on making music together again, the shape of the next chapter, and what home sounds like after time apart.', accent: 'blue' },
  { id: 4, category: 'COMMUNITY', date: '14 JUN 2025', title: 'The June “Purple Ribbon” project is now open for notes', summary: 'A global ARMY-led project collecting messages for the tour opening night. Participation details and deadlines are in the community brief.', accent: 'rose' },
];

const votingItems = [
  { id: 1, title: 'Global Fan Choice — June round', platform: 'Mnet Plus', closes: 'Closes in 18h 42m', progress: 68, note: 'Daily votes available', status: 'open' },
  { id: 2, title: 'Artist of the Summer 2025', platform: 'The Fandom', closes: 'Closes in 3d 07h', progress: 43, note: 'One vote per account', status: 'open' },
  { id: 3, title: 'Best Group — quarterly poll', platform: 'K-Chart', closes: 'Ended 12 JUN', progress: 100, note: 'Results pending', status: 'ended' },
  { id: 4, title: 'Global Streaming Awards', platform: 'Streamy', closes: 'Opens 26 JUN', progress: 0, note: 'Watch for opening notice', status: 'upcoming' },
];

const scheduleItems = [
  { day: '20', month: 'JUN', weekday: 'FRI', title: 'BTS WORLD TOUR “ARIRANG” — press conference', type: 'Broadcast', time: '19:00 KST', location: 'Official YouTube' },
  { day: '21', month: 'JUN', weekday: 'SAT', title: 'BTS WORLD TOUR “ARIRANG” — Seoul · night one', type: 'Performance', time: '18:00 KST', location: 'Goyang Stadium' },
  { day: '22', month: 'JUN', weekday: 'SUN', title: 'BTS WORLD TOUR “ARIRANG” — Seoul · night two', type: 'Performance', time: '18:00 KST', location: 'Goyang Stadium' },
  { day: '27', month: 'JUN', weekday: 'FRI', title: '“Echoes of Tomorrow” — behind the track', type: 'Content', time: '18:00 KST', location: 'BANGTANTV' },
];

const linkGroups = [
  { label: 'The official desk', description: 'Primary sources, always.', links: [
    { name: 'BTS Official', detail: 'bts.ibighit.com', url: 'https://ibighit.com/bts/eng/' },
    { name: 'BIGHIT MUSIC', detail: 'ibighit.com', url: 'https://ibighit.com' },
    { name: 'BTS on Weverse', detail: 'weverse.io/bts', url: 'https://weverse.io/bts' },
  ]},
  { label: 'Listen & watch', description: 'The places the music lives.', links: [
    { name: 'BANGTANTV', detail: 'youtube.com/@BTS', url: 'https://www.youtube.com/@BTS' },
    { name: 'BTS on Spotify', detail: 'open.spotify.com/artist', url: 'https://open.spotify.com/artist/3Nrfpe0tUJi4K4DXYWgMUX' },
    { name: 'BTS on Apple Music', detail: 'music.apple.com', url: 'https://music.apple.com/us/artist/bts/883131348' },
  ]},
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#aa8be8] text-[#2b1f4c]">
        <div className="h-4 w-4 rotate-45 border-[1.5px] border-[#2b1f4c]" />
        <div className="absolute h-2 w-2 rounded-full bg-[#2b1f4c]" />
      </div>
      {!compact && <span className="text-[17px] font-semibold tracking-[-0.03em]">PurpleSync</span>}
    </div>
  );
}

function Sidebar({ page, onNavigate }: { page: PageKey; onNavigate: (page: PageKey) => void }) {
  return (
    <aside className="ps-sidebar fixed inset-y-0 left-0 z-30 hidden w-[258px] flex-col px-5 py-7 md:flex">
      <div className="px-3"><BrandMark /></div>
      <div className="mt-14 px-3">
        <p className="ps-mono text-[9px] text-[#aa9fc8]">Your daily desk</p>
        <p className="mt-2 text-[13px] leading-5 text-[#d1cbe3]">A quieter way to stay close<br />to what matters.</p>
      </div>
      <nav className="mt-10 flex-1 space-y-1" aria-label="Main navigation">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button key={key} type="button" onClick={() => onNavigate(key)} className={`ps-nav-item flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium ${page === key ? 'active' : 'text-[#a59cbc]'}`}>
            <Icon size={17} strokeWidth={1.7} />
            <span>{label}</span>
            {key === 'voting' && <span className="ml-auto rounded-full bg-[#aa8be8] px-1.5 py-0.5 font-mono text-[9px] font-medium text-[#2b1f4c]">2</span>}
          </button>
        ))}
      </nav>
      <div className="rounded-2xl border border-[#4c4068] bg-[#312651] p-4">
        <div className="flex items-center gap-2 text-[#dcd5ed]"><ShieldCheck size={15} /><span className="text-[11px] font-medium">Source-first by design</span></div>
        <p className="mt-2 text-[11px] leading-4 text-[#a59cbc]">We point you to official sources. No noise, no guesswork.</p>
      </div>
      <div className="mt-5 flex items-center gap-3 border-t border-[#3c3157] pt-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7561a0] text-[11px] font-semibold text-white">A</div>
        <div><p className="text-[12px] font-medium text-[#eeeaf5]">My desk</p><p className="text-[10px] text-[#988ead]">Local view · private</p></div>
        <button type="button" className="ml-auto rounded-md p-1 text-[#988ead] hover:bg-[#3b2f56]" aria-label="More account options"><MoreHorizontal size={16} /></button>
      </div>
    </aside>
  );
}

function MobileNav({ page, onNavigate }: { page: PageKey; onNavigate: (page: PageKey) => void }) {
  const items = navItems.slice(0, 5);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[70px] items-center justify-around border-t border-[#dfd9eb] bg-[#fbfaff]/95 px-2 backdrop-blur-md md:hidden" aria-label="Mobile navigation">
      {items.map(({ key, label, icon: Icon }) => (
        <button key={key} type="button" onClick={() => onNavigate(key)} className={`flex min-w-[56px] flex-col items-center gap-1.5 rounded-xl px-2 py-2 text-[9px] font-medium ${page === key ? 'text-[#644597]' : 'text-[#8a829c]'}`}>
          <Icon size={18} strokeWidth={page === key ? 2.2 : 1.7} />
          <span>{label === 'Briefing' ? 'Home' : label.split(' ')[0]}</span>
        </button>
      ))}
    </nav>
  );
}

function Topbar({ page, onNavigate, onSearch }: { page: PageKey; onNavigate: (page: PageKey) => void; onSearch: () => void }) {
  const title = navItems.find((item) => item.key === page)?.label ?? 'Briefing';
  return (
    <header className="flex h-[82px] items-center justify-between border-b border-[#e8e3f0] px-5 md:px-10">
      <div className="flex items-center gap-4">
        <div className="md:hidden"><BrandMark compact /></div>
        <div className="hidden items-center gap-2 text-[11px] text-[#948ca0] md:flex"><span>ARMY /</span><span className="font-medium text-[#4c425c]">{title}</span></div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button type="button" onClick={onSearch} className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-[#81788f] hover:bg-[#f0edf6]" aria-label="Search the desk"><Search size={17} /><span className="hidden text-[12px] md:inline">Search</span></button>
        <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#81788f] hover:bg-[#f0edf6]" aria-label="Notifications"><Bell size={17} /><span className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-[#aa8be8]" /></button>
        <button type="button" onClick={() => onNavigate('links')} className="hidden items-center gap-2 rounded-lg border border-[#dfd9eb] bg-white px-3 py-2 text-[11px] font-medium text-[#4c425c] hover:border-[#b7a4dc] sm:flex"><Globe2 size={14} /> Official sources</button>
      </div>
    </header>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div><p className="ps-mono text-[9px] text-[#8068a9]">{eyebrow}</p><h2 className="ps-display mt-1 text-[27px] leading-none text-[#332840]">{title}</h2></div>
      {action}
    </div>
  );
}

function MetricCard({ label, value, detail, tone = 'plain' }: { label: string; value: string; detail: string; tone?: 'plain' | 'purple' }) {
  return (
    <div className={`ps-panel ps-panel-hover rounded-2xl p-5 ${tone === 'purple' ? 'border-[#68499b] bg-[#5e428f] text-white' : ''}`}>
      <div className="flex items-start justify-between"><p className={`ps-mono text-[9px] ${tone === 'purple' ? 'text-[#d9c9f1]' : 'text-[#958aa4]'}`}>{label}</p><Activity size={15} className={tone === 'purple' ? 'text-[#ceb9ed]' : 'text-[#aa8be8]'} /></div>
      <p className="mt-5 text-[29px] font-semibold tracking-[-0.06em]">{value}</p>
      <p className={`mt-1 text-[11px] ${tone === 'purple' ? 'text-[#d9c9f1]' : 'text-[#958aa4]'}`}>{detail}</p>
    </div>
  );
}

function HomePage({ onNavigate, dismissed, onDismiss }: { onNavigate: (page: PageKey) => void; dismissed: boolean; onDismiss: () => void }) {
  return (
    <div className="ps-page-enter ps-content py-8 md:py-12">
      <section className="ps-hero-glow ps-paper-grid relative overflow-hidden rounded-[26px] border border-[#e0d8ed] bg-[#f5f0fb] px-6 py-8 md:px-10 md:py-11">
        <div className="relative max-w-[650px]">
          <div className="flex items-center gap-2 text-[#8068a9]"><span className="ps-dot" /><span className="ps-mono text-[9px]">THURSDAY · 19 JUNE 2025</span></div>
          <h1 className="ps-display mt-6 max-w-[550px] text-[48px] leading-[.92] tracking-[-.035em] text-[#332840] md:text-[72px]">Keep the signal<br /><em className="text-[#704ca5]">close.</em></h1>
          <p className="mt-6 max-w-[450px] text-[14px] leading-6 text-[#70657f]">The day’s essential BTS briefing, arranged with care. Voting windows, the next note, and the moments worth holding onto.</p>
          <button type="button" onClick={() => onNavigate('voting')} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#5e428f] px-4 py-3 text-[12px] font-semibold text-white shadow-[0_8px_18px_hsl(258_51%_42%/.18)] transition-transform hover:-translate-y-0.5">Open voting desk <ArrowUpRight size={15} /></button>
        </div>
        <div className="absolute -right-5 -top-5 hidden h-56 w-56 rounded-full border border-[#cbb9e6] md:block" />
        <div className="absolute right-12 top-16 hidden h-36 w-36 rounded-full border border-[#d4c5e9] md:block" />
        <div className="absolute bottom-7 right-10 hidden max-w-[150px] text-right md:block"><p className="ps-mono text-[9px] text-[#8b73ae]">THE DESK NOTE</p><p className="mt-2 text-[12px] leading-5 text-[#756886]">“The best kind of current is calm.”</p></div>
      </section>
      <div className="ps-stagger mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="LIVE VOTING" value="02" detail="windows need your attention" tone="purple" />
        <MetricCard label="NEXT UP" value="20 JUN" detail="press conference · 19:00 KST" />
        <MetricCard label="THIS MONTH" value="08" detail="official updates logged" />
        <MetricCard label="ON RECORD" value="147" detail="achievements in the archive" />
      </div>
      {!dismissed && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#e2d7f1] bg-[#eee6f8] px-4 py-3.5 text-[#594879]">
          <Info size={16} className="mt-0.5 shrink-0 text-[#7958aa]" />
          <p className="flex-1 text-[12px] leading-5"><span className="font-semibold">A small desk note:</span> PurpleSync is a presentation of official sources — always follow through at the source before taking action.</p>
          <button type="button" onClick={onDismiss} className="rounded p-1 text-[#826fa1] hover:bg-[#e2d6ef]" aria-label="Dismiss note"><X size={15} /></button>
        </div>
      )}
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.16fr_.84fr]">
        <section>
          <SectionHeading eyebrow="RECENTLY ON THE DESK" title="The short read" action={<button type="button" onClick={() => onNavigate('updates')} className="flex items-center gap-1 text-[11px] font-semibold text-[#704ca5]">All updates <ChevronRight size={14} /></button>} />
          <div className="ps-panel overflow-hidden rounded-2xl">
            {updates.slice(0, 3).map((item, index) => (
              <article key={item.id} className={`group flex gap-4 px-5 py-5 ${index !== 2 ? 'border-b border-[#eeeaf3]' : ''}`}>
                <div className={`mt-1 h-9 w-9 shrink-0 rounded-xl ${item.accent === 'gold' ? 'bg-[#f5ead1] text-[#96733a]' : item.accent === 'blue' ? 'bg-[#e3ebf3] text-[#5c7791]' : 'bg-[#eee5f7] text-[#77599f]'} flex items-center justify-center`}><FileText size={16} strokeWidth={1.6} /></div>
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="ps-mono text-[8px] text-[#8d7da4]">{item.category}</span><span className="text-[10px] text-[#aaa2b2]">·</span><span className="text-[10px] text-[#aaa2b2]">{item.date}</span></div><h3 className="mt-1.5 text-[13px] font-semibold leading-5 text-[#3c324a] group-hover:text-[#704ca5]">{item.title}</h3><p className="mt-1.5 line-clamp-1 text-[11px] leading-5 text-[#887e91]">{item.summary}</p></div>
                <ChevronRight size={16} className="mt-5 shrink-0 text-[#b7adbf] transition-transform group-hover:translate-x-1" />
              </article>
            ))}
          </div>
        </section>
        <section>
          <SectionHeading eyebrow="NEXT ON THE CALENDAR" title="Keep close" action={<button type="button" onClick={() => onNavigate('schedule')} className="flex items-center gap-1 text-[11px] font-semibold text-[#704ca5]">Full schedule <ChevronRight size={14} /></button>} />
          <div className="ps-panel rounded-2xl p-5">
            <div className="flex items-center gap-4"><div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-[#60438f] text-white"><span className="ps-mono text-[9px] text-[#d4c2ef]">JUN</span><span className="text-[24px] font-semibold leading-6">20</span></div><div><p className="ps-mono text-[9px] text-[#907aa9]">FRIDAY · 19:00 KST</p><h3 className="mt-1 text-[14px] font-semibold leading-5 text-[#3c324a]">Press conference</h3><p className="mt-1 text-[11px] text-[#958a9c]">BTS WORLD TOUR “ARIRANG”</p></div></div>
            <div className="my-5 ps-rule" />
            <div className="flex items-center justify-between text-[11px]"><span className="text-[#887e91]">Time until start</span><span className="ps-mono text-[10px] text-[#704ca5]">01D : 04H : 18M</span></div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eeeaf4]"><div className="h-full w-[58%] rounded-full bg-[#a586d3]" /></div>
            <button type="button" onClick={() => onNavigate('schedule')} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e1d9ec] py-2.5 text-[11px] font-semibold text-[#665575] hover:bg-[#f8f5fb]">View calendar <CalendarDays size={14} /></button>
          </div>
        </section>
      </div>
      <section className="mt-12">
        <SectionHeading eyebrow="A QUIET MOMENT IN THE ARCHIVE" title="On record" action={<button type="button" onClick={() => onNavigate('achievements')} className="flex items-center gap-1 text-[11px] font-semibold text-[#704ca5]">Open archive <ChevronRight size={14} /></button>} />
        <div className="relative overflow-hidden rounded-2xl bg-[#2f2450] p-6 text-white md:p-8"><div className="absolute -right-20 -top-28 h-72 w-72 rounded-full border border-[#695887]" /><div className="absolute -right-5 top-7 h-36 w-36 rounded-full border border-[#695887]" /><div className="relative max-w-[640px]"><p className="ps-mono text-[9px] text-[#bda9df]">18 JUNE 2025 · ACHIEVEMENT 147</p><p className="ps-display mt-5 text-[29px] leading-[1.05] md:text-[38px]">“The first group to place three albums at No. 1 across three different decades.”</p><p className="mt-5 text-[11px] leading-5 text-[#c0b5d2]">A growing archive of the milestones that keep changing the shape of the room.</p></div></div>
      </section>
    </div>
  );
}

function VotingPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'ended'>('all');
  const [ready, setReady] = useState<number[]>([]);
  const filtered = votingItems.filter((item) => filter === 'all' || item.status === filter);
  const [seconds, setSeconds] = useState(18 * 3600 + 42 * 60 + 9);
  useEffect(() => { const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000); return () => window.clearInterval(timer); }, []);
  const countdown = `${String(Math.floor(seconds / 3600)).padStart(2, '0')}h ${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}m ${String(seconds % 60).padStart(2, '0')}s`;
  return (
    <div className="ps-page-enter ps-content py-8 md:py-12">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="ps-mono text-[9px] text-[#8068a9]">THE VOTING DESK</p><h1 className="ps-display mt-2 text-[48px] leading-[.9] tracking-[-.03em] text-[#332840]">Make the moment<br /><em className="text-[#704ca5]">count.</em></h1><p className="mt-5 max-w-[440px] text-[13px] leading-6 text-[#81758d]">A clear view of active windows, with the official destination always one click away.</p></div><div className="rounded-2xl border border-[#e0d4ed] bg-[#f1e9f9] p-4 md:min-w-[225px]"><div className="flex items-center justify-between"><span className="ps-mono text-[9px] text-[#8068a9]">NEXT CLOSES IN</span><Clock3 size={15} className="text-[#8068a9]" /></div><p className="mt-3 font-mono text-[20px] font-medium tracking-[-.04em] text-[#4f3876]">{countdown}</p><p className="mt-1 text-[10px] text-[#887b99]">Global Fan Choice · Mnet Plus</p></div></div>
      <div className="mt-10 flex gap-2 overflow-x-auto ps-scroll-hide">{(['all', 'open', 'ended'] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-full border px-4 py-2 text-[11px] font-medium capitalize ${filter === item ? 'border-[#60438f] bg-[#60438f] text-white' : 'border-[#ded6e9] bg-white text-[#766a84] hover:border-[#b9a5d7]'}`}>{item === 'all' ? 'All windows' : item === 'open' ? 'Open now' : 'Recently ended'}</button>)}</div>
      <div className="ps-stagger mt-5 grid gap-4 lg:grid-cols-2">{filtered.map((item) => <article key={item.id} className="ps-panel ps-panel-hover rounded-2xl p-5 md:p-6"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${item.status === 'open' ? 'bg-[#6aaf8f]' : item.status === 'ended' ? 'bg-[#b3a9bc]' : 'bg-[#c3a968]'}`} /><span className="ps-mono text-[9px] text-[#8e819c]">{item.platform}</span></div><h2 className="mt-3 text-[16px] font-semibold text-[#3d324b]">{item.title}</h2></div><button type="button" onClick={() => setReady((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} className={`rounded-lg border p-2 ${ready.includes(item.id) ? 'border-[#bca9d9] bg-[#f1eafb] text-[#704ca5]' : 'border-[#e1dbe9] text-[#988ca1] hover:text-[#704ca5]'}`} aria-label={ready.includes(item.id) ? 'Remove from desk' : 'Mark for later'}>{ready.includes(item.id) ? <CircleCheck size={16} /> : <Flag size={16} />}</button></div><div className="mt-7 flex items-end justify-between"><div><p className="ps-mono text-[9px] text-[#95899d]">STATUS</p><p className={`mt-1 text-[12px] font-medium ${item.status === 'open' ? 'text-[#6b9c7e]' : 'text-[#8f8495]'}`}>{item.closes}</p></div><p className="font-mono text-[18px] text-[#4f3a70]">{item.progress}%</p></div><div className="mt-3 h-1.5 rounded-full bg-[#eeeaf3]"><div className={`h-full rounded-full ${item.status === 'ended' ? 'bg-[#bdb4c7]' : 'bg-[#9b79c7]'}`} style={{ width: `${item.progress}%` }} /></div><div className="mt-4 flex items-center justify-between"><span className="text-[11px] text-[#958a9c]">{item.note}</span><button type="button" disabled={item.status !== 'open'} className="flex items-center gap-1.5 rounded-lg bg-[#60438f] px-3 py-2 text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#ddd7e4] disabled:text-[#918797]">Open official page <ExternalLink size={13} /></button></div></article>)}</div>
      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#e7e1ed] bg-white px-5 py-4"><ShieldCheck size={17} className="shrink-0 text-[#8068a9]" /><p className="text-[11px] leading-5 text-[#81768e]">PurpleSync does not process votes or ask for credentials. Use the official platform to participate.</p></div>
    </div>
  );
}

function SchedulePage() {
  const [view, setView] = useState<'week' | 'month'>('week');
  return (
    <div className="ps-page-enter ps-content py-8 md:py-12"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="ps-mono text-[9px] text-[#8068a9]">THE RUN OF SHOW</p><h1 className="ps-display mt-2 text-[48px] leading-[.9] tracking-[-.03em] text-[#332840]">What’s<br /><em className="text-[#704ca5]">ahead.</em></h1></div><div className="flex rounded-xl border border-[#ded7e9] bg-white p-1"><button type="button" onClick={() => setView('week')} className={`rounded-lg px-4 py-2 text-[11px] font-medium ${view === 'week' ? 'bg-[#60438f] text-white' : 'text-[#887b92]'}`}>This week</button><button type="button" onClick={() => setView('month')} className={`rounded-lg px-4 py-2 text-[11px] font-medium ${view === 'month' ? 'bg-[#60438f] text-white' : 'text-[#887b92]'}`}>June 2025</button></div></div>
      {view === 'month' ? <div className="ps-panel mt-10 rounded-2xl p-5 md:p-7"><div className="mb-6 flex items-center justify-between"><h2 className="text-[15px] font-semibold text-[#3d324b]">June 2025</h2><div className="flex gap-1"><button type="button" className="rounded-lg border border-[#e3dce9] p-2 text-[#82758e]"><ChevronRight size={15} className="rotate-180" /></button><button type="button" className="rounded-lg border border-[#e3dce9] p-2 text-[#82758e]"><ChevronRight size={15} /></button></div></div><div className="grid grid-cols-7 gap-1 text-center text-[9px] text-[#998ea2]">{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => <div key={day} className="py-2 ps-mono">{day}</div>)}{Array.from({ length: 30 }, (_, index) => <div key={index} className={`min-h-16 rounded-lg p-2 text-left text-[11px] ${[20, 21, 22, 27].includes(index + 1) ? 'bg-[#f0e9f7] font-semibold text-[#634493]' : 'text-[#84798e]'}`}>{index + 1}{[20, 21, 22, 27].includes(index + 1) && <div className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8d6bb7]" />}</div>)}</div></div> : <div className="mt-10"><div className="mb-5 flex items-center justify-between"><p className="text-[12px] text-[#887b92]">19 — 25 June 2025</p><button type="button" className="flex items-center gap-2 text-[11px] font-semibold text-[#704ca5]"><ListFilter size={14} /> Filter</button></div><div className="ps-panel overflow-hidden rounded-2xl">{scheduleItems.slice(0, 3).map((item, index) => <article key={item.day} className={`flex gap-4 px-5 py-5 md:gap-7 md:px-7 ${index !== 2 ? 'border-b border-[#eeeaf3]' : ''}`}><div className="flex w-12 shrink-0 flex-col items-center"><span className="ps-mono text-[9px] text-[#9a8ea2]">{item.month}</span><span className="mt-1 text-[27px] font-semibold leading-7 tracking-[-.06em] text-[#4b3b5e]">{item.day}</span><span className="mt-1 text-[9px] text-[#9a8ea2]">{item.weekday}</span></div><div className="min-w-0 flex-1 border-l border-[#e5dfea] pl-4 md:pl-7"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#f0e9f7] px-2 py-1 text-[9px] font-semibold text-[#76579b]">{item.type}</span><span className="text-[10px] text-[#9b90a1]">{item.time}</span></div><h2 className="mt-2 text-[14px] font-semibold leading-5 text-[#3d324b]">{item.title}</h2><p className="mt-1.5 text-[11px] text-[#968a9e]">{item.location}</p></div><button type="button" className="self-center rounded-lg p-2 text-[#aaa0b0] hover:bg-[#f5f2f8] hover:text-[#704ca5]" aria-label={`Add ${item.title} to calendar`}><CalendarDays size={16} /></button></article>)}</div></div>}</div>
  );
}

function AchievementsPage() {
  return (
    <div className="ps-page-enter ps-content py-8 md:py-12"><div><p className="ps-mono text-[9px] text-[#8068a9]">THE ARCHIVE</p><h1 className="ps-display mt-2 text-[48px] leading-[.9] tracking-[-.03em] text-[#332840]">A body of<br /><em className="text-[#704ca5]">work.</em></h1><p className="mt-5 max-w-[440px] text-[13px] leading-6 text-[#81758d]">The milestones are not just numbers. They are proof of distance travelled, kept in one place.</p></div><div className="mt-10 grid gap-4 md:grid-cols-[1.2fr_.8fr]"><div className="relative overflow-hidden rounded-2xl bg-[#60438f] p-7 text-white md:p-9"><div className="absolute -right-12 -top-16 h-52 w-52 rounded-full border border-[#876bb0]" /><p className="relative ps-mono text-[9px] text-[#d0beea]">LATEST ENTRY · 147</p><h2 className="relative ps-display mt-8 max-w-[500px] text-[32px] leading-[1.02] md:text-[42px]">Three decades.<br />One name at the centre.</h2><p className="relative mt-7 max-w-[410px] text-[12px] leading-5 text-[#d5c9e5]">The first group to place three albums at No. 1 across three different decades.</p><div className="relative mt-9 flex items-end justify-between border-t border-[#8c72b2] pt-4"><span className="text-[11px] text-[#d5c9e5]">18 June 2025</span><Trophy size={20} className="text-[#d7c4ee]" /></div></div><div className="ps-panel rounded-2xl p-6"><p className="ps-mono text-[9px] text-[#907fa0]">THE NUMBERS</p><div className="mt-7 space-y-6">{[['147', 'archived achievements'], ['21', 'territories with a No. 1'], ['09', 'years of shared history']].map(([number, label]) => <div key={label} className="flex items-end justify-between border-b border-[#eeeaf3] pb-4"><span className="text-[31px] font-semibold tracking-[-.07em] text-[#4f3b63]">{number}</span><span className="max-w-[115px] text-right text-[11px] leading-4 text-[#968a9f]">{label}</span></div>)}</div><button type="button" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e1d9ec] py-2.5 text-[11px] font-semibold text-[#665575] hover:bg-[#f8f5fb]">Browse full archive <ArrowUpRight size={14} /></button></div></div><div className="mt-10"><SectionHeading eyebrow="SELECTED RECORDS" title="Worth keeping" action={<button type="button" className="flex items-center gap-1 text-[11px] font-semibold text-[#704ca5]">Filter archive <ListFilter size={14} /></button>} /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[['2025', 'First K-pop group to headline a festival at Glastonbury', 'MILESTONE'], ['2024', 'Seven consecutive weeks at No. 1 with “Dynamite”', 'CHARTS'], ['2023', 'The most streamed group in global platform history', 'STREAMING']].map(([year, title, type]) => <article key={title} className="ps-panel ps-panel-hover rounded-2xl p-5"><div className="flex items-center justify-between"><span className="ps-mono text-[9px] text-[#907fa0]">{type}</span><span className="font-mono text-[12px] text-[#aa8be8]">{year}</span></div><h3 className="mt-8 text-[15px] font-semibold leading-5 text-[#40334e]">{title}</h3><div className="mt-8 flex items-center justify-between border-t border-[#eeeaf3] pt-3"><span className="text-[10px] text-[#9b8fa2]">Verified record</span><Check size={15} className="text-[#7c5da5]" /></div></article>)}</div></div></div>
  );
}

function UpdatesPage() {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<number | null>(1);
  const filters = ['All', 'Notice', 'Release', 'Broadcast', 'Community'];
  const filtered = updates.filter((item) => filter === 'All' || item.category === filter.toUpperCase());
  return (
    <div className="ps-page-enter ps-content py-8 md:py-12"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="ps-mono text-[9px] text-[#8068a9]">THE NEWSROOM</p><h1 className="ps-display mt-2 text-[48px] leading-[.9] tracking-[-.03em] text-[#332840]">Stay<br /><em className="text-[#704ca5]">current.</em></h1></div><div className="flex max-w-[300px] items-center gap-2 text-[12px] leading-5 text-[#81758d]"><Radio size={17} className="shrink-0 text-[#8068a9]" /> No algorithmic feed. Just the updates that deserve your attention.</div></div><div className="mt-10 flex gap-2 overflow-x-auto ps-scroll-hide">{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-[11px] font-medium ${filter === item ? 'border-[#60438f] bg-[#60438f] text-white' : 'border-[#ded6e9] bg-white text-[#766a84]'}`}>{item}</button>)}</div><div className="ps-panel mt-5 overflow-hidden rounded-2xl">{filtered.map((item, index) => <article key={item.id} className={`${index !== filtered.length - 1 ? 'border-b border-[#eeeaf3]' : ''}`}><button type="button" onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="flex w-full items-start gap-4 px-5 py-5 text-left md:px-7"><div className={`mt-0.5 h-9 w-9 shrink-0 rounded-xl ${item.accent === 'gold' ? 'bg-[#f5ead1] text-[#96733a]' : item.accent === 'blue' ? 'bg-[#e3ebf3] text-[#5c7791]' : item.accent === 'rose' ? 'bg-[#f3e3e9] text-[#a06177]' : 'bg-[#eee5f7] text-[#77599f]'} flex items-center justify-center`}><FileText size={16} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><span className="ps-mono text-[8px] text-[#8d7da4]">{item.category}</span><span className="text-[10px] text-[#aaa2b2]">·</span><span className="text-[10px] text-[#aaa2b2]">{item.date}</span></div><h2 className="mt-2 text-[14px] font-semibold leading-5 text-[#3d324b]">{item.title}</h2>{expanded === item.id && <p className="mt-2 max-w-[700px] text-[12px] leading-5 text-[#887e91]">{item.summary}</p>}</div><ChevronDown size={16} className={`mt-2 shrink-0 text-[#aa9faf] transition-transform ${expanded === item.id ? 'rotate-180' : ''}`} /></button></article>)}</div><div className="mt-7 flex items-center gap-3 rounded-2xl bg-[#f0eaf7] px-5 py-4 text-[#64527d]"><BookOpen size={17} className="shrink-0" /><p className="text-[11px] leading-5">Updates are written as a briefing, not a feed. For the complete context, open the original notice from an official source.</p></div></div>
  );
}

function LinksPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const openLink = (name: string, url: string) => { window.open(url, '_blank', 'noopener,noreferrer'); setCopied(name); window.setTimeout(() => setCopied(null), 1600); };
  return (
    <div className="ps-page-enter ps-content py-8 md:py-12"><div><p className="ps-mono text-[9px] text-[#8068a9]">THE SOURCE LIST</p><h1 className="ps-display mt-2 text-[48px] leading-[.9] tracking-[-.03em] text-[#332840]">Go to the<br /><em className="text-[#704ca5]">source.</em></h1><p className="mt-5 max-w-[450px] text-[13px] leading-6 text-[#81758d]">The official places, collected without detours. When something matters, this is where to begin.</p></div><div className="mt-10 space-y-8">{linkGroups.map((group) => <section key={group.label}><div className="mb-4 flex items-baseline justify-between"><div><h2 className="text-[16px] font-semibold text-[#40334e]">{group.label}</h2><p className="mt-1 text-[11px] text-[#958a9c]">{group.description}</p></div><span className="ps-mono text-[9px] text-[#aa9eac]">{group.links.length} destinations</span></div><div className="grid gap-3 md:grid-cols-3">{group.links.map((link) => <button type="button" key={link.name} onClick={() => openLink(link.name, link.url)} className="ps-panel ps-panel-hover group flex items-center gap-4 rounded-2xl p-4 text-left"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0e9f7] text-[#7759a0]"><Globe2 size={18} /></div><div className="min-w-0 flex-1"><h3 className="text-[13px] font-semibold text-[#43364f]">{link.name}</h3><p className="mt-1 truncate text-[10px] text-[#9a8ea0]">{link.detail}</p></div>{copied === link.name ? <Check size={15} className="text-[#6e9d7d]" /> : <ExternalLink size={15} className="text-[#b0a4b4] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}</button>)}</div></section>)}</div><div className="mt-10 rounded-2xl border border-[#e0d6ec] bg-[#f3ecfa] p-5 md:p-6"><div className="flex gap-3"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#7759a0]" /><div><h2 className="text-[13px] font-semibold text-[#514064]">A note on trust</h2><p className="mt-2 max-w-[650px] text-[11px] leading-5 text-[#7c6c8e]">PurpleSync only links to known official destinations in this presentation. Never share a password, payment information, or verification code through an unofficial page.</p></div></div></div></div>
  );
}

function SearchPanel({ onClose, onNavigate }: { onClose: () => void; onNavigate: (page: PageKey) => void }) {
  const [query, setQuery] = useState('');
  const results = navItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  return <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#2b2040]/30 px-4 pt-[14vh] backdrop-blur-sm" onMouseDown={onClose}><div className="w-full max-w-[500px] overflow-hidden rounded-2xl border border-[#e0d7ec] bg-white shadow-[0_25px_80px_hsl(258_51%_25%/.18)]" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-center gap-3 border-b border-[#eee9f2] px-5 py-4"><Search size={17} className="text-[#9b8da3]" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the desk..." className="flex-1 bg-transparent text-[13px] text-[#453650] outline-none placeholder:text-[#aaa1af]" /><button type="button" onClick={onClose} aria-label="Close search"><X size={17} className="text-[#9b8da3]" /></button></div><div className="p-2">{results.map(({ key, label, icon: Icon }) => <button key={key} type="button" onClick={() => { onNavigate(key); onClose(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] text-[#5b4d67] hover:bg-[#f5f1f9]"><Icon size={16} className="text-[#8068a9]" />{label}<ChevronRight size={14} className="ml-auto text-[#b0a5b4]" /></button>)}{results.length === 0 && <p className="px-3 py-5 text-center text-[12px] text-[#958a9e]">No desk pages match that search.</p>}</div></div></div>;
}

function Shell() {
  const [location, setLocation] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const page = useMemo<PageKey>(() => {
    const path = location.replace(/^\/+/, '').split('/')[0] as PageKey;
    return navItems.some((item) => item.key === path) ? path : 'home';
  }, [location]);
  const navigate = (next: PageKey) => setLocation(next === 'home' ? '/' : `/${next}`);
  let content: ReactNode = <HomePage onNavigate={navigate} dismissed={dismissed} onDismiss={() => setDismissed(true)} />;
  if (page === 'voting') content = <VotingPage />;
  if (page === 'schedule') content = <SchedulePage />;
  if (page === 'achievements') content = <AchievementsPage />;
  if (page === 'updates') content = <UpdatesPage />;
  if (page === 'links') content = <LinksPage />;
  return <div className="ps-shell"><Sidebar page={page} onNavigate={navigate} /><main className="ps-main ml-0 md:ml-[258px]"><Topbar page={page} onNavigate={navigate} onSearch={() => setSearchOpen(true)} />{content}</main><MobileNav page={page} onNavigate={navigate} />{searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} onNavigate={navigate} />}</div>;
}

function Router() {
  return <ErrorBoundary><Shell /></ErrorBoundary>;
}

const queryClient = new QueryClient();

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;