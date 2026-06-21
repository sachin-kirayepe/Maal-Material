import React, { useEffect } from "react";
import { useFieldStore } from "../../stores/fieldStore";

export default function FieldOperationsCenter() {
  const { tasks, isLoading, error, fetchTasks } = useFieldStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading) return <div className="p-8 text-white">Loading Field Operations...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
        Field Operations Center
      </h1>

      <div className="bg-[#111] p-6 rounded-xl border border-amber-500/20 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-amber-400">Dispatched Tasks</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-[#1a1a1a]">
              <tr>
                <th className="px-6 py-3">Task Type</th>
                <th className="px-6 py-3">Assignee</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-gray-800 hover:bg-[#1a1a1a] transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">{task.taskType}</td>
                  <td className="px-6 py-4">
                    {task.assignee?.firstName || "Unassigned"} {task.assignee?.lastName || ""}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === "HIGH" || task.priority === "URGENT"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.status === "COMPLETED"
                          ? "bg-green-500/20 text-green-400"
                          : task.status === "IN_PROGRESS"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <pre className="text-xs text-gray-500">{task.payload}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
