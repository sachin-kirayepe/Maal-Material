import React, { useEffect } from "react";
import { useTaxStore } from "../../stores/taxStore";

export default function TaxCenter() {
  const { rules, records, loading, fetchTaxData } = useTaxStore();

  useEffect(() => {
    fetchTaxData();
  }, []);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Tax Orchestration Center
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Global tax rules, GST/VAT pipelines, and compliance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Tax Rules</h2>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 border border-gray-100 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {rule.taxType} - {rule.country}
                    </h3>
                    <p className="text-xs text-gray-500">{rule.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
                      {rule.taxRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Tax Records</h2>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 rounded-lg">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Reference</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Taxable</th>
                    <th className="px-4 py-3 text-right rounded-r-lg">Tax Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{record.referenceId}</td>
                      <td className="px-4 py-3 text-gray-500">{record.referenceType}</td>
                      <td className="px-4 py-3 text-gray-600">
                        ${record.taxableAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        ${record.taxAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        No tax records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
