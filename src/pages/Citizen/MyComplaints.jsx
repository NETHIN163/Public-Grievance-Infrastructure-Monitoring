import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Filter, Search, Calendar, ChevronRight,
  Pencil, X, FileText, MapPin, Tag, Zap, Info
} from 'lucide-react';
import { editComplaint } from '../../store/slices/complaintsSlice';
import Card from '../../components/Shared/Card';
import Alert from '../../components/Shared/Alert';

const CATEGORIES = [
  'Roads & Highways',
  'Water Supply & Sanitation',
  'Electricity & Power',
  'Waste Management',
  'General Public Safety',
];

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 border border-govMatte-border/60 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-govMatte-border/40 bg-slate-50/60">
          <h3 className="text-sm font-extrabold text-govBlue tracking-wide">{title}</h3>
          <button onClick={onClose} className="text-govMatte-muted hover:text-red-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-bold text-govMatte-muted uppercase tracking-wider">{label}</label>
      <div className="relative">
        {Icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-govMatte-muted">
            <Icon className="w-3.5 h-3.5" />
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

const inputCls = "w-full pl-9 pr-3 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-slate-50 text-xs font-semibold text-slate-800";
const selectCls = "w-full pl-9 pr-3 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-slate-50 text-xs font-semibold text-slate-800";

export default function MyComplaints() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const { complaints } = useSelector((state) => state.complaints);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [targetComplaint, setTargetComplaint] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '', description: '', category: '', location: '', priority: 'Medium'
  });

  const citizenComplaints = complaints.filter(
    (c) => c.citizenEmail.toLowerCase() === (currentUser?.email || '').toLowerCase()
  );

  const filteredComplaints = citizenComplaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 4000); };

  const openEdit = (c) => {
    setTargetComplaint(c);
    setEditForm({
      title: c.title,
      description: c.description,
      category: c.category,
      location: c.location,
      priority: c.priority
    });
    setShowEditModal(true);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    dispatch(editComplaint({ id: targetComplaint.id, ...editForm }));
    flash(`Complaint ${targetComplaint.id} updated successfully.`);
    setShowEditModal(false);
    setTargetComplaint(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center space-x-2">
        <ClipboardList className="w-6 h-6 text-govBlue" />
        <div>
          <h2 className="text-xl font-extrabold text-govBlue">My Grievance Registry</h2>
          <p className="text-xs text-govMatte-muted">View all reported cases and edit pending submissions.</p>
        </div>
      </div>

      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 border border-govMatte-border/60 rounded-2xl shadow-sm">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Complaint ID or Subject..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 text-xs font-medium bg-slate-50"
          />
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-govMatte-muted flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-3.5 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 text-xs font-semibold bg-slate-50"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Complaint Cards */}
      {filteredComplaints.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-xs font-bold text-govMatte-muted">No grievances match the search filters.</p>
          <p className="text-[10px] text-govMatte-muted/70 mt-1">Try adapting your query parameters.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredComplaints.map((c) => (
            <Card key={c.id} className="flex flex-col justify-between hover:border-govBlue/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-govMatte-border/40 pb-2">
                  <span className="text-[10px] font-mono font-bold text-govBlue">{c.id}</span>
                  <div className="flex items-center gap-2">
                    {/* Edit button — only visible for Submitted complaints */}
                    {c.status === 'Submitted' && (
                      <button
                        onClick={() => openEdit(c)}
                        title="Edit this complaint (only available while pending)"
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg border border-govBlue/20 text-govBlue bg-govBlue/5 hover:bg-govBlue hover:text-white text-[9px] font-bold transition-all"
                      >
                        <Pencil className="w-2.5 h-2.5" />
                        <span>Edit</span>
                      </button>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      c.status === 'Resolved' || c.status === 'Closed'
                        ? 'bg-govGreen/10 text-govGreen border border-govGreen/20'
                        : c.status === 'In Progress' || c.status === 'Assigned'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100 animate-pulse'
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs font-extrabold text-slate-800 line-clamp-1">{c.title}</h3>
                  <p className="text-[10px] text-govMatte-muted line-clamp-2 leading-relaxed">{c.description}</p>
                </div>

                <div className="flex items-center gap-3 text-[10px] text-govMatte-muted font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />{c.category}
                  </span>
                  <span className={`flex items-center gap-1 font-bold ${
                    c.priority === 'High' ? 'text-red-600' : c.priority === 'Medium' ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    <Zap className="w-3 h-3" />{c.priority}
                  </span>
                </div>

                {/* Hint for non-editable complaints */}
                {c.status !== 'Submitted' && (
                  <div className="flex items-center gap-1.5 text-[9px] text-govMatte-muted/70 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-govMatte-border/30">
                    <Info className="w-3 h-3 flex-shrink-0" />
                    <span>Editing is only available for pending (Submitted) complaints.</span>
                  </div>
                )}
              </div>

              <div className="border-t border-govMatte-border/40 pt-3 flex items-center justify-between mt-4">
                <div className="flex items-center space-x-1 text-[10px] text-govMatte-muted font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(c.date).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => navigate(`/citizen/complaint/${c.id}`)}
                  className="px-3.5 py-1.5 rounded-xl bg-govBlue/5 hover:bg-govBlue text-govBlue hover:text-white text-[10px] font-bold border border-govBlue/10 hover:border-transparent flex items-center space-x-1.5 transition-all"
                >
                  <span>Detail Tracker</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Edit Complaint Modal ──────────────────────────────────────────── */}
      {showEditModal && targetComplaint && (
        <Modal title={`Edit Complaint — ${targetComplaint.id}`} onClose={() => setShowEditModal(false)}>
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 mb-4">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-[11px] font-semibold text-amber-700">
              You can only edit complaints that are still <strong>Submitted</strong> and not yet assigned to an officer.
            </p>
          </div>
          <form onSubmit={handleEdit} className="space-y-4">
            <Field label="Title / Subject" icon={FileText}>
              <input
                type="text"
                required
                value={editForm.title}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Description" icon={FileText}>
              <textarea
                required
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-slate-50 text-xs font-semibold text-slate-800 resize-none"
              />
            </Field>
            <Field label="Category" icon={Tag}>
              <select
                value={editForm.category}
                onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                className={selectCls}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </Field>
            <Field label="Location" icon={MapPin}>
              <input
                type="text"
                required
                value={editForm.location}
                onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Priority" icon={Zap}>
              <select
                value={editForm.priority}
                onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                className={selectCls}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 rounded-xl border border-govMatte-border text-xs font-bold text-govMatte-muted hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-govBlue text-white text-xs font-bold hover:bg-govBlue-light shadow shadow-govBlue/20 transition-all">Update Complaint</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
