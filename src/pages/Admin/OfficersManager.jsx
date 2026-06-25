import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserCheck, PlusCircle, Search, Edit2, ShieldAlert, UserPlus } from 'lucide-react';
import { addOfficer, editOfficer } from '../../store/slices/authSlice';
import { addAuditLog } from '../../store/slices/securitySlice';
import Card from '../../components/Shared/Card';
import Alert from '../../components/Shared/Alert';

export default function OfficersManager() {
  const dispatch = useDispatch();
  const { users, error } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Roads & Highways',
    area: 'Coimbatore Central Zone'
  });

  const [success, setSuccess] = useState('');
  const [localError, setLocalError] = useState('');

  // Extract officers
  const officersList = users.filter(u => u.role === 'officer');

  const filteredOfficers = officersList.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOfficer = (e) => {
    e.preventDefault();
    setSuccess('');
    setLocalError('');

    if (!form.name || !form.email || !form.phone) {
      setLocalError("Please input all mandatory parameters.");
      return;
    }

    // Dispatch
    dispatch(addOfficer(form));
    
    if (error) {
      setLocalError(error);
      return;
    }

    // Audit Log
    dispatch(addAuditLog({
      userName: 'Administrator',
      role: 'admin',
      action: 'Officer Account Registered',
      oldValue: 'N/A',
      newValue: `Officer: ${form.name}, Dept: ${form.department}, Area: ${form.area}`
    }));

    setSuccess(`Officer ${form.name} registered and deployed to ${form.department}.`);
    setForm({ name: '', email: '', phone: '', department: 'Roads & Highways', area: 'Coimbatore Central Zone' });
    setShowAddForm(false);
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleEditClick = (officer) => {
    setEditingOfficer(officer);
    setForm({
      name: officer.name,
      email: officer.email,
      phone: officer.phone,
      department: officer.department,
      area: officer.area
    });
    setShowAddForm(true);
  };

  const handleUpdateOfficer = (e) => {
    e.preventDefault();
    setSuccess('');
    setLocalError('');

    dispatch(editOfficer({ id: editingOfficer.id, ...form }));
    
    // Audit Log
    dispatch(addAuditLog({
      userName: 'Administrator',
      role: 'admin',
      action: 'Officer Parameters Modified',
      oldValue: `Officer ID: ${editingOfficer.id}`,
      newValue: `Updated details: Dept: ${form.department}, Area: ${form.area}`
    }));

    setSuccess(`Officer ${form.name} workspace details updated.`);
    setEditingOfficer(null);
    setForm({ name: '', email: '', phone: '', department: 'Roads & Highways', area: 'Coimbatore Central Zone' });
    setShowAddForm(false);
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-6 h-6 text-govBlue" />
          <div>
            <h2 className="text-xl font-extrabold text-govBlue">Field Officers Roster</h2>
            <p className="text-xs text-govMatte-muted">Deploy division superintendents, edit area jurisdictions, and monitor staff rosters.</p>
          </div>
        </div>

        {!showAddForm && (
          <button
            onClick={() => { setShowAddForm(true); setEditingOfficer(null); }}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-govGreen hover:bg-govGreen-light text-white shadow transition-all text-center"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Deploy Ground Officer</span>
          </button>
        )}
      </div>

      {(success || localError) && (
        <Alert type={success ? 'success' : 'error'} message={success || localError} onClose={() => { setSuccess(''); setLocalError(''); }} />
      )}

      {showAddForm ? (
        <Card className="max-w-2xl animate-slide-up border-govBlue/20">
          <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2 mb-4">
            {editingOfficer ? 'Edit Officer Jurisdiction' : 'Deploy Officer Profile'}
          </h3>

          <form onSubmit={editingOfficer ? handleUpdateOfficer : handleAddOfficer} className="space-y-4 text-xs font-semibold text-govMatte-text">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-govMatte-muted">Officer Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-govMatte-muted">Secure Email Address</label>
                <input
                  type="email"
                  required
                  disabled={!!editingOfficer}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ramesh@gov.in"
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 font-medium ${
                    editingOfficer ? 'bg-slate-100 cursor-not-allowed text-govMatte-muted' : 'bg-govMatte-bg/30'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-govMatte-muted">Helpline Mobile</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-govMatte-muted">Responsible Department</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-white font-medium"
                >
                  <option value="Roads & Highways">Roads & Highways</option>
                  <option value="Water Supply & Sanitation">Water & Sanitation</option>
                  <option value="Electricity & Power">Electricity & Power</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="General Public Safety">General Public Safety</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-govMatte-muted">Assigned Area Jurisdiction</label>
                <select
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-white font-medium"
                >
                  <option value="Coimbatore Central Zone">Coimbatore Central Zone</option>
                  <option value="Coimbatore South Zone">Coimbatore South Zone</option>
                  <option value="Coimbatore West Zone">Coimbatore West Zone</option>
                  <option value="Coimbatore East Zone">Coimbatore East Zone</option>
                  <option value="Coimbatore North Zone">Coimbatore North Zone</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-govBlue text-white font-bold rounded-xl hover:bg-govBlue-light shadow transition-all"
              >
                {editingOfficer ? 'Update Jurisdiction' : 'Confirm Deployment'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingOfficer(null);
                  setForm({ name: '', email: '', phone: '', department: 'Roads & Highways', area: 'Coimbatore Central Zone' });
                }}
                className="px-6 py-2.5 bg-white border border-govMatte-border text-govMatte-text font-bold rounded-xl hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="flex items-center bg-white dark:bg-govMatte-darkCard p-4 border border-govMatte-border/60 rounded-2xl shadow-sm">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search officers by name, email, or department..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 text-xs font-medium bg-govMatte-bg/30"
              />
            </div>
          </div>

          {/* Roster Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOfficers.map(o => (
              <Card key={o.id} className="flex flex-col justify-between h-48 hover:border-govBlue/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-govMatte-border/40 pb-2">
                    <span className="text-[10px] font-mono font-bold text-govMatte-muted">ID: {o.id}</span>
                    <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-emerald-50 text-emerald-700">
                      {o.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-govGreen/10 flex items-center justify-center text-govGreen font-bold text-xs shadow-sm">
                      {o.avatar}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold text-slate-800 leading-none">{o.name}</h4>
                      <span className="text-[9px] text-govGreen font-bold uppercase tracking-wider block mt-0.5">{o.department}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-govMatte-muted space-y-1 pt-1.5 leading-tight font-semibold">
                    <p>Jurisdiction: <strong className="text-slate-700">{o.area}</strong></p>
                    <p>Contact: <strong className="text-slate-700">{o.phone}</strong></p>
                  </div>
                </div>

                <div className="border-t border-govMatte-border/40 pt-2 flex justify-end mt-4">
                  <button
                    onClick={() => handleEditClick(o)}
                    className="px-3 py-1 rounded-lg bg-govBlue/5 hover:bg-govBlue text-govBlue hover:text-white border border-govBlue/10 hover:border-transparent transition-all font-bold text-[10px] flex items-center space-x-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
