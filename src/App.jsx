import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from './components/Shared/Navbar';
import Sidebar from './components/Shared/Sidebar';

// Public Pages
import Home from './pages/Public/Home';
import About from './pages/Public/About';
import Contact from './pages/Public/Contact';
import Login from './pages/Public/Login';
import Register from './pages/Public/Register';

import ForgotPassword from './pages/Public/ForgotPassword';
import ResetPassword from './pages/Public/ResetPassword';
import Legal from './pages/Public/Legal';
import NotFound from './pages/Public/NotFound';

// Citizen Pages
import CitizenDashboard from './pages/Citizen/Dashboard';
import CreateComplaint from './pages/Citizen/CreateComplaint';
import MyComplaints from './pages/Citizen/MyComplaints';
import ComplaintDetails from './pages/Citizen/ComplaintDetails';
import Notifications from './pages/Citizen/Notifications';
import Profile from './pages/Citizen/Profile';

// Officer Pages
import OfficerDashboard from './pages/Officer/Dashboard';
import AssignedList from './pages/Officer/AssignedList';
import OfficerComplaintDetails from './pages/Officer/ComplaintDetails';
import ResolutionPage from './pages/Officer/ResolutionPage';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import UsersManager from './pages/Admin/UsersManager';
import OfficersManager from './pages/Admin/OfficersManager';
import Monitoring from './pages/Admin/Monitoring';
import Assignment from './pages/Admin/Assignment';
import Analytics from './pages/Admin/Analytics';
import SecurityDashboard from './pages/Cybersecurity/SecurityDashboard';
import AuditLogs from './pages/Cybersecurity/AuditLogs';

// Portal Workspace Layout Wrapper
function PortalLayout({ children, role }) {
  const { currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== role) {
    // Redirect if they have incorrect role
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }

  return (
    <div className="flex h-full bg-govMatte-bg overflow-hidden relative">
      <Sidebar role={role} currentUser={currentUser} />
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto h-full min-w-0">
        {children}
      </main>
    </div>
  );
}

// Global Layout
export default function App() {
  const { currentUser } = useSelector((state) => state.auth);

  return (
    <div className="h-screen flex flex-col bg-govMatte-bg transition-colors duration-200 overflow-hidden">
      <Navbar />
      
      {/* Route mapping */}
      <div className="flex-1 w-full min-h-0 overflow-y-auto">
        <Routes>
          {/* Public Pages — redirect logged-in users to their dashboard */}
          <Route
            path="/"
            element={
              currentUser
                ? <Navigate to={`/${currentUser.role}/dashboard`} replace />
                : <Home />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/login"
            element={
              currentUser
                ? <Navigate to={`/${currentUser.role}/dashboard`} replace />
                : <Login />
            }
          />
          <Route
            path="/register"
            element={
              currentUser
                ? <Navigate to={`/${currentUser.role}/dashboard`} replace />
                : <Register />
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms" element={<Legal defaultTab="terms" />} />
          <Route path="/privacy" element={<Legal defaultTab="privacy" />} />
          <Route path="/cookies" element={<Legal defaultTab="cookies" />} />

          {/* Citizen Portal Pages (Guarded) */}
          <Route
            path="/citizen/dashboard"
            element={<PortalLayout role="citizen"><CitizenDashboard /></PortalLayout>}
          />
          <Route
            path="/citizen/create-complaint"
            element={<PortalLayout role="citizen"><CreateComplaint /></PortalLayout>}
          />
          <Route
            path="/citizen/my-complaints"
            element={<PortalLayout role="citizen"><MyComplaints /></PortalLayout>}
          />
          <Route
            path="/citizen/complaint/:id"
            element={<PortalLayout role="citizen"><ComplaintDetails /></PortalLayout>}
          />
          <Route
            path="/citizen/notifications"
            element={<PortalLayout role="citizen"><Notifications /></PortalLayout>}
          />
          <Route
            path="/citizen/profile"
            element={<PortalLayout role="citizen"><Profile /></PortalLayout>}
          />

          {/* Officer Portal Pages (Guarded) */}
          <Route
            path="/officer/dashboard"
            element={<PortalLayout role="officer"><OfficerDashboard /></PortalLayout>}
          />
          <Route
            path="/officer/assigned-complaints"
            element={<PortalLayout role="officer"><AssignedList /></PortalLayout>}
          />
          <Route
            path="/officer/complaint/:id"
            element={<PortalLayout role="officer"><OfficerComplaintDetails /></PortalLayout>}
          />
          <Route
            path="/officer/update-status"
            element={<PortalLayout role="officer"><ResolutionPage /></PortalLayout>}
          />

          {/* Admin Portal Pages (Guarded) */}
          <Route
            path="/admin/dashboard"
            element={<PortalLayout role="admin"><AdminDashboard /></PortalLayout>}
          />
          <Route
            path="/admin/manage-users"
            element={<PortalLayout role="admin"><UsersManager /></PortalLayout>}
          />
          <Route
            path="/admin/manage-officers"
            element={<PortalLayout role="admin"><OfficersManager /></PortalLayout>}
          />
          <Route
            path="/admin/complaint-monitoring"
            element={<PortalLayout role="admin"><Monitoring /></PortalLayout>}
          />
          <Route
            path="/admin/complaint-assignment"
            element={<PortalLayout role="admin"><Assignment /></PortalLayout>}
          />
          <Route
            path="/admin/analytics"
            element={<PortalLayout role="admin"><Analytics /></PortalLayout>}
          />
          <Route
            path="/admin/security-dashboard"
            element={<PortalLayout role="admin"><SecurityDashboard /></PortalLayout>}
          />
          <Route
            path="/admin/audit-logs"
            element={<PortalLayout role="admin"><AuditLogs /></PortalLayout>}
          />
          <Route
            path="/admin/complaint/:id"
            element={<PortalLayout role="admin"><ComplaintDetails /></PortalLayout>}
          />

          {/* 404 Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
