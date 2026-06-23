import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Users, Search, UserMinus, UserCheck, ShieldAlert,
  X, Plus, Pencil, Trash2, User, Phone, Map, Mail
} from 'lucide-react';
import { toggleBlockUser, addOfficer, editUser, deleteUser, register } from '../../store/slices/authSlice';
import { addAuditLog } from '../../store/slices/securitySlice';
import Card from '../../components/Shared/Card';
import Alert from '../../components/Shared/Alert';

const AREA_ZONES = [
  'Zone A - Central Delhi',
  'Zone B - South Delhi',
  'Zone C - West Delhi',
  'Zone D - East Delhi',
  'Zone E - North Delhi',
];

// ─── Reusable Modal Shell ──────────────────────────────────────────────────────
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

// ─── Field Component ───────────────────────────────────────────────────────────
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

const inputCls = "w-full pl-9 pr-3 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-slate-50 text-xs font-semibold text-slate-800 placeholder:text-govMatte-muted/60";
const selectCls = "w-full pl-9 pr-3 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-slate-50 text-xs font-semibold text-slate-800";

export default function UsersManager() {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  // Form state for Add
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', area: AREA_ZONES[0] });

  // Form state for Edit
  const [editForm, setEditForm] = useState({ name: '', phone: '', area: '' });

  const citizenUsers = users.filter(u => u.role === 'citizen');
  const filteredUsers = citizenUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phone || '').includes(searchTerm)
  );

  const flash = (msg, isError = false) => {
    if (isError) { setErrorMsg(msg); setTimeout(() => setErrorMsg(''), 4000); }
    else { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 4000); }
  };

  // ── Block / Unblock ───────────────────────────────────────────────────────
  const handleBlockToggle = (user) => {
    dispatch(toggleBlockUser(user.id));
    const wasBlocked = user.status === 'blocked';
    dispatch(addAuditLog({
      userName: 'Administrator',
      role: 'admin',
      action: wasBlocked ? 'User Suspends Revoked' : 'User Suspended',
      oldValue: `User: ${user.name}, Status: ${user.status}`,
      newValue: `Status: ${wasBlocked ? 'active' : 'blocked'}`
    }));
    flash(`${user.name} has been ${wasBlocked ? 'unblocked' : 'suspended'}.`);
    if (selectedUser?.id === user.id) {
      setSelectedUser(prev => ({ ...prev, status: wasBlocked ? 'active' : 'blocked' }));
    }
  };

  // ── Add Citizen ───────────────────────────────────────────────────────────
  const handleAdd = (e) => {
    e.preventDefault();
    const exists = users.find(u => u.email.toLowerCase() === addForm.email.toLowerCase());
    if (exists) { flash('Email already registered in the system.', true); return; }
    dispatch(register({ ...addForm }));
    dispatch(addAuditLog({
      userName: 'Administrator',
      role: 'admin',
      action: 'Citizen Account Created',
      oldValue: '—',
      newValue: `${addForm.name} (${addForm.email})`
    }));
    flash(`Citizen account for ${addForm.name} created successfully.`);
    setAddForm({ name: '', email: '', phone: '', area: AREA_ZONES[0] });
    setShowAddModal(false);
  };

  // ── Edit Citizen ──────────────────────────────────────────────────────────
  const openEdit = (user) => {
    setTargetUser(user);
    setEditForm({ name: user.name, phone: user.phone || '', area: user.area || AREA_ZONES[0] });
    setShowEditModal(true);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    dispatch(editUser({ id: targetUser.id, ...editForm }));
    dispatch(addAuditLog({
      userName: 'Administrator',
      role: 'admin',
      action: 'Citizen Profile Edited',
      oldValue: `${targetUser.name} | ${targetUser.phone} | ${targetUser.area}`,
      newValue: `${editForm.name} | ${editForm.phone} | ${editForm.area}`
    }));
    flash(`${editForm.name}'s profile updated successfully.`);
    if (selectedUser?.id === targetUser.id) {
      setSelectedUser(prev => ({ ...prev, ...editForm }));
    }
    setShowEditModal(false);
    setTargetUser(null);
  };

  // ── Delete Citizen ────────────────────────────────────────────────────────
  const openDelete = (user) => {
    setTargetUser(user);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    dispatch(deleteUser(targetUser.id));
    dispatch(addAuditLog({
      userName: 'Administrator',
      role: 'admin',
      action: 'Citizen Account Deleted',
      oldValue: `${targetUser.name} (${targetUser.email})`,
      newValue: '—'
    }));
    flash(`${targetUser.name}'s account has been permanently removed.`);
    if (selectedUser?.id === targetUser.id) setSelectedUser(null);
    setShowDeleteConfirm(false);
    setTargetUser(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-govBlue" />
          <div>
            <h2 className="text-xl font-extrabold text-govBlue">Citizen Registry Management</h2>
            <p className="text-xs text-govMatte-muted">Add, edit, suspend, or remove citizen accounts.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-govBlue text-white text-xs font-bold rounded-xl shadow shadow-govBlue/20 hover:bg-govBlue-light transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Citizen</span>
        </button>
      </div>

      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}
      {errorMsg && <Alert type="error" message={errorMsg} onClose={() => setErrorMsg('')} />}

      {/* Search Bar */}
      <div className="flex items-center bg-white p-4 border border-govMatte-border/60 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search citizens by name, email or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 text-xs font-medium bg-slate-50"
          />
        </div>
      </div>

      {/* Grid: Table + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Table Panel */}
        <div className="lg:col-span-2">
          <Card>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-10 text-govMatte-muted">
                <p className="text-xs font-bold">No citizens matching your query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto text-xs font-semibold text-govMatte-text">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-govMatte-border text-[10px] text-govMatte-muted uppercase font-extrabold bg-slate-50/50">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Area Zone</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-govMatte-border/40">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-50/40' : ''}`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="py-3 px-4 font-bold text-slate-800">{user.name}</td>
                        <td className="py-3 px-4 text-govMatte-muted">{user.email}</td>
                        <td className="py-3 px-4 text-govMatte-muted">{user.area}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                            user.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-red-50 text-red-700 border border-red-100'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit */}
                            <button
                              onClick={() => openEdit(user)}
                              title="Edit citizen"
                              className="p-1.5 rounded-lg border border-govMatte-border/60 text-govMatte-muted hover:bg-blue-50 hover:text-govBlue hover:border-govBlue/30 transition-all"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            {/* Block / Unblock */}
                            <button
                              onClick={() => handleBlockToggle(user)}
                              title={user.status === 'active' ? 'Suspend' : 'Activate'}
                              className={`p-1.5 rounded-lg border transition-all ${
                                user.status === 'active'
                                  ? 'border-amber-100 text-amber-600 hover:bg-amber-50'
                                  : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              {user.status === 'active' ? <UserMinus className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => openDelete(user)}
                              title="Delete citizen"
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
        </div>

        {/* Detail Inspector */}
        <div>
          {selectedUser ? (
            <Card className="space-y-4 relative animate-fade-in border-govBlue/20">
              <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-govMatte-muted hover:text-govMatte-text">
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2">User Inspector</h3>
              <div className="flex items-center space-x-3 pb-2">
                <div className="w-12 h-12 rounded-full bg-govBlue text-white font-extrabold text-sm flex items-center justify-center shadow">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm leading-none">{selectedUser.name}</h4>
                  <span className="text-[10px] text-govMatte-muted capitalize mt-1 block">Role: {selectedUser.role}</span>
                </div>
              </div>
              <div className="space-y-3.5 text-xs font-semibold text-govMatte-text pt-2 border-t border-govMatte-border/40">
                {[
                  ['Email', selectedUser.email],
                  ['Telephone', selectedUser.phone || '—'],
                  ['Area Zone', selectedUser.area],
                  ['Registered On', selectedUser.dateJoined],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-govMatte-muted">{label}:</span>
                    <span className="text-slate-800 truncate max-w-[160px]">{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <span className="text-govMatte-muted">Security status:</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                    selectedUser.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>{selectedUser.status}</span>
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => openEdit(selectedUser)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border border-govBlue/30 text-govBlue hover:bg-govBlue hover:text-white transition-all flex items-center justify-center space-x-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" /><span>Edit</span>
                </button>
                <button
                  onClick={() => handleBlockToggle(selectedUser)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 ${
                    selectedUser.status === 'active'
                      ? 'bg-red-600 hover:bg-red-700 text-white border-transparent shadow shadow-red-600/10'
                      : 'bg-govGreen hover:bg-govGreen-light text-white border-transparent shadow shadow-govGreen/10'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{selectedUser.status === 'active' ? 'Suspend' : 'Activate'}</span>
                </button>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-10 bg-slate-50/50 border-dashed">
              <p className="text-xs font-bold text-govMatte-muted">No Citizen Selected</p>
              <p className="text-[10px] text-govMatte-muted/70 mt-1">Click any row to inspect details.</p>
            </Card>
          )}
        </div>
      </div>

      {/* ── Add Citizen Modal ─────────────────────────────────────────────── */}
      {showAddModal && (
        <Modal title="Add New Citizen Account" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <Field label="Full Name" icon={User}>
              <input type="text" required value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g. Ravi Kumar" className={inputCls} />
            </Field>
            <Field label="Email Address" icon={Mail}>
              <input type="email" required value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} placeholder="citizen@email.com" className={inputCls} />
            </Field>
            <Field label="Mobile Number" icon={Phone}>
              <input type="tel" required value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} placeholder="+91 98765 43210" className={inputCls} />
            </Field>
            <Field label="Area Zone" icon={Map}>
              <select value={addForm.area} onChange={e => setAddForm({ ...addForm, area: e.target.value })} className={selectCls}>
                {AREA_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-xl border border-govMatte-border text-xs font-bold text-govMatte-muted hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-govBlue text-white text-xs font-bold hover:bg-govBlue-light shadow shadow-govBlue/20 transition-all">Create Account</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Edit Citizen Modal ────────────────────────────────────────────── */}
      {showEditModal && targetUser && (
        <Modal title={`Edit — ${targetUser.name}`} onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleEdit} className="space-y-4">
            <Field label="Full Name" icon={User}>
              <input type="text" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Mobile Number" icon={Phone}>
              <input type="tel" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Area Zone" icon={Map}>
              <select value={editForm.area} onChange={e => setEditForm({ ...editForm, area: e.target.value })} className={selectCls}>
                {AREA_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 rounded-xl border border-govMatte-border text-xs font-bold text-govMatte-muted hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-govBlue text-white text-xs font-bold hover:bg-govBlue-light shadow shadow-govBlue/20 transition-all">Save Changes</button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      {showDeleteConfirm && targetUser && (
        <Modal title="Confirm Account Deletion" onClose={() => setShowDeleteConfirm(false)}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
              <Trash2 className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-xs font-semibold text-red-700">
                You are about to permanently delete <strong>{targetUser.name}</strong>'s account. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-govMatte-border text-xs font-bold text-govMatte-muted hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow shadow-red-600/20 transition-all">Delete Permanently</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
