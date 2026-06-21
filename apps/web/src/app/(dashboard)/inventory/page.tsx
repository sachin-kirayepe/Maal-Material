"use client";

import React, { useEffect, useState } from "react";
import {
  Plus as PlusIcon,
  Search as SearchIcon,
  Loader2 as Loader2Icon,
  ArrowRightLeft as ArrowRightLeftIcon,
  ArrowDown as ArrowDownIcon,
  ArrowUp as ArrowUpIcon,
  RefreshCw as RefreshCwIcon,
  Layers as LayersIcon,
} from "lucide-react";
const Plus = PlusIcon as any;
const Search = SearchIcon as any;
const Loader2 = Loader2Icon as any;
const ArrowRightLeft = ArrowRightLeftIcon as any;
const ArrowDown = ArrowDownIcon as any;
const ArrowUp = ArrowUpIcon as any;
const RefreshCw = RefreshCwIcon as any;
const Layers = LayersIcon as any;
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@constructos/ui";
import { useProductsStore } from "@/stores/productsStore";
import { useWarehouseStore } from "@/stores/warehouseStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Zod schemas for validation
const stockInSchema = z.object({
  productId: z.string().min(1, "Please select a product"),
  warehouseId: z.string().min(1, "Please select a warehouse"),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().min(0.01, "Quantity must be greater than 0"),
  ),
  notes: z.string().optional(),
});

const transferSchema = z
  .object({
    productId: z.string().min(1, "Please select a product"),
    fromWarehouseId: z.string().min(1, "Please select source warehouse"),
    toWarehouseId: z.string().min(1, "Please select destination warehouse"),
    quantity: z.preprocess(
      (val) => Number(val),
      z.number().min(0.01, "Quantity must be greater than 0"),
    ),
    notes: z.string().optional(),
  })
  .refine((data) => data.fromWarehouseId !== data.toWarehouseId, {
    message: "Source and destination warehouses cannot be the same",
    path: ["toWarehouseId"],
  });

type StockInFormValues = z.infer<typeof stockInSchema>;
type TransferFormValues = z.infer<typeof transferSchema>;

export default function InventoryPage() {
  const { dashboard,
    products,
    isLoading: isProductsLoading,
    error,
    fetchProducts,
    fetchDashboard } = useProductsStore();
  const { warehouses,
    stockMovements,
    isLoading: isWarehouseLoading,
    fetchWarehouses,
    fetchStockMovements,
    stockIn,
    transferStock } = useWarehouseStore();

  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setups
  const stockInForm = useForm<StockInFormValues>({
    resolver: zodResolver(stockInSchema),
    defaultValues: { productId: "", warehouseId: "", quantity: 0, notes: "" },
  });

  const transferForm = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      productId: "",
      fromWarehouseId: "",
      toWarehouseId: "",
      quantity: 0,
      notes: "",
    },
  });

  useEffect(() => {
    fetchDashboard();
    fetchProducts();
    fetchWarehouses();
    fetchStockMovements();
  }, []);

  const handleStockInSubmit = async (values: StockInFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const success = await stockIn(values);
      if (success) {
        await Promise.all([fetchDashboard(), fetchProducts(), fetchStockMovements()]);
        setIsStockInOpen(false);
        stockInForm.reset();
      } else {
        setSubmitError(useWarehouseStore.getState().error || "Failed to ingest stock");
      }
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransferSubmit = async (values: TransferFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const success = await transferStock(values);
      if (success) {
        await Promise.all([fetchDashboard(), fetchProducts(), fetchStockMovements()]);
        setIsTransferOpen(false);
        transferForm.reset();
      } else {
        setSubmitError(useWarehouseStore.getState().error || "Failed to transfer stock");
      }
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getMovementBadge = (type: string) => {
    switch (type) {
      case "STOCK_IN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <ArrowDown className="w-3 h-3" /> STOCK IN
          </span>
        );
      case "STOCK_OUT":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border bg-rose-500/10 text-rose-500 border-rose-500/20">
            <ArrowUp className="w-3 h-3" /> STOCK OUT
          </span>
        );
      case "TRANSFER":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
            <ArrowRightLeft className="w-3 h-3" /> TRANSFER
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-500/10 text-slate-500 border-slate-500/20">
            {type}
          </span>
        );
    }
  };

  const isLoading = isProductsLoading || isWarehouseLoading;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto p-4 sm:p-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 backdrop-blur-xl shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Real-Time Materials Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Multi-tenant inventory control system for heavy materials, batch logs, and site
            telemetry.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            onClick={() => setIsTransferOpen(true)}
          >
            <ArrowRightLeft className="w-4 h-4" />
            Transfer Stock
          </Button>
          <Button
            variant="primary"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => setIsStockInOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Ingest New Batch
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium">
          Error loading inventory: {error}
        </div>
      )}

      {/* Overview Stat Widgets */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80">
          <CardHeader className="pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Total Products
            </span>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : (
              <>
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  {dashboard?.totalProducts || 0}
                </div>
                <p className="text-xs text-slate-400 mt-1">Active SKUs</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80">
          <CardHeader className="pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Low Stock Items
            </span>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : (
              <>
                <div className="text-3xl font-bold text-amber-500">
                  {dashboard?.lowStockItems || 0}
                </div>
                <p className="text-xs text-slate-400 mt-1">Under safety buffer levels</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80">
          <CardHeader className="pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Total Stock Qty
            </span>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : (
              <>
                <div className="text-3xl font-bold text-emerald-500">
                  {dashboard?.totalStockQuantity?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-slate-400 mt-1">Across all warehouses</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80">
          <CardHeader className="pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Inventory Value
            </span>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : (
              <>
                <div className="text-3xl font-bold text-indigo-500">
                  ${dashboard?.totalInventoryValue?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-slate-400 mt-1">Total physical value</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Stockpile Status */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800/60 pb-5 gap-4">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" /> Central Stockpile Status
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Physical stock telemetry across network.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by SKU or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none w-full"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isProductsLoading && products.length === 0 ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      SKU Code
                    </th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      Material Name
                    </th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      Category
                    </th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      Stock Level
                    </th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      Reorder Limit
                    </th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {filteredProducts.map((item) => {
                    const totalQty = item.totalStock || 0;
                    let status = "In Stock";
                    let statusColor = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";

                    if (totalQty <= 0) {
                      status = "Out of Stock";
                      statusColor = "bg-rose-500/10 text-rose-500 border-rose-500/20";
                    } else if (totalQty <= (item.reorderLevel || 0)) {
                      status = "Low Stock";
                      statusColor = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                    }

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="p-4 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {item.sku}
                        </td>
                        <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                          {item.name}
                        </td>
                        <td className="p-4 text-slate-500 dark:text-slate-400 text-xs">
                          {item.category?.name || "-"}
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-950 dark:text-white">
                          {totalQty} {item.unit?.abbreviation}
                        </td>
                        <td className="p-4 font-mono text-slate-400 text-xs">
                          {item.reorderLevel || 0}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor}`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProducts.length === 0 && !isProductsLoading && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-400">
                        No products found in inventory.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transactional Audit Log — Stock History */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-indigo-500" /> Recent Stock Operations Audit
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">
                Tamper-evident logs of stock movements across warehouses.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {isWarehouseLoading && stockMovements.length === 0 ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      Product
                    </th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      Type
                    </th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      Route
                    </th>
                    <th className="p-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {stockMovements.map((movement) => (
                    <tr
                      key={movement.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="p-4 text-xs font-mono text-slate-400">
                        {new Date(movement.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                        {movement.product?.name || "Unknown Product"}
                      </td>
                      <td className="p-4">{getMovementBadge(movement.movementType)}</td>
                      <td className="p-4 font-mono font-bold text-slate-950 dark:text-white">
                        {movement.quantity}
                      </td>
                      <td className="p-4 text-xs">
                        {movement.fromWarehouse ? (
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            {movement.fromWarehouse.name}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                        {movement.toWarehouse && (
                          <>
                            <span className="text-slate-400 mx-1.5 font-bold">→</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                              {movement.toWarehouse.name}
                            </span>
                          </>
                        )}
                      </td>
                      <td
                        className="p-4 text-xs text-slate-500 dark:text-slate-400 max-w-[200px] truncate"
                        title={movement.notes || ""}
                      >
                        {movement.notes || "—"}
                      </td>
                    </tr>
                  ))}
                  {stockMovements.length === 0 && !isWarehouseLoading && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-slate-400">
                        No stock movement logs found in ledger.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* MODAL: INGEST NEW BATCH (STOCK IN) */}
      {isStockInOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Ingest New Stock Batch
              </h3>
              <button
                onClick={() => setIsStockInOpen(false)}
                className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 focus:outline-none text-xl"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={stockInForm.handleSubmit(handleStockInSubmit)}
              className="p-6 space-y-4"
            >
              {submitError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-semibold">
                  {submitError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Select Material / Product
                </label>
                <select
                  {...stockInForm.register("productId")}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
                {stockInForm.formState.errors.productId && (
                  <p className="text-xs text-rose-500 font-semibold">
                    {stockInForm.formState.errors.productId.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Destination Warehouse
                </label>
                <select
                  {...stockInForm.register("warehouseId")}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">-- Choose Warehouse --</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.code})
                    </option>
                  ))}
                </select>
                {stockInForm.formState.errors.warehouseId && (
                  <p className="text-xs text-rose-500 font-semibold">
                    {stockInForm.formState.errors.warehouseId.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Ingest Quantity
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 50"
                  {...stockInForm.register("quantity")}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                {stockInForm.formState.errors.quantity && (
                  <p className="text-xs text-rose-500 font-semibold">
                    {stockInForm.formState.errors.quantity.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Notes / Ledger Reference
                </label>
                <textarea
                  placeholder="e.g. PO-8940, Supplier batch shipment"
                  rows={3}
                  {...stockInForm.register("notes")}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsStockInOpen(false)}
                  disabled={isSubmitting}
                  className="border-slate-200 dark:border-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center min-w-[100px]"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Ingest"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TRANSFER STOCK */}
      {isTransferOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Inter-Warehouse Stock Transfer
              </h3>
              <button
                onClick={() => setIsTransferOpen(false)}
                className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 focus:outline-none text-xl"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={transferForm.handleSubmit(handleTransferSubmit)}
              className="p-6 space-y-4"
            >
              {submitError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-semibold">
                  {submitError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Select Material / Product
                </label>
                <select
                  {...transferForm.register("productId")}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </option>
                  ))}
                </select>
                {transferForm.formState.errors.productId && (
                  <p className="text-xs text-rose-500 font-semibold">
                    {transferForm.formState.errors.productId.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Source Whse
                  </label>
                  <select
                    {...transferForm.register("fromWarehouseId")}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">-- Source --</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  {transferForm.formState.errors.fromWarehouseId && (
                    <p className="text-xs text-rose-500 font-semibold">
                      {transferForm.formState.errors.fromWarehouseId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Dest Whse
                  </label>
                  <select
                    {...transferForm.register("toWarehouseId")}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">-- Dest --</option>
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                  {transferForm.formState.errors.toWarehouseId && (
                    <p className="text-xs text-rose-500 font-semibold">
                      {transferForm.formState.errors.toWarehouseId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Transfer Quantity
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 10"
                  {...transferForm.register("quantity")}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                {transferForm.formState.errors.quantity && (
                  <p className="text-xs text-rose-500 font-semibold">
                    {transferForm.formState.errors.quantity.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Transfer Reason / Details
                </label>
                <textarea
                  placeholder="e.g. Replenishing regional secondary stock stockpile"
                  rows={3}
                  {...transferForm.register("notes")}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsTransferOpen(false)}
                  disabled={isSubmitting}
                  className="border-slate-200 dark:border-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center min-w-[100px]"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Execute Transfer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
