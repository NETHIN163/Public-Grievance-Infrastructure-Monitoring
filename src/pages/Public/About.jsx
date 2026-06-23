import React from 'react';
import Card from '../../components/Shared/Card';
import { Target, Flag, Shield, Landmark } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12 animate-fade-in">
      
      {/* Banner */}
      <section className="text-center space-y-4">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-govBlue/10 border border-govBlue/20 text-govBlue uppercase tracking-wide">
          <Landmark className="w-3.5 h-3.5" />
          <span>Our Vision</span>
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gradient-indigo">About The Monitoring System</h2>
        <p className="text-xs md:text-sm text-govMatte-muted max-w-2xl mx-auto leading-relaxed">
          The Public Grievance & Infrastructure Monitoring System is a joint municipal initiative designed to combine modern data pipelines with local governance workflows, speeding up resolution times and maintaining accountability.
        </p>
      </section>

      {/* Grid: Mission & Objectives */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-govBlue/10 flex items-center justify-center text-govBlue mb-1">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-govBlue uppercase tracking-wider">Our Mission</h3>
          <p className="text-[11px] text-govMatte-muted leading-relaxed">
            To provide citizens with a high-fidelity, user-friendly, transparent avenue to file grievances and watch resolutions take place in real-time, restoring trust in civic utilities.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-govGreen/10 flex items-center justify-center text-govGreen mb-1">
            <Flag className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-govGreen uppercase tracking-wider">Primary Objective</h3>
          <p className="text-[11px] text-govMatte-muted leading-relaxed">
            Automate incident categorization, priority assignment, and dispatch to drastically reduce administrative bottlenecks and officer response delays from weeks to hours.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-xl bg-govBlue/10 flex items-center justify-center text-govBlue mb-1">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-govBlue uppercase tracking-wider">Security First</h3>
          <p className="text-[11px] text-govMatte-muted leading-relaxed">
            Implement duplicate complaint scanning, strict IP security telemetry, and cryptographic audit log tracing to protect the integrity of reported municipal data.
          </p>
        </Card>
      </section>

      {/* Benefits Table/Detailed Grid */}
      <section className="space-y-6">
        <h3 className="text-xl font-extrabold text-govBlue text-center">Stakeholder Benefits</h3>
        
        <div className="space-y-4">
          <div className="p-5 bg-govMatte-card border border-govMatte-border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-govBlue uppercase tracking-wide">For General Citizens</h4>
              <p className="text-[11px] text-govMatte-muted">Easy photo uploads, geo-location mapping, mobile-friendly forms, and automated timeline tracking.</p>
            </div>
            <span className="text-[10px] font-bold text-govGreen bg-govGreen/10 px-3 py-1 rounded-full border border-govGreen/20">Rapid Resolution</span>
          </div>

          <div className="p-5 bg-govMatte-card border border-govMatte-border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-govGreen uppercase tracking-wide">For Municipal Officers</h4>
              <p className="text-[11px] text-govMatte-muted">Direct dispatch queues, priority sorting, simplified resolution notes, and Before/After photo evidence tracking.</p>
            </div>
            <span className="text-[10px] font-bold text-govBlue bg-govBlue/15 px-3 py-1 rounded-full border border-govBlue/20">Optimized Dispatch</span>
          </div>

          <div className="p-5 bg-govMatte-card border border-govMatte-border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-govBlue uppercase tracking-wide">For System Administrators</h4>
              <p className="text-[11px] text-govMatte-muted">Global operations overview, automatic department categorization, regional analytics dashboards, and complete activity audit trail.</p>
            </div>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">Global Control</span>
          </div>
        </div>
      </section>

    </div>
  );
}
