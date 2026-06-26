import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, FileText, CheckCircle2, ChevronRight, Users, Zap, ArrowRight, ArrowUpRight } from 'lucide-react';

export default function Home() {
  // Stakeholder Card Configs (Inspiration: Corepla stakeholder categories)
  const stakeholders = [
    {
      badge: 'Citizens & Residents',
      title: 'Report Grievances',
      desc: 'Register civic issues, map coordinates, and track before/after resolution timelines in real-time.',
      img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      color: '#10b981', // Citizen Green
      btnColor: '#047857',
      to: '/register',
    },
    {
      badge: 'Municipal Officers',
      title: 'Ground Redressal',
      desc: 'Access assigned officer work queues, update incident statuses, and submit field audit photos.',
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      color: '#06b6d4', // Officer Teal/Cyan
      btnColor: '#0e7490',
      to: '/login',
    },
    {
      badge: 'Security & Audit',
      title: 'Audit Analytics',
      desc: 'Inspect tamper-proof system audit logs, check security telemetry, and verify grievance data integrity.',
      img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      color: '#f97316', // Security Orange
      btnColor: '#c2410c',
      to: '/login',
    },
    {
      badge: 'Global Admins',
      title: 'Operations Center',
      desc: 'Manage municipal department routing, track regional statistics, and manage user authorizations.',
      img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
      color: '#8b5cf6', // Admin Purple
      btnColor: '#6d28d9',
      to: '/login',
    }
  ];

  return (
    <div className="w-full bg-[#f8fafc] text-[#1e293b] font-sans antialiased min-h-screen">

      {/* ── Hero & Stakeholder Section ──────────────────────────────────────── */}
      <section className="relative bg-white pt-16 pb-24 px-6 md:px-12 xl:px-24 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header/Intro text block */}
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border bg-emerald-50 border-emerald-200 text-emerald-600 tracking-wider uppercase">
              <Zap className="w-3 h-3 fill-emerald-600" />
              Next-Generation Grievance Redressal Platform
            </span>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[#0f172a] leading-tight">
              National <br />
              <span className="bg-gradient-to-r from-govBlue to-emerald-500 bg-clip-text text-transparent">
                Grievance Portal
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-500 leading-relaxed font-normal max-w-2xl">
              Register civic grievances and monitor resolutions in real-time. Our intelligent dispatch system automatically routes cases to municipal authorities.
            </p>

            {/* Corepla-style Pill Action Button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 group px-6 py-3 rounded-full text-sm font-bold bg-govBlue text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10"
              >
                <span>Get Started as Citizen</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
              >
                <span>Sign In to Portal</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Corepla-inspired Interactive Stakeholder Carousel/Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            {stakeholders.map((sh, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl aspect-[4/5] group cursor-pointer shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300"
              >
                {/* Background image */}
                <img
                  src={sh.img}
                  alt={sh.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {/* Default subtle gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent transition-opacity duration-300 group-hover:opacity-0" />

                {/* Default text block at the bottom */}
                <div className="absolute bottom-6 left-6 right-6 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-4">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase mb-2 text-white"
                    style={{ backgroundColor: sh.color }}
                  >
                    {sh.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-tight">{sh.title}</h3>
                </div>

                {/* Hover state brand color overlay */}
                <div
                  className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out"
                  style={{ backgroundColor: sh.color }}
                >
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-white/20 text-white tracking-wider uppercase">
                      {sh.badge}
                    </span>
                    <h3 className="text-xl font-black text-white">{sh.title}</h3>
                    <p className="text-xs text-white/90 leading-relaxed font-medium pt-1">
                      {sh.desc}
                    </p>
                  </div>

                  <Link
                    to={sh.to}
                    className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full text-xs font-bold bg-white shadow-sm hover:bg-slate-50 transition-all"
                    style={{ color: sh.btnColor }}
                  >
                    <span>Access Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ("I Numeri" Inspiration) ─────────────────────────── */}
      <section className="py-20 bg-slate-50 px-6 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Portal Operations Statistics</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">Live updates of grievances resolved across municipal grids.</p>
          </div>

          {/* Grid Layout mimicking Corepla's "I Numeri" counters */}
          <div className="grid grid-cols-1 md:grid-cols-4 border border-[#e2e8f0] bg-white rounded-3xl overflow-hidden shadow-sm divide-y md:divide-y-0 md:divide-x divide-[#e2e8f0]">
            {[
              { value: '4,892', label: 'Total Complaints Logged', color: '#2563eb' },
              { value: '4,120', label: 'Successfully Resolved', color: '#10b981' },
              { value: '182', label: 'Active Ground Officers', color: '#f97316' },
              { value: '84.2%', label: 'Resolution Rate', color: '#8b5cf6' },
            ].map(({ value, label, color }, idx) => (
              <div key={idx} className="p-8 text-center flex flex-col justify-center min-h-[180px]">
                <p className="text-5xl font-black tracking-tight mb-2 transition-transform duration-300 hover:scale-105 cursor-default" style={{ color }}>
                  {value}
                </p>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Split Section ──────────────────────────────────────────── */}
      <section className="py-24 bg-white px-6 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column content */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-600 tracking-wider uppercase">
                <ShieldAlert className="w-3 h-3 text-blue-600" />
                AI-Powered System
              </span>

              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                Intelligent Grievance Routing and Resolution Engine
              </h2>

              <p className="text-sm md:text-base leading-relaxed text-slate-500 font-normal">
                Our system employs natural language processing and computer vision to inspect submissions instantly. It cross-checks complaints against active reports to prevent duplicate spam, predicts priority tiers, and notifies zone managers.
              </p>

              {/* Checklist points with checkmark circles */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                {[
                  { title: 'Automated Categorization', desc: 'Complaints are scanned to auto-assign the correct municipal department (Water, Roads, Electric).' },
                  { title: 'GPS Location Tracking', desc: 'Interactive dashboards map problems on coordinates to plan local resource distribution.' },
                  { title: 'Interactive Timeline Updates', desc: 'Track officers assigned, reviews, progress reports, and resolution logs in detail.' },
                ].map(({ title, desc }, idx) => (
                  <div key={idx} className="flex gap-4">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-emerald-50 text-emerald-500 border border-emerald-200">
                      ✓
                    </span>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column image container */}
            <div className="relative group">
              <div className="absolute inset-0 rounded-3xl bg-emerald-100 blur-3xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-35 duration-500" />
              <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80"
                  alt="Public Grievance System dashboard"
                  className="w-full object-cover h-[400px] transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 px-6 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Citizen Incident Filing Flow</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">Follow this quick step-by-step pipeline to register and monitor updates.</p>
          </div>

          {/* Cards timeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              { num: '01', title: 'Register Account', desc: 'Verify your email address and create your citizen account.', color: '#2563eb' },
              { num: '02', title: 'Submit Complaint', desc: 'Upload photos and enter coordinates with the grid map.', color: '#06b6d4' },
              { num: '03', title: 'System Analysis & Dispatch', desc: 'System filters duplicate filings and maps the incident to an officer.', color: '#f97316' },
              { num: '04', title: 'Resolution & Audits', desc: 'Verify field action via before/after image timeline tracker.', color: '#10b981' },
            ].map(({ num, title, desc, color }, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm space-y-4 hover:-translate-y-1 transition-transform duration-300">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold bg-slate-50 border-2"
                  style={{ color, borderColor: color + '33' }}
                >
                  {num}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800" style={{ color }}>{title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white px-6 text-center">
        <div className="max-w-4xl mx-auto rounded-3xl p-12 md:p-16 relative overflow-hidden bg-slate-900 text-white shadow-xl">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-950/20 to-emerald-950/20 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Help Us Improve Our Cities</h2>
            <p className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed text-slate-300">
              Report broken pavements, open drainages, power faults, sewage leakages, or waste piling. Your reports directly trigger local department dispatches.
            </p>

            <div className="pt-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-3 group px-8 py-3.5 rounded-full text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10"
              >
                <span>Register a Grievance Now</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1">
                  <ChevronRight className="w-3.5 h-3.5 text-white" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer (Inspiration: Corepla robust dark footer) ──────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-sm font-bold uppercase text-white tracking-wider">Grievance Portal</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 max-w-xs">
              A joint municipal initiative integrating modern citizen pipelines with localized public works operations cells, speeding response times and securing public oversight records.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Portal Links</h4>
            <div className="flex flex-col gap-2 text-xs">
              <Link to="/" className="hover:text-white transition-colors">Home Page</Link>
              <Link to="/about" className="hover:text-white transition-colors">About Redressal Cell</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Support & FAQs</Link>
            </div>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Legal Details</h4>
            <div className="flex flex-col gap-2 text-xs">
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Guidelines</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policies</Link>
            </div>
          </div>

          {/* Column 4: Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest">Initiative Cell</h4>
            <p className="text-xs leading-relaxed text-slate-500">
              National Infrastructure Redressal Cell<br />
              Ministry of Housing and Urban Affairs<br />
              Operational Registry grid 2026.
            </p>
          </div>
        </div>

        {/* Copyright info */}
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-600 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 National Infrastructure &amp; Grievance Redressal Cell. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full border border-slate-800 text-slate-600 uppercase tracking-widest font-extrabold">MoHUA initiative</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
