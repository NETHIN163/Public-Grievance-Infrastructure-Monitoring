import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  Bell,
  User,
  ShieldCheck,
  Users,
  UserCheck,
  TrendingUp,
  History,
  LogOut,
  FolderLock
} from 'lucide-react';
import { logout, setSidebarOpen } from '../../store/slices/authSlice';
import { addAuditLog } from '../../store/slices/securitySlice';

export default function Sidebar({ role, currentUser }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarOpen } = useSelector((state) => state.auth);

  const handleLogout = () => {
    if (currentUser) {
      dispatch(addAuditLog({
        userName: currentUser.name,
        role: currentUser.role,
        action: 'Logout (Sidebar)',
        oldValue: `Logged in as ${currentUser.name}`,
        newValue: 'Session Terminated'
      }));
    }
    dispatch(logout());
    navigate('/login');
  };

  const getCitizenLinks = () => [
    { name: 'Dashboard', path: '/citizen/dashboard', icon: LayoutDashboard },
    { name: 'Create Complaint', path: '/citizen/create-complaint', icon: FilePlus },
    { name: 'My Complaints', path: '/citizen/my-complaints', icon: ClipboardList },
    { name: 'Notifications', path: '/citizen/notifications', icon: Bell },
    { name: 'Profile', path: '/citizen/profile', icon: User }
  ];

  const getOfficerLinks = () => [
    { name: 'Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
    { name: 'Assigned Complaints', path: '/officer/assigned-complaints', icon: ClipboardList },
    { name: 'Update Status', path: '/officer/update-status', icon: ShieldCheck }
  ];

  const getAdminLinks = () => [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Users', path: '/admin/manage-users', icon: Users },
    { name: 'Manage Officers', path: '/admin/manage-officers', icon: UserCheck },
    { name: 'Complaint Monitoring', path: '/admin/complaint-monitoring', icon: ClipboardList },
    { name: 'Complaint Assignment', path: '/admin/complaint-assignment', icon: ShieldCheck },
    { name: 'Analytics', path: '/admin/analytics', icon: TrendingUp },
    { name: 'Security Dashboard', path: '/admin/security-dashboard', icon: FolderLock },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: History }
  ];

  const links =
    role === 'citizen'
      ? getCitizenLinks()
      : role === 'officer'
      ? getOfficerLinks()
      : role === 'admin'
      ? getAdminLinks()
      : [];

  return (
    <>
      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => dispatch(setSidebarOpen(false))}
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`w-64 matte-glass border-r border-govMatte-border/40 h-full flex flex-col justify-between p-4 flex-shrink-0
          fixed md:static top-16 bottom-0 left-0 z-30 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="space-y-6 flex-1 overflow-y-auto pr-1">
          
          {/* Portal Branding / Section Banner */}
          <div className="px-3 py-2 bg-govBlue/10 rounded-xl border border-govMatte-border text-center">
            <p className="text-[10px] uppercase font-bold tracking-wider text-govMatte-muted">Active Portal Workspace</p>
            <p className="text-xs font-bold text-govBlue-light capitalize mt-0.5">{role} Account</p>
          </div>

          {/* Links Navigation */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => dispatch(setSidebarOpen(false))}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold matte-transition ${
                      isActive
                        ? 'bg-govGreen/10 border border-govGreen/20 text-govGreen shadow-md shadow-govGreen/5'
                        : 'text-govMatte-text hover:bg-slate-800/40 hover:text-govGreen border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

      {/* Logout Action at the bottom */}
      <div className="mt-4 pt-4 border-t border-govMatte-border/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 matte-transition"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Logout Session</span>
        </button>
      </div>
      </aside>
    </>
  );
}
