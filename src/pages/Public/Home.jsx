import { Link } from 'react-router-dom';
import { ShieldAlert, FileText, CheckCircle2, ChevronRight, Users, Zap, ArrowRight } from 'lucide-react';
import Card from '../../components/Shared/Card';

export default function Home() {
  return (
    <div className="w-full space-y-20 pb-20">

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-b-[3rem] px-6 py-24 md:py-36" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #1d4ed8 100%)'
      }}>
        {/* Decorative grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* Glow blobs */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(16,185,129,0.12)' }} />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(37,99,235,0.18)' }} />

        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border" style={{
            background: 'rgba(16,185,129,0.12)',
            borderColor: 'rgba(16,185,129,0.3)',
            color: '#34d399'
          }}>
            <Zap className="w-3 h-3" />
            Next-Generation Grievance Redressal Platform
          </span>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Public Grievance &amp;{' '}
            <span style={{
              background: 'linear-gradient(90deg, #34d399 0%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Infrastructure Monitoring
            </span>{' '}
            System
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: '#94a3b8' }}>
            Register civic grievances, track infrastructure issues, and monitor resolutions in real-time. Our intelligent dispatch system automatically routes cases to municipal authorities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-lg"
              style={{ background: '#10b981', color: '#fff' }}
            >
              Get Started as Citizen
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold transition-all border"
              style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#fff', background: 'rgba(255,255,255,0.06)' }}
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Section ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl font-extrabold text-govBlue">Portal Operations Statistics</h2>
          <p className="text-xs text-govMatte-muted">Live updates of grievances resolved across municipal grids.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: FileText, value: '4,892', label: 'Total Complaints Logged', color: '#2563eb', bg: 'rgba(37,99,235,0.07)' },
            { icon: CheckCircle2, value: '4,120', label: 'Successfully Resolved', color: '#10b981', bg: 'rgba(16,185,129,0.07)' },
            { icon: Users, value: '182', label: 'Active Ground Officers', color: '#f59e0b', bg: 'rgba(245,158,11,0.07)' },
            { icon: Zap, value: '84.2%', label: 'Resolution Rate', color: '#8b5cf6', bg: 'rgba(139,92,246,0.07)' },
          ].map(({ icon: Icon, value, label, color, bg }) => (
            <Card key={label} className="text-center hover:-translate-y-1 group cursor-default">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: bg }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <p className="text-3xl font-extrabold" style={{ color }}>{value}</p>
              <h3 className="text-[11px] font-bold text-govMatte-muted uppercase tracking-wider mt-1">{label}</h3>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Feature Split Section ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold" style={{
              background: 'rgba(37,99,235,0.08)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.15)'
            }}>
              <ShieldAlert className="w-3 h-3" />
              AI-Powered System
            </div>
            <h2 className="text-3xl font-extrabold text-govBlue leading-tight">
              Intelligent Grievance Routing and Resolution Engine
            </h2>
            <p className="text-sm leading-relaxed text-govMatte-muted">
              Our system employs natural language processing and computer vision to inspect submissions instantly. It cross-checks complaints against active reports to prevent duplicate spam, predicts priority tiers, and notifies zone managers.
            </p>
            <div className="space-y-4 pt-2">
              {[
                { title: 'Automated Categorization', desc: 'Complaints are scanned to auto-assign the correct municipal department (Water, Roads, Electric).' },
                { title: 'GPS Location Tracking', desc: 'Interactive dashboards map problems on coordinates to plan local resource distribution.' },
                { title: 'Interactive Timeline Updates', desc: 'Track officers assigned, reviews, progress reports, and resolution logs in detail.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5" style={{
                    background: 'rgba(16,185,129,0.1)', color: '#10b981'
                  }}>✓</span>
                  <div>
                    <h4 className="text-xs font-bold text-govBlue">{title}</h4>
                    <p className="text-[10px] text-govMatte-muted mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl blur-3xl pointer-events-none" style={{ background: 'rgba(16,185,129,0.06)' }} />
            <img
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80"
              alt="Public Grievance System dashboard"
              className="rounded-3xl shadow-xl border border-govMatte-border/60 relative z-10 w-full object-cover h-[350px] matte-transition hover:scale-[1.01]"
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-govMatte-border" style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-14">
            <h2 className="text-2xl font-extrabold text-govBlue">Citizen Incident Filing Flow</h2>
            <p className="text-xs text-govMatte-muted max-w-md mx-auto">Follow this quick step-by-step pipeline to register and monitor updates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-px" style={{ background: 'linear-gradient(90deg, #2563eb22, #10b98122, #2563eb22)' }} />

            {[
              { num: '1', title: 'Register Account', desc: 'Verify your email address and create your citizen account.', color: '#2563eb' },
              { num: '2', title: 'Submit Complaint', desc: 'Upload photos and enter coordinates with the grid map.', color: '#2563eb' },
              { num: '3', title: 'System Analysis & Dispatch', desc: 'System filters duplicate filings and maps the incident to an officer.', color: '#2563eb' },
              { num: '4', title: 'Resolution & Audits', desc: 'Verify field action via before/after image timeline tracker.', color: '#10b981' },
            ].map(({ num, title, desc, color }) => (
              <div key={num} className="text-center space-y-3 relative">
                <div className="w-11 h-11 rounded-full flex items-center justify-center mx-auto text-sm font-extrabold shadow-md border-2 bg-white" style={{ color, borderColor: color + '44' }}>
                  {num}
                </div>
                <h3 className="text-xs font-extrabold" style={{ color }}>{title}</h3>
                <p className="text-[10px] text-govMatte-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative rounded-3xl p-12 max-w-3xl mx-auto overflow-hidden shadow-xl" style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #0f766e 100%)'
        }}>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl font-extrabold text-white">Help Us Improve Our Cities</h2>
            <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: '#94a3b8' }}>
              Report broken pavements, open drainages, power faults, sewage leakages, or waste piling. Your reports directly trigger local department dispatches.
            </p>
            <div className="pt-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-bold shadow-lg transition-all"
                style={{ background: '#10b981', color: '#fff' }}
              >
                Register a Grievance Now
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-govMatte-border/60 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-govMatte-muted font-medium gap-4">
        <p>© 2026 National Infrastructure &amp; Grievance Redressal Cell. Ministry of Urban Governance.</p>
        <div className="flex space-x-5">
          <Link to="/about" className="hover:text-govBlue transition-colors">About</Link>
          <Link to="/contact" className="hover:text-govBlue transition-colors">Support FAQs</Link>
          <a href="#" className="hover:text-govBlue transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-govBlue transition-colors">Privacy Guidelines</a>
        </div>
      </footer>

    </div>
  );
}
