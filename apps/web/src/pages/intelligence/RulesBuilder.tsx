import React, { useEffect, useState } from "react";
import { useRulesStore } from "../../stores/rulesStore";
import { Plus as PlusIcon, Save as SaveIcon, Activity as ActivityIcon } from "lucide-react";
const Plus = PlusIcon as any;
const Save = SaveIcon as any;
const Activity = ActivityIcon as any;

export default function RulesBuilder() {
  const { rules, fetchRules, createRule, executions, fetchExecutions } = useRulesStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    module: "INVENTORY",
    eventTrigger: "STOCK_UPDATED",
    conditions: { all: [] },
    actions: { type: "ALERT", title: "", message: "" },
  });

  useEffect(() => {
    fetchRules();
    fetchExecutions();
  }, [fetchRules, fetchExecutions]);

  const handleCreate = async () => {
    await createRule({ ...newRule, isActive: true });
    setIsCreating(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Business Rules Engine</h1>
          <p className="text-gray-500 mt-1">Configure automated workflows and alerts.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Rule
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Create New Rule</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Rule Name"
              className="border p-2 rounded-lg"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
            />
            <input
              placeholder="Description"
              className="border p-2 rounded-lg"
              value={newRule.description}
              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              className="border p-2 rounded-lg"
              value={newRule.module}
              onChange={(e) => setNewRule({ ...newRule, module: e.target.value })}
            >
              <option value="INVENTORY">Inventory</option>
              <option value="FINANCE">Finance</option>
              <option value="LOGISTICS">Logistics</option>
            </select>
            <input
              placeholder="Event Trigger (e.g., INVOICE_CREATED)"
              className="border p-2 rounded-lg"
              value={newRule.eventTrigger}
              onChange={(e) => setNewRule({ ...newRule, eventTrigger: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conditions (JSON format)
            </label>
            <textarea
              className="border p-2 rounded-lg w-full font-mono text-sm"
              rows={4}
              value={JSON.stringify(newRule.conditions, null, 2)}
              onChange={(e) => {
                try {
                  setNewRule({ ...newRule, conditions: JSON.parse(e.target.value) });
                } catch (err) {}
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actions (JSON format)
            </label>
            <textarea
              className="border p-2 rounded-lg w-full font-mono text-sm"
              rows={3}
              value={JSON.stringify(newRule.actions, null, 2)}
              onChange={(e) => {
                try {
                  setNewRule({ ...newRule, actions: JSON.parse(e.target.value) });
                } catch (err) {}
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 border rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Save Rule
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-semibold text-gray-900">
            Active Rules
          </div>
          <ul className="divide-y divide-gray-100">
            {rules.map((r, i) => (
              <li key={i} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{r.name}</h4>
                  <p className="text-xs text-gray-500">{r.description}</p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  Active
                </span>
              </li>
            ))}
            {rules.length === 0 && <li className="p-4 text-sm text-gray-500">No active rules.</li>}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-500" /> Recent Executions
          </div>
          <ul className="divide-y divide-gray-100">
            {executions.slice(0, 10).map((ex, i) => (
              <li key={i} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {ex.rule?.name || "Rule Executed"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(ex.executedAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs font-mono bg-gray-100 p-2 rounded text-gray-600 truncate">
                  Result: {ex.result}
                </div>
              </li>
            ))}
            {executions.length === 0 && (
              <li className="p-4 text-sm text-gray-500">No recent executions.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
