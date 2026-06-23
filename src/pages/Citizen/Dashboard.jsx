import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Hourglass, ArrowUpRight, CheckCircle, PlusCircle, AlertCircle } from 'lucide-react';
import Card from '../../components/Shared/Card';

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const { complaints } = useSelector((state) => state.complaints);

  // Filter complaints filed by this specific citizen
  const myComplaints = complaints.filter(
    (c) => c.citizenEmail.toLowerCase() === (currentUser?.email || '').toLowerCase()
  );

  const total = myComplaints.length;
  const pending = myComplaints.filter((c) => c.status === 'Submitted' || c.status === 'Under Review').length;
  const inProgress = myComplaints.filter((c) => c.status === 'Assigned' || c.status === 'In Progress').length;
  const resolved = myComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-govBlue">Citizen Grievance Center</h2>
          <p className="text-xs text-govMatte-muted">Report local issues and monitor department response times.</p>
        </div>
        <Link
          to="/citizen/create-complaint"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-govBlue text-white hover:bg-govBlue-light shadow-md shadow-govBlue/15 text-center transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Grievance</span>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-govBlue/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-govBlue">{total}</p>
              <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-0.5">Total Registered</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-govBlue/5 flex items-center justify-center text-govBlue">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-amber-600">{pending}</p>
              <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-0.5">Awaiting Review</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Hourglass className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-blue-600">{inProgress}</p>
              <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-0.5">In Progress</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </Card>

        <Card className="hover:border-govGreen/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-govGreen">{resolved}</p>
              <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-0.5">Cases Resolved</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-govGreen/5 flex items-center justify-center text-govGreen">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <div className="flex items-center justify-between mb-4 border-b border-govMatte-border/60 pb-3">
          <h3 className="text-sm font-extrabold text-govBlue uppercase tracking-wider">My Recent Submissions</h3>
          <Link to="/citizen/my-complaints" className="text-xs font-bold text-govGreen hover:underline flex items-center space-x-0.5">
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {total === 0 ? (
          <div className="text-center py-10 space-y-2">
            <p className="text-xs font-bold text-govMatte-muted">No registered complaints in your workspace.</p>
            <p className="text-[10px] text-govMatte-muted/70">Click the button above to report an infrastructure failure.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-govMatte-text">
              <thead>
                <tr className="border-b border-govMatte-border text-[10px] text-govMatte-muted uppercase font-extrabold bg-slate-50/50">
                  <th className="py-3 px-4">Incident ID</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Logged Date</th>
                  <th className="py-3 px-4">Work Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-govMatte-border/40">
                {myComplaints.slice(0, 5).map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-govBlue">{complaint.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">{complaint.title}</td>
                    <td className="py-3 px-4 text-govMatte-muted">{complaint.category}</td>
                    <td className="py-3 px-4 text-govMatte-muted">
                      {new Date(complaint.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        complaint.status === 'Resolved' || complaint.status === 'Closed'
                          ? 'bg-govGreen/10 text-govGreen border border-govGreen/20'
                          : complaint.status === 'In Progress' || complaint.status === 'Assigned'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100 animate-pulse'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/citizen/complaint/${complaint.id}`)}
                        className="px-3 py-1 rounded-lg bg-govBlue/5 hover:bg-govBlue text-govBlue hover:text-white border border-govBlue/10 hover:border-transparent transition-all font-bold"
                      >
                        Track Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
    </div>
  );
}
