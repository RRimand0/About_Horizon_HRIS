import { useMemo, useState } from 'react';
import { ArrowUpRight, CalendarDays, CheckCircle2, Globe2, Mail, MapPin, Send } from 'lucide-react';

const API_URL = (import.meta.env.VITE_DEMO_API_URL || '').trim();
const ONSITE_ENABLED = import.meta.env.VITE_ONSITE_BOOKING_ENABLED === 'true';
const TOPICS = [
  'Scheduling', 'Attendance & worktime', 'Brands & branches',
  'Mobile kiosk', 'Payroll & payslips', 'SMS workflows',
];

const emptyForm = {
  fullName: '', company: '', email: '', phone: '',
  topics: [], notes: '', preferredDate: '', preferredTime: '',
  meetingMode: 'online', onsiteAddress: '', consent: false, website: '',
};

function minimumDate() {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(tomorrow);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

const fieldClass = 'mt-2 min-h-12 w-full rounded-xl border border-[#dcded9] bg-white px-4 py-3 text-[14px] text-ink outline-none transition-colors placeholder:text-[#969993] focus:border-brand focus:ring-2 focus:ring-brand/15';
const fieldLabel = 'block text-[13px] font-semibold text-[#343831]';

function StepTitle({ number, title, children }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff0e4] text-[12px] font-extrabold text-[#b94c12]">{number}</span>
      <div><h3 className="text-[18px] font-semibold tracking-[-0.04em]">{title}</h3><p className="mt-1 text-[12px] leading-5 text-muted">{children}</p></div>
    </div>
  );
}

export default function DemoRequestForm({ contactEmail }) {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const minDate = useMemo(minimumDate, []);
  const mailto = contactEmail ? `mailto:${contactEmail}?subject=${encodeURIComponent('Horizon HRIS Demo Request')}` : '';

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => { const next = { ...current }; delete next[name]; return next; });
    if (status === 'error') setStatus('idle');
  }

  function toggleTopic(topic) {
    setField('topics', form.topics.includes(topic) ? form.topics.filter((name) => name !== topic) : [...form.topics, topic]);
  }

  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    if (!API_URL) {
      setStatus('error');
      setMessage('Online booking is not configured yet. Please email us directly using the link below.');
      return;
    }
    if (form.topics.length === 0) {
      setErrors({ topics: 'Choose at least one area to discuss.' });
      document.getElementById('demo-topics')?.focus();
      return;
    }
    if (form.meetingMode === 'onsite' && !ONSITE_ENABLED) {
      setErrors({ meetingMode: 'Onsite requests are in preview mode until the server verifies the 200 km service area.' });
      return;
    }
    setStatus('sending');
    setErrors({});
    setMessage('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      let response;
      try {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            preferredAt: `${form.preferredDate}T${form.preferredTime}`,
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeout);
      }
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.ok) {
        setErrors(body.errors && typeof body.errors === 'object' ? body.errors : {});
        throw new Error(body.message || 'The request could not be sent. Please try again.');
      }
      setStatus('success');
      setMessage('Your demo request has been emailed to Horizon HRIS. We’ll reply to confirm a meeting time.');
      setForm(emptyForm);
    } catch (error) {
      setStatus('error');
      setMessage(error.name === 'AbortError'
        ? 'The request timed out. Please check your email before trying again, or contact us directly.'
        : error instanceof TypeError ? 'Could not connect to the booking service. Please use the email link below.' : error.message);
    }
  }

  return (
    <section id="demo" className="bg-[#fff3e9] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.65fr_1.35fr] lg:gap-14 lg:px-10">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#a8420a]">Request a demo</p>
          <h2 className="mt-4 max-w-[430px] text-[clamp(2.5rem,4.4vw,4.1rem)] font-semibold leading-[1.07] tracking-[-0.06em] text-ink">See if Horizon fits your team.</h2>
          <p className="mt-5 max-w-[360px] text-[14px] leading-7 text-[#665e55]">Tell us what your team needs. We’ll review your request and arrange a suitable walkthrough.</p>
          <div className="mt-8 space-y-4 text-[13px] font-medium text-[#49483f]">
            <p className="flex items-center gap-3"><CalendarDays size={19} className="text-brand" aria-hidden="true" /> Choose a preferred schedule</p>
            <p className="flex items-center gap-3"><Globe2 size={19} className="text-brand" aria-hidden="true" /> Online, or onsite where available</p>
            <p className="flex items-center gap-3"><Mail size={19} className="text-brand" aria-hidden="true" /> Confirmation will be sent separately</p>
          </div>
          {mailto && <p className="mt-9 text-[12px] leading-6 text-[#6b5f54]">Prefer email? <a href={mailto} className="font-semibold text-[#a8420a] underline underline-offset-4 hover:text-[#7b3209]">Contact {contactEmail}</a></p>}
        </div>

        <form onSubmit={submit} className="rounded-[22px] border border-[#ebd9ca] bg-white p-5 shadow-[0_22px_60px_-45px_rgba(52,29,8,.25)] sm:p-8" aria-label="Horizon HRIS demo request" noValidate={false}>
          <div className="grid gap-9">
            <fieldset>
              <legend className="sr-only">Who is requesting the demo?</legend>
              <StepTitle number="01" title="Who are we meeting?">Your contact and business details</StepTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={fieldLabel}>Full name <span className="text-[#bd510d]">*</span><input className={fieldClass} name="fullName" autoComplete="name" required minLength={2} maxLength={100} value={form.fullName} onChange={(event) => setField('fullName', event.target.value)} placeholder="Your full name" /></label>
                <label className={fieldLabel}>Company / business <span className="text-[#bd510d]">*</span><input className={fieldClass} name="company" autoComplete="organization" required minLength={2} maxLength={130} value={form.company} onChange={(event) => setField('company', event.target.value)} placeholder="Business name" /></label>
                <label className={fieldLabel}>Work email <span className="text-[#bd510d]">*</span><input className={fieldClass} name="email" type="email" autoComplete="email" required maxLength={190} value={form.email} onChange={(event) => setField('email', event.target.value)} placeholder="name@company.com" /></label>
                <label className={fieldLabel}>Contact number <span className="font-normal text-muted">(optional)</span><input className={fieldClass} name="phone" type="tel" autoComplete="tel" maxLength={35} value={form.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="+63 9XX XXX XXXX" /></label>
              </div>
            </fieldset>

            <fieldset>
              <legend className="sr-only">What would you like to see?</legend>
              <StepTitle number="02" title="What would you like to see?">Select the features that matter most</StepTitle>
              <div id="demo-topics" tabIndex={-1} className="grid gap-2 sm:grid-cols-2" aria-describedby={errors.topics ? 'demo-topics-error' : undefined}>
                {TOPICS.map((topic) => <label key={topic} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-[13px] font-semibold transition-colors ${form.topics.includes(topic) ? 'border-[#f59e6a] bg-[#fff5ed] text-[#923a0b]' : 'border-[#e5e5e1] text-[#565952] hover:border-[#e6b18f]'}`}>
                  <input type="checkbox" checked={form.topics.includes(topic)} onChange={() => toggleTopic(topic)} className="h-4 w-4 accent-[#f46b17]" />{topic}
                </label>)}
              </div>
              {errors.topics && <p id="demo-topics-error" role="alert" className="mt-2 text-[12px] text-red-700">{errors.topics}</p>}
              <label className={`${fieldLabel} mt-4`}>Anything else? <span className="font-normal text-muted">(optional)</span><textarea name="notes" rows={3} maxLength={1200} value={form.notes} onChange={(event) => setField('notes', event.target.value)} placeholder="Tell us about your current HR workflow or questions" className={`${fieldClass} resize-y`} /></label>
            </fieldset>

            <fieldset>
              <legend className="sr-only">When would you like the demo?</legend>
              <StepTitle number="03" title="When works for you?">Preferred schedule — Philippine time (UTC+8)</StepTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={fieldLabel}>Preferred date <span className="text-[#bd510d]">*</span><input name="preferredDate" type="date" min={minDate} required className={fieldClass} value={form.preferredDate} onChange={(event) => setField('preferredDate', event.target.value)} /></label>
                <label className={fieldLabel}>Preferred time <span className="text-[#bd510d]">*</span><input name="preferredTime" type="time" required className={fieldClass} value={form.preferredTime} onChange={(event) => setField('preferredTime', event.target.value)} /></label>
              </div>
              <p className="mt-2 text-[11px] text-[#86857f]">Please choose at least 24 hours in advance. Your preferred time is subject to confirmation.</p>
              {errors.preferredAt && <p role="alert" className="mt-2 text-[12px] text-red-700">{errors.preferredAt}</p>}
            </fieldset>

            <fieldset>
              <legend className="sr-only">How would you like to meet?</legend>
              <StepTitle number="04" title="How should we meet?">Choose online or onsite</StepTitle>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={`flex cursor-pointer flex-col gap-2 rounded-xl border p-4 ${form.meetingMode === 'online' ? 'border-brand bg-[#fff5ed]' : 'border-[#e5e5e1]'}`}>
                  <span className="flex items-center gap-2 text-[14px] font-semibold"><input type="radio" name="meetingMode" checked={form.meetingMode === 'online'} onChange={() => setField('meetingMode', 'online')} className="accent-[#f46b17]" /> Online meeting</span>
                  <span className="pl-5 text-[12px] text-muted">Remote walkthrough</span>
                </label>
                <label className={`flex cursor-pointer flex-col gap-2 rounded-xl border p-4 ${form.meetingMode === 'onsite' ? 'border-brand bg-[#fff5ed]' : 'border-[#e5e5e1]'}`}>
                  <span className="flex items-center gap-2 text-[14px] font-semibold"><input type="radio" name="meetingMode" checked={form.meetingMode === 'onsite'} onChange={() => setField('meetingMode', 'onsite')} className="accent-[#f46b17]" /> Onsite demo</span>
                  <span className="pl-5 text-[12px] text-muted">Within 200 km of Cagayan de Oro City</span>
                </label>
              </div>
              {!ONSITE_ENABLED && <p className="mt-3 text-[12px] leading-5 text-[#8e684e]">Enter the meeting address below. Onsite requests cannot be submitted until the 200 km address verification service is enabled.</p>}
              {form.meetingMode === 'onsite' && (
                <label className={`${fieldLabel} mt-4`}>
                  <span className="flex items-center gap-2"><MapPin size={16} className="text-brand" aria-hidden="true" /> Full meeting address <span className="text-[#bd510d]">*</span></span>
                  <input type="text" name="onsiteAddress" autoComplete="street-address" required minLength={10} maxLength={300} value={form.onsiteAddress} onChange={(event) => setField('onsiteAddress', event.target.value)} placeholder="Building / street, city, province, Philippines" className={fieldClass} aria-describedby="onsite-address-help" />
                  <span id="onsite-address-help" className="mt-2 block text-[11px] font-normal leading-5 text-muted">Type the complete meeting location. Our team is based in Cagayan de Oro City; onsite requests must be within a 200 km straight-line radius and are subject to confirmation.</span>
                </label>
              )}
              {errors.onsiteAddress && <p role="alert" className="mt-2 text-[12px] text-red-700">{errors.onsiteAddress}</p>}
              {errors.meetingMode && <p role="alert" className="mt-2 text-[12px] text-red-700">{errors.meetingMode}</p>}
            </fieldset>
          </div>

          <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true"><label>Website <input name="website" autoComplete="off" tabIndex={-1} value={form.website} onChange={(event) => setField('website', event.target.value)} /></label></div>
          <div className="mt-8 border-t border-[#ece9e3] pt-6">
            {Object.keys(errors).length > 0 && <div role="alert" className="mb-5 rounded-xl border border-[#f0c1b5] bg-[#fff5f1] p-4 text-[12px] leading-6 text-[#9e361e]">
              <p className="font-semibold">Please check the following:</p>
              <ul className="mt-1 list-inside list-disc">{Object.entries(errors).map(([key, value]) => <li key={key}>{value}</li>)}</ul>
            </div>}
            <label className="flex cursor-pointer items-start gap-3 text-[12px] leading-5 text-[#51554c]"><input type="checkbox" required checked={form.consent} onChange={(event) => setField('consent', event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#f46b17]" /><span>I agree to be contacted using these details about my Horizon HRIS demo request. <span className="text-red-700">*</span></span></label>
            <button type="submit" disabled={status === 'sending' || !API_URL || (form.meetingMode === 'onsite' && !ONSITE_ENABLED)} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-brand px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#d85d10] disabled:cursor-not-allowed disabled:bg-[#c6a691] sm:w-auto">
              <Send size={17} aria-hidden="true" />{status === 'sending' ? 'Sending request…' : 'Send demo request'}
            </button>
            {!API_URL && <p className="mt-3 text-[12px] leading-5 text-[#7b5c43]">Automatic email submissions are being set up. {mailto ? <>For now, <a href={mailto} className="font-bold underline underline-offset-4">request a demo by email</a>.</> : 'Please check back soon.'}</p>}
            {form.meetingMode === 'onsite' && !ONSITE_ENABLED && <p className="mt-3 text-[12px] leading-5 text-[#8e684e]">Onsite requests are not accepting submissions yet. Choose Online while we finish setting up onsite address verification.</p>}
            {message && <div role="status" aria-live="polite" className={`mt-4 flex items-start gap-2.5 rounded-xl border p-4 text-[13px] leading-6 ${status === 'success' ? 'border-[#b8ddc6] bg-[#f1fbf4] text-[#1c6e39]' : 'border-[#f0c1b5] bg-[#fff5f1] text-[#9e361e]'}`}>
              {status === 'success' ? <CheckCircle2 size={20} className="mt-0.5 shrink-0" aria-hidden="true" /> : <span aria-hidden="true">!</span>}{message}
            </div>}
            <p className="mt-4 text-[11px] leading-5 text-[#85857f]">This is a meeting request, not a confirmed booking. We’ll reply to arrange availability. No HRIS account is created.</p>
          </div>
        </form>
      </div>
    </section>
  );
}
