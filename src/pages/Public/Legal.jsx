import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Scale, 
  ShieldCheck, 
  Cookie, 
  FileText, 
  Lock, 
  UserCheck, 
  Clock, 
  Info, 
  CheckCircle, 
  ChevronRight, 
  AlertTriangle 
} from 'lucide-react';

export default function Legal({ defaultTab = 'terms' }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Sync active tab with route defaultTab prop updates
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const tabs = [
    { id: 'terms', label: 'Terms of Use', icon: Scale },
    { id: 'privacy', label: 'Privacy Guidelines', icon: ShieldCheck },
    { id: 'cookies', label: 'Cookie Policies', icon: Cookie },
  ];

  return (
    <div className="w-full bg-[#f8fafc] text-[#1e293b] font-sans antialiased min-h-screen py-12 px-4 sm:px-6 md:px-12 xl:px-24 bg-mesh">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-govBlue transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 font-medium">Legal Details</span>
        </div>

        {/* ── Banner Section ─────────────────────────────────────────────────── */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 border border-blue-200 text-blue-600 tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Compliance & Transparency</span>
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Legal & Compliance <br />
            <span className="bg-gradient-to-r from-govBlue to-emerald-500 bg-clip-text text-transparent">Information Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto font-normal">
            Understand your rights, safety protocols, and privacy parameters when accessing the National Grievance and Infrastructure Monitoring system.
          </p>
        </section>

        {/* ── Interactive Layout ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <nav className="lg:col-span-4 flex flex-col gap-2 p-2 bg-white rounded-3xl border border-slate-100 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3.5 px-5 py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-govBlue to-indigo-600 text-white shadow-md shadow-blue-500/10 translate-x-1' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
            
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <p className="text-[11px] text-slate-400 leading-normal">
                Last updated: <strong>June 2026</strong>
              </p>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                Ministry of Housing and Urban Affairs
              </p>
            </div>
          </nav>

          {/* Policy Document Content Area */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
            
            {activeTab === 'terms' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-govBlue flex items-center justify-center">
                    <Scale className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Terms of Use</h2>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Governing Platform Governance</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-5 leading-relaxed font-normal">
                  <p>
                    Welcome to the <strong>National Grievance & Infrastructure Monitoring Portal</strong>. By accessing or using this system, you agree to comply with and be bound by the following Terms of Use.
                  </p>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3.5">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800 leading-normal">
                      <strong>Critical Regulatory Notice:</strong> Submission of intentionally falsified or malicious grievance reports is a punishable offence. The portal traces telemetry logs including IP coordinates and device signatures for security auditing.
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider pt-2">1. Acceptable Use Policy</h3>
                  <p>
                    Citizens must use this platform in good faith to report genuine municipal, civic, or public infrastructure issues (e.g., damaged roads, waste management blockages, electrical hazards).
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Grievance details must be accurate and relate to public utility services.</li>
                    <li>Uploaded images must contain only the affected public site (no private portraits).</li>
                    <li>No harassment, abusive terminology, or political messaging will be tolerated.</li>
                  </ul>

                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider pt-2">2. Secure Account Setup & OTP Validation</h3>
                  <p>
                    Registration requires a verified email address. Verification is completed via a secure One-Time Password (OTP) dispatched to your mailbox. 
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Account details must represent your true identity.</li>
                    <li>OTP credentials are confidential and remain valid for precisely 10 minutes.</li>
                    <li>You are responsible for all actions conducted under your authenticated session.</li>
                  </ul>

                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider pt-2">3. Role-Based Access Control (RBAC) Integrity</h3>
                  <p>
                    The platform enforces strict role-based dashboards (Citizen, Ground Officer, Operations Administrator, Cybersecurity Auditor). Attempting to elevate privileges, tamper with endpoint payloads, or access restricted command paths is logged in the system's tamper-proof audit trail and flagged as a security threat.
                  </p>

                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider pt-2">4. Disclaimer of Liability</h3>
                  <p>
                    While the ministry strives for immediate dispatch and resolution scheduling, the portal coordinates action with local municipal corporations. Immediate service completion is dependent on regional logistics, category severity, and municipal staff availability.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Privacy Guidelines</h2>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Citizen Data Protection Standards</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-5 leading-relaxed font-normal">
                  <p>
                    Your privacy is of paramount importance to the Ministry of Housing and Urban Affairs. These guidelines outline how your data is safely collected, processed, and safeguarded.
                  </p>

                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider pt-2">1. Data We Collect</h3>
                  <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="min-w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Data Field Collected</th>
                          <th className="px-4 py-3">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        <tr>
                          <td className="px-4 py-3 font-semibold">User Identity</td>
                          <td className="px-4 py-3">Full name, verified email, telephone number</td>
                          <td className="px-4 py-3">Authentication, OTP validation, and ticket dispatch alerts.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold">Telemetry Location</td>
                          <td className="px-4 py-3">Latitude & Longitude coordinates, zone area</td>
                          <td className="px-4 py-3">Automated dispatch routing and mapping grievance clusters.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold">Field Evidence</td>
                          <td className="px-4 py-3">Before/After photos of infrastructure damage</td>
                          <td className="px-4 py-3">Proof of status, validation by ground crews, and audit verification.</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-semibold">Security logs</td>
                          <td className="px-4 py-3">IP address, audit timestamps, action types</td>
                          <td className="px-4 py-3">Intrusion detection, security compliance tracking.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider pt-2">2. Processing & Automated Dispatch Routing</h3>
                  <p>
                    We process complaint descriptions using an AI-based Rule Engine that analyzes priority levels and assigns cases to officers based on categories. The personal information of the reporting citizen is only disclosed to the assigned officer and regional administrator for communication or verification.
                  </p>

                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider pt-2">3. Data Sharing Restrictions</h3>
                  <p>
                    Grievance data is never sold, traded, or shared with third-party marketing networks. Access is strictly limited to authorized government departments, designated municipal personnel, and security auditing tools.
                  </p>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start space-x-3.5">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-800 leading-normal">
                      <strong>Security Guarantee:</strong> All communication between your device and our server uses TLS encryption. Authentication tokens are securely verified in server-side sessions.
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider pt-2">4. Data Retention</h3>
                  <p>
                    Inactive citizen accounts can request deletion of registration profiles. Complaints remain in the public operations registry as historical records of civic resolutions but can be anonymized upon verified request.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'cookies' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    <Cookie className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Cookie Policies</h2>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Cookie & Session State Storage</p>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-5 leading-relaxed font-normal">
                  <p>
                    This portal utilizes session storage mechanisms to ensure security, authentication persistence, and custom workspace settings.
                  </p>

                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider pt-2">1. What are cookies and local storage tokens?</h3>
                  <p>
                    Cookies are tiny files stored on your machine. Similarly, Web Local Storage allows us to store user session configurations securely. These technologies allow you to navigate pages without needing to input your credentials on every action.
                  </p>

                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider pt-2">2. Types of Cookies We Use</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 border border-slate-100 bg-slate-50 rounded-2xl space-y-2">
                      <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                        <Lock className="w-4 h-4 text-govBlue" />
                        <span>Strictly Essential</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        Used for security, maintaining your JSON Web Token (JWT) session status, and preventing cross-site request forgery attacks. Disabling these prevents portal logins.
                      </p>
                    </div>

                    <div className="p-5 border border-slate-100 bg-slate-50 rounded-2xl space-y-2">
                      <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                        <Info className="w-4 h-4 text-emerald-500" />
                        <span>Workspace State</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-normal">
                        Maintains dashboard preference configurations (e.g. recent searches, applied filters, and map zoom coordinates) for citizen and admin dashboards.
                      </p>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider pt-2">3. Storage Lifespans</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Authentication Session Tokens:</strong> Cleared automatically when logging out or after 24 hours of inactivity.</li>
                    <li><strong>Application Configs (Local Storage):</strong> Retained persistently to restore preference states (e.g. theme modes) but can be cleared in browser settings.</li>
                  </ul>

                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider pt-2">4. Disabling Cookies</h3>
                  <p>
                    You can restrict cookies and Web Storage via browser configuration settings. However, disabling essential tokens will prevent logging in to the Citizen or Administrative Workspaces.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
