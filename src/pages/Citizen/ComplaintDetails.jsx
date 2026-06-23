import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, User, Mail, Calendar, Sparkles } from 'lucide-react';
import Card from '../../components/Shared/Card';

export default function ComplaintDetails() {
  const { id } = useParams();
  const { complaints } = useSelector((state) => state.complaints);
  const { currentUser } = useSelector((state) => state.auth);

  const complaint = complaints.find((c) => c.id === id);

  // Enforce access control for citizen role
  const isUnauthorized = currentUser && currentUser.role === 'citizen' && complaint && complaint.citizenEmail.toLowerCase() !== currentUser.email.toLowerCase();

  if (!complaint || isUnauthorized) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h2 className="text-lg font-bold text-govBlue">Complaint Record Not Found</h2>
        <p className="text-xs text-govMatte-muted">Please check the grievance ID and try again.</p>
        <Link to={currentUser?.role === 'admin' ? "/admin/complaint-monitoring" : "/citizen/my-complaints"} className="inline-block text-xs font-bold text-govGreen hover:underline">
          Return to Grievances
        </Link>
      </div>
    );
  }

  // Stepper Stages definition
  const stages = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

  const getStageIndex = (status) => stages.indexOf(status);
  const activeIndex = getStageIndex(complaint.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 animate-fade-in">
      
      {/* Back Button */}
      <div>
        <Link
          to={currentUser?.role === 'admin' ? "/admin/complaint-monitoring" : "/citizen/my-complaints"}
          className="inline-flex items-center space-x-1 text-xs font-bold text-govMatte-muted hover:text-govBlue transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{currentUser?.role === 'admin' ? 'Back to Incident Monitor' : 'Back to Grievance List'}</span>
        </Link>
      </div>

      {/* Title & Identity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-govMatte-border/40 pb-4 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold bg-govBlue/5 px-2 py-0.5 rounded text-govBlue border border-govBlue/10">{complaint.id}</span>
          <h2 className="text-lg font-extrabold text-govBlue mt-1.5">{complaint.title}</h2>
          <div className="flex items-center space-x-3 text-[10px] text-govMatte-muted font-bold mt-1">
            <span className="capitalize">{complaint.category}</span>
            <span>•</span>
            <span className="flex items-center"><MapPin className="w-3 h-3 mr-0.5" />{complaint.location}</span>
          </div>
        </div>

        <div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
            complaint.status === 'Resolved' || complaint.status === 'Closed'
              ? 'bg-govGreen/10 text-govGreen border border-govGreen/20'
              : complaint.status === 'In Progress' || complaint.status === 'Assigned'
              ? 'bg-blue-50 text-blue-700 border border-blue-100 animate-pulse'
              : 'bg-amber-50 text-amber-700 border border-amber-100'
          }`}>
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Stepper Timeline Tracker */}
      <Card className="bg-slate-50/50">
        <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider mb-6">Resolution Stage Tracker</h3>
        
        {/* Horizontal Line Stepper */}
        <div className="relative flex items-center justify-between">
          {/* Background Bar */}
          <div className="absolute left-0 right-0 h-0.5 bg-govMatte-border -translate-y-1/2 top-1/2 z-0" />
          {/* Active Fill Bar */}
          <div 
            style={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
            className="absolute left-0 h-0.5 bg-govGreen -translate-y-1/2 top-1/2 z-0 matte-transition" 
          />

          {stages.map((stage, idx) => {
            const isCompleted = idx <= activeIndex;
            const isActive = idx === activeIndex;
            return (
              <div key={stage} className="relative z-10 flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border font-bold text-[10px] matte-transition ${
                  isActive
                    ? 'bg-govBlue border-govBlue text-white ring-4 ring-govBlue/10 animate-pulse'
                    : isCompleted
                    ? 'bg-govGreen border-govGreen text-white'
                    : 'bg-white border-govMatte-border text-govMatte-muted'
                }`}>
                  {isCompleted && !isActive ? '✓' : idx + 1}
                </div>
                <span className={`text-[9px] font-bold mt-2 hidden md:block whitespace-nowrap ${
                  isActive ? 'text-govBlue' : isCompleted ? 'text-govGreen' : 'text-govMatte-muted'
                }`}>
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Grid: Complaint Info & Timelines logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Detail Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2">Description & Incident Evidence</h3>
            <p className="text-xs font-medium leading-relaxed text-govMatte-text">{complaint.description}</p>
            
            {/* Image Before/After comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] text-govMatte-muted font-bold block uppercase tracking-wider">Before Field Action (Logged Photo)</span>
                <div className="w-full h-44 rounded-xl overflow-hidden border border-govMatte-border">
                  <img src={complaint.beforeImage} alt="Before damage view" className="w-full h-full object-cover" />
                </div>
              </div>

              {complaint.afterImage && (
                <div className="space-y-1">
                  <span className="text-[10px] text-govGreen font-bold block uppercase tracking-wider flex items-center">
                    <Sparkles className="w-3 h-3 text-govGreen mr-1 animate-pulse" />
                    <span>After Resolution (Verified Photo)</span>
                  </span>
                  <div className="w-full h-44 rounded-xl overflow-hidden border border-govGreen/20">
                    <img src={complaint.afterImage} alt="After repair view" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            {complaint.resolutionNotes && (
              <div className="p-3.5 bg-govGreen/5 border border-govGreen/20 rounded-xl space-y-1.5 mt-4 text-[11px]">
                <h4 className="font-extrabold text-govGreen uppercase tracking-wider">Resolution Closure remarks</h4>
                <p className="text-govMatte-text font-medium leading-relaxed">{complaint.resolutionNotes}</p>
              </div>
            )}
          </Card>

          {/* Stepper Timeline Logs */}
          <Card>
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2 mb-4">Operations Audit Log</h3>
            <div className="relative border-l-2 border-govMatte-border pl-4 space-y-6">
              {complaint.timeline.map((log, index) => (
                <div key={index} className="relative">
                  {/* Circle dot on line */}
                  <span className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-govBlue border-2 border-white ring-2 ring-govBlue/10" />
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-extrabold text-govBlue uppercase tracking-wide">{log.status}</span>
                      <span className="text-govMatte-muted">{new Date(log.date).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-govMatte-muted font-medium mt-0.5">{log.remarks}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Assigned Officer Sidebar */}
        <div className="space-y-6">
          <Card className="bg-slate-50/50">
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2 mb-3">System Routing Check</h3>
            <div className="space-y-2 text-[11px] font-semibold text-govMatte-text">
              <div className="flex items-center justify-between">
                <span className="text-govMatte-muted">Urgency Tier:</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                  complaint.priority === 'High' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>{complaint.priority} Priority</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-govMatte-muted">Assigned Department:</span>
                <span>{complaint.department}</span>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2">Responsible Officer</h3>
            
            {complaint.assignedOfficer ? (
              <div className="space-y-4 text-xs font-semibold text-govMatte-text">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-govGreen/10 flex items-center justify-center text-govGreen">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 leading-none">{complaint.assignedOfficer}</h4>
                    <span className="text-[10px] text-govMatte-muted mt-0.5 block">{complaint.department} Superintendent</span>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-govMatte-border/40 text-[11px]">
                  <div className="flex items-center space-x-2 text-govMatte-muted">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{complaint.assignedOfficerEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-govMatte-muted">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Dispatched Crew Assigned</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-2 text-govMatte-muted">
                <p className="text-xs font-bold">Awaiting Officer Assignment</p>
                <p className="text-[10px] text-govMatte-muted/70">Our system is screening coordinates. An administrator will route a field dispatch crew shortly.</p>
              </div>
            )}
          </Card>
        </div>

      </div>

    </div>
  );
}
