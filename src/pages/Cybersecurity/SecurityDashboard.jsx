import React from 'react';
import { useSelector } from 'react-redux';
import { ShieldAlert, AlertTriangle, KeyRound, CopyCheck, RefreshCw } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import Card from '../../components/Shared/Card';

export default function SecurityDashboard() {
  const { securityAlerts } = useSelector((state) => state.security);

  // Derived counts
  const totalAlerts = securityAlerts.length;
  const highRisk = securityAlerts.filter(a => a.riskLevel === 'High').length;
  const mediumRisk = securityAlerts.filter(a => a.riskLevel === 'Medium').length;
  const duplicateDetections = securityAlerts.filter(a => a.activity.includes('Duplicate')).length;

  // Chart Data: hourly login telemetry (successful vs failed)
  const loginTrendData = [
    { hour: '08:00', successful: 25, failed: 1 },
    { hour: '10:00', successful: 48, failed: 3 },
    { hour: '12:00', successful: 62, failed: 2 },
    { hour: '14:00', successful: 55, failed: 8 },
    { hour: '16:00', successful: 42, failed: 4 },
    { hour: '18:00', successful: 30, failed: 1 }
  ];

  // Chart Data: daily failure aggregates
  const dailyFailureData = [
    { day: 'Mon', attempts: 5 },
    { day: 'Tue', attempts: 8 },
    { day: 'Wed', attempts: 12 },
    { day: 'Thu', attempts: 6 },
    { day: 'Fri', attempts: 15 },
    { day: 'Sat', attempts: 4 },
    { day: 'Sun', attempts: 2 }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center space-x-2">
        <ShieldAlert className="w-6 h-6 text-red-600" />
        <div>
          <h2 className="text-xl font-extrabold text-govBlue">Cybersecurity Control Console</h2>
          <p className="text-xs text-govMatte-muted">Supervise brute-force blocks, duplicate incident fraud detection, and OTP token verification logs.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-red-600">{totalAlerts}</p>
              <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-0.5 font-sans">Total Security Alerts</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-red-600/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-red-700">{highRisk}</p>
              <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-0.5 font-sans">High Severity Threats</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-amber-600">{mediumRisk}</p>
              <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-0.5 font-sans">Medium Risks</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-govGreen/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-govGreen">{duplicateDetections}</p>
              <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-0.5 font-sans">Spam Duplicates Deflected</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-govGreen/5 flex items-center justify-center text-govGreen">
              <CopyCheck className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Security Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Login activity chart */}
        <Card className="flex flex-col justify-between">
          <div className="border-b border-govMatte-border/40 pb-3 mb-4 flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-govBlue animate-spin-slow" />
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider">Live Authentication Activity</h3>
          </div>
          <div className="w-full h-64 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={loginTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip />
                <Legend iconSize={10} iconType="circle" />
                <Line type="monotone" dataKey="successful" name="Success Logins" stroke="#1E5D46" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="failed" name="Failed Logins" stroke="#A53838" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Failed Login attempts histogram */}
        <Card className="flex flex-col justify-between">
          <div className="border-b border-govMatte-border/40 pb-3 mb-4 flex items-center space-x-2">
            <ShieldAlert className="w-4.5 h-4.5 text-red-600" />
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider">Weekly Failed Access Attempts</h3>
          </div>
          <div className="w-full h-64 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyFailureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.015)' }} />
                <Bar dataKey="attempts" name="Blocked Attempts" fill="#A53838" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* Security Alerts Table */}
      <Card>
        <div className="border-b border-govMatte-border/40 pb-3 mb-4">
          <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider">Active Intrusion Warnings Registry</h3>
        </div>

        <div className="overflow-x-auto text-xs font-semibold text-govMatte-text">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-govMatte-border text-[10px] text-govMatte-muted uppercase font-extrabold bg-slate-50/50">
                <th className="py-3 px-4">User Source</th>
                <th className="py-3 px-4">Suspected Activity</th>
                <th className="py-3 px-4">Log Timestamp</th>
                <th className="py-3 px-4">Telemetry IP</th>
                <th className="py-3 px-4">Device Environment</th>
                <th className="py-3 px-4">Risk Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-govMatte-border/40">
              {securityAlerts.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">{a.user}</td>
                  <td className="py-3 px-4 text-govMatte-muted">{a.activity}</td>
                  <td className="py-3 px-4 text-govMatte-muted">
                    {new Date(a.date).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-govMatte-muted">{a.ipAddress}</td>
                  <td className="py-3 px-4 text-govMatte-muted truncate max-w-[130px]">{a.device}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${
                      a.riskLevel === 'High' 
                        ? 'bg-red-50 text-red-700 border border-red-100' 
                        : a.riskLevel === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}>
                      {a.riskLevel} Risk
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
