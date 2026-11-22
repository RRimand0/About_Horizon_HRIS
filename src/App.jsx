import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ClipboardList,
  FileText,
  Image as ImageIcon,
  Layers3,
  Menu,
  MessageSquareText,
  Smartphone,
  WalletCards,
  X,
} from 'lucide-react';
import { capabilities, contact, productImages, showcases } from './siteData';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'The system', href: '#system' },
  { label: 'About', href: '#about' },
];

const featureIcons = {
  calendar: CalendarDays,
  building: Layers3,
  phone: Smartphone,
  wallet: WalletCards,
};

const safeHttps = (value) => /^https:\/\/[^\s]+$/i.test(value?.trim() ?? '') ? value.trim() : '';
const inquiryUrl = safeHttps(contact.inquiryUrl) || (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email?.trim() ?? '') ? `mailto:${contact.email.trim()}` : '');
const navLinks = inquiryUrl ? [...navItems, { label: 'Contact', href: '#contact' }] : navItems;

function Brand({ light = false, footer = false }) {
  return (
    <a href="#top" aria-label="Horizon HRIS — back to top" className="group inline-flex shrink-0 items-center gap-2.5 rounded-sm">
      <img src="/branding/horizon-symbol.webp" alt="" width="27" height="43" className={`${footer ? 'h-11' : 'h-9'} w-auto shrink-0 object-contain`} />
      <span className={`text-[17px] font-extrabold tracking-[-0.055em] sm:text-[19px] ${light ? 'text-white' : 'text-ink'}`}>
        HORIZON <span className="font-medium tracking-[-0.045em]">HRIS</span>
      </span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/6 bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Brand />
        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary navigation">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} className="text-[13px] font-medium text-[#4a4d4b] transition-colors hover:text-brand">{item.label}</a>
          ))}
        </nav>
        <div className="hidden items-center md:flex">
          <a href="#system" className="inline-flex items-center gap-2 rounded-full border border-[#deddd8] bg-white px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-brand hover:text-brand">
            Explore the product <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
        <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="mobile-menu" aria-expanded={menuOpen} className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#e8e5df] bg-white text-ink md:hidden">
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>
      {menuOpen && (
        <nav id="mobile-menu" className="border-t border-[#e9e6df] bg-paper px-5 pb-5 pt-3 shadow-sm md:hidden" aria-label="Mobile navigation">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center border-b border-[#eeeae3] text-sm font-medium text-ink">{item.label}</a>
          ))}
          <a href="#system" onClick={() => setMenuOpen(false)} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand">Explore the product <ArrowUpRight size={16} aria-hidden="true" /></a>
        </nav>
      )}
    </header>
  );
}

function Eyebrow({ children, dark = false }) {
  return (
    <div className={`mb-5 flex items-center gap-2.5 text-[10px] font-bold tracking-[0.19em] uppercase sm:text-[11px] ${dark ? 'text-[#ffc19c]' : 'text-[#ac511f]'}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />{children}
    </div>
  );
}

function ScreenshotFrame({ src = '', alt, label, variant = 'wide', hero = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const showImage = Boolean(src) && !failed;
  const portrait = variant === 'portrait';

  return (
    <div className={`overflow-hidden rounded-[17px] border border-[#dedbd3] bg-white shadow-[0_24px_60px_-40px_rgba(31,31,31,0.3)] ${hero ? 'sm:rounded-[20px]' : ''}`}>
      <div className="flex h-11 items-center justify-between border-b border-[#eeece8] bg-white px-4">
        <div className="flex gap-1.5" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-[#e4e1db]" /><span className="h-2 w-2 rounded-full bg-[#e4e1db]" /><span className="h-2 w-2 rounded-full bg-[#e4e1db]" /></div>
        <span className="text-[10px] font-semibold tracking-[0.12em] text-[#9d9b95] uppercase">Horizon HRIS</span>
        <span className="w-[36px]" aria-hidden="true" />
      </div>
      <div className={`relative flex items-center justify-center overflow-hidden ${portrait ? 'min-h-[360px] sm:min-h-[440px]' : hero ? 'aspect-[4/3] min-h-[220px] sm:aspect-[6/5]' : 'aspect-[16/10] min-h-[220px]'} screenshot-empty`}>
        {showImage ? (
          <img src={src} alt={alt} onError={() => setFailed(true)} loading={hero ? 'eager' : 'lazy'} decoding="async" className={`absolute inset-0 h-full w-full bg-[#f6f5f2] object-contain ${portrait ? 'p-5 sm:p-8' : ''}`} />
        ) : (
          <div role="img" aria-label={`${label} placeholder; screenshot to be added`} className="relative z-10 flex max-w-[230px] flex-col items-center px-5 text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#dcd8d0] bg-white text-[#8e8a81] shadow-sm"><ImageIcon size={21} strokeWidth={1.5} aria-hidden="true" /></span>
            <span className="text-[12px] font-semibold text-[#67645f]">{label}</span>
            <span className="mt-1.5 text-[11px] leading-5 text-[#99948c]">Product screenshot coming soon</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden border-b border-[#e9e6df]">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="max-w-[570px]">
          <Eyebrow>HR & workforce management</Eyebrow>
          <h1 className="text-[clamp(2.7rem,5.2vw,4.65rem)] leading-[1.07] font-semibold tracking-[-0.06em] text-ink">
            Manage your people, schedules, and <span className="text-brand">payroll</span> in one place.
          </h1>
          <p className="mt-7 max-w-[480px] text-[15px] leading-[1.9] text-muted sm:text-[16px]">Horizon HRIS brings workforce scheduling, attendance, employee management, and payroll into one organized system for businesses with multiple branches and brands.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#features" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-6 py-3 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#373a3b]">Explore features <ArrowUpRight size={17} aria-hidden="true" /></a>
            <a href="#system" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#d8d6d0] bg-white px-6 py-3 text-[13px] font-semibold text-ink transition-colors hover:border-[#bcb9b1]">See the system <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#e7e4de] pt-6 text-[11px] font-medium text-[#73716c] sm:text-xs">
            <span className="inline-flex items-center gap-2"><Check size={15} className="text-brand" aria-hidden="true" /> Branch & brand management</span>
            <span className="inline-flex items-center gap-2"><Check size={15} className="text-brand" aria-hidden="true" /> Position-based access</span>
          </div>
        </div>
        <div className="relative min-w-0 lg:pl-3">
          <div className="absolute -right-5 -top-5 h-[58%] w-[66%] rounded-[25px] border border-brand/55" aria-hidden="true" />
          <div className="absolute -bottom-5 -left-3 h-28 w-28 rounded-bl-[32px] border-b border-l border-[#f2a477]" aria-hidden="true" />
          <div className="relative"><ScreenshotFrame src={productImages.overview} alt="Overview of the Horizon HRIS system" label="Main product overview" hero /></div>
          <div className="mt-5 flex items-center justify-between gap-3 px-1 text-[10px] font-semibold tracking-[0.12em] text-[#8b8983] uppercase"><span>One system. Connected workflows.</span><span>01 / 04</span></div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-7 lg:grid-cols-[0.76fr_1.24fr] lg:gap-16">
          <div>
            <Eyebrow>01 / What it covers</Eyebrow>
            <h2 className="max-w-[380px] text-[clamp(2.15rem,3.6vw,3.25rem)] leading-[1.14] font-semibold tracking-[-0.055em]">Built around your daily operations.</h2>
          </div>
          <p className="max-w-[560px] self-end text-[15px] leading-8 text-muted">From planning shifts to processing payroll, Horizon HRIS brings the essential parts of HR administration into a more organized workspace.</p>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#eae7e1] bg-[#eae7e1] sm:grid-cols-2 lg:mt-14">
          {capabilities.map((feature) => {
            const Icon = featureIcons[feature.icon] || ClipboardList;
            return (
              <article key={feature.number} className="group bg-white p-7 transition-colors hover:bg-[#fcfaf6] sm:p-8 lg:p-10">
                <div className="mb-12 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1e8] text-[#cf5b14]"><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></div>
                  <span className="text-[11px] font-semibold tracking-[0.1em] text-[#aaa69f]">{feature.number}</span>
                </div>
                <h3 className="text-[21px] font-semibold tracking-[-0.04em]">{feature.title}</h3>
                <p className="mt-3 max-w-[400px] text-[13px] leading-[1.85] text-muted sm:text-[14px]">{feature.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">{feature.tags.map((tag) => <span key={tag} className="rounded-full border border-[#ebe8e3] px-3 py-1.5 text-[10px] font-medium text-[#67635f]">{tag}</span>)}</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ShowcaseRow({ item, index }) {
  const reverse = index % 2 === 1;
  const isPortrait = item.variant === 'portrait';
  return (
    <article className={`grid items-center gap-10 border-t border-[#e5e2dc] py-14 sm:py-16 lg:grid-cols-2 lg:gap-20 lg:py-20 ${reverse ? 'lg:[&>:first-child]:order-2' : ''}`}>
      <div className="max-w-[490px]">
        <div className="mb-6 text-[11px] font-bold tracking-[0.13em] text-[#bd5a22]">{item.number}</div>
        <h3 className="max-w-[450px] text-[clamp(2.1rem,3.5vw,3.05rem)] leading-[1.16] font-semibold tracking-[-0.055em]">{item.title}</h3>
        <p className="mt-5 max-w-[440px] text-[14px] leading-8 text-muted sm:text-[15px]">{item.description}</p>
        <ul className="mt-7 space-y-3">{item.bullets.map((bullet) => <li key={bullet} className="flex items-center gap-3 text-[13px] font-medium text-[#444542]"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fff0e7] text-[#d3611b]"><Check size={12} strokeWidth={2.5} aria-hidden="true" /></span>{bullet}</li>)}</ul>
      </div>
      <div className={`${isPortrait ? 'mx-auto w-full max-w-[420px] lg:mx-0' : 'w-full'} min-w-0`}><ScreenshotFrame src={item.image} alt={item.alt} label={item.imageLabel} variant={item.variant} /></div>
    </article>
  );
}

function Product() {
  return (
    <section id="system" className="bg-paper py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
          <div><Eyebrow>02 / Inside Horizon HRIS</Eyebrow><h2 className="max-w-[590px] text-[clamp(2.15rem,3.7vw,3.4rem)] leading-[1.13] font-semibold tracking-[-0.055em]">A closer look at the system.</h2></div>
          <p className="max-w-[280px] text-[12px] leading-6 text-muted">Selected views of the workflows that matter most. Actual application screenshots will be added here.</p>
        </div>
        {showcases.map((item, index) => <ShowcaseRow key={item.number} item={item} index={index} />)}
      </div>
    </section>
  );
}

function Additional() {
  const items = [
    { title: 'Multi-company structure', icon: Layers3 },
    { title: 'Branch & brand management', icon: ClipboardList },
    { title: 'Position-based permissions', icon: Check },
    { title: 'CSV attendance imports', icon: FileText },
    { title: 'Shift SMS notifications', icon: MessageSquareText },
  ];
  return (
    <section className="bg-[#1c1e1e] py-20 text-white sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-24 lg:px-10">
        <div>
          <Eyebrow dark>03 / More flexibility</Eyebrow>
          <h2 className="max-w-[470px] text-[clamp(2.15rem,3.7vw,3.35rem)] leading-[1.15] font-semibold tracking-[-0.055em]">Made for the way your business is organized.</h2>
          <p className="mt-5 max-w-[440px] text-[14px] leading-8 text-[#bbbcb8]">Support for multiple brands and branches, with practical tools to connect everyday workforce workflows.</p>
          <div className="mt-9 max-w-[470px] border-l-2 border-brand bg-white/[0.055] px-5 py-4 text-[12px] leading-6 text-[#d0d0cb]">
            <span className="font-semibold text-white">About biometric attendance</span><br />CSV attendance imports are supported. Real-time biometric integration requires separate device setup and configuration and is not included in the standard package.
          </div>
        </div>
        <div className="self-center border-t border-white/20">
          {items.map(({ title, icon: Icon }, index) => <div key={title} className="flex items-center gap-4 border-b border-white/20 py-5 sm:py-6"><span className="w-8 shrink-0 text-[11px] text-[#8e918c]">0{index + 1}</span><Icon size={19} strokeWidth={1.6} className="shrink-0 text-[#f29a63]" aria-hidden="true" /><span className="text-[14px] font-medium sm:text-[15px]">{title}</span><ArrowUpRight size={15} className="ml-auto shrink-0 text-[#7e817e]" aria-hidden="true" /></div>)}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:px-10">
        <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-[22px] border border-[#f0eee9] bg-white p-6 sm:min-h-[360px] sm:p-10">
          <div className="absolute left-0 top-0 h-1.5 w-24 bg-brand" aria-hidden="true" />
          <img src="/branding/horizon-logo.webp" alt="Horizon HR — HR Simplified, Results Amplified" className="relative w-full max-w-[440px] object-contain" loading="lazy" />
          <span className="absolute bottom-6 left-6 text-[10px] font-bold tracking-[0.13em] text-[#9c9891] uppercase sm:bottom-8 sm:left-8">Our brand</span>
        </div>
        <div>
          <Eyebrow>04 / About Horizon HRIS</Eyebrow>
          <h2 className="max-w-[540px] text-[clamp(2.15rem,3.6vw,3.3rem)] leading-[1.16] font-semibold tracking-[-0.055em]">HR simplified.<br /><span className="text-brand">Results amplified.</span></h2>
          <p className="mt-6 max-w-[520px] text-[14px] leading-8 text-muted sm:text-[15px]">Horizon HRIS is built to help teams handle the work behind their people operations. From scheduling and attendance to branch administration and payroll, it brings essential HR tasks into a more connected workspace.</p>
          <p className="mt-4 max-w-[520px] text-[14px] leading-8 text-muted sm:text-[15px]">A practical foundation for businesses managing people across positions, brands, and locations.</p>
          <a href="#features" className="mt-7 inline-flex items-center gap-2 border-b border-[#b65d2b] pb-1 text-[13px] font-semibold text-[#b65d2b] transition-colors hover:text-[#85350c]">Explore what Horizon covers <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  if (!inquiryUrl) return null;
  return (
    <section id="contact" className="bg-[#f5f2ec] py-18 sm:py-20">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-7 px-5 sm:px-8 md:flex-row md:items-center lg:px-10">
        <div><Eyebrow>Get in touch</Eyebrow><h2 className="text-[clamp(2rem,3.5vw,3rem)] leading-tight font-semibold tracking-[-0.055em]">Let's talk about your HR workflow.</h2></div>
        <a href={inquiryUrl} {...(inquiryUrl.startsWith('https://') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 self-start rounded-full bg-ink px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#393b3b]">Send an inquiry <ArrowUpRight size={17} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#e8e6e0] bg-paper">
      <div className="mx-auto max-w-[1200px] px-5 pb-8 pt-12 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-9 sm:flex-row sm:items-start">
          <div><Brand footer /><p className="mt-3 text-[12px] text-muted">HR Simplified, Results Amplified.</p></div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-7 gap-y-3 pt-2">{navLinks.map(item => <a href={item.href} key={item.href} className="text-[12px] font-medium text-[#585953] transition-colors hover:text-brand">{item.label}</a>)}</nav>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-2 border-t border-[#e8e6e0] pt-6 text-[11px] text-[#888780] sm:flex-row">
          <span>© {new Date().getFullYear()} Horizon HRIS. All rights reserved.</span>
          <span>Thoughtfully built for everyday HR operations.</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div id="top" className="min-h-screen overflow-x-clip bg-paper text-ink">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-3">Skip to content</a>
      <Header />
      <main id="main-content"><Hero /><Features /><Product /><Additional /><About /><Contact /></main>
      <Footer />
    </div>
  );
}
