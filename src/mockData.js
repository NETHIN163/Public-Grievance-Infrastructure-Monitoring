// Mock seed data for the Public Grievance & Infrastructure Monitoring System

export const INITIAL_USERS = [
  {
    id: "user-1",
    name: "Aarav Sharma",
    email: "citizen@gov.in",
    phone: "+91 98765 43210",
    role: "citizen",
    avatar: "AS",
    status: "active",
    area: "Coimbatore Central Zone",
    dateJoined: "2026-01-15"
  },
  {
    id: "user-2",
    name: "Nethra Swathi",
    email: "nethraswathi17@gmail.com",
    password: "nethrasara",
    phone: "+91 91234 56789",
    role: "officer",
    avatar: "NS",
    status: "active",
    department: "Roads & Highways",
    area: "Coimbatore Central Zone",
    dateJoined: "2025-11-20"
  },
  {
    id: "user-3",
    name: "Dr. Sunita Rao",
    email: "officer2@gov.in",
    phone: "+91 93456 78901",
    role: "officer",
    avatar: "SR",
    status: "active",
    department: "Water Supply & Sanitation",
    area: "Coimbatore South Zone",
    dateJoined: "2025-12-05"
  },
  {
    id: "user-4",
    name: "Deepak Verma",
    email: "officer3@gov.in",
    phone: "+91 94567 89012",
    role: "officer",
    avatar: "DV",
    status: "active",
    department: "Waste Management",
    area: "Coimbatore West Zone",
    dateJoined: "2026-02-10"
  },
  {
    id: "user-5",
    name: "Nethin Admin",
    email: "nethin163@gmail.com",
    password: "9894506871",
    phone: "+91 99999 99999",
    role: "admin",
    avatar: "NA",
    status: "active",
    area: "National Headquarters",
    dateJoined: "2025-08-01"
  },
  {
    id: "user-6",
    name: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 88776 65544",
    role: "citizen",
    avatar: "PP",
    status: "active",
    area: "Coimbatore South Zone",
    dateJoined: "2026-03-22"
  },
  {
    id: "user-7",
    name: "Karan Johar",
    email: "karan@example.com",
    phone: "+91 77665 54433",
    role: "citizen",
    avatar: "KJ",
    status: "blocked",
    area: "Coimbatore West Zone",
    dateJoined: "2026-04-05"
  }
];

export const INITIAL_COMPLAINTS = [
  {
    id: "GOV-2026-1001",
    title: "Hazardous Deep Potholes on Main Ring Road",
    description: "There are multiple deep potholes near the flyover exit. They are extremely dangerous, especially at night and during rains. Multiple two-wheelers have met with accidents here in the last 48 hours.",
    category: "Roads & Highways",
    location: "Ring Road, Near Sector 5 Flyover Exit, Coimbatore Central Zone",
    latitude: 28.6139,
    longitude: 77.2090,
    priority: "High",
    status: "Assigned",
    date: "2026-06-12T10:30:00Z",
    citizenName: "Aarav Sharma",
    citizenEmail: "citizen@gov.in",
    citizenPhone: "+91 98765 43210",
    assignedOfficer: "Nethra Swathi",
    assignedOfficerEmail: "nethraswathi17@gmail.com",
    department: "Roads & Highways",
    remarks: "Site inspection scheduled. Requesting road repair dispatch crew.",
    resolutionNotes: "",
    beforeImage: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
    afterImage: "",
    timeline: [
      { status: "Submitted", date: "2026-06-12T10:30:00Z", remarks: "Complaint successfully registered by citizen." },
      { status: "Under Review", date: "2026-06-12T14:15:00Z", remarks: "System auto-validated coordinates. Categorized by System Engine." },
      { status: "Assigned", date: "2026-06-13T09:00:00Z", remarks: "Assigned to Officer Rajesh Kumar (Roads & Highways)." }
    ]
  },
  {
    id: "GOV-2026-1002",
    title: "Contaminated Water Supply in Block C",
    description: "The tap water supplied to Block C apartments has a yellowish tint and a foul chemical odor. It is completely unfit for consumption. Several children in the neighborhood are reporting stomach upsets.",
    category: "Water Supply & Sanitation",
    location: "Block C, Pragati Vihar, Coimbatore South Zone",
    latitude: 28.5800,
    longitude: 77.2200,
    priority: "High",
    status: "In Progress",
    date: "2026-06-14T08:20:00Z",
    citizenName: "Priya Patel",
    citizenEmail: "priya@example.com",
    citizenPhone: "+91 88776 65544",
    assignedOfficer: "Dr. Sunita Rao",
    assignedOfficerEmail: "officer2@gov.in",
    department: "Water Supply & Sanitation",
    remarks: "Water sample collected for laboratory testing. Valve cleaning in progress.",
    resolutionNotes: "",
    beforeImage: "https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&w=800&q=80",
    afterImage: "",
    timeline: [
      { status: "Submitted", date: "2026-06-14T08:20:00Z", remarks: "Grievance registered. System Priority check: High." },
      { status: "Under Review", date: "2026-06-14T11:00:00Z", remarks: "Reviewed by Admin panel." },
      { status: "Assigned", date: "2026-06-14T11:45:00Z", remarks: "Assigned to Water Supply department superintendent." },
      { status: "In Progress", date: "2026-06-15T10:00:00Z", remarks: "Field crew dispatched. Checking main line leakage." }
    ]
  },
  {
    id: "GOV-2026-1003",
    title: "Broken Streetlight Near Public Park",
    description: "The streetlight at the entrance of Netaji Park has been non-functional for the past two weeks. The entire street is Pitch dark, raising safety concerns for women and elderly walking in the evening.",
    category: "Electricity & Power",
    location: "Gate No. 2, Netaji Subhash Park, Coimbatore Central Zone",
    latitude: 28.6250,
    longitude: 77.2150,
    priority: "Medium",
    status: "Resolved",
    date: "2026-06-10T19:40:00Z",
    citizenName: "Aarav Sharma",
    citizenEmail: "citizen@gov.in",
    citizenPhone: "+91 98765 43210",
    assignedOfficer: "Nethra Swathi",
    assignedOfficerEmail: "nethraswathi17@gmail.com",
    department: "Roads & Highways", // Temporarily assigned for testing
    remarks: "LED bulb replaced. Wiring issue resolved.",
    resolutionNotes: "The electrical wiring had snapped due to tree branches. Dispatched pruning team, fixed the connection, and installed a new energy-efficient 100W LED street lamp. Operational checks successful.",
    beforeImage: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80",
    timeline: [
      { status: "Submitted", date: "2026-06-10T19:40:00Z", remarks: "Registered online." },
      { status: "Under Review", date: "2026-06-11T09:30:00Z", remarks: "Approved for dispatch." },
      { status: "Assigned", date: "2026-06-11T13:00:00Z", remarks: "Assigned to Maintenance Division." },
      { status: "In Progress", date: "2026-06-12T11:00:00Z", remarks: "Field team replacing light fixture." },
      { status: "Resolved", date: "2026-06-12T15:30:00Z", remarks: "Streetlight operational. Night safety restored." }
    ]
  },
  {
    id: "GOV-2026-1004",
    title: "Piled Up Unattended Garbage Dump",
    description: "Garbage is overflowing from the municipal bin onto the main street. Stray animals are scattering it everywhere, causing a horrible stench and creating an extremely unhygienic breeding ground for mosquitoes.",
    category: "Waste Management",
    location: "Opposite Sector 4 Metro Station, Coimbatore West Zone",
    latitude: 28.6300,
    longitude: 77.1200,
    priority: "Medium",
    status: "Submitted",
    date: "2026-06-17T14:50:00Z",
    citizenName: "Karan Johar",
    citizenEmail: "karan@example.com",
    citizenPhone: "+91 77665 54433",
    assignedOfficer: "",
    assignedOfficerEmail: "",
    department: "Waste Management",
    remarks: "",
    resolutionNotes: "",
    beforeImage: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
    afterImage: "",
    timeline: [
      { status: "Submitted", date: "2026-06-17T14:50:00Z", remarks: "Complaint logged by citizen. Image uploaded." }
    ]
  },
  {
    id: "GOV-2026-1005",
    title: "Open Manhole on Sidewalk",
    description: "A main sewage manhole cover is broken on the active pedestrian sidewalk, creating a deadly drop-trap. There are no barricades or warning signs around it.",
    category: "Water Supply & Sanitation",
    location: "Kasturba Gandhi Marg, Near metro gate 4, Coimbatore Central Zone",
    latitude: 28.6220,
    longitude: 77.2280,
    priority: "High",
    status: "Submitted",
    date: "2026-06-18T06:10:00Z",
    citizenName: "Aarav Sharma",
    citizenEmail: "citizen@gov.in",
    citizenPhone: "+91 98765 43210",
    assignedOfficer: "",
    assignedOfficerEmail: "",
    department: "Water Supply & Sanitation",
    remarks: "",
    resolutionNotes: "",
    beforeImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    afterImage: "",
    timeline: [
      { status: "Submitted", date: "2026-06-18T06:10:00Z", remarks: "Registered. Flagged as Immediate Safety Hazard by System Engine." }
    ]
  }
];

export const INITIAL_SECURITY_ALERTS = [
  {
    id: "alert-1",
    user: "citizen@gov.in",
    activity: "Failed Login Attempt (Password mismatch)",
    date: "2026-06-18T09:12:00Z",
    riskLevel: "Low",
    ipAddress: "192.168.1.45",
    device: "Chrome / Windows 11"
  },
  {
    id: "alert-2",
    user: "unknown@anonymous.org",
    activity: "Brute Force Suspected (5 failed logins in 1 min)",
    date: "2026-06-18T10:05:00Z",
    riskLevel: "High",
    ipAddress: "103.88.22.190",
    device: "Firefox / Linux"
  },
  {
    id: "alert-3",
    user: "karan@example.com",
    activity: "Account Blocked due to malicious complaints",
    date: "2026-06-17T16:30:00Z",
    riskLevel: "Medium",
    ipAddress: "172.16.2.89",
    device: "Safari / iOS Mobile"
  },
  {
    id: "alert-4",
    user: "citizen@gov.in",
    activity: "Duplicate Complaint Detection Triggered",
    date: "2026-06-18T06:11:00Z",
    riskLevel: "Low",
    ipAddress: "192.168.1.45",
    device: "Chrome / Windows 11",
    details: "Checked similarity (84%) against active complaint GOV-2026-1005 (Open Manhole)."
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "audit-1",
    userName: "Aarav Sharma",
    role: "citizen",
    action: "Complaint Registration",
    oldValue: "N/A",
    newValue: "Registered complaint GOV-2026-1005: Open Manhole on Sidewalk",
    date: "2026-06-18T06:10:00Z"
  },
  {
    id: "audit-2",
    userName: "Administrator",
    role: "admin",
    action: "User Account Modified",
    oldValue: "Role: Citizen, Status: Active",
    newValue: "Role: Citizen, Status: Blocked",
    date: "2026-06-17T16:30:00Z"
  },
  {
    id: "audit-3",
    userName: "Rajesh Kumar",
    role: "officer",
    action: "Complaint Status Update",
    oldValue: "Status: In Progress",
    newValue: "Status: Resolved (Bulb Replaced)",
    date: "2026-06-12T15:30:00Z"
  },
  {
    id: "audit-4",
    userName: "Administrator",
    role: "admin",
    action: "Complaint Assignment",
    oldValue: "Status: Under Review, Officer: Unassigned",
    newValue: "Status: Assigned, Officer: Rajesh Kumar",
    date: "2026-06-13T09:00:00Z"
  },
  {
    id: "audit-5",
    userName: "Aarav Sharma",
    role: "citizen",
    action: "Profile Update",
    oldValue: "Phone: +91 98000 00000",
    newValue: "Phone: +91 98765 43210",
    date: "2026-06-10T12:00:00Z"
  }
];
