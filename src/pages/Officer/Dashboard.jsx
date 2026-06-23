import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, AlertOctagon, CheckCircle2, ChevronRight, ClipboardList } from 'lucide-react';
import Card from '../../components/Shared/Card';

export default function OfficerDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const { complaints } = useSelector((state) => state.complaints);

  // Filter complaints assigned to this specific officer
  const myCases = complaints.filter(
    (c) => c.assignedOfficerEmail.toLowerCase() === (currentUser?.email || '').toLowerCase()
  );

  const totalAssigned = myCases.length;
  const pendingCases = myCases.filter(c => c.status === 'Assigned' || c.status === 'In Progress').length;
  const highPriority = myCases.filter(c => c.priority === 'High' && c.status !== 'Resolved' && c.status !== 'Closed').length;
  const resolvedCases = myCases.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  const urgentCases = myCases
    .filter(c => c.status !== 'Resolved' && c.status !== 'Closed')
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-govBlue">Field Officer Console</h2>
        <p className="text-xs text-govMatte-muted">Manage assigned service dispatches, upload repairs proof, and update resolution states.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-govBlue/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-govBlue">{totalAssigned}</p>
              <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-0.5">Assigned Cases</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-govBlue/5 flex items-center justify-center text-govBlue">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-orange-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-orange-600">{pendingCases}</p>
              <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-0.5">Awaiting Resolution</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <AlertOctagon className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-red-600">{highPriority}</p>
              <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-0.5">High Severity</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <AlertOctagon className="w-5 h-5 text-red-500 animate-bounce" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-govGreen/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-govGreen">{resolvedCases}</p>
              <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-0.5">Cases Resolved</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-govGreen/5 flex items-center justify-center text-govGreen">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Grid Layout: Urgent Tasks & List redirect */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Urgent Task Card */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4 border-b border-govMatte-border/40 pb-3">
              <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider">Urgent Action Items</h3>
              <Link to="/officer/assigned-complaints" className="text-xs font-bold text-govGreen hover:underline flex items-center">
                <span>All Assignments</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {urgentCases.length === 0 ? (
              <div className="text-center py-10 text-govMatte-muted">
                <p className="text-xs font-bold">No outstanding issues in your worklist.</p>
                <p className="text-[10px] text-govMatte-muted/70">All assigned jobs have been successfully resolved.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentCases.map((c) => (
                  <div key={c.id} className="p-4 bg-slate-50 border border-govMatte-border/60 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold text-govBlue">{c.id}</span>
                        <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-red-100 text-red-700">
                          {c.priority} Priority
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 truncate max-w-sm">{c.title}</h4>
                      <p className="text-[10px] text-govMatte-muted truncate max-w-sm">{c.location}</p>
                    </div>

                    <button
                      onClick={() => navigate(`/officer/complaint/${c.id}`)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl text-[10px] font-bold bg-govBlue text-white hover:bg-govBlue-light shadow transition-all"
                    >
                      Inspect Case
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Instructions */}
        <Card className="space-y-3.5 bg-slate-50/50">
          <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2">Duty Instructions</h3>
          <ul className="space-y-3 text-[11px] font-semibold text-govMatte-text">
            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-govGreen text-white flex items-center justify-center text-[10px] flex-shrink-0">1</span>
              <p className="text-govMatte-muted leading-tight">Locate coordinate markers using telemetry data before leaving depot.</p>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-govGreen text-white flex items-center justify-center text-[10px] flex-shrink-0">2</span>
              <p className="text-govMatte-muted leading-tight">Transition case from <strong className="text-govBlue">Assigned</strong> to <strong className="text-govBlue">In Progress</strong> upon site arrival.</p>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-govGreen text-white flex items-center justify-center text-[10px] flex-shrink-0">3</span>
              <p className="text-govMatte-muted leading-tight">Upload repair photographs and submit final resolution reports to close tickets.</p>
            </li>
          </ul>
        </Card>

      </div>

    </div>
  );
}
