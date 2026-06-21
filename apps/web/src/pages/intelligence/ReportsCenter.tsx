import React, { useEffect, useState } from "react";
import {
  Download as DownloadIcon,
  FileText as FileTextIcon,
  Settings as SettingsIcon,
  Play as PlayIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ApiClient } from "../../lib/api-client";

const Download = DownloadIcon as any;
const FileText = FileTextIcon as any;
const Settings = SettingsIcon as any;
const Play = PlayIcon as any;

export default function ReportsCenter() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
    fetchReports();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await ApiClient.get<any>("/reports/templates");
      setTemplates(res.data || res || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await ApiClient.get<any>("/reports");
      setReports(res.data || res || []);
    } catch (e) {
      console.error(e);
    }
  };

  const generateReport = async (templateId: string) => {
    setIsGenerating(templateId);
    try {
      toast.info("Queueing report generation...");
      await ApiClient.post("/reports/generate", { templateId, tenantId: "GLOBAL" });
      toast.success("Report queued successfully.");
      setIsGenerating(null);
      fetchReports();
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report.");
      setIsGenerating(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Enterprise Reports</h1>
          <p className="text-gray-500 mt-1">
            Generate and manage analytics and compliance reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Templates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-500" /> Report Templates
          </div>
          <ul className="divide-y divide-gray-100">
            {templates.map((t) => (
              <li key={t.id} className="p-4 hover:bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-900">{t.name}</h4>
                <p className="text-xs text-gray-500 mb-3">{t.description}</p>
                <button
                  disabled={isGenerating === t.id}
                  onClick={() => generateReport(t.id)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  {isGenerating === t.id ? (
                    "Generating..."
                  ) : (
                    <>
                      <Play className="h-3 w-3" /> Generate Now
                    </>
                  )}
                </button>
              </li>
            ))}
            {templates.length === 0 && (
              <li className="p-4 text-sm text-gray-500">No templates found.</li>
            )}
          </ul>
        </div>

        {/* Generated Reports */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" /> Generated Archives
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Report Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {r.template?.name || "Custom Report"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : r.status === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {r.status === "COMPLETED" && (
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-xs">
                          <Download className="h-4 w-4" /> Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      No reports generated yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
