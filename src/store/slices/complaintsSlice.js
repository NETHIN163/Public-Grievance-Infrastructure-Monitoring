import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_COMPLAINTS } from '../../mockData';
import { calculatePriority } from '../../services/priorityEngine';

const getStoredComplaints = () => {
  const stored = localStorage.getItem('gov_complaints');
  if (stored) {
    // Re-calculate priority for any complaints missing prioritySource (migration)
    const parsed = JSON.parse(stored);
    return parsed.map(c => {
      if (!c.prioritySource) {
        const result = calculatePriority(c.description, c.category);
        return { ...c, priority: c.priority || result.priority, prioritySource: result.source };
      }
      return c;
    });
  }
  // Seed initial complaints with priority engine metadata
  const seeded = INITIAL_COMPLAINTS.map(c => {
    const result = calculatePriority(c.description, c.category);
    return { ...c, priority: c.priority || result.priority, prioritySource: result.source };
  });
  localStorage.setItem('gov_complaints', JSON.stringify(seeded));
  return seeded;
};

const initialState = {
  complaints: getStoredComplaints(),
  loading: false,
  error: null
};

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    addComplaint: (state, action) => {
      const { title, description, category, location, priority, citizenName, citizenEmail, citizenPhone } = action.payload;
      
      // AI Priority Engine — compute priority from description + category
      const priorityResult = calculatePriority(description, category);
      // Use engine result, but allow explicit override if passed
      const finalPriority = priority || priorityResult.priority || 'Medium';

      const newId = `GOV-2026-${1000 + state.complaints.length + 1}`;
      const newComplaint = {
        id: newId,
        title,
        description,
        category,
        location,
        latitude: 28.6 + Math.random() * 0.1,
        longitude: 77.2 + Math.random() * 0.1,
        priority: finalPriority,
        prioritySource: priorityResult.source,
        priorityConfidence: priorityResult.confidence,
        matchedKeywords: priorityResult.matchedKeywords,
        status: 'Submitted',
        date: new Date().toISOString(),
        citizenName,
        citizenEmail,
        citizenPhone,
        assignedOfficer: '',
        assignedOfficerEmail: '',
        department: category,
        remarks: '',
        resolutionNotes: '',
        beforeImage: 'https://images.unsplash.com/photo-1599740831464-5cbe1a1c6841?auto=format&fit=crop&w=800&q=80', // Default mock upload image
        afterImage: '',
        timeline: [
          {
            status: 'Submitted',
            date: new Date().toISOString(),
            remarks: `Complaint registered successfully. AI Priority Engine assigned ${finalPriority} priority (${priorityResult.confidence}% confidence).`
          }
        ]
      };
      
      state.complaints.unshift(newComplaint);
      localStorage.setItem('gov_complaints', JSON.stringify(state.complaints));
    },
    assignComplaint: (state, action) => {
      const { id, officerName, officerEmail, department } = action.payload;
      state.complaints = state.complaints.map(c => {
        if (c.id === id) {
          const updatedTimeline = [...c.timeline, {
            status: 'Assigned',
            date: new Date().toISOString(),
            remarks: `Assigned to Officer ${officerName} (${department})`
          }];
          return {
            ...c,
            status: 'Assigned',
            assignedOfficer: officerName,
            assignedOfficerEmail: officerEmail,
            department: department,
            timeline: updatedTimeline
          };
        }
        return c;
      });
      localStorage.setItem('gov_complaints', JSON.stringify(state.complaints));
    },
    updateComplaintStatus: (state, action) => {
      const { id, status, remarks, resolutionNotes, afterImage } = action.payload;
      state.complaints = state.complaints.map(c => {
        if (c.id === id) {
          const updatedTimeline = [...c.timeline, {
            status,
            date: new Date().toISOString(),
            remarks: remarks || `Status transitioned to ${status}`
          }];
          
          const updated = {
            ...c,
            status,
            remarks: remarks || c.remarks,
            timeline: updatedTimeline
          };
          
          if (status === 'Resolved') {
            updated.resolutionNotes = resolutionNotes || 'Resolution completed by department.';
            updated.afterImage = afterImage || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80'; // Mock after image
          }
          
          return updated;
        }
        return c;
      });
      localStorage.setItem('gov_complaints', JSON.stringify(state.complaints));
    },
    editComplaint: (state, action) => {
      const { id, title, description, category, location, priority } = action.payload;
      state.complaints = state.complaints.map(c => {
        if (c.id === id) {
          return { ...c, title, description, category, location, priority };
        }
        return c;
      });
      localStorage.setItem('gov_complaints', JSON.stringify(state.complaints));
    },
    deleteComplaint: (state, action) => {
      const id = action.payload;
      state.complaints = state.complaints.filter(c => c.id !== id);
      localStorage.setItem('gov_complaints', JSON.stringify(state.complaints));
    }
  }
});

export const {
  addComplaint,
  assignComplaint,
  updateComplaintStatus,
  editComplaint,
  deleteComplaint
} = complaintsSlice.actions;
export default complaintsSlice.reducer;
