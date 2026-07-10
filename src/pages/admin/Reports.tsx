import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Reports: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    const { data, error } = await supabase.from('survey_responses').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  };

  const exportCSV = async () => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `survey_responses_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = async () => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Responses");
      XLSX.writeFile(wb, `survey_responses_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    try {
      setLoading(true);
      const data = await fetchAllData();
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Gen Z Financial Literacy Survey Report', 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Total Responses: ${data.length}`, 14, 36);

      const tableData = data.map(r => [
        new Date(r.created_at).toLocaleDateString(),
        r.age_group,
        r.district,
        r.residence_type,
        r.literacy_score.toString(),
        r.literacy_category
      ]);

      autoTable(doc, {
        startY: 45,
        head: [['Date', 'Age', 'District', 'Residence', 'Score', 'Category']],
        body: tableData,
      });

      doc.save(`survey_summary_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Reports & Export</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card text-center py-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold mb-2">CSV Export</h3>
          <p className="text-gray-500 mb-6 text-sm">Download all raw data as a comma-separated values file.</p>
          <button onClick={exportCSV} disabled={loading} className="btn btn-primary w-full">
            <Download size={18} /> Download CSV
          </button>
        </div>

        <div className="glass-card text-center py-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4">
            <FileSpreadsheet size={32} />
          </div>
          <h3 className="text-lg font-bold mb-2">Excel Export</h3>
          <p className="text-gray-500 mb-6 text-sm">Download formatted data suitable for Excel analysis.</p>
          <button onClick={exportExcel} disabled={loading} className="btn btn-primary w-full">
            <Download size={18} /> Download Excel
          </button>
        </div>

        <div className="glass-card text-center py-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-bold mb-2">PDF Summary</h3>
          <p className="text-gray-500 mb-6 text-sm">Download a summary report of the survey results.</p>
          <button onClick={exportPDF} disabled={loading} className="btn btn-primary w-full">
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
