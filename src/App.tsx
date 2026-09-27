import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, BookOpen, CalendarDays, Check, ChevronDown, ChevronRight, CircleArrowUp, Clock3, Instagram, Mail, MapPin, Menu, PenLine, Quote, Sparkles, Users, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
const logo = '/prologue-logo.jpg';

const queryClient = new QueryClient();

type EventItem = {
  title: string;
  date: string;
  time: string;
  place: string;
  type: 'upcoming' | 'past';
  detail: string;
  color: string;
};

const events: EventItem[] = [
  { title: 'The First Page', date: '18', time: '05:00 PM', place: 'Seminar Hall B · LBSITW', type: 'upcoming', detail: 'An open-circle welcome for anyone who has ever underlined a sentence and wanted to talk about it.', color: 'bg-[#d9e0cd]' },
  { title: 'Margins & Memory', date: '26', time: '04:30 PM', place: 'Reading Room · Main Block', type: 'upcoming', detail: 'Bring one book, one memory, and a willingness to lend both to the room.', color: 'bg-[#edd8b7]' },
  { title: 'After Hours: Poetry', date: '04', time: '06:00 PM', place: 'The Courtyard', type: 'past', detail: 'A low-lit evening of found words, original poems, and very good pauses.', color: 'bg-[#e6c7bb]' },
  { title: 'Small Books, Big Questions', date: '21', time: '05:30 PM', place: 'Design Studio 01', type: 'past', detail: 'Our first cross-department reading table, around Annie Ernaux and the lives we inherit.', color: 'bg-[#d2ddd5]' },
];

const galleryItems = [
  { title: 'The reading table', caption: 'A seat is always saved.', className: 'gallery-tall' },
  { title: 'Notes in the margins', caption: 'Thoughts become visible.', className: 'gallery-wide' },
  { title: 'After-hours poetry', caption: 'A room, speaking softly.', className: 'gallery-square' },
  { title: 'A borrowed story', caption: 'Pass it on.', className: 'gallery-paper' },
];

function SectionLabel({ number, children }: { number: string; children: string }) {
  return <div className="flex items-center gap-3 eyebrow"><span className="text-[#b77957]">{number}</span><span>{children}</span></div>;
}

function SectionHeading({ eyebrow, title, intro, align = 'left' }: { eyebrow: string; title: ReactNode; intro?: string; align?: 'left' | 'center' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <div className="eyebrow mb-4">{eyebrow}</div>
      <h2 className="font-display text-4xl leading-[1.05] tracking-[-.035em] text-[#30251d] sm:text-5xl md:text-6xl">{title}</h2>
      {intro && <p className="mt-5 max-w-xl text-[1.02rem] leading-7 text-[#75675d]">{intro}</p>}
    </div>
  );
}

function Nav({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const links = [
    ['about', 'About'], ['why-join', 'Why join'], ['activities', 'Activities'], ['events', 'Events'], ['gallery', 'Gallery'],
  ];
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-[#d8cbbb]/70 bg-[#f5f0e7]/90 backdrop-blur-md">
      <div className="section-shell flex h-[74px] items-center justify-between">
        <a href="#home" className="flex items-center gap-3" onClick={() => setMenuOpen(false)} data-testid="link-brand-home">
          <img src={logo} alt="PROLOGUE LBSITW logo" className="h-12 w-12 rounded-full object-cover" data-testid="img-brand-logo" />
          <span className="hidden text-[11px] font-semibold tracking-[.2em] text-[#30251d] sm:block">PROLOGUE <span className="font-normal text-[#937c6c]">/ LBSITW</span></span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {links.map(([href, label]) => <a key={href} href={`#${href}`} className="text-[12px] font-medium tracking-[.04em] text-[#66584e] transition-colors hover:text-[#9b5137]" data-testid={`link-nav-${href}`}>{label}</a>)}
        </nav>
        <div className="flex items-center gap-3">
          <a href="#join" className="hidden items-center gap-2 rounded-full bg-[#743c2c] px-5 py-3 text-[11px] font-bold uppercase tracking-[.12em] text-[#f7ecd9] transition-transform hover:-translate-y-0.5 sm:flex" data-testid="link-nav-join">Join the club <ArrowUpRight size={14} /></a>
          <button type="button" className="rounded-full p-2 text-[#402b21] md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" data-testid="button-mobile-menu">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {menuOpen && <nav className="border-t border-[#d8cbbb] bg-[#f5f0e7] px-5 py-5 md:hidden" aria-label="Mobile navigation">
        <div className="section-shell flex flex-col gap-1">
          {links.map(([href, label]) => <a key={href} href={`#${href}`} onClick={() => setMenuOpen(false)} className="border-b border-[#dfd2c4] py-3 text-sm text-[#4b3a2e]" data-testid={`link-mobile-${href}`}>{label}</a>)}
          <a href="#join" onClick={() => setMenuOpen(false)} className="mt-4 flex items-center justify-between rounded-full bg-[#743c2c] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#f7ecd9]" data-testid="link-mobile-join">Join the club <ArrowUpRight size={15} /></a>
        </div>
      </nav>}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#f5f0e7] pt-[74px]">
      <div className="section-shell grid min-h-[680px] items-center gap-12 py-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:py-24">
        <div className="relative z-10 reveal">
          <div className="mb-8 flex items-center gap-3 eyebrow"><span className="inline-block h-px w-8 bg-[#b77957]" /> Reading club · LBSITW</div>
          <h1 className="max-w-[760px] font-display text-[4.7rem] leading-[.9] tracking-[-.065em] text-[#30251d] sm:text-[6.7rem] lg:text-[8.3rem]">Read<br /><em className="text-[#9b5137]">slowly.</em></h1>
          <p className="mt-8 max-w-md text-[1.06rem] leading-7 text-[#75675d]">A student space for books, big questions, and the people who make campus feel like home.</p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a href="#join" className="group flex items-center gap-3 rounded-full bg-[#743c2c] px-6 py-4 text-xs font-bold uppercase tracking-[.1em] text-[#f7ecd9] transition-all hover:bg-[#573025]" data-testid="link-hero-join">Find your people <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
            <a href="#about" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.1em] text-[#684a3d] hover:text-[#9b5137]" data-testid="link-hero-about">Our story <ChevronRight size={15} /></a>
          </div>
        </div>
        <div className="relative mx-auto h-[390px] w-full max-w-[460px] reveal reveal-delay-1 sm:h-[490px]">
          <div className="absolute left-[10%] top-[4%] h-[79%] w-[76%] rotate-[-7deg] rounded-[44%_56%_48%_52%] bg-[#e1c2a2]" />
          <div className="absolute bottom-[6%] right-[4%] h-48 w-48 rounded-full border border-[#9b5137]/30" />
          <div className="absolute bottom-[16%] left-[2%] h-28 w-28 rounded-full bg-[#d3ded0]" />
          <div className="absolute left-[18%] top-[12%] flex h-[76%] w-[70%] rotate-[6deg] items-center justify-center overflow-hidden rounded-[48%_52%_43%_57%] border-[10px] border-[#f5f0e7] bg-[#ead8be] shadow-[0_20px_60px_rgba(76,44,28,.17)]">
            <img src={logo} alt="PROLOGUE emblem" className="h-full w-full object-cover mix-blend-multiply opacity-90" data-testid="img-hero-logo" />
          </div>
          <div className="absolute bottom-[9%] left-[20%] rounded-full border border-[#9b5137]/30 bg-[#f5f0e7] px-4 py-2 font-mono-ui text-[10px] uppercase tracking-widest text-[#9b5137]">Since 2024</div>
          <div className="absolute right-0 top-0 hidden rotate-12 text-[#9b5137] sm:block"><PenLine size={38} strokeWidth={1} /></div>
        </div>
      </div>
      <div className="section-shell flex items-center justify-between border-t border-[#d8cbbb] py-5 text-[10px] uppercase tracking-[.16em] text-[#8e7a6b]">
        <span>For the curious &amp; contemplative</span><span className="hidden sm:block">Scroll to begin ↓</span><span>01 / 08</span>
      </div>
    </section>
  );
}

function About() {
  return <section id="about" className="bg-[#eee4d6] py-24 md:py-32">
    <div className="section-shell">
      <SectionLabel number="01" children="A little about us" />
      <div className="mt-10 grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
        <div><h2 className="font-display text-4xl leading-[1.08] tracking-[-.04em] text-[#30251d] sm:text-6xl">Books are<br /><em className="text-[#9b5137]">only the beginning.</em></h2></div>
        <div className="max-w-xl">
          <p className="text-xl leading-8 text-[#4e3e33]">PROLOGUE is the reading club of LBSITW — an unhurried corner of campus where stories turn into conversations, conversations turn into friendships, and a borrowed book can change the shape of your week.</p>
          <p className="mt-7 leading-7 text-[#78685c]">We believe reading is less about finishing a list and more about noticing what stays with you. We gather across departments and years to read widely, listen closely, and make room for the thoughts that do not fit neatly in a classroom.</p>
          <div className="mt-10 grid grid-cols-2 gap-8 border-t border-[#cab9a7] pt-7"><div><div className="font-display text-4xl text-[#9b5137]">01</div><p className="mt-2 text-sm text-[#78685c]">shared reading table</p></div><div><div className="font-display text-4xl text-[#9b5137]">∞</div><p className="mt-2 text-sm text-[#78685c]">ways to see a story</p></div></div>
        </div>
      </div>
    </div>
  </section>;
}

function WhyJoin() {
  const perks = [
    ['01', 'A monthly table', 'A gentle, structured space to discuss one good book with people from every corner of campus.'],
    ['02', 'A place to make', 'Write, draw, perform, curate — bring your way of seeing and help shape our creative programme.'],
    ['03', 'A wider world', 'Meet readers, writers, and ideas beyond your timetable through collaborations and campus events.'],
  ];
  return <section id="why-join" className="bg-[#f5f0e7] py-24 md:py-32">
    <div className="section-shell"><SectionLabel number="02" children="Why join" />
      <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1fr_.72fr]"><SectionHeading eyebrow="" title={<>Come for the<br /><em className="text-[#9b5137]">book. Stay for the room.</em></>} intro="There is no right kind of reader here. Only a willingness to be curious, and perhaps to bring a sentence you cannot stop thinking about." /><div className="flex items-center gap-3 text-sm text-[#78685c] lg:justify-end"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9e0cd]"><Users size={16} /></span> Open to every department &amp; year</div></div>
      <div className="mt-16 grid border-t border-[#d8cbbb] md:grid-cols-3">{perks.map(([num, title, copy]) => <article key={num} className="border-b border-[#d8cbbb] py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0"><div className="flex items-center justify-between"><span className="font-mono-ui text-xs text-[#b77957]">{num}</span><ArrowDownRight size={18} className="text-[#b77957]" /></div><h3 className="mt-14 font-display text-3xl text-[#30251d]">{title}</h3><p className="mt-4 max-w-xs text-sm leading-6 text-[#78685c]">{copy}</p></article>)}</div>
    </div>
  </section>;
}

function Activities() {
  return <section id="activities" className="overflow-hidden bg-[#30483f] py-24 text-[#f5f0e7] md:py-32">
    <div className="section-shell"><div className="flex flex-col justify-between gap-10 md:flex-row md:items-end"><div><SectionLabel number="03" children="Ways we gather" /><h2 className="mt-7 max-w-2xl font-display text-4xl leading-[1.06] tracking-[-.04em] sm:text-6xl">Not a syllabus.<br /><em className="text-[#ddbd7c]">A living library.</em></h2></div><p className="max-w-xs text-sm leading-6 text-[#bdc9bd]">Small rituals, shared often. Our programme follows curiosity instead of a fixed formula.</p></div>
      <div className="mt-16 grid gap-4 md:grid-cols-12 md:grid-rows-2 md:h-[430px]">
        <div className="group relative overflow-hidden rounded-[2px] bg-[#c37c5e] p-7 md:col-span-7 md:row-span-2"><BookOpen size={28} strokeWidth={1.2} className="text-[#f8e4c5]" /><div className="absolute bottom-8 left-8"><div className="font-mono-ui text-[10px] uppercase tracking-widest text-[#f4d9b5]">Every last Thursday</div><h3 className="mt-3 font-display text-4xl">The reading table</h3><p className="mt-3 max-w-sm text-sm leading-6 text-[#f6debf]">One selected book. One long table. A conversation that refuses to be rushed.</p></div><div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#f6debf]/40 transition-transform duration-500 group-hover:scale-125" /></div>
        <div className="relative rounded-[2px] bg-[#d6b16e] p-7 text-[#30483f] md:col-span-5"><PenLine size={25} strokeWidth={1.2} /><div className="absolute bottom-7 left-7"><h3 className="font-display text-3xl">Open mic &amp; margins</h3><p className="mt-2 text-sm text-[#4d5e4f]">Poetry, fragments, and work-in-progress.</p></div></div>
        <div className="relative rounded-[2px] bg-[#d8e0d1] p-7 text-[#30483f] md:col-span-5"><Sparkles size={25} strokeWidth={1.2} /><div className="absolute bottom-7 left-7"><h3 className="font-display text-3xl">Guest pages</h3><p className="mt-2 text-sm text-[#4d5e4f]">Writers, artists, and unexpected recommendations.</p></div></div>
      </div>
    </div>
  </section>;
}

function Events() {
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');
  const visible = events.filter((event) => event.type === filter);
  return <section id="events" className="bg-[#eee4d6] py-24 md:py-32"><div className="section-shell"><SectionLabel number="04" children="On the calendar" /><div className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end"><SectionHeading eyebrow="" title={<>Make a little<br /><em className="text-[#9b5137]">room for this.</em></>} intro="Come exactly as you are. You do not need to finish the book to join the conversation." /><div className="flex rounded-full border border-[#cab9a7] p-1" role="tablist" aria-label="Event filter">{(['upcoming', 'past'] as const).map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-full px-5 py-2 text-xs font-bold capitalize transition-colors ${filter === item ? 'bg-[#743c2c] text-[#f7ecd9]' : 'text-[#78685c] hover:bg-[#e1d4c5]'}`} data-testid={`button-events-${item}`}>{item}</button>)}</div></div>
      <div className="mt-14 divide-y divide-[#cab9a7] border-y border-[#cab9a7]">{visible.map((event) => <article key={event.title} className="group grid gap-6 py-7 transition-colors hover:bg-[#e7d9ca] md:grid-cols-[100px_1fr_auto] md:items-center" data-testid={`card-event-${event.title.toLowerCase().replaceAll(' ', '-')}`}><div className={`flex h-[88px] w-[88px] flex-col items-center justify-center ${event.color} text-[#3d3027]`}><span className="font-display text-4xl leading-none">{event.date}</span><span className="mt-1 font-mono-ui text-[9px] uppercase tracking-widest">October</span></div><div><div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-widest text-[#9b5137]"><span className="flex items-center gap-1"><Clock3 size={12} /> {event.time}</span><span className="flex items-center gap-1"><MapPin size={12} /> {event.place}</span></div><h3 className="mt-3 font-display text-3xl text-[#30251d]">{event.title}</h3><p className="mt-1 max-w-lg text-sm leading-6 text-[#78685c]">{event.detail}</p></div><button type="button" onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#743c2c] md:justify-self-end" data-testid={`button-event-interest-${event.date}`}>I’m interested <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" /></button></article>)}</div></div></section>;
}

function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  return <section id="gallery" className="bg-[#f5f0e7] py-24 md:py-32"><div className="section-shell"><div className="flex items-end justify-between"><div><SectionLabel number="05" children="From the archive" /><h2 className="mt-7 font-display text-4xl tracking-[-.04em] text-[#30251d] sm:text-6xl">A few things<br /><em className="text-[#9b5137]">we remember.</em></h2></div><span className="hidden font-mono-ui text-[10px] uppercase tracking-widest text-[#9b5137] sm:block">Tap to enlarge ↗</span></div>
      <div className="gallery-grid mt-14">{galleryItems.map((item, index) => <button type="button" key={item.title} onClick={() => setSelected(index)} className={`gallery-card ${item.className} group relative overflow-hidden text-left`} data-testid={`button-gallery-${index}`}><div className={`gallery-art art-${index}`}><div className="absolute inset-0 flex items-center justify-center opacity-70"><span className="font-display text-6xl italic text-[#f5f0e7]/80">{index === 0 ? 'read' : index === 1 ? 'note' : index === 2 ? 'speak' : 'pass'}</span></div></div><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#30251d]/80 to-transparent p-5 pt-16 text-[#f7ecd9]"><div className="text-sm font-semibold">{item.title}</div><div className="mt-1 text-xs text-[#eed8be]">{item.caption}</div></div><span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f0e7]/80 text-[#743c2c] opacity-0 transition-opacity group-hover:opacity-100"><ArrowUpRight size={15} /></span></button>)}</div></div>
      {selected !== null && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#30251d]/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={() => setSelected(null)}><div className={`relative h-[70vh] w-full max-w-3xl overflow-hidden ${galleryItems[selected].className}`} onClick={(event) => event.stopPropagation()}><div className={`gallery-art art-${selected} h-full`}><span className="font-display text-7xl italic text-[#f5f0e7]/80">{galleryItems[selected].title}</span></div><div className="absolute bottom-0 left-0 right-0 bg-[#30251d]/80 p-6 text-[#f7ecd9]"><h3 className="font-display text-2xl">{galleryItems[selected].title}</h3><p className="mt-1 text-sm text-[#ddcbb7]">{galleryItems[selected].caption}</p></div><button type="button" onClick={() => setSelected(null)} className="absolute right-4 top-4 rounded-full bg-[#f5f0e7] p-2 text-[#30251d]" aria-label="Close gallery" data-testid="button-close-gallery"><X size={18} /></button></div></div>}
    </section>;
}

function Join() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', department: '', genre: '', why: '' });
  const update = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [key]: event.target.value });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.includes('@') || !form.department || !form.genre || form.why.trim().length < 12) {
      setError('Please fill every field. Tell us a little more in the last box (at least 12 characters).');
      return;
    }
    setError('');
    setSubmitted(true);
  };
  return <section id="join" className="bg-[#d6b16e] py-24 md:py-32"><div className="section-shell grid gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-28"><div><SectionLabel number="06" children="Pull up a chair" /><h2 className="mt-8 font-display text-5xl leading-[.98] tracking-[-.05em] text-[#30251d] sm:text-7xl">Your next<br /><em className="text-[#743c2c]">chapter starts</em><br />here.</h2><p className="mt-7 max-w-sm leading-7 text-[#59483b]">Membership is free, and there is no audition. Just bring your curiosity — and maybe a book you love.</p><div className="mt-10 flex items-center gap-3 text-sm text-[#59483b]"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#9b7445]"><Check size={16} /></span> No experience required</div></div>
      <div className="rounded-[2px] bg-[#f5f0e7] p-6 shadow-[0_20px_50px_rgba(76,44,28,.12)] sm:p-10">{submitted ? <div className="flex min-h-[460px] flex-col items-start justify-center"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#d9e0cd] text-[#30483f]"><Check size={27} /></div><div className="eyebrow mt-8">You’re on the list</div><h3 className="mt-4 font-display text-4xl text-[#30251d]">Welcome to the<br /><em className="text-[#9b5137]">reading room.</em></h3><p className="mt-5 max-w-sm leading-7 text-[#78685c]">Thanks, {form.name.split(' ')[0]}. We’ll send details for the next gathering to {form.email}.</p><button type="button" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', department: '', genre: '', why: '' }); }} className="mt-8 text-xs font-bold uppercase tracking-widest text-[#743c2c] underline underline-offset-4" data-testid="button-join-another">Register another reader</button></div> : <form onSubmit={submit} noValidate><div className="mb-8 flex items-center justify-between border-b border-[#d8cbbb] pb-5"><div><div className="font-display text-2xl text-[#30251d]">Become a member</div><div className="mt-1 text-xs text-[#8e7a6b]">Takes about two minutes.</div></div><BookOpen size={22} className="text-[#9b5137]" /></div>{error && <div className="mb-5 border-l-2 border-[#a74639] bg-[#f0dbd2] px-4 py-3 text-sm leading-5 text-[#79382e]" role="alert" data-testid="status-form-error">{error}</div>}<div className="grid gap-5 sm:grid-cols-2"><label className="block sm:col-span-2"><span className="eyebrow mb-2 block text-[#78685c]">Full name</span><input required value={form.name} onChange={update('name')} className="form-input" placeholder="Your name" data-testid="input-full-name" /></label><label className="block"><span className="eyebrow mb-2 block text-[#78685c]">Email</span><input required type="email" value={form.email} onChange={update('email')} className="form-input" placeholder="you@lbsitw.ac.in" data-testid="input-email" /></label><label className="block"><span className="eyebrow mb-2 block text-[#78685c]">Department / year</span><input required value={form.department} onChange={update('department')} className="form-input" placeholder="CSE · S3" data-testid="input-department" /></label><label className="block sm:col-span-2"><span className="eyebrow mb-2 block text-[#78685c]">Favourite reading genre</span><select required value={form.genre} onChange={update('genre')} className="form-input" data-testid="select-genre"><option value="">Choose one</option><option>Literary fiction</option><option>Poetry</option><option>Fantasy &amp; speculative</option><option>Non-fiction &amp; essays</option><option>Comics &amp; graphic novels</option><option>Still finding my genre</option></select></label><label className="block sm:col-span-2"><span className="eyebrow mb-2 block text-[#78685c]">Why do you want to join?</span><textarea required value={form.why} onChange={update('why')} className="form-input min-h-[105px] resize-y" placeholder="A book, a question, a feeling…" data-testid="textarea-why-join" /></label></div><button type="submit" className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#743c2c] px-6 py-4 text-xs font-bold uppercase tracking-[.12em] text-[#f7ecd9] transition-colors hover:bg-[#573025]" data-testid="button-submit-membership">Send my application <ArrowUpRight size={16} /></button></form>}</div>
    </div></section>;
}

function Contact() {
  return <footer id="contact" className="bg-[#30251d] py-16 text-[#f5f0e7] md:py-24"><div className="section-shell"><div className="grid gap-12 border-b border-[#665247] pb-14 md:grid-cols-[1fr_auto] md:items-end"><div><div className="eyebrow text-[#d6b16e]">07 / Keep in touch</div><h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.05] sm:text-6xl">The best conversations<br /><em className="text-[#d6b16e]">usually continue.</em></h2></div><div className="max-w-xs text-sm leading-6 text-[#c0afa0]">Have a question, a book suggestion, or an idea for our next gathering? We would love to hear from you.</div></div><div className="grid gap-8 py-12 sm:grid-cols-3"><div><div className="eyebrow text-[#a68c7b]">Find us</div><a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-2 text-sm text-[#f5f0e7] hover:text-[#d6b16e]" data-testid="link-instagram"><Instagram size={16} /> @prologue.lbsitw</a></div><div><div className="eyebrow text-[#a68c7b]">Write to us</div><a href="mailto:prologue@lbsitw.ac.in" className="mt-4 flex items-center gap-2 text-sm text-[#f5f0e7] hover:text-[#d6b16e]" data-testid="link-email"><Mail size={16} /> prologue@lbsitw.ac.in</a></div><div><div className="eyebrow text-[#a68c7b]">On campus</div><div className="mt-4 flex items-center gap-2 text-sm text-[#f5f0e7]" data-testid="text-location"><MapPin size={16} /> LBS Institute of Technology for Women</div></div></div><div className="flex flex-col justify-between gap-4 border-t border-[#665247] pt-6 text-[10px] uppercase tracking-[.16em] text-[#a68c7b] sm:flex-row"><span>PROLOGUE / LBSITW</span><span>Made for readers, by readers.</span><a href="#home" className="flex items-center gap-2 hover:text-[#d6b16e]" data-testid="link-back-top">Back to top <CircleArrowUp size={14} /></a></div></div></footer>;
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);
  return <div className="paper-grain min-h-[100dvh]"><Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} /><main><Hero /><About /><WhyJoin /><Activities /><Events /><Gallery /><Join /></main><Contact /></div>;
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;