import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Search } from 'lucide-react';

export const Responses: React.FC = () => {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setResponses(data || []);
    } catch (err) {
      console.error('Error fetching responses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResponses = responses.filter(r => 
    r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Survey Responses</h1>
      </div>

      <div className="filters-bar flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="Search by ID or District..." 
            className="form-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="text-sm text-gray-500">
          Showing {filteredResponses.length} of {responses.length}
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading responses...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Age</th>
                <th>Gender</th>
                <th>District</th>
                <th>Score</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResponses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">No responses found</td>
                </tr>
              ) : (
                filteredResponses.map(r => (
                  <tr key={r.id}>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>{r.age_group}</td>
                    <td>{r.gender}</td>
                    <td>{r.district}</td>
                    <td>
                      <span className="font-bold">{r.literacy_score}</span>/3
                    </td>
                    <td>
                      <span className={`badge ${
                        r.literacy_score === 3 ? 'badge-green' : 
                        r.literacy_score === 2 ? 'badge-blue' : 
                        r.literacy_score === 1 ? 'badge-gray' : 'badge-red'
                      }`}>
                        {r.literacy_category}
                      </span>
                    </td>
                    <td>
                      <button className="text-blue-600 hover:underline text-sm font-medium">View Details</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
