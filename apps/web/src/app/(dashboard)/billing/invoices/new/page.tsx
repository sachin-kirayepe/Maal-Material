"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@constructos/ui";
import { Button } from "@constructos/ui";
import { useInvoiceStore } from "@/stores/invoiceStore";
import { useCustomerStore } from "@/stores/customerStore";
import { useProductsStore } from "@/stores/productsStore";
import { useWarehouseStore } from "@/stores/warehouseStore";
import { useRouter } from "next/navigation";
import { Trash2, Plus, ReceiptIndianRupee, Building2 } from "lucide-react";
import { toast } from "sonner";

const invoiceSchema = z.object({
  customerId: z.string().min(1, "Please select a customer"),
  warehouseId: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Select product"),
        quantity: z.number().min(0.1, "Min qty 0.1"),
        unitPrice: z.number().min(0, "Invalid price"),
        taxPercent: z.number().min(0).max(100).default(18),
        discountPercent: z.number().min(0).max(100).default(0),
      }),
    )
    .min(1, "Add at least one item"),
});

export default function InvoiceBuilder() {
  const router = useRouter();
  const { customers, fetchCustomers } = useCustomerStore();
  const { products, fetchProducts } = useProductsStore();
  const { warehouses, fetchWarehouses } = useWarehouseStore();
  const { createInvoice } = useInvoiceStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchWarehouses();
  }, []);

  const form = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: "",
      warehouseId: "",
      notes: "",
      items: [{ productId: "", quantity: 1, unitPrice: 0, taxPercent: 18, discountPercent: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");

  // Live calculations
  let subtotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;

  watchedItems.forEach((item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    const tax = Number(item.taxPercent) || 0;
    const disc = Number(item.discountPercent) || 0;

    const base = qty * price;
    const discAmt = (base * disc) / 100;
    const afterDisc = base - discAmt;
    const taxAmt = (afterDisc * tax) / 100;

    subtotal += base;
    totalDiscount += discAmt;
    totalTax += taxAmt;
  });

  const grandTotal = subtotal - totalDiscount + totalTax;

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    // Cast strings to numbers
    const payload = {
      ...data,
      items: data.items.map((item: any) => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        taxPercent: Number(item.taxPercent),
        discountPercent: Number(item.discountPercent),
      })),
    };

    const success = await createInvoice(payload);
    if (success) {
      toast.success("Invoice generated successfully!");
      router.push("/billing");
    } else {
      toast.error("Failed to generate invoice. Please check stock levels.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <ReceiptIndianRupee className="w-6 h-6 text-indigo-700" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Tax Invoice</h1>
          <p className="text-slate-500">
            Generate a B2B/B2C GST invoice with automatic inventory deduction.
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Building2 className="w-4 h-4 mr-2" /> Billing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Customer</label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  onChange={(e) => form.setValue("customerId", e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Customer
                  </option>
                  {customers.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.mobile})
                    </option>
                  ))}
                </select>
                {form.formState.errors.customerId && (
                  <p className="text-xs text-rose-500">
                    {form.formState.errors.customerId.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Deduct Stock From (Optional)
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                  onChange={(e) => form.setValue("warehouseId", e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Warehouse (Skip to not deduct stock)
                  </option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.code})
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Live Summary Card */}
          <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-slate-200">Live Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Discount</span>
                <span className="text-emerald-400">
                  - ₹{totalDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 border-b border-slate-700 pb-3">
                <span>Total GST</span>
                <span>+ ₹{totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-medium">Grand Total</span>
                <span className="text-3xl font-bold text-indigo-400">
                  ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Items */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-slate-800">Invoice Items</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    productId: "",
                    quantity: 1,
                    unitPrice: 0,
                    taxPercent: 18,
                    discountPercent: 0,
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" /> Add Row
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-700">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium w-24">Qty</th>
                    <th className="px-4 py-3 font-medium w-32">Rate (₹)</th>
                    <th className="px-4 py-3 font-medium w-24">Disc (%)</th>
                    <th className="px-4 py-3 font-medium w-24">GST (%)</th>
                    <th className="px-4 py-3 font-medium w-32 text-right">Total (₹)</th>
                    <th className="px-4 py-3 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fields.map((field, index) => {
                    const wItem: any = watchedItems[index] || {};
                    const q = Number(wItem.quantity) || 0;
                    const p = Number(wItem.unitPrice) || 0;
                    const d = Number(wItem.discountPercent) || 0;
                    const t = Number(wItem.taxPercent) || 0;
                    const base = q * p;
                    const afterD = base - (base * d) / 100;
                    const finalRowTotal = afterD + (afterD * t) / 100;

                    return (
                      <tr key={field.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <select
                            className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                            defaultValue=""
                            onChange={(e) => {
                              const v = e.target.value;
                              form.setValue(`items.${index}.productId`, v);
                              const prod = products.find((p) => p.id === v);
                              if (prod) {
                                form.setValue(`items.${index}.unitPrice`, prod.sellingPrice);
                                form.setValue(`items.${index}.taxPercent`, prod.taxPercent || 18);
                              }
                            }}
                          >
                            <option value="" disabled>
                              Select item
                            </option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} - ₹{p.sellingPrice}
                              </option>
                            ))}
                          </select>
                          {form.formState.errors?.items?.[index]?.productId && (
                            <p className="text-xs text-rose-500 mt-1">Required</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.1"
                            className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                            {...form.register(`items.${index}.quantity`)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.01"
                            className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                            {...form.register(`items.${index}.unitPrice`)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.1"
                            className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                            {...form.register(`items.${index}.discountPercent`)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.1"
                            className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                            {...form.register(`items.${index}.taxPercent`)}
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-slate-900">
                          {finalRowTotal.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {form.formState.errors.items && (
              <p className="text-sm text-rose-500 p-4">
                {form.formState.errors.items.message as string}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex-1 max-w-md space-y-2">
            <label className="text-sm font-medium leading-none">Additional Notes</label>
            <input
              placeholder="E.g. Delivery via self-pickup..."
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              {...form.register("notes")}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 min-w-[200px]"
          >
            {isSubmitting ? "Generating Invoice..." : "Generate Final Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
}
