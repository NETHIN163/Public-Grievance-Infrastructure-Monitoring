import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  FileText, CheckCircle2, BarChart3,
  AlertTriangle, ShieldAlert, Clock, RefreshCw, Eye, ArrowUpRight, ArrowDownRight, ArrowDownLeft
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie
} from 'recharts';

export default function AdminDashboard() {
  const { users } = useSelector((state) => state.auth);
  const reduxComplaints = useSelector((state) => state.complaints.complaints);
  
  // Local state to manage interactive escalation changes
  const [localComplaints, setLocalComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [reassigningId, setReassigningId] = useState(null);

  // Initialize and enrich complaints with escalation properties
  useEffect(() => {
    if (reduxComplaints.length > 0) {
      const enriched = reduxComplaints.map((c, idx) => {
        // Deterministic mock values for demo consistency
        let escLevel;
        let daysPending;
        
        if (c.status === 'In Progress') {
          escLevel = (idx % 3) + 1; // Levels 1, 2, 3
          daysPending = (idx + 1) * 3 + 2;
        } else if (c.status === 'Assigned') {
          escLevel = idx % 2 === 0 ? 1 : 2; // Levels 1, 2
          daysPending = (idx + 1) * 2;
        } else if (c.status === 'Submitted') {
          escLevel = idx % 3 === 0 ? 1 : 0; // Level 0 or 1
          daysPending = idx + 1;
        } else {
          escLevel = 0; // Resolved / Closed
          daysPending = 0;
        }

        return {
          ...c,
          escalationLevel: c.escalationLevel !== undefined ? c.escalationLevel : escLevel,
          daysPending: c.daysPending !== undefined ? c.daysPending : daysPending,
        };
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalComplaints(enriched);
    }
  }, [reduxComplaints]);

  // Extract list of officers for the reassignment action
  const officers = users.filter((u) => u.role === 'officer');

  // Interactive Quick Actions Handlers
  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowTimelineModal(true);
  };

  const handleReassign = (complaintId, officerName) => {
    setLocalComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          assignedOfficer: officerName,
          status: 'Assigned',
          timeline: [
            ...c.timeline,
            { status: 'Assigned', date: new Date().toISOString(), remarks: `Reassigned to Officer ${officerName} via Command Panel` }
          ]
        };
      }
      return c;
    }));
    setReassigningId(null);
  };

  const handleMarkHighPriority = (complaintId) => {
    setLocalComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return { ...c, priority: 'High' };
      }
      return c;
    }));
  };

  const handleLowerPriority = (complaintId) => {
    setLocalComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const nextPriority = c.priority === 'High' ? 'Medium' : 'Low';
        return { ...c, priority: nextPriority };
      }
      return c;
    }));
  };

  const handleDeescalate = (complaintId) => {
    setLocalComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const currentLevel = c.escalationLevel;
        const nextLevel = currentLevel > 0 ? currentLevel - 1 : 0;
        
        // Append de-escalation step to timeline if level changes
        const updatedTimeline = [...c.timeline];
        if (nextLevel < currentLevel) {
          updatedTimeline.push({
            status: nextLevel === 0 ? 'De-escalated to Normal' : `De-escalated to Level ${nextLevel}`,
            date: new Date().toISOString(),
            remarks: nextLevel === 0 
              ? 'Urgency level de-escalated to Normal by Administrator' 
              : `Urgency level de-escalated to Level ${nextLevel} by Administrator`
          });
        }

        return {
          ...c,
          escalationLevel: nextLevel,
          timeline: updatedTimeline
        };
      }
      return c;
    }));
  };

  const handleEscalateFurther = (complaintId) => {
    setLocalComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        const currentLevel = c.escalationLevel;
        const nextLevel = currentLevel < 3 ? currentLevel + 1 : 3;
        
        // Append escalation step to timeline if level changes
        const updatedTimeline = [...c.timeline];
        if (nextLevel > currentLevel) {
          updatedTimeline.push({
            status: `Escalated Level ${nextLevel}`,
            date: new Date().toISOString(),
            remarks: `Urgency level escalated to Level ${nextLevel} by Administrator`
          });
        }

        return {
          ...c,
          escalationLevel: nextLevel,
          priority: 'High',
          timeline: updatedTimeline
        };
      }
      return c;
    }));
  };

  // Metrics calculation (unused local variables totalUsers and activeOfficers removed to resolve ESLint warnings)
  
  const totalComplaintsCount = localComplaints.length;
  const pendingComplaintsCount = localComplaints.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const resolvedComplaintsCount = localComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  
  const escalatedComplaintsCount = localComplaints.filter(c => c.escalationLevel > 0).length;
  const level1Count = localComplaints.filter(c => c.escalationLevel === 1).length;
  const level2Count = localComplaints.filter(c => c.escalationLevel === 2).length;
  const level3Count = localComplaints.filter(c => c.escalationLevel === 3).length;

  const highestEscalationCasesCount = level3Count;
  const awaitingActionCount = localComplaints.filter(c => !c.assignedOfficer || c.status === 'Submitted').length;
  const overdueCount = localComplaints.filter(c => c.daysPending > 5).length;

  const highPriorityCount = localComplaints.filter(c => c.priority === 'High').length;
  const mediumPriorityCount = localComplaints.filter(c => c.priority === 'Medium').length;
  const lowPriorityCount = localComplaints.filter(c => c.priority === 'Low').length;

  const priorityData = [
    { name: 'High Priority', value: highPriorityCount, color: '#ef4444' },
    { name: 'Medium Priority', value: mediumPriorityCount, color: '#f59e0b' },
    { name: 'Low Priority', value: lowPriorityCount, color: '#10b981' }
  ];

  // Chart 1: Complaints by Status (Pie Donut Chart)
  const statusData = [
    { name: 'Submitted', value: localComplaints.filter(c => c.status === 'Submitted').length, color: '#f59e0b' },
    { name: 'Assigned', value: localComplaints.filter(c => c.status === 'Assigned').length, color: '#38bdf8' },
    { name: 'In Progress', value: localComplaints.filter(c => c.status === 'In Progress').length, color: '#6366f1' },
    { name: 'Resolved/Closed', value: resolvedComplaintsCount, color: '#10b981' }
  ];

  // Chart 2: Escalation Level Distribution (Bar Chart)
  const escalationDistributionData = [
    { name: 'Level 0 (Normal)', value: localComplaints.filter(c => c.escalationLevel === 0).length, color: '#10b981' },
    { name: 'Level 1', value: level1Count, color: '#eab308' },
    { name: 'Level 2', value: level2Count, color: '#fd7e14' },
    { name: 'Level 3', value: level3Count, color: '#ef4444' }
  ];

  // Chart 3: Monthly Complaint Trends (Area Line Chart)
  const trendData = [
    { month: 'Jan', total: 45, escalated: 8 },
    { month: 'Feb', total: 52, escalated: 12 },
    { month: 'Mar', total: 78, escalated: 15 },
    { month: 'Apr', total: 92, escalated: 20 },
    { month: 'May', total: 110, escalated: 25 },
    { month: 'Jun', total: totalComplaintsCount || 120, escalated: escalatedComplaintsCount || 30 }
  ];

  // Dynamic status highlighting logic for timeline steps
  const getTimelineSteps = (complaint) => {
    if (!complaint) return [];
    
    const baseSteps = [
      { name: 'Complaint Submitted', date: complaint.date, details: 'Registered successfully in system logs.' },
      { 
        name: 'Assigned to Officer', 
        date: complaint.timeline.find(t => t.status === 'Assigned')?.date || '',
        details: complaint.assignedOfficer ? `Assigned to ${complaint.assignedOfficer}` : 'Awaiting assignment.' 
      },
      { 
        name: 'In Progress', 
        date: complaint.timeline.find(t => t.status === 'In Progress')?.date || '',
        details: 'Investigation and resolving work ongoing by crew.' 
      },
      { 
        name: 'Escalated Level 1', 
        date: complaint.timeline.find(t => t.status === 'Escalated Level 1')?.date || '',
        details: 'Unresolved past threshold timeline. Notification pushed.' 
      },
      { 
        name: 'Escalated Level 2', 
        date: complaint.timeline.find(t => t.status === 'Escalated Level 2')?.date || '',
        details: 'High-priority command intervention. Action required.' 
      },
      { 
        name: 'Resolved', 
        date: complaint.timeline.find(t => t.status === 'Resolved' || t.status === 'Closed')?.date || '',
        details: complaint.resolutionNotes || 'Grievance ticket closed successfully.' 
      }
    ];

    // Determine completion index based on current status and escalation level
    let completedIndex = 0; // default submitted

    if (complaint.status === 'Resolved' || complaint.status === 'Closed') {
      completedIndex = 5;
    } else if (complaint.escalationLevel === 2) {
      completedIndex = 4;
    } else if (complaint.escalationLevel === 1) {
      completedIndex = 3;
    } else if (complaint.status === 'In Progress') {
      completedIndex = 2;
    } else if (complaint.status === 'Assigned') {
      completedIndex = 1;
    }

    return baseSteps.map((step, idx) => ({
      ...step,
      isCompleted: idx <= completedIndex,
      isActive: idx === completedIndex
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-5">
      
      {/* Header Banner */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-govBlue-light">Command Control Panel</h2>
          <p className="text-xs text-govMatte-muted">Oversee national infrastructure dispatches, grievance lifecycle telemetry, and system escalations.</p>
        </div>
        <Link
          to="/admin/complaint-monitoring"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-govGreen text-black hover:bg-govGreen-light shadow-lg shadow-govGreen/10 transition-all text-center text-decoration-none"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Monitor Active Incidents</span>
        </Link>
      </div>

      {/* Statistics Cards Rows (Bootstrap Cards with Icons & Badges) */}
      <div className="row g-4">
        {/* Total Complaints */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm bg-white" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <p className="fs-3 fw-extrabold text-primary mb-0 font-sans">{totalComplaintsCount}</p>
                <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-1">Total Complaints</h4>
              </div>
              <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Complaints */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm bg-white" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <p className="fs-3 fw-extrabold text-warning mb-0 font-sans">{pendingComplaintsCount}</p>
                  <span className="badge bg-warning text-dark text-[9px] font-extrabold uppercase">Active</span>
                </div>
                <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-1">Pending Cases</h4>
              </div>
              <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Resolved Complaints */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm bg-white" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <p className="fs-3 fw-extrabold text-success mb-0 font-sans">{resolvedComplaintsCount}</p>
                <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-1">Resolved Closed</h4>
              </div>
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Escalated Complaints */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm bg-white" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4 d-flex align-items-center justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <p className="fs-3 fw-extrabold text-danger mb-0 font-sans">{escalatedComplaintsCount}</p>
                  <span className="badge bg-danger text-[9px] font-extrabold uppercase">Alert</span>
                </div>
                <h4 className="text-xs font-bold text-govMatte-muted uppercase tracking-wider mt-1">Escalated Total</h4>
              </div>
              <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Escalated Levels breakdown */}
      <div className="row g-4 mt-1">
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-sm bg-white border-start border-warning border-3" style={{ borderRadius: '0.75rem' }}>
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <p className="fs-4 fw-extrabold text-warning mb-0 font-sans">{level1Count}</p>
                <span className="text-xs font-bold text-govMatte-muted">Level 1 Escalations</span>
              </div>
              <span className="badge bg-warning text-dark text-[9px] font-extrabold">LEVEL 1</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-sm bg-white border-start border-3" style={{ borderRadius: '0.75rem', borderColor: '#fd7e14' }}>
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <p className="fs-4 fw-extrabold mb-0 font-sans" style={{ color: '#fd7e14' }}>{level2Count}</p>
                <span className="text-xs font-bold text-govMatte-muted">Level 2 Escalations</span>
              </div>
              <span className="badge text-[9px] font-extrabold text-white" style={{ backgroundColor: '#fd7e14' }}>LEVEL 2</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-sm bg-white border-start border-danger border-3" style={{ borderRadius: '0.75rem' }}>
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <p className="fs-4 fw-extrabold text-danger mb-0 font-sans">{level3Count}</p>
                <span className="text-xs font-bold text-govMatte-muted">Level 3 Escalations</span>
              </div>
              <span className="badge bg-danger text-[9px] font-extrabold text-white">LEVEL 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Summary Cards */}
      <div className="row g-4 mt-1">
        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-sm bg-white border-start border-danger border-3" style={{ borderRadius: '0.75rem' }}>
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <p className="fs-4 fw-extrabold text-danger mb-0 font-sans">{highPriorityCount}</p>
                <span className="text-xs font-bold text-govMatte-muted">High Priority Cases</span>
              </div>
              <span className="badge bg-danger text-white text-[9px] font-extrabold">🔴 HIGH</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-sm bg-white border-start border-3" style={{ borderRadius: '0.75rem', borderColor: '#f59e0b' }}>
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <p className="fs-4 fw-extrabold mb-0 font-sans" style={{ color: '#f59e0b' }}>{mediumPriorityCount}</p>
                <span className="text-xs font-bold text-govMatte-muted">Medium Priority Cases</span>
              </div>
              <span className="badge text-[9px] font-extrabold text-dark" style={{ backgroundColor: '#f59e0b' }}>🟡 MEDIUM</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100 border-0 shadow-sm bg-white border-start border-success border-3" style={{ borderRadius: '0.75rem' }}>
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <p className="fs-4 fw-extrabold text-success mb-0 font-sans">{lowPriorityCount}</p>
                <span className="text-xs font-bold text-govMatte-muted">Low Priority Cases</span>
              </div>
              <span className="badge bg-success text-white text-[9px] font-extrabold">🟢 LOW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Summary Widget banner */}
      <div className="card border-0 shadow-sm text-dark bg-light" style={{ borderRadius: '1rem', border: '1px solid #cbd5e1' }}>
        <div className="card-body p-4">
          <div className="row text-center divide-x border-slate-200">
            <div className="col-6 col-md-3">
              <p className="fs-4 fw-extrabold text-danger mb-0">{escalatedComplaintsCount}</p>
              <span className="text-[10px] text-govMatte-muted font-bold uppercase tracking-wider">Total Escalated Cases</span>
            </div>
            <div className="col-6 col-md-3 border-start">
              <p className="fs-4 fw-extrabold text-danger mb-0">{highestEscalationCasesCount}</p>
              <span className="text-[10px] text-govMatte-muted font-bold uppercase tracking-wider">Highest Escalation (L3)</span>
            </div>
            <div className="col-6 col-md-3 border-start mt-3 mt-md-0">
              <p className="fs-4 fw-extrabold text-warning mb-0">{awaitingActionCount}</p>
              <span className="text-[10px] text-govMatte-muted font-bold uppercase tracking-wider">Awaiting Officer Action</span>
            </div>
            <div className="col-6 col-md-3 border-start mt-3 mt-md-0">
              <p className="fs-4 fw-extrabold text-danger mb-0">{overdueCount}</p>
              <span className="text-[10px] text-govMatte-muted font-bold uppercase tracking-wider">Overdue (Pending &gt; 5d)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Grid */}
      <div className="row g-4">
        {/* Complaints by Status */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm bg-white h-100" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4 d-flex flex-column">
              <h5 className="card-title text-xs font-extrabold text-govBlue uppercase tracking-wider mb-4">Complaints by Status</h5>
              <div className="flex-grow-1 w-full h-64 text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '10px' }} />
                    <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm bg-white h-100" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4 d-flex flex-column">
              <h5 className="card-title text-xs font-extrabold text-govBlue uppercase tracking-wider mb-4">Priority Distribution</h5>
              <div className="flex-grow-1 w-full h-64 text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: '10px' }} />
                    <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Escalation Level Distribution */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm bg-white h-100" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4 d-flex flex-column">
              <h5 className="card-title text-xs font-extrabold text-govBlue uppercase tracking-wider mb-4">Escalation Distribution</h5>
              <div className="flex-grow-1 w-full h-64 text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={escalationDistributionData}>
                    <XAxis dataKey="name" stroke="#64748b" tickLine={false} tickFormatter={(val) => val.split(' ')[0]} />
                    <YAxis stroke="#64748b" tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {escalationDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Complaint Trends */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm bg-white h-100" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4 d-flex flex-column">
              <h5 className="card-title text-xs font-extrabold text-govBlue uppercase tracking-wider mb-4">Monthly Complaint Trends</h5>
              <div className="flex-grow-1 w-full h-64 text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" tickLine={false} />
                    <YAxis stroke="#64748b" tickLine={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '9px' }} iconSize={8} iconType="circle" />
                    <Line type="monotone" dataKey="total" name="Total Logged" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="escalated" name="Escalated" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Monitoring Section with Responsive Table */}
      <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: '1rem' }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="text-sm font-extrabold text-govBlue uppercase tracking-wider mb-0">Escalation Monitoring</h5>
            <span className="badge bg-light text-govMatte-muted border px-2.5 py-1.5 font-bold">{localComplaints.length} Loaded Cases</span>
          </div>

          <div className="table-responsive text-xs">
            <table className="table table-hover table-striped align-middle border-light">
              <thead>
                <tr className="table-light text-[10px] text-govMatte-muted uppercase font-extrabold border-bottom">
                  <th className="py-3 px-3">Complaint ID</th>
                  <th className="py-3 px-3">Complaint Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Assigned Officer</th>
                  <th className="py-3 px-3">Current Status</th>
                  <th className="py-3 px-3">Escalation Level</th>
                  <th className="py-3 px-3">Days Pending</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3 text-end">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-800">
                {localComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-govMatte-muted">
                      No complaints registered in system logs.
                    </td>
                  </tr>
                ) : (
                  localComplaints.map((c) => (
                    <tr key={c.id}>
                      {/* ID */}
                      <td className="py-3 px-3 font-monospace fw-bold text-primary">{c.id}</td>
                      
                      {/* Title */}
                      <td className="py-3 px-3 fw-bold max-w-[200px] truncate text-slate-900" title={c.title}>
                        {c.title}
                      </td>
                      
                      {/* Category */}
                      <td className="py-3 px-3 text-govMatte-muted font-medium">{c.category}</td>
                      
                      {/* Assigned Officer */}
                      <td className="py-3 px-3">
                        {reassigningId === c.id ? (
                          <select
                            defaultValue=""
                            onChange={(e) => handleReassign(c.id, e.target.value)}
                            className="form-select form-select-sm text-[10px] py-1 border-slate-300 font-semibold"
                            style={{ minWidth: '120px' }}
                          >
                            <option value="" disabled>Select Officer</option>
                            {officers.map(o => (
                              <option key={o.id} value={o.name}>{o.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={c.assignedOfficer ? "fw-semibold text-dark" : "text-danger font-medium animate-pulse"}>
                            {c.assignedOfficer || "Unassigned"}
                          </span>
                        )}
                      </td>
                      
                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`badge rounded-pill text-[9px] font-extrabold uppercase py-1 px-2.5 ${
                          c.status === 'Resolved' || c.status === 'Closed' 
                            ? 'bg-success bg-opacity-10 text-success border border-success border-opacity-20' 
                            : c.status === 'In Progress' || c.status === 'Assigned'
                              ? 'bg-info bg-opacity-10 text-info-emphasis border border-info border-opacity-20'
                              : 'bg-warning bg-opacity-10 text-warning-emphasis border border-warning border-opacity-20'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      
                      {/* Escalation Level */}
                      <td className="py-3 px-3">
                        {c.escalationLevel === 0 && (
                          <span className="badge bg-success py-1 px-2.5 text-[9px]">L0 (Normal)</span>
                        )}
                        {c.escalationLevel === 1 && (
                          <span className="badge bg-warning text-dark py-1 px-2.5 text-[9px]">Level 1</span>
                        )}
                        {c.escalationLevel === 2 && (
                          <span className="badge py-1 px-2.5 text-white text-[9px]" style={{ backgroundColor: '#fd7e14' }}>Level 2</span>
                        )}
                        {c.escalationLevel === 3 && (
                          <span className="badge bg-danger py-1 px-2.5 text-[9px]">Level 3</span>
                        )}
                      </td>
                      
                      {/* Days Pending */}
                      <td className="py-3 px-3 text-center">
                        <span className={`fw-extrabold ${c.daysPending > 5 ? 'text-danger' : 'text-slate-800'}`}>
                          {c.daysPending} {c.daysPending === 1 ? 'day' : 'days'}
                        </span>
                      </td>
                      
                      {/* Priority */}
                      <td className="py-3 px-3">
                        <span className={`badge text-[9px] font-extrabold uppercase py-1 px-2.5 d-inline-flex align-items-center gap-1 ${
                          c.priority === 'High' 
                            ? 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-20' 
                            : c.priority === 'Medium'
                              ? 'bg-warning bg-opacity-15 text-warning-emphasis border border-warning border-opacity-20'
                              : 'bg-success bg-opacity-10 text-success border border-success border-opacity-20'
                        }`}>
                          <span>{c.priority === 'High' ? '🔴' : c.priority === 'Medium' ? '🟡' : '🟢'}</span>
                          <span>{c.priority}</span>
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-3 px-3 text-end">
                        <div className="d-flex justify-content-end gap-1">
                          {/* View details */}
                          <button
                            onClick={() => handleViewComplaint(c)}
                            title="View details timeline"
                            className="btn btn-outline-primary btn-sm py-1 px-2 text-[10px] d-flex align-items-center gap-1 font-bold"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          
                          {/* Reassign */}
                          <button
                            onClick={() => setReassigningId(reassigningId === c.id ? null : c.id)}
                            title="Reassign Officer"
                            className="btn btn-outline-secondary btn-sm py-1 px-2 text-[10px] d-flex align-items-center gap-1 font-bold"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Reassign</span>
                          </button>

                          {/* Priority Toggle */}
                          <button
                            onClick={() => handleMarkHighPriority(c.id)}
                            disabled={c.priority === 'High'}
                            title="Mark High Priority"
                            className="btn btn-outline-warning btn-sm py-1 px-2 text-[10px] d-flex align-items-center gap-1 font-bold"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>High</span>
                          </button>

                          {/* Lower Priority */}
                          <button
                            onClick={() => handleLowerPriority(c.id)}
                            disabled={c.priority === 'Low'}
                            title="Lower Priority"
                            className="btn btn-outline-success btn-sm py-1 px-2 text-[10px] d-flex align-items-center gap-1 font-bold"
                          >
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            <span>Lower</span>
                          </button>

                          {/* Escalate */}
                          <button
                            onClick={() => handleEscalateFurther(c.id)}
                            disabled={c.escalationLevel === 3}
                            title="Escalate Further"
                            className="btn btn-outline-danger btn-sm py-1 px-2 text-[10px] d-flex align-items-center gap-1 font-bold"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Escalate</span>
                          </button>

                          {/* De-escalate */}
                          <button
                            onClick={() => handleDeescalate(c.id)}
                            disabled={c.escalationLevel === 0}
                            title="De-escalate"
                            className="btn btn-outline-info btn-sm py-1 px-2 text-[10px] d-flex align-items-center gap-1 font-bold"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            <span>De-escalate</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Complaint Timeline Modal */}
      {showTimelineModal && selectedComplaint && (
        <>
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="modal-header border-bottom border-light bg-light py-3 px-4">
                  <div>
                    <h5 className="modal-title fs-6 fw-extrabold text-primary">{selectedComplaint.id} Timeline Tracking</h5>
                    <p className="text-[10px] text-govMatte-muted mb-0 mt-0.5 max-w-[320px] truncate">{selectedComplaint.title}</p>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setShowTimelineModal(false)}></button>
                </div>
                <div className="modal-body p-4" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                  
                  {/* Timeline representation */}
                  <div className="ps-3 position-relative" style={{ borderLeft: '2px solid #e2e8f0', margin: '15px 0 15px 10px' }}>
                    {getTimelineSteps(selectedComplaint).map((step, idx) => (
                      <div className="mb-4 position-relative" key={idx} style={{ marginTop: idx === 0 ? '-5px' : '0' }}>
                        
                        {/* Status node dot */}
                        <div 
                          className="position-absolute" 
                          style={{ 
                            left: '-19px', 
                            top: '2px', 
                            width: '12px', 
                            height: '12px', 
                            borderRadius: '50%', 
                            backgroundColor: step.isCompleted ? (step.isActive ? '#ef4444' : '#10b981') : '#cbd5e1',
                            border: step.isCompleted ? 'none' : '2px solid #ffffff',
                            boxShadow: step.isActive ? '0 0 0 4px rgba(239, 68, 68, 0.25)' : 'none'
                          }} 
                        />
                        
                        <div className="ps-3">
                          <h6 className={`text-xs fw-extrabold mb-0.5 ${step.isCompleted ? 'text-slate-900' : 'text-govMatte-muted'}`}>
                            {step.name}
                          </h6>
                          <p className="text-[10px] text-govMatte-muted mb-1 font-medium">{step.details}</p>
                          {step.date && (
                            <span className="text-[9px] font-monospace text-primary bg-primary bg-opacity-5 px-1.5 py-0.5 rounded">
                              {new Date(step.date).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* General details card */}
                  <div className="card bg-light border-0 rounded-3 p-3 mt-3">
                    <h6 className="text-[10px] font-bold text-govMatte-muted uppercase tracking-wider mb-2">Complainant Info</h6>
                    <div className="d-flex justify-content-between text-[11px] font-semibold text-slate-800">
                      <div>
                        <span className="text-govMatte-muted d-block font-normal text-[9px] uppercase">Name</span>
                        {selectedComplaint.citizenName}
                      </div>
                      <div className="text-end">
                        <span className="text-govMatte-muted d-block font-normal text-[9px] uppercase">Phone</span>
                        {selectedComplaint.citizenPhone}
                      </div>
                    </div>
                  </div>

                </div>
                <div className="modal-footer bg-light border-top border-light py-2.5 px-4">
                  <button type="button" className="btn btn-primary btn-sm px-4 fw-bold" onClick={() => setShowTimelineModal(false)}>Close Window</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
        </>
      )}

    </div>
  );
}
