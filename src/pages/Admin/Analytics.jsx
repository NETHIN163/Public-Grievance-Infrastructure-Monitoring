import React from 'react';
import { useSelector } from 'react-redux';
import { TrendingUp, BarChart3, PieChart, CheckCircle2, AlertOctagon } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import Card from '../../components/Shared/Card';

export default function Analytics() {
  const { complaints } = useSelector((state) => state.complaints);

  // 1. Category Distribution
  const categoryData = [
    { name: 'Roads & Highways', value: complaints.filter(c => c.category === 'Roads & Highways').length },
    { name: 'Water & Sanitation', value: complaints.filter(c => c.category === 'Water Supply & Sanitation').length },
    { name: 'Electricity & Power', value: complaints.filter(c => c.category === 'Electricity & Power').length },
    { name: 'Waste Management', value: complaints.filter(c => c.category === 'Waste Management').length },
    { name: 'Public Safety', value: complaints.filter(c => c.category === 'General Public Safety').length }
  ];

  // 2. Area Wise Complaints Mock
  const areaData = [
    { name: 'Zone A (Central)', active: complaints.filter(c => c.location.includes('Zone A') && c.status !== 'Resolved').length, resolved: complaints.filter(c => c.location.includes('Zone A') && c.status === 'Resolved').length },
    { name: 'Zone B (South)', active: complaints.filter(c => c.location.includes('Zone B') && c.status !== 'Resolved').length, resolved: complaints.filter(c => c.location.includes('Zone B') && c.status === 'Resolved').length },
    { name: 'Zone C (West)', active: complaints.filter(c => c.location.includes('Zone C') && c.status !== 'Resolved').length, resolved: complaints.filter(c => c.location.includes('Zone C') && c.status === 'Resolved').length },
    { name: 'Zone D (East)', active: 4, resolved: 12 },
    { name: 'Zone E (North)', active: 2, resolved: 8 }
  ];

  // 3. Resolution Efficiency Speed trends
  const efficiencyData = [
    { name: 'Week 1', roads: 4, water: 6, electricity: 8, waste: 12 },
    { name: 'Week 2', roads: 7, water: 9, electricity: 14, waste: 18 },
    { name: 'Week 3', roads: 12, water: 11, electricity: 22, waste: 24 },
    { name: 'Week 4', roads: 18, water: 15, electricity: 31, waste: 35 }
  ];

  // 4. Priority Distribution
  const priorityData = [
    { name: 'High Priority', value: complaints.filter(c => c.priority === 'High').length, color: '#ef4444' },
    { name: 'Medium Priority', value: complaints.filter(c => c.priority === 'Medium').length, color: '#f59e0b' },
    { name: 'Low Priority', value: complaints.filter(c => c.priority === 'Low').length, color: '#10b981' }
  ];

  // 5. Priority by Category Cross-Tabulation
  const priorityCategoryData = [
    { name: 'Roads & Highways', high: complaints.filter(c => c.category === 'Roads & Highways' && c.priority === 'High').length, medium: complaints.filter(c => c.category === 'Roads & Highways' && c.priority === 'Medium').length, low: complaints.filter(c => c.category === 'Roads & Highways' && c.priority === 'Low').length },
    { name: 'Water & Sanitation', high: complaints.filter(c => c.category === 'Water Supply & Sanitation' && c.priority === 'High').length, medium: complaints.filter(c => c.category === 'Water Supply & Sanitation' && c.priority === 'Medium').length, low: complaints.filter(c => c.category === 'Water Supply & Sanitation' && c.priority === 'Low').length },
    { name: 'Electricity & Power', high: complaints.filter(c => c.category === 'Electricity & Power' && c.priority === 'High').length, medium: complaints.filter(c => c.category === 'Electricity & Power' && c.priority === 'Medium').length, low: complaints.filter(c => c.category === 'Electricity & Power' && c.priority === 'Low').length },
    { name: 'Waste Management', high: complaints.filter(c => c.category === 'Waste Management' && c.priority === 'High').length, medium: complaints.filter(c => c.category === 'Waste Management' && c.priority === 'Medium').length, low: complaints.filter(c => c.category === 'Waste Management' && c.priority === 'Low').length },
    { name: 'Public Safety', high: complaints.filter(c => c.category === 'General Public Safety' && c.priority === 'High').length, medium: complaints.filter(c => c.category === 'General Public Safety' && c.priority === 'Medium').length, low: complaints.filter(c => c.category === 'General Public Safety' && c.priority === 'Low').length }
  ];

  const COLORS = ['#0B2545', '#1E5D46', '#134074', '#C78B2D', '#64748B'];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center space-x-2">
        <TrendingUp className="w-6 h-6 text-govBlue" />
        <div>
          <h2 className="text-xl font-extrabold text-govBlue">Performance Analytics Dashboard</h2>
          <p className="text-xs text-govMatte-muted">Inspect municipal response speeds, geographic failure densities, and work checklists.</p>
        </div>
      </div>

      {/* Priority Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="hover:border-red-500/20 bg-red-50/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-red-600">{priorityData[0].value}</p>
              <h4 className="text-[10px] font-bold text-red-700/70 uppercase tracking-wider mt-0.5">High Priority Cases</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
              <span className="text-sm">🔴</span>
            </div>
          </div>
        </Card>
        
        <Card className="hover:border-amber-500/20 bg-amber-50/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-amber-600">{priorityData[1].value}</p>
              <h4 className="text-[10px] font-bold text-amber-700/70 uppercase tracking-wider mt-0.5">Medium Priority Cases</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
              <span className="text-sm">🟡</span>
            </div>
          </div>
        </Card>

        <Card className="hover:border-emerald-500/20 bg-emerald-50/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-emerald-600">{priorityData[2].value}</p>
              <h4 className="text-[10px] font-bold text-emerald-700/70 uppercase tracking-wider mt-0.5">Low Priority Cases</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
              <span className="text-sm">🟢</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Geographic Area density */}
        <Card className="flex flex-col justify-between">
          <div className="border-b border-govMatte-border/40 pb-3 mb-4 flex items-center space-x-2">
            <BarChart3 className="w-4.5 h-4.5 text-govBlue" />
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider">Area-Wise Incident Densities</h3>
          </div>
          <div className="w-full h-64 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip />
                <Legend iconSize={10} iconType="circle" />
                <Bar dataKey="active" name="Active Case Load" fill="#0B2545" stackId="a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved Closed" fill="#1E5D46" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category distribution Pie */}
        <Card className="flex flex-col justify-between">
          <div className="border-b border-govMatte-border/40 pb-3 mb-4 flex items-center space-x-2">
            <PieChart className="w-4.5 h-4.5 text-govBlue" />
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider">Complaint Categories Breakdown</h3>
          </div>
          <div className="w-full h-64 text-[10px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority Distribution Pie Chart */}
        <Card className="flex flex-col justify-between">
          <div className="border-b border-govMatte-border/40 pb-3 mb-4 flex items-center space-x-2">
            <AlertOctagon className="w-4.5 h-4.5 text-govBlue" />
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider">Overall Priority Distribution</h3>
          </div>
          <div className="w-full h-64 text-[10px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority by Category Bar Chart */}
        <Card className="flex flex-col justify-between">
          <div className="border-b border-govMatte-border/40 pb-3 mb-4 flex items-center space-x-2">
            <BarChart3 className="w-4.5 h-4.5 text-govBlue" />
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider">Priority Breakdown by Department</h3>
          </div>
          <div className="w-full h-64 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityCategoryData} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend iconSize={10} iconType="circle" />
                <Bar dataKey="high" name="High Priority" stackId="a" fill="#ef4444" />
                <Bar dataKey="medium" name="Medium Priority" stackId="a" fill="#f59e0b" />
                <Bar dataKey="low" name="Low Priority" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Resolution Speed Trends */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="border-b border-govMatte-border/40 pb-3 mb-4 flex items-center space-x-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-govGreen" />
            <h3 className="text-xs font-extrabold text-govBlue uppercase tracking-wider">Weekly Resolution Efficiency (Units Dispatched)</h3>
          </div>
          <div className="w-full h-64 text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} />
                <Tooltip />
                <Legend iconSize={10} iconType="circle" />
                <Line type="monotone" dataKey="roads" name="Roads & Highways" stroke="#0B2545" strokeWidth={2} />
                <Line type="monotone" dataKey="water" name="Water & Sanitation" stroke="#1E5D46" strokeWidth={2} />
                <Line type="monotone" dataKey="electricity" name="Electricity & Power" stroke="#134074" strokeWidth={2} />
                <Line type="monotone" dataKey="waste" name="Waste Management" stroke="#C78B2D" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
}
