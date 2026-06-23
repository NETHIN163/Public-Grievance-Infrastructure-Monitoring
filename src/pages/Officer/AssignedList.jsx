import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Search, Eye, Filter } from 'lucide-react';
import Card from '../../components/Shared/Card';

export default function AssignedList() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const { complaints } = useSelector((state) => state.complaints);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter complaints assigned to this officer
  const myAssigned = complaints.filter(
    (c) => c.assignedOfficerEmail.toLowerCase() === (currentUser?.email || '').toLowerCase()
  );

  const filteredCases = myAssigned.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.citizenName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center space-x-2">
        <ClipboardList className="w-6 h-6 text-govBlue" />
        <div>
          <h2 className="text-xl font-extrabold text-govBlue">Assigned Field Dispatches</h2>
          <p className="text-xs text-govMatte-muted">View and modify active grievances routed to your department zone.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-govMatte-darkCard p-4 border border-govMatte-border/60 rounded-2xl shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, Citizen, or Subject..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 text-xs font-medium bg-govMatte-bg/30"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-govMatte-muted flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-3.5 py-2 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 text-xs font-semibold bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

      </div>

      {/* Data Table */}
      <Card>
        {filteredCases.length === 0 ? (
          <div className="text-center py-10 text-govMatte-muted">
            <p className="text-xs font-bold">No dispatch assignments found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold text-govMatte-text">
              <thead>
                <tr className="border-b border-govMatte-border text-[10px] text-govMatte-muted uppercase font-extrabold bg-slate-50/50">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Citizen Name</th>
                  <th className="py-3 px-4">Operational Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-govMatte-border/40">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-govBlue">{c.id}</td>
                    <td className="py-3 px-4 text-slate-800">{c.citizenName}</td>
                    <td className="py-3 px-4 text-govMatte-muted">{c.category}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                        c.priority === 'High' 
                          ? 'bg-red-50 text-red-700 border border-red-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                        c.status === 'Resolved' || c.status === 'Closed'
                          ? 'bg-govGreen/10 text-govGreen border border-govGreen/20'
                          : c.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100 animate-pulse'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/officer/complaint/${c.id}`)}
                        className="px-3 py-1 rounded-lg bg-govBlue/5 hover:bg-govBlue text-govBlue hover:text-white border border-govBlue/10 hover:border-transparent transition-all font-bold flex items-center space-x-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
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
