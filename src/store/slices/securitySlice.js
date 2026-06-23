import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_SECURITY_ALERTS, INITIAL_AUDIT_LOGS } from '../../mockData';

const getStoredAlerts = () => {
  const stored = localStorage.getItem('gov_alerts');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('gov_alerts', JSON.stringify(INITIAL_SECURITY_ALERTS));
  return INITIAL_SECURITY_ALERTS;
};

const getStoredAudits = () => {
  const stored = localStorage.getItem('gov_audits');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('gov_audits', JSON.stringify(INITIAL_AUDIT_LOGS));
  return INITIAL_AUDIT_LOGS;
};

const initialState = {
  securityAlerts: getStoredAlerts(),
  auditLogs: getStoredAudits()
};

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    addSecurityAlert: (state, action) => {
      const { user, activity, riskLevel, details } = action.payload;
      const newAlert = {
        id: `alert-${state.securityAlerts.length + 1}`,
        user: user || 'anonymous',
        activity,
        date: new Date().toISOString(),
        riskLevel: riskLevel || 'Low',
        ipAddress: '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
        device: 'Chrome / Windows 10',
        details: details || ''
      };
      state.securityAlerts.unshift(newAlert);
      localStorage.setItem('gov_alerts', JSON.stringify(state.securityAlerts));
    },
    addAuditLog: (state, action) => {
      const { userName, role, action: logAction, oldValue, newValue } = action.payload;
      const newLog = {
        id: `audit-${state.auditLogs.length + 1}`,
        userName,
        role,
        action: logAction,
        oldValue: oldValue || 'N/A',
        newValue: newValue || 'N/A',
        date: new Date().toISOString()
      };
      state.auditLogs.unshift(newLog);
      localStorage.setItem('gov_audits', JSON.stringify(state.auditLogs));
    }
  }
});

export const { addSecurityAlert, addAuditLog } = securitySlice.actions;
export default securitySlice.reducer;
