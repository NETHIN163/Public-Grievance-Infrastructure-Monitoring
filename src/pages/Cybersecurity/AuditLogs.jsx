import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { History, Search, Filter } from 'lucide-react';
import Card from '../../components/Shared/Card';

export default function AuditLogs() {
  const { auditLogs } = useSelector((state) => state.security);

  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');

  // Filter logs query
  const filteredLogs = auditLogs.filter((log) => {
    const matchesUser = log.userName.toLowerCase().includes(searchUser.toLowerCase()) ||
                        log.id.toLowerCase().includes(searchUser.toLowerCase());
    const matchesRole = roleFilter === 'All' || log.role === roleFilter;
    const matchesAction = actionFilter === 'All' || log.action.includes(actionFilter);
    return matchesUser && matchesRole && matchesAction;
  });

  // Unique actions in logs for dropdown filters
  const uniqueActions = ['Registration', 'Assignment', 'Status', 'Modified', 'Recovery', 'Role'];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center space-x-2">
        <History className="w-6 h-6 text-govBlue" />
        <div>
          <h2 className="text-xl font-extrabold text-govBlue">Core Security Audit Registry</h2>
          <p className="text-xs text-govMatte-muted">Inspect complete logs of administrative parameters changes, credentials updates, and assignments.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-govMatte-darkCard p-4 border border-govMatte-border/60 rounded-2xl shadow-sm text-xs font-semibold text-govMatte-text">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Search by Username or Log ID..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 font-medium bg-govMatte-bg/30 text-xs"
          />
        </div>

        {/* Role filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-govMatte-muted flex-shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-40 px-3.5 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-white"
          >
            <option value="All">All Roles</option>
            <option value="citizen">Citizen</option>
            <option value="officer">Officer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Action filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-govMatte-muted flex-shrink-0" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full md:w-44 px-3.5 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-white"
          >
            <option value="All">All Log Actions</option>
            {uniqueActions.map(act => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Audit Log Table */}
      <Card>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-10 text-govMatte-muted">
            <p className="text-xs font-bold">No audit logs found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs font-semibold text-govMatte-text">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-govMatte-border text-[10px] text-govMatte-muted uppercase font-extrabold bg-slate-50/50">
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Operator Name</th>
                  <th className="py-3 px-4">Role Context</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Parameters Before</th>
                  <th className="py-3 px-4">Parameters After</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-govMatte-border/40">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-govMatte-muted">{log.id}</td>
                    <td className="py-3 px-4 text-slate-800">{log.userName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                        log.role === 'admin' 
                          ? 'bg-red-50 text-red-700 border border-red-100' 
                          : log.role === 'officer'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-bold">{log.action}</td>
                    <td className="py-3 px-4 text-govMatte-muted font-medium break-all max-w-[150px]">{log.oldValue}</td>
                    <td className="py-3 px-4 text-govGreen font-medium break-all max-w-[180px]">{log.newValue}</td>
                    <td className="py-3 px-4 text-right text-govMatte-muted font-mono">
                      {new Date(log.date).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  );
}
