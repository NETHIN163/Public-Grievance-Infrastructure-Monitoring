import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, User, Mail, Phone, Calendar, PenSquare } from 'lucide-react';
import Card from '../../components/Shared/Card';

export default function OfficerComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints } = useSelector((state) => state.complaints);
  const { currentUser } = useSelector((state) => state.auth);

  const complaint = complaints.find((c) => c.id === id);

  const isUnauthorized = currentUser && complaint && complaint.assignedOfficerEmail.toLowerCase() !== currentUser.email.toLowerCase();

  if (!complaint || isUnauthorized) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <h2 className="text-lg font-bold text-govBlue">Complaint Record Not Found</h2>
        <p className="text-xs text-govMatte-muted">Please check the grievance ID and try again.</p>
        <Link to="/officer/assigned-complaints" className="inline-block text-xs font-bold text-govGreen hover:underline">
          Return to Assignments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 animate-fade-in">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link to="/officer/assigned-complaints" className="inline-flex items-center space-x-1 text-xs font-bold text-govMatte-muted hover:text-govBlue transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Assignments</span>
        </Link>
        
        {complaint.status !== 'Resolved' && complaint.status !== 'Closed' && (
          <button
            onClick={() => navigate('/officer/update-status', { state: { complaintId: complaint.id } })}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-govGreen hover:bg-govGreen-light text-white transition-all shadow shadow-govGreen/15"
          >
            <PenSquare className="w-4 h-4" />
            <span>Update Case Status</span>
          </button>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-govMatte-border/40 pb-4 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold bg-govBlue/5 px-2 py-0.5 rounded text-govBlue border border-govBlue/10">{complaint.id}</span>
          <h2 className="text-lg font-extrabold text-govBlue mt-1.5">{complaint.title}</h2>
          <div className="flex items-center space-x-3 text-[10px] text-govMatte-muted font-bold mt-1">
            <span>{complaint.category}</span>
            <span>•</span>
            <span className="flex items-center"><MapPin className="w-3 h-3 mr-0.5" />{complaint.location}</span>
          </div>
        </div>

        <div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
            complaint.status === 'Resolved' || complaint.status === 'Closed'
              ? 'bg-govGreen/10 text-govGreen border border-govGreen/20'
              : complaint.status === 'In Progress'
              ? 'bg-blue-50 text-blue-700 border border-blue-100 animate-pulse'
              : 'bg-amber-50 text-amber-700 border border-amber-100'
          }`}>
            {complaint.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="space-y-4">
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2">Grievance Information</h3>
            <p className="text-xs font-medium leading-relaxed text-govMatte-text">{complaint.description}</p>
            
            <div className="pt-2">
              <span className="text-[10px] text-govMatte-muted font-bold block uppercase tracking-wider mb-2">Before Repair Evidence (Citizen Upload)</span>
              <div className="w-full h-60 rounded-xl overflow-hidden border border-govMatte-border">
                <img src={complaint.beforeImage} alt="Incident Site Before" className="w-full h-full object-cover" />
              </div>
            </div>

            {complaint.afterImage && (
              <div className="pt-2">
                <span className="text-[10px] text-govGreen font-bold block uppercase tracking-wider mb-2">After Repair Evidence (Officer Upload)</span>
                <div className="w-full h-60 rounded-xl overflow-hidden border border-govGreen/25">
                  <img src={complaint.afterImage} alt="Incident Site After" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </Card>

          {/* Stepper Timeline Logs */}
          <Card>
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2 mb-4">Operations Audit Log</h3>
            <div className="relative border-l-2 border-govMatte-border pl-4 space-y-6">
              {complaint.timeline.map((log, index) => (
                <div key={index} className="relative">
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

        {/* Citizen Details & Map coordinates */}
        <div className="space-y-6">
          
          <Card className="space-y-4">
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2">Citizen Contact Details</h3>
            
            <div className="space-y-4 text-xs font-semibold text-govMatte-text">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-govBlue/5 flex items-center justify-center text-govBlue">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 leading-none">{complaint.citizenName}</h4>
                  <span className="text-[9px] text-govMatte-muted mt-0.5 block">Complainant ID Verified</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-govMatte-border/40 text-[11px]">
                <div className="flex items-center space-x-2 text-govMatte-muted">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{complaint.citizenEmail}</span>
                </div>
                <div className="flex items-center space-x-2 text-govMatte-muted">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{complaint.citizenPhone}</span>
                </div>
                <div className="flex items-center space-x-2 text-govMatte-muted">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Filed: {new Date(complaint.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-3 bg-slate-50/50">
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2">Telemetry Coordinates</h3>
            <div className="space-y-2 text-[11px] font-semibold text-govMatte-text">
              <div className="flex items-center justify-between">
                <span className="text-govMatte-muted">Latitude:</span>
                <span className="font-mono">{complaint.latitude?.toFixed(4) || '28.6139'}° N</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-govMatte-muted">Longitude:</span>
                <span className="font-mono">{complaint.longitude?.toFixed(4) || '77.2090'}° E</span>
              </div>
              <div className="flex items-center justify-between border-t border-govMatte-border/40 pt-2 text-[10px]">
                <span className="text-govMatte-muted">Priority Class:</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                  complaint.priority === 'High' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                }`}>{complaint.priority}</span>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
