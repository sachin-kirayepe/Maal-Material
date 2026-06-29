"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@constructos/ui";
import { Button } from "@constructos/ui";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { useCustomerStore } from "@/stores/customerStore";
import { Plus, Receipt, TrendingUp, Users, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BillingDashboard() {
  const router = useRouter();
  const { invoices, fetchInvoices, isLoading: loadingInvoices } = useInvoiceStore();
  const { customers, fetchCustomers, isLoading: loadingCustomers } = useCustomerStore();

  useEffect(() => {
    fetchInvoices();
    fetchCustomers();
  }, [fetchInvoices, fetchCustomers]);

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalDue = invoices.reduce((sum, inv) => sum + inv.dueAmount, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Financial Hub</h1>
          <p className="text-slate-500 mt-2">
            Manage invoices, GST, payments, and sales analytics.
          </p>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => router.push("/customers/new")}>
            <Users className="mr-2 h-4 w-4" /> Add Customer
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            onClick={() => router.push("/billing/invoices/new")}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none shadow-md bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRevenue.toLocaleString("en-IN")}</div>
            <p className="text-xs mt-1 opacity-75">All time generated</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Dues</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600">
              {totalDue.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-slate-400 mt-1">Requires collection</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Invoices Generated</CardTitle>
            <Receipt className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{invoices.length}</div>
            <p className="text-xs text-slate-400 mt-1">Total count</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{customers.length}</div>
            <p className="text-xs text-slate-400 mt-1">Active accounts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-100 overflow-hidden">
              <table className="w-full text-sm text-left text-slate-700">
                <thead className="text-xs uppercase font-medium bg-slate-50">
                  <tr>
                    <th className="px-4 py-3">Invoice No.</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingInvoices ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    invoices.slice(0, 5).map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-indigo-600">
                          {inv.invoiceNumber}
                        </td>
                        <td className="px-4 py-3">{(inv as any).customer?.name || "Unknown"}</td>
                        <td className="px-4 py-3">
                          {new Date(inv.issueDate).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              inv.paymentStatus === "PAID"
                                ? "bg-emerald-100 text-emerald-700"
                                : inv.paymentStatus === "PARTIAL"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {inv.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {inv.grandTotal.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Top Defaulters (Dues)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingCustomers ? (
                <p className="text-center text-slate-500 py-4">Loading...</p>
              ) : (
                customers
                  .filter((c: any) => c.totalDue > 0)
                  .sort((a, b) => b.totalDue - a.totalDue)
                  .slice(0, 5)
                  .map((customer) => (
                    <div
                      key={customer.id}
                      className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.mobile}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-rose-600">
                          {customer.totalDue.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))
              )}
              {customers.filter((c: any) => c.totalDue > 0).length === 0 && !loadingCustomers && (
                <p className="text-center text-emerald-600 py-4 font-medium">
                  All dues cleared! 🎉
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
