import React from 'react';
import { Target, Flag, Shield, Landmark, CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="w-full bg-[#f8fafc] text-[#1e293b] font-sans antialiased min-h-screen py-16 px-6 md:px-12 xl:px-24">
      <div className="max-w-6xl mx-auto space-y-20 animate-fade-in">
        
        {/* ── Banner Section ─────────────────────────────────────────────────── */}
        <section className="text-center space-y-5 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-600 tracking-wider uppercase">
            <Landmark className="w-3.5 h-3.5" />
            <span>Our Vision</span>
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            About The National <br />
            <span className="bg-gradient-to-r from-govBlue to-emerald-500 bg-clip-text text-transparent">Grievance Portal</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-2xl mx-auto font-normal">
            The National Grievance Portal is a joint municipal initiative designed to combine modern data pipelines with local governance workflows, speeding up resolution times and maintaining accountability.
          </p>
        </section>

        {/* ── Mission & Objectives Grid (Thematic Brand Colors) ──────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Mission (Green / Citizens) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            {/* Top border decoration */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#10b981]" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10b981] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-wide mb-3">Our Mission</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              To provide citizens with a high-fidelity, user-friendly, transparent avenue to file grievances and watch resolutions take place in real-time, restoring trust in civic utilities.
            </p>
          </div>

          {/* Card 2: Objective (Teal / Municipalities) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#06b6d4]" />
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#06b6d4] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
              <Flag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-wide mb-3">Primary Objective</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Automate incident categorization, priority assignment, and dispatch to drastically reduce administrative bottlenecks and officer response delays from weeks to hours.
            </p>
          </div>

          {/* Card 3: Security (Orange / Security) */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#f97316]" />
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#f97316] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-wide mb-3">Security First</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Implement duplicate complaint scanning, strict IP security telemetry, and cryptographic audit log tracing to protect the integrity of reported municipal data.
            </p>
          </div>
        </section>

        {/* ── Core Platform Features ─────────────────────────────────────────── */}
        <section className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-slate-900">Core Platform Features</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Engineered using modern web frameworks and intelligent queue dispatch algorithms.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Automated Categorization', desc: 'Complaints are scanned to auto-assign the correct municipal department (Water, Roads, Electric).' },
              { title: 'GPS Location Tracking', desc: 'Interactive dashboards map problems on coordinates to plan local resource distribution.' },
              { title: 'Interactive Timeline Updates', desc: 'Track officers assigned, reviews, progress reports, and resolution logs in detail.' },
            ].map(({ title, desc }, idx) => (
              <div key={idx} className="space-y-3 p-4 hover:bg-slate-50 rounded-2xl transition-colors duration-300">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-50 text-emerald-500 border border-emerald-100">
                    ✓
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">{title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stakeholder Benefits Rows (Color-coded Pill Badges) ───────────── */}
        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-slate-900">Stakeholder Benefits</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Dedicated interfaces designed specifically to optimize tasks for all members of the governance flow.</p>
          </div>

          <div className="space-y-4">
            {/* Citizens Row */}
            <div className="p-6 md:p-8 bg-white hover:bg-slate-50 border border-slate-100 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow transition-all duration-300 group">
              <div className="space-y-1 max-w-3xl">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#10b981] transition-colors duration-300">For General Citizens</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Easy photo uploads, geo-location mapping, mobile-friendly forms, and automated timeline tracking.
                </p>
              </div>
              <span className="self-start md:self-center text-[10px] font-black uppercase tracking-wider text-[#10b981] bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm cursor-default">
                Rapid Resolution
              </span>
            </div>

            {/* Officers Row */}
            <div className="p-6 md:p-8 bg-white hover:bg-slate-50 border border-slate-100 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow transition-all duration-300 group">
              <div className="space-y-1 max-w-3xl">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#06b6d4] transition-colors duration-300">For Municipal Officers</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Direct dispatch queues, priority sorting, simplified resolution notes, and Before/After photo evidence tracking.
                </p>
              </div>
              <span className="self-start md:self-center text-[10px] font-black uppercase tracking-wider text-[#06b6d4] bg-cyan-50 px-4 py-1.5 rounded-full border border-cyan-100 shadow-sm cursor-default">
                Optimized Dispatch
              </span>
            </div>

            {/* Admins Row */}
            <div className="p-6 md:p-8 bg-white hover:bg-slate-50 border border-slate-100 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow transition-all duration-300 group">
              <div className="space-y-1 max-w-3xl">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#8b5cf6] transition-colors duration-300">For System Administrators</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Global operations overview, automatic department categorization, regional analytics dashboards, and complete activity audit trail.
                </p>
              </div>
              <span className="self-start md:self-center text-[10px] font-black uppercase tracking-wider text-[#8b5cf6] bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100 shadow-sm cursor-default">
                Global Control
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
