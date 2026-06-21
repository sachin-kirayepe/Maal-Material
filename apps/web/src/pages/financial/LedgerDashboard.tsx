import React, { useState } from "react";
import { useLedgerStore } from "../../stores/ledgerStore";
import {
  Wallet as WalletIcon,
  ArrowDownRight as ArrowDownRightIcon,
  ArrowUpRight as ArrowUpRightIcon,
  FileText as FileTextIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
} from "lucide-react";
const FileText = FileTextIcon as any;
const CheckCircle = CheckCircleIcon as any;
const Search = SearchIcon as any;
const Wallet = WalletIcon as any;
const ArrowUpRight = ArrowUpRightIcon as any;
const ArrowDownRight = ArrowDownRightIcon as any;
import { formatCurrency, formatDate } from "../../utils/formatters";

const LedgerDashboard: React.FC = () => {
  const { customerLedger, settlements, fetchCustomerLedger, fetchCustomerSettlements, isLoading } =
    useLedgerStore();
  const [customerId, setCustomerId] = useState("");
  const [activeTab, setActiveTab] = useState<"entries" | "settlements">("entries");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerId) {
      fetchCustomerLedger(customerId);
      fetchCustomerSettlements(customerId);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Ledger & Financials</h1>
          <p className="text-gray-500 mt-1">
            Manage customer accounts, settlements, and due tracking.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Customer ID..."
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Load Ledger
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : customerLedger ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Current Balance</p>
                <h3
                  className={`text-2xl font-bold ${customerLedger.balance > 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {formatCurrency(Math.abs(customerLedger.balance))}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {customerLedger.balance > 0 ? "Due" : "Advance"}
                  </span>
                </h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Debit (Receivables)</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    customerLedger.entries.reduce(
                      (acc: number, entry: any) => acc + entry.debit,
                      0,
                    ),
                  )}
                </h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <ArrowDownRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Credit (Paid)</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    customerLedger.entries.reduce(
                      (acc: number, entry: any) => acc + entry.credit,
                      0,
                    ),
                  )}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("entries")}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === "entries"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Ledger Entries
              </button>
              <button
                onClick={() => setActiveTab("settlements")}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === "settlements"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Settlements History
              </button>
            </div>

            <div className="p-0">
              {activeTab === "entries" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                          Description
                        </th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                          Ref Type
                        </th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase text-right">
                          Debit
                        </th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase text-right">
                          Credit
                        </th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase text-right">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {customerLedger.entries.map((entry: any) => (
                        <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 text-sm text-gray-500">
                            {formatDate(entry.entryDate)}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                            {entry.description}
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                              {entry.referenceType}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-right text-red-600 font-medium">
                            {entry.debit > 0 ? formatCurrency(entry.debit) : "-"}
                          </td>
                          <td className="py-4 px-6 text-sm text-right text-green-600 font-medium">
                            {entry.credit > 0 ? formatCurrency(entry.credit) : "-"}
                          </td>
                          <td className="py-4 px-6 text-sm text-right font-bold text-gray-900">
                            {formatCurrency(entry.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "settlements" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                          Settlement No
                        </th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                          Method
                        </th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase text-right">
                          Amount Applied
                        </th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {settlements.map((settlement: any) => (
                        <tr key={settlement.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                            {settlement.settlementNumber}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500">
                            {formatDate(settlement.createdAt)}
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                              {settlement.paymentMethod.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-right font-bold text-gray-900">
                            {formatCurrency(settlement.amountApplied)}
                          </td>
                          <td className="py-4 px-6">
                            <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              Success
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Ledger Loaded</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Enter a valid Customer ID above to view their financial ledger, outstanding dues, and
            settlement history.
          </p>
        </div>
      )}
    </div>
  );
};

export default LedgerDashboard;
