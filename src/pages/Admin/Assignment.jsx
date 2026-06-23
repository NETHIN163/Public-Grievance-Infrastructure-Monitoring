import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, AlertCircle, FileText } from 'lucide-react';
import { assignComplaint } from '../../store/slices/complaintsSlice';
import { addAuditLog } from '../../store/slices/securitySlice';
import Card from '../../components/Shared/Card';
import Alert from '../../components/Shared/Alert';

export default function Assignment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { users } = useSelector((state) => state.auth);
  const { complaints } = useSelector((state) => state.complaints);

  const [selectedComplaintId, setSelectedComplaintId] = useState('');
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Unassigned complaints (Submitted or Under Review status)
  const unassignedGrievances = complaints.filter(c => c.status === 'Submitted' || c.status === 'Under Review');

  // Ground officers list
  const officers = users.filter(u => u.role === 'officer' && u.status === 'active');

  useEffect(() => {
    // If navigated from monitoring list carrying a complaintId
    if (location.state?.complaintId) {
      setSelectedComplaintId(location.state.complaintId);
    } else if (unassignedGrievances.length > 0) {
      setSelectedComplaintId(unassignedGrievances[0].id);
    }
  }, [location.state, complaints]);

  const activeComplaint = complaints.find(c => c.id === selectedComplaintId);

  // Filter officers matching the active complaint's department
  const matchingOfficers = officers.filter(o => 
    !activeComplaint || o.department === activeComplaint.category
  );

  useEffect(() => {
    if (matchingOfficers.length > 0) {
      setSelectedOfficerId(matchingOfficers[0].id);
    } else if (officers.length > 0) {
      setSelectedOfficerId(officers[0].id); // Fallback to any officer
    } else {
      setSelectedOfficerId('');
    }
  }, [selectedComplaintId, activeComplaint]);

  const activeOfficer = users.find(u => u.id === selectedOfficerId);

  const handleAssign = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedComplaintId) {
      setError("Please select an incident ticket to dispatch.");
      return;
    }

    if (!selectedOfficerId) {
      setError("Please select an active ground officer to assign.");
      return;
    }

    // Assign
    dispatch(assignComplaint({
      id: selectedComplaintId,
      officerName: activeOfficer.name,
      officerEmail: activeOfficer.email,
      department: activeComplaint.category
    }));

    // Log Audit
    dispatch(addAuditLog({
      userName: 'Administrator',
      role: 'admin',
      action: 'Complaint Dispatched to Officer',
      oldValue: `ID: ${selectedComplaintId}, Officer: Unassigned`,
      newValue: `Officer: ${activeOfficer.name}, Department: ${activeComplaint.category}`
    }));

    setSuccess(`Grievance ${selectedComplaintId} assigned to Officer ${activeOfficer.name} successfully.`);
    setSelectedComplaintId('');
    setSelectedOfficerId('');
    
    setTimeout(() => {
      navigate('/admin/complaint-monitoring');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center space-x-2">
        <UserCheck className="w-6 h-6 text-govBlue" />
        <div>
          <h2 className="text-xl font-extrabold text-govBlue">Emergency Dispatch Control</h2>
          <p className="text-xs text-govMatte-muted">Route validated infrastructure complaints to qualified regional division officers.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      {success && (
        <div className="mb-4">
          <Alert type="success" message={success} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <form onSubmit={handleAssign} className="space-y-4 text-xs font-semibold text-govMatte-text">
          <Card>
            <div className="space-y-4">
              
              {/* Select Complaint */}
              <div className="space-y-1">
                <label className="block text-govMatte-muted font-bold">Outstanding Unassigned Grievance</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                    <FileText className="w-4 h-4" />
                  </span>
                  <select
                    value={selectedComplaintId}
                    onChange={(e) => setSelectedComplaintId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-white font-medium text-xs"
                  >
                    {unassignedGrievances.length === 0 ? (
                      <option value="">No unassigned complaints in queue</option>
                    ) : (
                      unassignedGrievances.map(c => (
                        <option key={c.id} value={c.id}>{c.id} - {c.title} ({c.category})</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Display Auto Category */}
              {activeComplaint && (
                <div className="p-4 bg-slate-50 border border-govMatte-border/60 rounded-2xl space-y-3.5">
                  <h4 className="text-[10px] uppercase font-bold text-govMatte-muted tracking-wider border-b border-govMatte-border pb-1.5">Grievance Summary Pre-check</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-semibold text-govMatte-text">
                    <p>Subject: <span className="text-slate-800 font-bold">{activeComplaint.title}</span></p>
                    <p>Sector Address: <span className="text-slate-800">{activeComplaint.location}</span></p>
                    <p>Category Tag: <span className="text-govBlue font-extrabold">{activeComplaint.category}</span></p>
                    <p>Severity Class: <span className="px-2 py-0.5 rounded text-[8px] font-extrabold bg-red-100 text-red-700">{activeComplaint.priority}</span></p>
                  </div>
                </div>
              )}

              {/* Select Ground Officer */}
              <div className="space-y-1">
                <label className="block text-govMatte-muted font-bold">Assign Division Superintendent</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                    <UserCheck className="w-4 h-4" />
                  </span>
                  <select
                    value={selectedOfficerId}
                    onChange={(e) => setSelectedOfficerId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-white font-medium text-xs"
                  >
                    {matchingOfficers.length === 0 ? (
                      <option value="">No active officers deployed to {activeComplaint?.category}</option>
                    ) : (
                      matchingOfficers.map(o => (
                        <option key={o.id} value={o.id}>{o.name} - {o.department} ({o.area})</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

            </div>
          </Card>

          <button
            type="submit"
            className="w-full py-2.5 bg-govBlue text-white font-bold rounded-xl hover:bg-govBlue-light shadow-md shadow-govBlue/15 flex items-center justify-center space-x-2 matte-transition text-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Confirm Crew Dispatch</span>
          </button>
        </form>
      </div>

    </div>
  );
}
