import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Phone, Map, ShieldCheck, Key } from 'lucide-react';
import { updateProfile } from '../../store/slices/authSlice';
import { addAuditLog } from '../../store/slices/securitySlice';
import Card from '../../components/Shared/Card';
import Alert from '../../components/Shared/Alert';

export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    area: currentUser?.area || 'Coimbatore Central Zone'
  });
  
  const [passForm, setPassForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileSuccess, setProfileSuccess] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setProfileSuccess('');
    
    dispatch(updateProfile(form));
    dispatch(addAuditLog({
      userName: currentUser.name,
      role: currentUser.role,
      action: 'Profile Modified',
      oldValue: `Phone: ${currentUser.phone}, Area: ${currentUser.area}`,
      newValue: `Phone: ${form.phone}, Area: ${form.area}`
    }));

    setProfileSuccess("Account profile updated successfully.");
    setTimeout(() => setProfileSuccess(''), 4000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');

    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassError("New passwords do not match. Please verify.");
      return;
    }

    if (passForm.newPassword.length < 6) {
      setPassError("New password must be at least 6 characters long.");
      return;
    }

    dispatch(addAuditLog({
      userName: currentUser.name,
      role: currentUser.role,
      action: 'Credential Password Changed',
      oldValue: 'Password Hash Update',
      newValue: 'Successful Renewal'
    }));

    setPassSuccess("Account password changed successfully.");
    setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPassSuccess(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-govBlue">Profile & Workspace Settings</h2>
        <p className="text-xs text-govMatte-muted">Update your contact profile parameters and secure access key credentials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Profile details */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2 mb-4">Personal Information</h3>
            
            {profileSuccess && (
              <div className="mb-4">
                <Alert type="success" message={profileSuccess} />
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs font-semibold text-govMatte-text">
              
              <div className="space-y-1">
                <label className="block text-govMatte-muted">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-govMatte-muted">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border bg-slate-100 text-govMatte-muted font-medium cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-govMatte-muted">Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-govMatte-muted">Default Residential Area</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                    <Map className="w-4 h-4" />
                  </span>
                  <select
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-white font-medium"
                  >
                    <option value="Coimbatore Central Zone">Coimbatore Central Zone</option>
                    <option value="Coimbatore South Zone">Coimbatore South Zone</option>
                    <option value="Coimbatore West Zone">Coimbatore West Zone</option>
                    <option value="Coimbatore East Zone">Coimbatore East Zone</option>
                    <option value="Coimbatore North Zone">Coimbatore North Zone</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-govBlue text-white font-bold rounded-xl hover:bg-govBlue-light shadow-md shadow-govBlue/15 flex items-center justify-center space-x-2 matte-transition text-xs"
              >
                <span>Save Profile Parameters</span>
              </button>

            </form>
          </Card>
        </div>

        {/* Change Password */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider border-b border-govMatte-border/40 pb-2 mb-4">Security Key Update</h3>
            
            {passSuccess && (
              <div className="mb-4">
                <Alert type="success" message={passSuccess} />
              </div>
            )}
            {passError && (
              <div className="mb-4">
                <Alert type="error" message={passError} onClose={() => setPassError('')} />
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-4 text-xs font-semibold text-govMatte-text">
              
              <div className="space-y-1">
                <label className="block text-govMatte-muted">Current Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={passForm.oldPassword}
                    onChange={(e) => setPassForm({ ...passForm, oldPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-govMatte-muted">New Secure Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-govMatte-muted">Re-type New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                    <Key className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-govGreen text-white font-bold rounded-xl hover:bg-govGreen-light shadow-md shadow-govGreen/15 flex items-center justify-center space-x-2 matte-transition text-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm Credentials Update</span>
              </button>

            </form>
          </Card>
        </div>

      </div>

    </div>
  );
}
