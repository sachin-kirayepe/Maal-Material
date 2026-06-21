import React, { useEffect, useState } from "react";
import { useComplianceStore } from "../../stores/complianceStore";

export default function ComplianceCenter() {
  const { records, isLoading, error, fetchRecords, generateReport } = useComplianceStore();
  const [reportType, setReportType] = useState("SOC2_ACCESS_REVIEW");

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleGenerate = () => {
    generateReport(reportType);
  };

  if (isLoading && records.length === 0)
    return <div className="p-8 text-white">Loading Compliance Data...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
          Enterprise Compliance Center
        </h1>

        <div className="flex gap-4">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-[#1a1a1a] border border-emerald-500/30 text-white rounded px-4 py-2"
          >
            <option value="SOC2_ACCESS_REVIEW">SOC2 Access Review</option>
            <option value="GDPR_DATA_AUDIT">GDPR Data Audit</option>
            <option value="HIPAA_LOG_REVIEW">HIPAA Log Review</option>
          </select>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      <div className="bg-[#111] p-6 rounded-xl border border-emerald-500/20">
        <h2 className="text-xl font-semibold mb-4 text-emerald-400">
          Compliance & Regulatory Reports
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-[#1a1a1a]">
              <tr>
                <th className="px-6 py-3">Report Type</th>
                <th className="px-6 py-3">Summary</th>
                <th className="px-6 py-3">Period</th>
                <th className="px-6 py-3">Generated At</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-emerald-400">{record.reportType}</td>
                  <td className="px-6 py-4 text-white">{record.summary}</td>
                  <td className="px-6 py-4">
                    {new Date(record.periodStart).toLocaleDateString()} -{" "}
                    {new Date(record.periodEnd).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{new Date(record.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
