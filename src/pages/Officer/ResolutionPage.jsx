import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Clipboard, Upload } from 'lucide-react';
import { updateComplaintStatus } from '../../store/slices/complaintsSlice';
import { addAuditLog } from '../../store/slices/securitySlice';
import Card from '../../components/Shared/Card';
import Alert from '../../components/Shared/Alert';

export default function ResolutionPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.auth);
  const { complaints } = useSelector((state) => state.complaints);

  // Filter complaints assigned to this officer
  const myAssigned = complaints.filter(
    (c) => c.assignedOfficerEmail.toLowerCase() === (currentUser?.email || '').toLowerCase() && 
           c.status !== 'Resolved' && c.status !== 'Closed'
  );

  const [selectedId, setSelectedId] = useState(() => {
    if (location.state?.complaintId) {
      return location.state.complaintId;
    }
    return myAssigned.length > 0 ? myAssigned[0].id : '';
  });

  const [status, setStatus] = useState(() => {
    const initialId = location.state?.complaintId || (myAssigned.length > 0 ? myAssigned[0].id : '');
    if (initialId) {
      const activeCase = complaints.find(c => c.id === initialId);
      if (activeCase) {
        return activeCase.status === 'Assigned' ? 'In Progress' : activeCase.status;
      }
    }
    return 'In Progress';
  });

  const [remarks, setRemarks] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [afterImage, setAfterImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const activeComplaint = complaints.find((c) => c.id === selectedId);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAfterImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedId) {
      setError("Please select a valid complaint record.");
      return;
    }

    if (!activeComplaint || activeComplaint.assignedOfficerEmail.toLowerCase() !== currentUser.email.toLowerCase()) {
      setError("Unauthorized access: This grievance case file is not assigned to your account.");
      return;
    }

    if (status === 'Resolved' && (!resolutionNotes || !imagePreview)) {
      setError("Resolution notes and post-repair photographic evidence are mandatory to resolve cases.");
      return;
    }

    // Dispatch update
    dispatch(updateComplaintStatus({
      id: selectedId,
      status,
      remarks,
      resolutionNotes: status === 'Resolved' ? resolutionNotes : '',
      afterImage: status === 'Resolved' ? (imagePreview || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80') : ''
    }));

    // Log Audit
    dispatch(addAuditLog({
      userName: currentUser.name,
      role: currentUser.role,
      action: 'Grievance Work Status Transition',
      oldValue: `ID: ${selectedId}, Status: ${activeComplaint?.status}`,
      newValue: `Status: ${status}, Notes: ${remarks || 'None'}`
    }));

    setSuccess("Case updated successfully. Timelines updated across portals.");
    setTimeout(() => {
      navigate('/officer/assigned-complaints');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center space-x-2">
        <ShieldCheck className="w-6 h-6 text-govBlue" />
        <div>
          <h2 className="text-xl font-extrabold text-govBlue">Update Operations Status</h2>
          <p className="text-xs text-govMatte-muted">Document field inspection logs, modify statuses, and upload resolution proof.</p>
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
        {activeComplaint && activeComplaint.assignedOfficerEmail.toLowerCase() !== currentUser.email.toLowerCase() ? (
          <Card className="text-center py-10 space-y-3">
            <p className="text-sm font-bold text-red-500">Access Denied</p>
            <p className="text-xs text-govMatte-muted">You are not authorized to update status for this grievance case file.</p>
            <Link to="/officer/assigned-complaints" className="inline-block text-xs font-bold text-govGreen hover:underline">
              Return to Assignments List
            </Link>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-govMatte-text">
            <Card>
            <div className="space-y-4">
              
              {/* Select Case */}
              <div className="space-y-1">
                <label className="block text-govMatte-muted">Active Assignment Case File</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                    <Clipboard className="w-4 h-4" />
                  </span>
                  {location.state?.complaintId ? (
                    <input
                      type="text"
                      disabled
                      value={`${activeComplaint?.id} - ${activeComplaint?.title}`}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border bg-slate-100 text-govMatte-muted font-medium cursor-not-allowed text-xs"
                    />
                  ) : (
                    <select
                      value={selectedId}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        setSelectedId(nextId);
                        const nextCase = complaints.find(c => c.id === nextId);
                        if (nextCase) {
                          setStatus(nextCase.status === 'Assigned' ? 'In Progress' : nextCase.status);
                        }
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-white font-medium text-xs"
                    >
                      {myAssigned.length === 0 ? (
                        <option value="">No pending cases assigned</option>
                      ) : (
                        myAssigned.map(c => (
                          <option key={c.id} value={c.id}>{c.id} - {c.title}</option>
                        ))
                      )}
                    </select>
                  )}
                </div>
              </div>

              {/* Status Select */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-govMatte-muted">Transition Work Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-white font-medium text-xs"
                  >
                    <option value="In Progress">In Progress (Active Work)</option>
                    <option value="Resolved">Resolved (Closure Request)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-govMatte-muted">Telemetry Coordinates (Read-only)</label>
                  <div className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border bg-slate-100 text-govMatte-muted font-mono leading-relaxed text-[11px] font-bold">
                    {activeComplaint ? `${activeComplaint.latitude?.toFixed(4)}° N, ${activeComplaint.longitude?.toFixed(4)}° E` : 'Coordinates Unresolved'}
                  </div>
                </div>
              </div>

              {/* General remarks */}
              <div className="space-y-1">
                <label className="block text-govMatte-muted">Operational Progress Remarks (Appends to Timeline)</label>
                <input
                  type="text"
                  required
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Field crew inspecting drainage valve leakages."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium text-xs"
                />
              </div>

              {/* Resolution Parameters (Conditional) */}
              {status === 'Resolved' && (
                <div className="space-y-4 pt-4 border-t border-govMatte-border/40 animate-slide-up">
                  
                  <div className="space-y-1">
                    <label className="block text-govMatte-muted">Technical Resolution Notes</label>
                    <textarea
                      required
                      rows="4"
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Detail the actions taken: e.g. Patched asphalt, replaced street lighting fixture, flushed water pipelines..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-govMatte-muted">Upload Post-Repair Evidence</label>
                    <div className="border-2 border-dashed border-govMatte-border rounded-2xl p-6 text-center hover:border-govGreen/40 relative cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-govMatte-muted mx-auto" />
                        <p className="text-govMatte-muted text-[11px]">Click or drag post-repair photographs to attach (PNG, JPG max 5MB)</p>
                      </div>
                    </div>
                    {imagePreview && (
                      <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-govMatte-border">
                        <img src={imagePreview} alt="Resolution Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          </Card>

          <button
            type="submit"
            className="w-full py-2.5 bg-govBlue text-white font-bold rounded-xl hover:bg-govBlue-light shadow-md shadow-govBlue/15 flex items-center justify-center space-x-2 matte-transition text-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Submit Status Update</span>
          </button>
        </form>
        )}
      </div>

    </div>
  );
}
