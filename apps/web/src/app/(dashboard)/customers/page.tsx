"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@constructos/ui";
import { Button } from "@constructos/ui";
import { useCustomerStore } from "@/stores/customerStore";
import { Plus, Search, Building2, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomersPage() {
  const router = useRouter();
  const { customers, fetchCustomers, isLoading } = useCustomerStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers(search);
  }, [search, fetchCustomers]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customers Directory</h1>
          <p className="text-slate-500">
            Manage contractors, retail customers, and business accounts.
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
          onClick={() => router.push("/customers/new")}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Customer
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, mobile, or company..."
              className="flex h-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 pl-9 bg-slate-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-100 overflow-hidden">
            <table className="w-full text-sm text-left text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-medium">
                <tr>
                  <th className="px-4 py-3">Customer Info</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3 text-right">Credit Limit</th>
                  <th className="px-4 py-3 text-right">Total Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      Loading...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((c: any) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/customers/${c.id}`)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-full ${c.customerType === "RETAIL" ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"}`}
                          >
                            {c.customerType === "RETAIL" ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Building2 className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{c.name}</p>
                            {c.companyName && (
                              <p className="text-xs text-slate-500">{c.companyName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                          {c.customerType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm">{c.mobile}</p>
                        {c.email && <p className="text-xs text-slate-500">{c.email}</p>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ₹{c.creditLimit.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-medium ${c.totalDue > 0 ? "text-rose-600" : "text-emerald-600"}`}
                        >
                          ₹{c.totalDue.toLocaleString("en-IN")}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
