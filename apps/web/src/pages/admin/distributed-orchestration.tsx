import { useEffect } from "react";
import { useDistributedStore } from "../../stores/distributedStore";

export default function DistributedOrchestration() {
  const { tasks, fetchTasks, retryTask } = useDistributedStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Distributed Orchestration Center</h1>
        <p className="text-gray-600 mb-8">
          Monitor multi-step asynchronous sagas and message queues.
        </p>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payload
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{task.taskType}</div>
                    <div className="text-xs text-red-500 mt-1">{task.errorMessage}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        task.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : task.status === "FAILED"
                            ? "bg-red-100 text-red-800"
                            : task.status === "RETRYING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.retryCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">
                    <pre className="bg-gray-50 p-2 rounded max-w-xs overflow-auto">
                      {task.payload}
                    </pre>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {(task.status === "FAILED" ||
                      task.status === "RETRYING" ||
                      task.status === "PENDING") && (
                      <button
                        onClick={() => retryTask(task.id)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded"
                      >
                        Force Retry
                      </button>
                    )}
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
