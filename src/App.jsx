import { useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Image as ImageIcon,
  Layers3,
  Menu,
  MessageSquareText,
  ShieldCheck,
  Smartphone,
  WalletCards,
  X,
} from 'lucide-react';
import { capabilities, contact, productImages, showcases } from './siteData';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Product', href: '#system' },
  { label: 'About', href: '#about' },
];

const iconMap = {
  calendar: CalendarDays,
  building: Building2,
  phone: Smartphone,
  wallet: WalletCards,
};

const safeHttps = (value = '') => /^https:\/\/[^\s]+$/i.test(value.trim()) ? value.trim() : '';
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email?.trim() ?? '') ? contact.email.trim() : '';
const inquiryUrl = safeHttps(contact.inquiryUrl) || (email ? `mailto:${email}` : '');
const navLinks = inquiryUrl ? [...links, { label: 'Contact', href: '#contact' }] : links;

function Brand({ footer = false }) {
  return (
    <a href="#top" aria-label="Horizon HRIS, return to top" className="inline-flex shrink-0 items-center gap-2.5 rounded-sm">
      <img src="/branding/horizon-symbol.webp" alt="" width="27" height="43" className={`${footer ? 'h-10' : 'h-9'} w-auto object-contain`} />
      <span className="whitespace-nowrap text-[17px] font-extrabold tracking-[-0.055em] text-ink sm:text-[19px]">
        HORIZON <span className="font-medium">HRIS</span>
      </span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/8 bg-paper/96 backdrop-blur-md">
      <div className="mx-auto flex h-[70px] max-w-[1240px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Brand />
        <nav aria-label="Primary navigation" className="hidden items-center gap-9 md:flex">
          {navLinks.map(({ label, href }) => <a key={href} href={href} className="text-[13px] font-semibold text-[#565852] transition-colors hover:text-brand">{label}</a>)}
        </nav>
        <a href="#system" className="hidden min-h-10 items-center gap-2 rounded-full bg-ink px-5 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-brand md:inline-flex">
          Explore Horizon <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <button type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-controls="mobile-menu" aria-expanded={open} className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#e4e0d8] bg-white md:hidden">
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>
      {open && <nav id="mobile-menu" aria-label="Mobile navigation" className="border-t border-[#e7e3da] bg-paper px-5 pb-5 pt-2 shadow-sm md:hidden">
        {navLinks.map(({ label, href }) => <a key={href} href={href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-[#e7e3da] text-sm font-semibold text-ink">{label}</a>)}
        <a href="#system" onClick={() => setOpen(false)} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand">Explore Horizon <ArrowUpRight size={17} aria-hidden="true" /></a>
      </nav>}
    </header>
  );
}

function Eyebrow({ children, onDark = false }) {
  return <div className={`flex items-center gap-2.5 text-[10px] font-extrabold uppercase tracking-[0.17em] sm:text-[11px] ${onDark ? 'text-[#ffad78]' : 'text-[#b94c12]'}`}>
    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />{children}
  </div>;
}

const steps = [
  { title: 'Plan shifts', detail: 'Scheduling', icon: CalendarDays, number: '01' },
  { title: 'Track time', detail: 'Attendance', icon: Clock3, number: '02' },
  { title: 'Handle requests', detail: 'Leave & overtime', icon: Smartphone, number: '03' },
  { title: 'Manage payroll', detail: 'Payslips', icon: WalletCards, number: '04' },
];

function WorkflowVisual() {
  return <div className="workflow-visual relative overflow-hidden rounded-[24px] bg-[#1d211f] p-5 text-white shadow-[0_28px_64px_-36px_rgba(17,17,17,.45)] sm:p-7 lg:p-8" aria-label="Illustration of the four HR workflows supported by Horizon HRIS">
    <div className="relative z-10 flex items-start justify-between gap-3">
      <div><span className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#ffb88a]">The workflow</span><h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] sm:text-2xl">One connected workspace.</h2></div>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white"><Layers3 size={22} aria-hidden="true" /></span>
    </div>
    <div className="relative z-10 mt-7 grid grid-cols-2 gap-2.5 sm:gap-3">
      {steps.map(({ title, detail, icon: Icon, number }) => <div key={number} className="group relative flex min-h-[126px] flex-col justify-between rounded-[14px] border border-white/14 bg-[#303431] p-4 sm:min-h-[148px] sm:p-5">
        <div className="flex items-start justify-between gap-2"><Icon className="text-[#ff9853]" size={23} strokeWidth={1.8} aria-hidden="true" /><span className="text-[10px] tracking-[0.14em] text-white/40">{number}</span></div>
        <div><p className="text-[14px] font-semibold sm:text-base">{title}</p><p className="mt-1 text-[11px] text-white/60 sm:text-[12px]">{detail}</p></div>
      </div>)}
    </div>
    <div className="relative z-10 mt-5 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
      <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/65 sm:text-[11px]">From plans to payslips</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand"><ArrowDownRight size={19} aria-hidden="true" /></span>
    </div>
  </div>;
}

function ScreenshotFrame({ src, alt, label, variant = 'wide', featured = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const available = Boolean(src) && !failed;
  const portrait = variant === 'portrait';
  return <div className="overflow-hidden rounded-2xl border border-[#e6e3db] bg-white shadow-[0_25px_55px_-42px_rgba(0,0,0,.2)]">
    <div className="flex h-11 items-center justify-between border-b border-[#ebe8e3] px-4">
      <div className="flex gap-1.5" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-[#e2dfd8]" /><span className="h-2 w-2 rounded-full bg-[#e2dfd8]" /><span className="h-2 w-2 rounded-full bg-[#e2dfd8]" /></div>
      <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#99958c]">Horizon HRIS</span>
      <span className="w-10" aria-hidden="true" />
    </div>
    <div className={`screenshot-empty relative flex items-center justify-center overflow-hidden ${portrait ? 'min-h-[290px] sm:min-h-[340px]' : featured ? 'min-h-[280px] sm:min-h-[340px]' : 'aspect-[16/10] min-h-[260px]'}`}>
      {available ? <img src={src} alt={alt} onError={() => setFailed(true)} loading={featured ? 'eager' : 'lazy'} decoding="async" className={`relative z-10 h-full w-full object-contain ${portrait ? 'absolute inset-0 p-5' : 'absolute inset-0'}`} /> : <div className="relative z-10 flex flex-col items-center gap-2 px-5 text-center">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#e9d2c4] bg-white text-brand shadow-sm"><ImageIcon size={27} strokeWidth={1.5} aria-hidden="true" /></div>
        <span className="text-[13px] font-semibold text-[#565752]">{label}</span>
        <span className="text-[11px] font-medium text-[#8f8c85]">Screenshot slot · add in Phase 2</span>
      </div>}
    </div>
  </div>;
}

function Hero() {
  return <section id="home" className="overflow-hidden border-b border-[#e6e3db] bg-paper">
    <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:px-10 lg:pb-24 lg:pt-24">
      <div className="max-w-[560px]">
        <Eyebrow>HR management, made practical</Eyebrow>
        <h1 className="mt-6 text-[clamp(3rem,5.5vw,5.6rem)] font-semibold leading-[1.015] tracking-[-0.07em] text-ink">
          Shifts.<br />Attendance.<br />Payroll.<br /><span className="text-brand">One place.</span>
        </h1>
        <p className="mt-6 max-w-[440px] text-[15px] leading-[1.75] text-muted sm:text-[17px]">Keep people operations organized across your teams, brands, and branches.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#system" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-brand px-6 py-3 text-[13px] font-bold text-white transition-colors hover:bg-[#d95c0c]">See how it works <ArrowUpRight size={18} aria-hidden="true" /></a>
          <a href="#features" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#dbd8d1] bg-white px-5 py-3 text-[13px] font-semibold text-ink transition-colors hover:border-[#aaa69e]">Explore features <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="mt-8 flex items-center gap-2.5 border-t border-[#e8e4dc] pt-5 text-xs font-medium text-[#777970]"><Check size={17} className="shrink-0 text-brand" aria-hidden="true" /> HR Simplified, Results Amplified.</div>
      </div>
      <div className="relative min-w-0">
        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-tr-[26px] border-r-2 border-t-2 border-brand sm:-right-5 sm:-top-5" aria-hidden="true" />
        {productImages.overview ? <ScreenshotFrame src={productImages.overview} alt="Overview of the Horizon HRIS application" label="Product overview" featured /> : <WorkflowVisual />}
        <p className="mt-4 px-1 text-[11px] font-medium text-[#848077]">A visual guide to the workflow. Real system screens will be added separately.</p>
      </div>
    </div>
  </section>;
}

function Features() {
  return <section id="features" className="bg-white py-16 sm:py-20 lg:py-24">
    <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end sm:gap-8">
        <div><Eyebrow>What Horizon covers</Eyebrow><h2 className="mt-4 max-w-[520px] text-[clamp(2.3rem,3.8vw,3.7rem)] font-semibold leading-[1.08] tracking-[-0.06em]">The essentials.<br /><span className="text-brand">All together.</span></h2></div>
        <p className="max-w-[330px] text-[14px] leading-6 text-muted">Four areas of HR work, organized into one system.</p>
      </div>
      <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {capabilities.map((feature, index) => {
          const Icon = iconMap[feature.icon] || Layers3;
          return <article key={feature.number} className={`flex min-h-[242px] flex-col rounded-2xl border p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-7 ${index === 0 ? 'border-brand bg-brand text-white' : 'border-[#e8e4dc] bg-[#f9f8f5] text-ink'}`}>
            <div className="flex items-start justify-between gap-2"><Icon size={29} strokeWidth={1.6} aria-hidden="true" className={index === 0 ? 'text-white' : 'text-brand'} /><span className={`text-[11px] font-bold tracking-[0.15em] ${index === 0 ? 'text-white/75' : 'text-[#aea9a1]'}`}>{feature.number}</span></div>
            <div className="mt-auto pt-9"><h3 className="text-[19px] font-semibold leading-tight tracking-[-0.04em]">{feature.title}</h3><p className={`mt-3 text-[13px] leading-6 ${index === 0 ? 'text-white/90' : 'text-muted'}`}>{feature.description}</p></div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}

function Product() {
  const [active, setActive] = useState(0);
  const item = showcases[active];
  function onTabKeyDown(event, index) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % showcases.length;
    else if (event.key === 'ArrowLeft') next = (index + showcases.length - 1) % showcases.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = showcases.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next]?.focus();
  }

  return <section id="system" className="bg-[#f6f4ef] py-16 sm:py-20 lg:py-24">
    <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end md:gap-10">
        <div><Eyebrow>Inside Horizon HRIS</Eyebrow><h2 className="mt-4 max-w-[520px] text-[clamp(2.3rem,3.8vw,3.7rem)] font-semibold leading-[1.08] tracking-[-0.06em]">See the workflows.</h2></div>
        <p className="max-w-[350px] text-[14px] leading-6 text-muted">Choose what matters to your team. Actual product screenshots can be added when ready.</p>
      </div>
      <div role="tablist" aria-label="Horizon HRIS product areas" className="mt-9 flex gap-2 overflow-x-auto pb-2 sm:gap-3">
        {showcases.map((showcase, index) => <button key={showcase.number} id={`product-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls="product-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => onTabKeyDown(event, index)} className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-[12px] font-bold transition-colors sm:text-[13px] ${active === index ? 'border-ink bg-ink text-white' : 'border-[#dedbd4] bg-white text-[#525550] hover:border-brand hover:text-brand'}`}>
          {showcase.tabTitle}<ChevronRight size={16} aria-hidden="true" className={active === index ? 'text-[#ff9853]' : 'text-[#b9b5ac]'} />
        </button>)}
      </div>
      <div id="product-panel" role="tabpanel" aria-labelledby={`product-tab-${active}`} tabIndex={0} className="mt-4 grid items-center gap-8 rounded-[24px] border border-[#e7e2d9] bg-white p-5 sm:p-7 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:p-10">
        <div className="lg:pl-2">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#b95119]">{item.number}</span>
          <h3 className="mt-4 max-w-[420px] text-[clamp(1.95rem,3.1vw,3.1rem)] font-semibold leading-[1.12] tracking-[-0.055em]">{item.title}</h3>
          <p className="mt-4 max-w-[390px] text-[14px] leading-7 text-muted">{item.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2">{item.bullets.map((bullet) => <li key={bullet} className="inline-flex items-center gap-2 rounded-full border border-[#eae6dd] bg-[#fcfaf7] px-3 py-2 text-[11px] font-semibold text-[#50534e]"><Check size={13} className="text-brand" aria-hidden="true" />{bullet}</li>)}</ul>
        </div>
        <div className={`min-w-0 ${item.variant === 'portrait' ? 'mx-auto w-full max-w-[420px]' : 'w-full'}`}><ScreenshotFrame key={item.number} src={item.image} alt={item.alt} label={item.imageLabel} variant={item.variant} featured /></div>
      </div>
      <p className="mt-4 text-right text-[11px] text-[#858177]">{String(active + 1).padStart(2, '0')} / {String(showcases.length).padStart(2, '0')}</p>
    </div>
  </section>;
}

function Structure() {
  const levels = [
    { label: 'Company', icon: Building2 },
    { label: 'Brands', icon: Layers3 },
    { label: 'Branches', icon: Building2 },
    { label: 'Positions & access', icon: ShieldCheck },
  ];
  return <section id="organization" className="bg-[#1d211f] py-16 text-white sm:py-20 lg:py-24">
    <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-10">
      <div><Eyebrow onDark>Built for your structure</Eyebrow><h2 className="mt-5 max-w-[480px] text-[clamp(2.3rem,3.7vw,3.7rem)] font-semibold leading-[1.08] tracking-[-0.06em]">Different teams.<br /><span className="text-[#ff9658]">One organized system.</span></h2><p className="mt-6 max-w-[390px] text-[14px] leading-7 text-[#c3c5c1]">Manage how people and permissions fit across your companies, brands, and branches.</p></div>
      <div className="rounded-[22px] border border-white/20 bg-[#282d29] p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-2"><span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">Organization structure</span><span className="h-2 w-2 rounded-full bg-[#ff8d48]" /></div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">{levels.map(({ label, icon: Icon }, index) => <div key={label} className="flex min-h-[127px] flex-col justify-between rounded-xl border border-white/15 bg-[#363b36] p-4"><Icon size={23} className="text-[#ff9658]" strokeWidth={1.6} aria-hidden="true" /><div><p className="text-[12px] font-semibold sm:text-[13px]">{label}</p><p className="mt-1 text-[10px] text-white/50">0{index + 1}</p></div></div>)}</div>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/15 pt-5 text-[11px] font-medium text-[#dbdcd7]"><span className="inline-flex items-center gap-2"><FileText size={15} className="text-[#ff9658]" aria-hidden="true" />CSV attendance import</span><span className="inline-flex items-center gap-2"><MessageSquareText size={15} className="text-[#ff9658]" aria-hidden="true" />Shift SMS notifications</span></div>
      </div>
      <div className="lg:col-span-2"><p className="border-l-2 border-brand bg-white/5 px-4 py-3 text-[12px] leading-6 text-[#ccd0c9]"><strong className="font-semibold text-white">Biometric attendance:</strong> CSV attendance import is supported. Real-time device integration requires separate setup and configuration and is not included in the standard package.</p></div>
    </div>
  </section>;
}

function About() {
  return <section id="about" className="bg-white py-16 sm:py-20">
    <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-10">
      <div className="flex min-h-[210px] items-center justify-center rounded-2xl border border-[#ede9e1] bg-paper p-7 sm:min-h-[260px]"><img src="/branding/horizon-logo.webp" alt="Horizon HR — HR Simplified, Results Amplified" loading="lazy" className="w-full max-w-[440px] object-contain" /></div>
      <div><Eyebrow>About Horizon HRIS</Eyebrow><h2 className="mt-4 text-[clamp(2.2rem,3.7vw,3.55rem)] font-semibold leading-[1.1] tracking-[-0.06em]">HR simplified.<br /><span className="text-brand">Results amplified.</span></h2><p className="mt-5 max-w-[470px] text-[14px] leading-7 text-muted sm:text-[15px]">Horizon HRIS brings scheduling, attendance, workforce management, and payroll into one practical place for growing teams.</p><a href="#features" className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-[#b94c12] hover:text-[#8c380b]">Explore the features <ArrowUpRight size={17} aria-hidden="true" /></a></div>
    </div>
  </section>;
}

function Contact() {
  if (!inquiryUrl) return null;
  return <section id="contact" className="bg-[#fff0e5] py-14 sm:py-16"><div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-5 px-5 sm:px-8 md:flex-row md:items-center lg:px-10"><div><Eyebrow>Get in touch</Eyebrow><h2 className="mt-3 text-[clamp(1.8rem,3vw,2.7rem)] font-semibold leading-tight tracking-[-0.045em]">Let's talk about your HR workflow.</h2></div><a href={inquiryUrl} {...(inquiryUrl.startsWith('https://') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full bg-ink px-6 text-[13px] font-bold text-white hover:bg-brand">Send an inquiry <ArrowUpRight size={17} aria-hidden="true" /></a></div></section>;
}

function Footer() {
  return <footer className="border-t border-[#e8e4dc] bg-paper"><div className="mx-auto max-w-[1240px] px-5 pb-7 pt-10 sm:px-8 lg:px-10"><div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-start"><div><Brand footer /><p className="mt-2 text-[12px] text-muted">HR Simplified, Results Amplified.</p></div><nav aria-label="Footer navigation" className="flex flex-wrap gap-x-7 gap-y-3 pt-2">{navLinks.map(({ label, href }) => <a href={href} key={href} className="text-[12px] font-semibold text-[#555951] hover:text-brand">{label}</a>)}</nav></div><div className="mt-9 border-t border-[#e8e4dc] pt-5 text-[11px] text-[#777970]">© {new Date().getFullYear()} Horizon HRIS. All rights reserved.</div></div></footer>;
}

export default function App() {
  return <div id="top" className="min-h-screen overflow-x-clip bg-paper text-ink"><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-3">Skip to content</a><Header /><main id="main-content"><Hero /><Features /><Product /><Structure /><About /><Contact /></main><Footer /></div>;
}
