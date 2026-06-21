"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEcommerceStore } from "@/stores/ecommerceStore";
import { Card, Button } from "@constructos/ui";
import { ShoppingCart, Package, Plus, Minus, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { cart, isLoading, fetchCart } = useEcommerceStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const items = cart?.items || [];
  const totalItems = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const subtotal = cart?.total || 0;
  const tax = subtotal * 0.18; // 18% GST example
  const total = subtotal + tax;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-slate-800/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-slate-400 mt-1 font-medium">{totalItems} items ready for checkout</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <Card className="bg-slate-900/80 border-slate-800/50 p-12 text-center text-slate-500 rounded-3xl">
              Loading cart contents...
            </Card>
          ) : items.length === 0 ? (
            <Card className="bg-slate-900/80 border-slate-800/50 p-12 text-center text-slate-500 rounded-3xl flex flex-col items-center justify-center">
              <Package className="w-16 h-16 mb-4 text-slate-700" />
              <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
              <p className="mb-6">Browse the marketplace to add B2B supplies.</p>
              <Button
                onClick={() => router.push("/marketplace")}
                className="bg-slate-800 hover:bg-slate-700 text-white"
              >
                Go to Marketplace
              </Button>
            </Card>
          ) : (
            items.map((item: any, index: number) => (
              <Card
                key={index}
                className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 shadow-sm rounded-2xl overflow-hidden p-4 flex gap-4"
              >
                <div className="w-24 h-24 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0">
                  {item.product?.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product?.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-slate-600" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {item.product?.name || "Unknown Product"}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">
                        Vendor: {item.product?.vendor?.name || "Standard Supply"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        ${(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        ${item.price?.toLocaleString()} each
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
                      <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-white font-mono font-medium">
                        {item.quantity}
                      </span>
                      <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4">
            <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 shadow-sm rounded-3xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-white font-medium">
                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Tax (18%)</span>
                  <span className="text-white font-medium">
                    ${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                    ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => router.push("/checkout")}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 border-0 rounded-xl py-6 text-lg font-bold transition-all hover:scale-[1.02]"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Card>

            <div className="text-center text-xs text-slate-500 flex flex-col gap-2">
              <p>Secure Enterprise Payment Gateway</p>
              <p>SSL Encrypted • 100% Purchase Protection</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
