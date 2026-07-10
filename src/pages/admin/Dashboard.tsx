import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, CheckCircle, TrendingUp, Wallet, ArrowUpRight, ShoppingBag } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({
    total: 0,
    avgScore: 0,
    savePercent: 0,
    budgetPercent: 0,
    investPercent: 0,
    upiPercent: 0,
    qcPercent: 0,
    creditPercent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.from('survey_responses').select('*');
      
      if (error) throw error;
      if (!data) return;

      const total = data.length;
      if (total === 0) {
        setLoading(false);
        return;
      }

      const totalScore = data.reduce((acc, curr) => acc + curr.literacy_score, 0);
      const avgScore = (totalScore / total).toFixed(2);
      
      const savers = data.filter(r => r.saving_status !== 'No').length;
      const budgeters = data.filter(r => r.budgeting_frequency === 'Always' || r.budgeting_frequency === 'Often').length;
      const investors = data.filter(r => r.investment_status === 'Yes').length;
      const upiUsers = data.filter(r => r.upi_frequency !== 'Never').length;
      const qcUsers = data.filter(r => r.qc_frequency !== 'Never').length;
      const creditUsers = data.filter(r => r.credit_facilities_used.length > 0 && !r.credit_facilities_used.includes('None of the above')).length;

      setStats({
        total,
        avgScore,
        savePercent: ((savers / total) * 100).toFixed(1),
        budgetPercent: ((budgeters / total) * 100).toFixed(1),
        investPercent: ((investors / total) * 100).toFixed(1),
        upiPercent: ((upiUsers / total) * 100).toFixed(1),
        qcPercent: ((qcUsers / total) * 100).toFixed(1),
        creditPercent: ((creditUsers / total) * 100).toFixed(1),
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center mt-12"><svg className="animate-spin text-blue-600" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg></div>;
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Overview Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Responses</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-icon"><Users size={24} /></div>
        </div>
        
        <div className="stat-card">
          <div>
            <div className="stat-label">Avg. Literacy Score</div>
            <div className="stat-value">{stats.avgScore} <span className="text-sm font-normal text-gray-500">/ 3</span></div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><CheckCircle size={24} /></div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Save Money</div>
            <div className="stat-value">{stats.savePercent}%</div>
          </div>
          <div className="stat-icon"><Wallet size={24} /></div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Active Investors</div>
            <div className="stat-value">{stats.investPercent}%</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><TrendingUp size={24} /></div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Use UPI</div>
            <div className="stat-value">{stats.upiPercent}%</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><ArrowUpRight size={24} /></div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Use Quick-Commerce</div>
            <div className="stat-value">{stats.qcPercent}%</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}><ShoppingBag size={24} /></div>
        </div>
      </div>
    </div>
  );
};
