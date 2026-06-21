"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomerStore } from "../../../stores/customerStore";
import { useProductsStore } from "../../../stores/productsStore";

import {
  ShoppingCart as ShoppingCartIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Trash2 as Trash2Icon,
  Building2 as Building2Icon,
  Package as PackageIcon,
  ArrowRight as ArrowRightIcon,
  CheckCircle2 as CheckCircle2Icon,
} from "lucide-react";

const ShoppingCart = ShoppingCartIcon as any;
const Plus = PlusIcon as any;
const Minus = MinusIcon as any;
const Trash2 = Trash2Icon as any;
const Building2 = Building2Icon as any;
const Package = PackageIcon as any;
const ArrowRight = ArrowRightIcon as any;
const CheckCircle2 = CheckCircle2Icon as any;

import { ApiClient } from "@/lib/api-client";

export default function CheckoutPage() {
  const router = useRouter();
  const { customers, fetchCustomers } = useCustomerStore();
  const { products, fetchProducts } = useProductsStore();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [cart, setCart] = useState<{ product: any; quantity: number }[]>([]);
  const [shippingAddress] = useState({
    addressLine: "123 Industrial Estate",
    city: "Mumbai",
    state: "MH",
    pincode: "400001",
    country: "India",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, [fetchCustomers, fetchProducts]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }),
    );
  };

  const removeProduct = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.product.purchasePrice || 100) * item.quantity,
    0,
  );
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + tax;

  const handleCheckout = async () => {
    if (!selectedCustomerId || cart.length === 0) return;
    setIsProcessing(true);

    try {
      const headers = {
        "x-customer-id": selectedCustomerId,
      };

      // 1. Clear existing cart
      await ApiClient.delete("/cart", { headers });

      // 2. Add items to cart
      let currentCartId = "";
      for (const item of cart) {
        const cartData: any = await ApiClient.post("/cart/items", {
          productId: item.product.id,
          quantity: item.quantity,
        }, { headers });
        currentCartId = cartData.id;
      }

      // 3. Process Checkout
      await ApiClient.post("/checkout", {
        customerId: selectedCustomerId,
        cartId: currentCartId,
        shippingAddress,
        billingAddress: shippingAddress, // same for now
      });

      setSuccess(true);
      router.push("/orders");
    } catch (error) {
      console.error(error);
      alert("Error during checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
          Order Placed Successfully!
        </h2>
        <p className="text-slate-500 font-medium">
          Your B2B order has been routed to the fulfillment center.
        </p>
        <p className="text-sm text-slate-400 mt-4">Redirecting to Order Management...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-amber-500" />
            B2B Checkout
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Create and process a new commercial order
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-500" />
              Select Customer
            </h3>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors font-medium"
            >
              <option value="">-- Choose a corporate client --</option>
              {customers.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.companyName || c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>

          {/* Product Catalog */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-emerald-500" />
              Available Products
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex justify-between items-center hover:border-amber-500/50 transition-colors group"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{p.name}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-1">SKU: {p.sku}</p>
                    <p className="text-sm font-black text-amber-600 dark:text-amber-500 mt-2">
                      ₹{(p.purchasePrice || 100).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all shadow-sm group-hover:shadow-md"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            {products.length === 0 && (
              <div className="text-center p-8 text-slate-500 font-medium bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                No products available in the catalog.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Cart & Summary */}
        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <ShoppingCart className="w-5 h-5 text-amber-500" />
              Order Summary
            </h3>

            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cart.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">Cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-white leading-tight pr-4">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeProduct(item.product.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-amber-500">
                        ₹{(item.product.purchasePrice || 100).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 hover:bg-slate-700 rounded text-slate-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 hover:bg-slate-700 rounded text-slate-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax (18%)</span>
                <span className="text-white font-medium">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-bold">Total</span>
                <span className="text-amber-500 font-black">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing || !selectedCustomerId || cart.length === 0}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isProcessing ? "Processing..." : "Place Corporate Order"}
              {!isProcessing && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
