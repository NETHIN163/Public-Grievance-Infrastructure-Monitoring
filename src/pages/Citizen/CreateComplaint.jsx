import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, Upload, AlertCircle, FilePlus } from 'lucide-react';
import { addComplaint } from '../../store/slices/complaintsSlice';
import { addAuditLog } from '../../store/slices/securitySlice';
import Card from '../../components/Shared/Card';
import Alert from '../../components/Shared/Alert';

export default function CreateComplaint() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  
  // System Suggestions State
  const [systemSuggestions, setSystemSuggestions] = useState({
    category: 'Analyzing text...',
    priority: 'Low',
    confidence: 0
  });

  const [error, setError] = useState('');

  // Live text parsing to simulate system suggestions
  useEffect(() => {
    const text = (form.title + " " + form.description).toLowerCase();
    
    if (text.trim().length < 5) {
      setSystemSuggestions({ category: 'Type more details...', priority: 'Low', confidence: 0 });
      return;
    }

    if (text.includes('pothole') || text.includes('road') || text.includes('street damage') || text.includes('highway')) {
      setSystemSuggestions({
        category: 'Roads & Highways',
        priority: 'High',
        confidence: 94
      });
      // Synchronize category if not selected manually
      if (!form.category) setForm(prev => ({ ...prev, category: 'Roads & Highways' }));
    } else if (text.includes('water') || text.includes('contamination') || text.includes('leakage') || text.includes('sewage') || text.includes('drain')) {
      setSystemSuggestions({
        category: 'Water Supply & Sanitation',
        priority: 'High',
        confidence: 96
      });
      if (!form.category) setForm(prev => ({ ...prev, category: 'Water Supply & Sanitation' }));
    } else if (text.includes('streetlight') || text.includes('electricity') || text.includes('power') || text.includes('wire')) {
      setSystemSuggestions({
        category: 'Electricity & Power',
        priority: 'Medium',
        confidence: 89
      });
      if (!form.category) setForm(prev => ({ ...prev, category: 'Electricity & Power' }));
    } else if (text.includes('garbage') || text.includes('waste') || text.includes('dump') || text.includes('litter') || text.includes('stench')) {
      setSystemSuggestions({
        category: 'Waste Management',
        priority: 'Medium',
        confidence: 91
      });
      if (!form.category) setForm(prev => ({ ...prev, category: 'Waste Management' }));
    } else {
      setSystemSuggestions({
        category: 'General Public Safety',
        priority: 'Low',
        confidence: 72
      });
    }
  }, [form.title, form.description]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.description || !form.category || !form.location) {
      setError("Please fill out all mandatory fields.");
      return;
    }

    // Submit complaint
    dispatch(addComplaint({
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      priority: systemSuggestions.priority,
      citizenName: currentUser.name,
      citizenEmail: currentUser.email,
      citizenPhone: currentUser.phone
    }));

    // Log Audit
    dispatch(addAuditLog({
      userName: currentUser.name,
      role: currentUser.role,
      action: 'Complaint Registration',
      oldValue: 'N/A',
      newValue: `Created case: ${form.title} (Category: ${form.category})`
    }));

    navigate('/citizen/my-complaints');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center space-x-2.5 mb-6">
        <FilePlus className="w-6 h-6 text-govBlue" />
        <div>
          <h2 className="text-xl font-extrabold text-govBlue">Register Grievance Ticket</h2>
          <p className="text-xs text-govMatte-muted">Report infrastructure anomalies directly to the zone monitoring board.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Form panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4 text-xs font-semibold text-govMatte-text">
          <Card>
            <div className="space-y-4">
              
              <div className="space-y-1">
                <label htmlFor="title" className="block text-govMatte-muted">Grievance Subject / Short Title</label>
                <input
                  id="title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Deep potholes opposite Block 3 gate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="desc" className="block text-govMatte-muted">Detailed Incident Description</label>
                <textarea
                  id="desc"
                  required
                  rows="5"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide precise details of the infrastructure damage, duration, and safety hazards..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="cat" className="block text-govMatte-muted">Operational Category</label>
                  <select
                    id="cat"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-white font-medium"
                  >
                    <option value="">-- Select Department --</option>
                    <option value="Roads & Highways">Roads & Highways</option>
                    <option value="Water Supply & Sanitation">Water & Sanitation</option>
                    <option value="Electricity & Power">Electricity & Power</option>
                    <option value="Waste Management">Waste Management</option>
                    <option value="General Public Safety">General Public Safety</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="loc" className="block text-govMatte-muted">Incident Street Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-govMatte-muted">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <input
                      id="loc"
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Ring Road Sector 14, New Delhi"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-govMatte-border focus:outline-none focus:border-govBlue/60 bg-govMatte-bg/30 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Image Section */}
              <div className="space-y-1">
                <label className="block text-govMatte-muted">Upload Incident Photographic Evidence</label>
                <div className="border-2 border-dashed border-govMatte-border rounded-2xl p-6 text-center hover:border-govBlue/40 matte-transition relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-govMatte-muted mx-auto" />
                    <p className="text-govMatte-muted text-[11px]">Click or drag before-resolution photos to attach (PNG, JPG max 5MB)</p>
                  </div>
                </div>
                {imagePreview && (
                  <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-govMatte-border">
                    <img src={imagePreview} alt="Incident Upload Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

            </div>
          </Card>
          
          <button
            type="submit"
            className="w-full py-2.5 bg-govBlue text-white font-bold rounded-xl hover:bg-govBlue-light shadow-md shadow-govBlue/15 flex items-center justify-center space-x-2 matte-transition text-xs"
          >
            <FilePlus className="w-4 h-4" />
            <span>Transmit Grievance Details</span>
          </button>
        </form>

        {/* System Suggestion Panel */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-govBlue-dark via-govBlue to-govBlue-light border-slate-700/60 shadow-lg text-white">
            <div className="flex items-center space-x-2 border-b border-white/10 pb-3 mb-4">
              <Sparkles className="w-5 h-5 text-govGreen-light animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-100">Telemetry Pre-Check</h3>
            </div>
            
            <div className="space-y-4 text-xs leading-normal">
              
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Predicted Department</p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 font-bold text-slate-100">
                  {systemSuggestions.category}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Severity Level</p>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    systemSuggestions.priority === 'High' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : systemSuggestions.priority === 'Medium'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                  }`}>
                    {systemSuggestions.priority} Priority
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Match Confidence</p>
                  <span className="font-mono text-sm font-extrabold text-govGreen-light">
                    {systemSuggestions.confidence}%
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 bg-slate-950/45 p-3 rounded-xl border border-white/5 text-[10px] text-slate-300">
                <AlertCircle className="w-4 h-4 text-govGreen-light flex-shrink-0 mt-0.5" />
                <p>The system automatically analyzes text indicators to sort priorities and scan coordinates. These metrics help the dispatcher assign tasks without manual routing delays.</p>
              </div>

            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
