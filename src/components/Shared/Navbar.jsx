import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, ShieldAlert, Monitor, ChevronDown, Sun, Moon, Menu, X } from 'lucide-react';
import { devSwitchRole, logout, toggleSidebar } from '../../store/slices/authSlice';
import { addAuditLog } from '../../store/slices/securitySlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, users } = useSelector((state) => state.auth);
  const { complaints } = useSelector((state) => state.complaints);
  const [profileOpen, setProfileOpen] = useState(false);
  const [guestMobileMenuOpen, setGuestMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Mock Notification generation from complaints
  const unassignedCount = complaints.filter(c => c.status === 'Submitted').length;
  const recentComplaints = complaints.slice(0, 3);

  const handleRoleChange = (role) => {
    const oldRole = currentUser ? currentUser.role : 'Public Guest';
    dispatch(devSwitchRole(role));
    setRoleMenuOpen(false);
    
    // Log audit
    const newSession = role === 'public' ? null : users.find(u => u.role === role);
    dispatch(addAuditLog({
      userName: newSession ? newSession.name : 'Guest User',
      role: role,
      action: 'Role Switched (Dev Widget)',
      oldValue: `Active Role: ${oldRole}`,
      newValue: `Active Role: ${role}`
    }));

    if (role === 'public') {
      navigate('/');
    } else if (role === 'citizen') {
      navigate('/citizen/dashboard');
    } else if (role === 'officer') {
      navigate('/officer/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      dispatch(addAuditLog({
        userName: currentUser.name,
        role: currentUser.role,
        action: 'Logout',
        oldValue: `Logged in as ${currentUser.name}`,
        newValue: 'Session Terminated'
      }));
    }
    dispatch(logout());
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full matte-glass shadow-sm border-b border-govMatte-border/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo and Emblem */}
        <div className="flex items-center space-x-3">
          {/* Hamburger Menu for Mobile */}
          <button
            onClick={() => {
              if (currentUser) {
                dispatch(toggleSidebar());
              } else {
                setGuestMobileMenuOpen(!guestMobileMenuOpen);
              }
            }}
            className="p-1.5 rounded-xl border border-govMatte-border hover:bg-slate-800/10 text-govMatte-text md:hidden focus:outline-none transition-all flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {guestMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <Link to={currentUser ? `/${currentUser.role}/dashboard` : "/"} className="flex items-center space-x-2.5">
            {/* Styled Government Emblem (Vector SVG) */}
            <div className="w-10 h-10 rounded-lg bg-govGreen/10 border border-govGreen/20 flex items-center justify-center text-govGreen shadow transform hover:scale-105 transition-transform">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="hidden md:block">
              <h1 className="text-sm font-extrabold text-govBlue tracking-wide uppercase leading-none">
                National Grievance Portal
              </h1>
              <span className="text-[10px] text-govGreen font-semibold tracking-wider uppercase block mt-0.5">
                Infrastructure Monitor
              </span>
            </div>
          </Link>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center space-x-4">

          {/* Developer Role Switcher Widget */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-govGreen/10 border border-govGreen/20 text-govGreen hover:bg-govGreen/20 transition-all duration-200 focus:outline-none"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Role: <strong className="uppercase">{currentUser ? currentUser.role : 'Public'}</strong></span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-govMatte-card border border-govMatte-border shadow-xl py-1 z-50 text-xs text-govMatte-text animate-slide-up">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-govMatte-muted tracking-wider border-b border-govMatte-border mb-1">
                  Simulation Settings
                </div>
                <button
                  onClick={() => handleRoleChange('public')}
                  className={`w-full text-left px-4 py-2 hover:bg-slate-800/50 hover:text-govGreen flex items-center space-x-2 ${!currentUser ? 'bg-slate-800/40 font-bold text-govGreen' : ''}`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>Public Guest Portal</span>
                </button>
                <button
                  onClick={() => handleRoleChange('citizen')}
                  className={`w-full text-left px-4 py-2 hover:bg-slate-800/50 hover:text-govGreen flex items-center space-x-2 ${currentUser?.role === 'citizen' ? 'bg-slate-800/40 font-bold text-govGreen' : ''}`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Citizen Portal</span>
                </button>
                <button
                  onClick={() => handleRoleChange('officer')}
                  className={`w-full text-left px-4 py-2 hover:bg-slate-800/50 hover:text-govGreen flex items-center space-x-2 ${currentUser?.role === 'officer' ? 'bg-slate-800/40 font-bold text-govGreen' : ''}`}
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span>Officer Portal</span>
                </button>
                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`w-full text-left px-4 py-2 hover:bg-slate-800/50 hover:text-govGreen flex items-center space-x-2 ${currentUser?.role === 'admin' ? 'bg-slate-800/40 font-bold text-govGreen' : ''}`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>Admin Control Panel</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Portal Navigation Links */}
          <div className="hidden lg:flex items-center space-x-4 border-r border-govMatte-border/60 pr-4">
            <Link to="/" className="text-xs font-semibold text-govMatte-text hover:text-govBlue transition-colors">Home</Link>
            <Link to="/about" className="text-xs font-semibold text-govMatte-text hover:text-govBlue transition-colors">About</Link>
            <Link to="/contact" className="text-xs font-semibold text-govMatte-text hover:text-govBlue transition-colors">Contact</Link>
          </div>

          {/* Notifications Bell */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-govMatte-muted hover:text-govGreen hover:bg-white/5 rounded-full relative transition-all"
              >
                <Bell className="w-5 h-5" />
                {unassignedCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unassignedCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-govMatte-card border border-govMatte-border shadow-xl z-50 overflow-hidden animate-slide-up">
                  <div className="p-3 border-b border-govMatte-border bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs font-bold text-govBlue-light">Recent Bulletins</span>
                    <Link to={`/${currentUser.role}/notifications`} className="text-[10px] text-govGreen font-bold hover:underline" onClick={() => setNotificationsOpen(false)}>
                      View All
                    </Link>
                  </div>
                  <div className="divide-y divide-govMatte-border max-h-64 overflow-y-auto">
                    {recentComplaints.map(c => (
                      <div key={c.id} className="p-3 hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${c.priority === 'High' ? 'bg-red-950/20 text-red-400 border-red-900/30' : 'bg-amber-950/20 text-amber-400 border-amber-900/30'
                            }`}>
                            {c.priority} Priority
                          </span>
                          <span className="text-[9px] text-govMatte-muted">
                            {new Date(c.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-govMatte-text mt-1 truncate">{c.title}</h4>
                        <p className="text-[10px] text-govMatte-muted mt-0.5 truncate">{c.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/5 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-full bg-govBlue text-white font-bold flex items-center justify-center text-xs shadow">
                  {currentUser.avatar}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-govBlue-light leading-none">{currentUser.name}</p>
                  <span className="text-[9px] text-govMatte-muted capitalize mt-0.5 block">{currentUser.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-govMatte-muted" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-govMatte-card border border-govMatte-border shadow-xl py-1.5 z-50 text-xs animate-slide-up">
                  <div className="px-4 py-2 border-b border-govMatte-border mb-1.5">
                    <p className="font-bold text-govBlue-light">{currentUser.name}</p>
                    <p className="text-[10px] text-govMatte-muted truncate mt-0.5">{currentUser.email}</p>
                  </div>

                  {currentUser.role === 'citizen' && (
                    <Link to="/citizen/profile" onClick={() => setProfileOpen(false)} className="px-4 py-2 hover:bg-slate-800/50 hover:text-govGreen flex items-center space-x-2 text-govMatte-text">
                      <User className="w-4 h-4 text-govMatte-muted" />
                      <span>Manage Profile</span>
                    </Link>
                  )}
                  {currentUser.role === 'admin' && (
                    <Link to="/admin/dashboard" onClick={() => setProfileOpen(false)} className="px-4 py-2 hover:bg-slate-800/50 hover:text-govGreen flex items-center space-x-2 text-govMatte-text">
                      <Monitor className="w-4 h-4 text-govMatte-muted" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-950/20 text-red-400 flex items-center space-x-2 border-t border-govMatte-border mt-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Secure Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="px-4 py-1.5 rounded-full text-xs font-semibold text-govBlue-light hover:bg-white/5 transition-all">
                Login
              </Link>
              <Link to="/register" className="px-4 py-1.5 rounded-full text-xs font-semibold bg-govGreen text-black hover:bg-govGreen-light transition-all shadow-md shadow-govGreen/10">
                Register
              </Link>
            </div>
          )}

        </div>

      </div>
      {/* Mobile Guest Menu Dropdown */}
      {!currentUser && guestMobileMenuOpen && (
        <div className="md:hidden border-t border-govMatte-border bg-white p-4 space-y-3 shadow-md animate-slide-up">
          <nav className="flex flex-col space-y-2">
            <Link to="/" onClick={() => setGuestMobileMenuOpen(false)} className="text-xs font-bold text-govMatte-text hover:text-govBlue py-2 border-b border-govMatte-border/30">Home</Link>
            <Link to="/about" onClick={() => setGuestMobileMenuOpen(false)} className="text-xs font-bold text-govMatte-text hover:text-govBlue py-2 border-b border-govMatte-border/30">About</Link>
            <Link to="/contact" onClick={() => setGuestMobileMenuOpen(false)} className="text-xs font-bold text-govMatte-text hover:text-govBlue py-2">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
