import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bell, Info, ShieldAlert, CheckCircle, ArrowRight, ClipboardList } from 'lucide-react';
import Card from '../../components/Shared/Card';

export default function Notifications() {
  const { currentUser } = useSelector((state) => state.auth);
  const { complaints } = useSelector((state) => state.complaints);

  // Filter complaints filed by this specific citizen
  const myComplaints = complaints.filter(
    (c) => c.citizenEmail.toLowerCase() === (currentUser?.email || '').toLowerCase()
  );

  // Parse timelines to extract notifications
  const notifications = [];
  myComplaints.forEach((c) => {
    c.timeline.forEach((log) => {
      // Create a notification for each log except the very first submission (unless wanted)
      notifications.push({
        id: `${c.id}-${log.status}-${log.date}`,
        complaintId: c.id,
        title: c.title,
        status: log.status,
        remarks: log.remarks,
        date: log.date
      });
    });
  });

  // Sort by date descending
  notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

  const getIcon = (status) => {
    if (status === 'Resolved' || status === 'Closed') {
      return <CheckCircle className="w-5 h-5 text-govGreen" />;
    }
    if (status === 'Assigned' || status === 'In Progress') {
      return <Info className="w-5 h-5 text-blue-500" />;
    }
    return <ShieldAlert className="w-5 h-5 text-amber-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Bell className="w-6 h-6 text-govBlue" />
        <div>
          <h2 className="text-xl font-extrabold text-govBlue">Activity Bulletins</h2>
          <p className="text-xs text-govMatte-muted">Real-time alerts tracking department actions on your filed grievances.</p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-xs font-bold text-govMatte-muted">No active bulletins recorded in this workspace.</p>
          <p className="text-[10px] text-govMatte-muted/70 mt-1">Notifications populate as officers perform field actions.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-white border border-govMatte-border/60 rounded-2xl p-4 flex items-start space-x-3.5 hover:shadow-sm matte-transition"
            >
              <div className="mt-0.5 flex-shrink-0">
                {getIcon(n.status)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono font-bold text-govBlue">{n.complaintId}</span>
                  <span className="text-govMatte-muted">{new Date(n.date).toLocaleString()}</span>
                </div>
                <h4 className="text-xs font-extrabold text-slate-800 leading-tight">
                  Status Shift: {n.status}
                </h4>
                <p className="text-[11px] text-govMatte-muted leading-relaxed font-medium">
                  {n.remarks} — on "<span className="italic">{n.title}</span>"
                </p>
                <div className="pt-1.5">
                  <Link
                    to={`/citizen/complaint/${n.complaintId}`}
                    className="inline-flex items-center space-x-1 text-[10px] font-bold text-govGreen hover:underline"
                  >
                    <span>View Case File</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
