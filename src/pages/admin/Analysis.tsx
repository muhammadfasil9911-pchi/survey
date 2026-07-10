import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Analysis: React.FC = () => {
  // Placeholder data - in a real app this would be aggregated from Supabase
  const ageData = [
    { name: 'Below 18', count: 45 },
    { name: '18-20', count: 120 },
    { name: '21-23', count: 200 },
    { name: '24-27', count: 150 },
    { name: 'Above 27', count: 30 },
  ];

  const scoreData = [
    { name: 'High (3)', value: 120, color: '#10b981' },
    { name: 'Moderate (2)', value: 250, color: '#3b82f6' },
    { name: 'Low (1)', value: 100, color: '#64748b' },
    { name: 'Very Low (0)', value: 75, color: '#ef4444' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Data Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4">Responses by Age Group</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-lg font-semibold mb-4">Financial Literacy Score Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
