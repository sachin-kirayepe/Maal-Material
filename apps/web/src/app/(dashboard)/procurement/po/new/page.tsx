"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProcurementStore } from "../../../../../stores/procurementStore";
import { useProductsStore } from "../../../../../stores/productsStore";
import { useWarehouseStore } from "../../../../../stores/warehouseStore";
import { toast } from "sonner";
import {
  ArrowLeft as ArrowLeftIcon,
  Save as SaveIcon,
  Plus as PlusIcon,
  Trash2 as Trash2Icon,
  ShoppingCart as ShoppingCartIcon,
} from "lucide-react";
const ArrowLeft = ArrowLeftIcon as any;
const Save = SaveIcon as any;
const Plus = PlusIcon as any;
const Trash2 = Trash2Icon as any;
const ShoppingCart = ShoppingCartIcon as any;

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const { suppliers, fetchSuppliers, createPurchaseOrder } = useProcurementStore();
  const { products, fetchProducts } = useProductsStore();
  const { warehouses, fetchWarehouses } = useWarehouseStore();

  const [loading, setLoading] = useState(false);

  // Basic state for the form
  const [supplierId, setSupplierId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [notes, setNotes] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [items, setItems] = useState([
    { productId: "", orderedQty: 1, unitPrice: 0, taxPercent: 0, discountPercent: 0 },
  ]);

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    fetchWarehouses();
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      { productId: "", orderedQty: 1, unitPrice: 0, taxPercent: 0, discountPercent: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items] as any;
    newItems[index][field] = value;

    // Auto-fill unit price and tax when product is selected
    if (field === "productId" && value) {
      const product = products.find((p) => p.id === value);
      if (product) {
        newItems[index].unitPrice = (product as any).purchasePrice || 0; // Using selling price as a default if purchase price isn't readily available, ideally should be costPrice
        newItems[index].taxPercent = product.taxPercent || 0;
      }
    }

    setItems(newItems);
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.orderedQty * item.unitPrice, 0);
  const totalItemDiscount = items.reduce(
    (sum, item) => sum + item.orderedQty * item.unitPrice * (item.discountPercent / 100),
    0,
  );
  const taxableAmount = subtotal - totalItemDiscount;
  const totalTax = items.reduce((sum, item) => {
    const itemSub = item.orderedQty * item.unitPrice;
    const itemDisc = itemSub * (item.discountPercent / 100);
    return sum + (itemSub - itemDisc) * (item.taxPercent / 100);
  }, 0);
  const grandTotal = taxableAmount - discount + totalTax + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId || !warehouseId || items.length === 0)
      return alert("Please fill required fields");
    if (items.some((i) => !i.productId || i.orderedQty <= 0))
      return alert("Please fill all item details correctly");

    setLoading(true);
    try {
      const res: any = await createPurchaseOrder({
        supplierId,
        warehouseId,
        expectedDelivery: expectedDelivery || undefined,
        notes,
        shippingCost,
        discount,
        items,
      });
      if (res.success) {
        router.push("/procurement");
      } else {
        alert(res.message || "Failed to create PO");
      }
    } catch (err) {
      console.error(err);
      toast.error("Action failed", { description: err?.message || "An unexpected error occurred" });
      alert("An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-amber-500" />
              New Purchase Order
            </h1>
            <p className="text-sm text-slate-500">Create a new PO for a supplier</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Supplier *
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
              >
                <option value="">Select Supplier...</option>
                {suppliers.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.companyName ? `(${s.companyName})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Delivery Warehouse *
              </label>
              <select
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
              >
                <option value="">Select Warehouse...</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Expected Delivery Date
              </label>
              <input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Line Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-sm font-semibold text-amber-500 hover:text-amber-400"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase">
                    Product
                  </th>
                  <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase w-24">
                    Qty
                  </th>
                  <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase w-32">
                    Unit Price
                  </th>
                  <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase w-24">
                    Disc %
                  </th>
                  <th className="text-left p-3 text-xs font-bold text-slate-500 uppercase w-24">
                    Tax %
                  </th>
                  <th className="text-right p-3 text-xs font-bold text-slate-500 uppercase w-32">
                    Total
                  </th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const itemSub = item.orderedQty * item.unitPrice;
                  const itemDisc = itemSub * (item.discountPercent / 100);
                  const itemTax = (itemSub - itemDisc) * (item.taxPercent / 100);
                  const itemTotal = itemSub - itemDisc + itemTax;

                  return (
                    <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-2">
                        <select
                          value={item.productId}
                          onChange={(e) => updateItem(index, "productId", e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"
                        >
                          <option value="">Select Product...</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          value={item.orderedQty}
                          onChange={(e) => updateItem(index, "orderedQty", Number(e.target.value))}
                          required
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, "unitPrice", Number(e.target.value))}
                          required
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discountPercent}
                          onChange={(e) =>
                            updateItem(index, "discountPercent", Number(e.target.value))
                          }
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.taxPercent}
                          onChange={(e) => updateItem(index, "taxPercent", Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 dark:text-white"
                        />
                      </td>
                      <td className="p-2 text-right font-semibold text-slate-900 dark:text-white text-sm">
                        {formatCurrency(itemTotal)}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-50 transition rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals & Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Additional Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-white resize-none"
                  placeholder="Order notes, special instructions..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Item Discount</span>
                <span className="text-emerald-500">-{formatCurrency(totalItemDiscount)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Overall Discount</span>
                <div className="w-32">
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full px-2 py-1 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:ring-1 focus:ring-amber-500 dark:text-white text-emerald-500"
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Tax Amount</span>
                <span>{formatCurrency(totalTax)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Shipping Cost</span>
                <div className="w-32">
                  <input
                    type="number"
                    min="0"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    className="w-full px-2 py-1 text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded focus:ring-1 focus:ring-amber-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  Grand Total
                </span>
                <span className="text-xl font-bold text-amber-500">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-slate-950 rounded-xl font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" /> Create Purchase Order
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
