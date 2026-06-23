import React from 'react';
import { useSelector } from 'react-redux';
import { TrendingUp, BarChart3, PieChart, CheckCircle2 } from 'lucide-react';
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
