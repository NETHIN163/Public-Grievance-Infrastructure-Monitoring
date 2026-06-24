import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Eye, AlertCircle, Pencil, Trash2, X,
  FileText, MapPin, Tag, Zap
} from 'lucide-react';
import { editComplaint, deleteComplaint } from '../../store/slices/complaintsSlice';
import { addAuditLog } from '../../store/slices/securitySlice';
import Card from '../../components/Shared/Card';
import Alert from '../../components/Shared/Alert';

const CATEGORIES = [
  'Roads & Highways',
  'Water Supply & Sanitation',
  'Electricity & Power',
  'Waste Management',
  'General Public Safety',
];

const PRIORITIES = ['Low', 'Medium', 'High'];


function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-govMatte-border/60 overflow-hidden">
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

export default function Monitoring() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { complaints } = useSelector((state) => state.complaints);

  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');


  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [targetComplaint, setTargetComplaint] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', category: '', priority: '', location: '' });

  const priorityOrder = { High: 0, Medium: 1, Low: 2 };

  const filteredGrievances = complaints
    .filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = catFilter === 'All' || c.category === catFilter;
      const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesCat && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      const priorityDiff = (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.date) - new Date(a.date);
    });

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 4000); };


  const openEdit = (c) => {
    setTargetComplaint(c);
    setEditForm({ title: c.title, category: c.category, priority: c.priority, location: c.location });
    setShowEditModal(true);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    dispatch(editComplaint({ id: targetComplaint.id, ...editForm }));
    dispatch(addAuditLog({
      userName: 'Administrator',
      role: 'admin',
      action: 'Complaint Record Edited',
      oldValue: `${targetComplaint.title} | ${targetComplaint.priority}`,
      newValue: `${editForm.title} | ${editForm.priority}`
    }));
    flash(`Complaint ${targetComplaint.id} updated successfully.`);
    setShowEditModal(false);
    setTargetComplaint(null);
  };


  const openDelete = (c) => { setTargetComplaint(c); setShowDeleteConfirm(true); };

  const handleDelete = () => {
    dispatch(deleteComplaint(targetComplaint.id));
    dispatch(addAuditLog({
      userName: 'Administrator',
      role: 'admin',
      action: 'Complaint Record Deleted',
      oldValue: `${targetComplaint.id}: ${targetComplaint.title}`,
      newValue: '—'
    }));
    flash(`Complaint ${targetComplaint.id} has been removed from the registry.`);
    setShowDeleteConfirm(false);
    setTargetComplaint(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center space-x-2">
        <AlertCircle className="w-6 h-6 text-govBlue" />
        <div>
          <h2 className="text-xl font-extrabold text-govBlue">National Grievance Monitor</h2>
          <p className="text-xs text-govMatte-muted">Consolidated dashboard registry of all submitted municipal complaints across zones.</p>
        </div>
      </div>

      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

      {/* Filter Controls */}

      <div className="bg-white p-4 border border-govMatte-border/60 rounded-2xl shadow-sm space-y-4">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Case ID, Complainant name or Subject details..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 text-xs font-medium bg-slate-50"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-govMatte-text">
          {[
            { label: 'Category Filter', value: catFilter, setter: setCatFilter, options: ['All', ...CATEGORIES] },
            { label: 'Priority Filter', value: priorityFilter, setter: setPriorityFilter, options: ['All', '🔴 High Urgency', '🟡 Medium Urgency', '🟢 Low Urgency'], rawValues: ['All', 'High', 'Medium', 'Low'] },
            { label: 'Work Status Filter', value: statusFilter, setter: setStatusFilter, options: ['All', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'] },
          ].map(({ label, value, setter, options, rawValues }) => (
            <div key={label} className="space-y-1">
              <label className="flex items-center text-govMatte-muted">
                <Filter className="w-3.5 h-3.5 mr-1" />{label}
              </label>
              <select
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-slate-50 text-xs font-semibold"
              >
                {options.map((opt, i) => (
                  <option key={opt} value={rawValues ? rawValues[i] : opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <Card>
        {filteredGrievances.length === 0 ? (
          <div className="text-center py-10 text-govMatte-muted">
            <p className="text-xs font-bold">No grievances match the specified parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs font-semibold text-govMatte-text">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-govMatte-border text-[10px] text-govMatte-muted uppercase font-extrabold bg-slate-50/50">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Complainant</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Area Zone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-govMatte-border/40">
                {filteredGrievances.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-govBlue">{c.id}</td>
                    <td className="py-3 px-4 text-slate-800">
                      <p className="font-bold">{c.citizenName}</p>
                      <span className="text-[9px] text-govMatte-muted block font-medium mt-0.5">{c.citizenPhone}</span>
                    </td>
                    <td className="py-3 px-4 text-govMatte-muted">{c.category}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase flex items-center space-x-1 w-fit ${c.priority === 'High'
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : c.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                        <span>{c.priority === 'High' ? '🔴' : c.priority === 'Medium' ? '🟡' : '🟢'}</span>
                        <span>{c.priority}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-govMatte-muted max-w-[120px] truncate">
                      {c.location.split(',').slice(-1)[0].trim()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${c.status === 'Resolved' || c.status === 'Closed'
                          ? 'bg-govGreen/10 text-govGreen border border-govGreen/20'
                          : c.status === 'In Progress' || c.status === 'Assigned'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100 animate-pulse'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>{c.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.status === 'Submitted' && (
                          <button
                            onClick={() => navigate('/admin/complaint-assignment', { state: { complaintId: c.id } })}
                            className="px-2 py-1 rounded-lg text-[9px] font-bold bg-govGreen/10 text-govGreen hover:bg-govGreen hover:text-white border border-govGreen/20 hover:border-transparent transition-all"
                          >
                            Assign
                          </button>
                        )}
                        {/* View */}
                        <button
                          onClick={() => navigate(`/admin/complaint/${c.id}`)}
                          title="View details"
                          className="p-1.5 rounded-lg border border-govBlue/20 text-govBlue hover:bg-govBlue hover:text-white transition-all"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        {/* Edit */}
                        <button
                          onClick={() => openEdit(c)}
                          title="Edit complaint"
                          className="p-1.5 rounded-lg border border-govMatte-border/60 text-govMatte-muted hover:bg-blue-50 hover:text-govBlue hover:border-govBlue/30 transition-all"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => openDelete(c)}
                          title="Delete complaint"
                          className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── Edit Complaint Modal ───────────────────────────────────────────── */}
      {showEditModal && targetComplaint && (
        <Modal title={`Edit Complaint — ${targetComplaint.id}`} onClose={() => setShowEditModal(false)}>
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
            <Field label="Category" icon={Tag}>
              <select
                value={editForm.category}
                onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                className={selectCls}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Priority Level" icon={Zap}>
              <select
                value={editForm.priority}
                onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                className={selectCls}
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
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
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 rounded-xl border border-govMatte-border text-xs font-bold text-govMatte-muted hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-govBlue text-white text-xs font-bold hover:bg-govBlue-light shadow shadow-govBlue/20 transition-all">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Confirmation Modal ──────────────────────────────────────── */}
      {showDeleteConfirm && targetComplaint && (
        <Modal title="Confirm Complaint Deletion" onClose={() => setShowDeleteConfirm(false)}>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
              <Trash2 className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-700">
                You are about to permanently delete complaint <strong>{targetComplaint.id}</strong>: "{targetComplaint.title}". This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-govMatte-border text-xs font-bold text-govMatte-muted hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow shadow-red-600/20 transition-all">Delete Record</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
