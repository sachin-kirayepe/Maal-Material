"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Truck, CreditCard, Wallet, Building2, AlertCircle } from "lucide-react";
import { useEcommerceStore } from "@/stores/ecommerceStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { cart, fetchCart, placeOrder, isLoading } = useEcommerceStore();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartItems = cart?.items || [];
  const totalAmount = cart?.grandTotal || cart?.total || 0;

  const handlePlaceOrder = async () => {
    if (!address) {
      toast.error("Please provide a shipping address.");
      return;
    }
    try {
      await placeOrder(paymentMethod, address);
      setIsSuccess(true);
      toast.success("Order placed securely!");
    } catch (e) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] bg-black flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-light text-white mb-4">Order Placed Successfully!</h1>
          <p className="text-zinc-400 mb-8">
            Your materials will be delivered to the site shortly. You can track the status in your dashboard.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors w-full"
          >
            Return to Storefront
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-light tracking-tight mb-8">Secure Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Flow */}
          <div className="flex-1 space-y-8">
            
            {/* Step 1: Address */}
            <div className={`p-8 rounded-3xl border transition-all ${step === 1 ? 'bg-zinc-900 border-purple-500/50' : 'bg-black border-zinc-800 opacity-50'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 1 ? 'bg-purple-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>1</div>
                <h2 className="text-xl font-medium flex items-center gap-2"><Truck size={20} /> Shipping Details</h2>
              </div>
              
              {step === 1 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Delivery Site Address</label>
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3} 
                      className="w-full bg-black border border-zinc-700 rounded-xl p-4 focus:outline-none focus:border-purple-500 text-white resize-none"
                      placeholder="Enter site location, plot number, landmarks..."
                    />
                  </div>
                  <button 
                    onClick={() => { if(address) setStep(2); else toast.error("Please enter an address"); }}
                    className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}
              {step > 1 && <p className="text-zinc-400 pl-12">{address}</p>}
            </div>

            {/* Step 2: Payment */}
            <div className={`p-8 rounded-3xl border transition-all ${step === 2 ? 'bg-zinc-900 border-purple-500/50' : 'bg-black border-zinc-800 opacity-50'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step === 2 ? 'bg-purple-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>2</div>
                <h2 className="text-xl font-medium flex items-center gap-2"><ShieldCheck size={20} /> Payment Method</h2>
              </div>
              
              {step === 2 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className={`cursor-pointer border p-4 rounded-xl flex flex-col items-center gap-3 transition-colors ${paymentMethod === 'CREDIT_CARD' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>
                      <input type="radio" name="payment" value="CREDIT_CARD" checked={paymentMethod === 'CREDIT_CARD'} onChange={() => setPaymentMethod('CREDIT_CARD')} className="hidden" />
                      <CreditCard size={24} />
                      <span className="font-medium">Credit Card</span>
                    </label>
                    <label className={`cursor-pointer border p-4 rounded-xl flex flex-col items-center gap-3 transition-colors ${paymentMethod === 'UPI' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>
                      <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="hidden" />
                      <Wallet size={24} />
                      <span className="font-medium">UPI / Wallet</span>
                    </label>
                    <label className={`cursor-pointer border p-4 rounded-xl flex flex-col items-center gap-3 transition-colors ${paymentMethod === 'NET30' ? 'border-purple-500 bg-purple-500/10 text-white' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>
                      <input type="radio" name="payment" value="NET30" checked={paymentMethod === 'NET30'} onChange={() => setPaymentMethod('NET30')} className="hidden" />
                      <Building2 size={24} />
                      <span className="font-medium">Net 30 (Credit)</span>
                    </label>
                  </div>

                  {paymentMethod === 'CREDIT_CARD' && (
                    <div className="bg-black border border-zinc-800 p-6 rounded-xl mt-4 space-y-4">
                      <input type="text" placeholder="Card Number" className="w-full bg-transparent border-b border-zinc-800 pb-2 focus:outline-none focus:border-purple-500" />
                      <div className="flex gap-4">
                        <input type="text" placeholder="MM/YY" className="w-1/2 bg-transparent border-b border-zinc-800 pb-2 focus:outline-none focus:border-purple-500" />
                        <input type="text" placeholder="CVC" className="w-1/2 bg-transparent border-b border-zinc-800 pb-2 focus:outline-none focus:border-purple-500" />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'NET30' && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl mt-4 flex gap-3 text-amber-500">
                      <AlertCircle size={20} className="shrink-0" />
                      <p className="text-sm">Subject to credit approval. Maal-Material will invoice your registered business entity.</p>
                    </div>
                  )}
                  
                </motion.div>
              )}
            </div>
            
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sticky top-24">
              <h3 className="text-xl font-medium mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <p className="text-zinc-500">Your cart is empty.</p>
                ) : (
                  cartItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex-1 pr-4">
                        <p className="text-zinc-300 truncate">{item.product?.name || "Item"}</p>
                        <p className="text-zinc-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white font-medium">₹{(item.price || item.product?.price || 0) * item.quantity}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-zinc-800 pt-6 space-y-3 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Logistics & Freight</span>
                  <span className="text-white">Calculated post-dispatch</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>GST (18%)</span>
                  <span className="text-white">₹{(totalAmount * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-4 border-t border-zinc-800">
                  <span>Total</span>
                  <span className="text-purple-400">₹{(totalAmount * 1.18).toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={step !== 2 || cartItems.length === 0 || isLoading}
                className="w-full bg-purple-500 text-black py-4 rounded-xl font-medium hover:bg-purple-400 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                {isLoading ? "Processing..." : "Place Order Securely"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
