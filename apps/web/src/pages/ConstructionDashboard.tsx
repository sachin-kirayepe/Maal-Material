import React, { useEffect, useState } from "react";
import { useProjectStore } from "../store/projectStore";
import { useBoqStore } from "../store/boqStore";
import { useSiteOperationsStore } from "../store/siteOperationsStore";
import { useLaborStore } from "../store/laborStore";
import { useEquipmentStore } from "../store/equipmentStore";

export default function ConstructionDashboard() {
  const { projects, fetchProjects, isLoading: loadingProjects } = useProjectStore();
  const { items: boqItems, fetchItems: fetchBoq } = useBoqStore();
  const { activities, fetchActivities } = useSiteOperationsStore();
  const { attendance, fetchAttendance } = useLaborStore();
  const { assignments, fetchAssignments } = useEquipmentStore();

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (activeProjectId) {
      fetchBoq(activeProjectId);
      fetchActivities(activeProjectId);
      fetchAttendance(activeProjectId);
      fetchAssignments(activeProjectId);
    }
  }, [activeProjectId, fetchBoq, fetchActivities, fetchAttendance, fetchAssignments]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0]?.id || null);
    }
  }, [projects, activeProjectId]);

  if (loadingProjects) return <div className="p-8 text-white">Loading industrial projects...</div>;
  if (projects.length === 0)
    return <div className="p-8 text-white">No active construction projects.</div>;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Construction Execution</h1>
          <p className="text-gray-400 mt-1">Industrial Operations & Site Orchestration</p>
        </div>
        <div className="flex gap-4">
          <select
            value={activeProject?.id}
            onChange={(e) => setActiveProjectId(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
            Generate Site Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium">Project Budget</h3>
          <p className="text-2xl font-bold text-white mt-2">
            ${activeProject?.budget?.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium">Cost to Date</h3>
          <p className="text-2xl font-bold text-red-400 mt-2">
            ${activeProject?.costToDate?.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium">Completion</h3>
          <p className="text-2xl font-bold text-blue-400 mt-2">
            {activeProject?.completionPercentage}%
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 text-sm font-medium">Profitability</h3>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {activeProject?.profitability}%
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BOQ & Materials */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Bill of Quantities (BOQ)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Estimated</th>
                    <th className="px-4 py-3">Actual</th>
                    <th className="px-4 py-3">Variance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {boqItems.map((item) => (
                    <tr key={item.id} className="text-sm text-gray-300">
                      <td className="px-4 py-3 font-mono">{item.itemCode}</td>
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3">
                        {item.estimatedQty} {item.unit}
                      </td>
                      <td className="px-4 py-3">
                        {item.actualQty} {item.unit}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            item.actualQty > item.estimatedQty ? "text-red-400" : "text-emerald-400"
                          }
                        >
                          {((item.actualQty / item.estimatedQty) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Site Activities & Logs</h2>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-gray-900/50 p-4 rounded-lg border border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        {(activity as any).reportType}
                      </span>
                      <h4 className="text-white font-medium mt-1">{activity.summary}</h4>
                      <p className="text-sm text-gray-400 mt-1">{activity.progressDetails}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.activityDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Labor & Equipment Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Labor Attendance</h2>
            <div className="space-y-3">
              {attendance.map((worker) => (
                <div key={worker.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-white font-medium">{worker.workerName}</p>
                    <p className="text-gray-400 text-xs">
                      {worker.trade} ({worker.shift})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-medium">{worker.hoursWorked} hrs</p>
                    <p className="text-gray-400 text-xs">${worker.totalCalculatedWage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Equipment on Site</h2>
            <div className="space-y-4">
              {assignments.map((eq) => (
                <div key={eq.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-900/50 rounded-lg flex items-center justify-center border border-indigo-500/30">
                    <svg
                      className="w-5 h-5 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{eq.equipmentName}</p>
                    <p className="text-gray-400 text-xs">
                      {eq.status} • {eq.usageHours} hrs used
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
