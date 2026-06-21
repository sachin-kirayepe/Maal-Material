import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useEcommerceStore } from "@/stores/ecommerceStore";
import { useRouter } from "next/navigation";

interface CartFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartFlyout({ isOpen, onClose }: CartFlyoutProps) {
  const { cart, fetchCart, isLoading } = useEcommerceStore();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, fetchCart]);

  const cartItems = cart?.items || [];
  const totalAmount = cart?.grandTotal || cart?.total || 0;

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl shadow-black z-50 flex flex-col"
          >
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2 rounded-full">
                  <ShoppingBag className="text-purple-400" size={20} />
                </div>
                <h2 className="text-xl font-medium text-white">Your Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading && cartItems.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
                  <ShoppingBag size={48} className="text-zinc-800" />
                  <p>Your cart is currently empty.</p>
                  <button onClick={onClose} className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4 bg-zinc-900 border border-zinc-800 p-3 rounded-xl">
                    <div className="w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.product?.images?.[0] || "https://via.placeholder.com/150/333333/FFFFFF?text=Item"}
                        alt={item.product?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-medium text-white line-clamp-2">{item.product?.name || "Unknown Product"}</h4>
                        <button className="text-zinc-500 hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500 mb-auto">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-white">
                        ₹{(item.price || item.product?.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-xl font-medium text-white">₹{totalAmount}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-purple-500 text-black py-3 rounded-xl font-medium hover:bg-purple-400 transition-colors flex justify-center items-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
