"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";

import { useProductsStore } from "@/stores/productsStore";
import { useEcommerceStore } from "@/stores/ecommerceStore";
import CartFlyout from "@/components/marketplace/CartFlyout";

export default function StorefrontHome() {
  const { products, fetchProducts, isLoading } = useProductsStore();
  const { addToCart } = useEcommerceStore();
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      setIsCartOpen(true);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      // Optional: Add toast error here
    }
  };

  return (
    <div className="w-full">
      <CartFlyout isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <section className="relative w-full h-[500px] bg-zinc-950 border-b border-zinc-800 flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900 via-black to-black"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold mb-6">
              <Zap size={14} /> NEW: Direct to Site Delivery
            </div>
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-white mb-6">
              Industrial procurement, <span className="font-semibold text-purple-400">simplified.</span>
            </h1>
            <p className="text-lg text-zinc-400 mb-8">
              Order cement, steel, and aggregates directly from local verified suppliers at wholesale rates. Add to cart and get it delivered to your site.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/suppliers">
                <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2">
                  Browse Catalog <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-light mb-2">Trending Materials</h2>
            <p className="text-zinc-500">Most purchased by local contractors this week.</p>
          </div>
          <Link href="/suppliers" className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 text-sm">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading && <p className="text-zinc-500">Loading products...</p>}
          {!isLoading && products.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500 border border-zinc-800 rounded-2xl border-dashed">
              No products found in marketplace.
            </div>
          )}
          {products.map((product: any, i: number) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={product.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-colors"
            >
              <div className="h-48 w-full bg-zinc-800 relative">
                {/* Placeholder Image */}
                <img src={product.images?.[0] || "https://via.placeholder.com/150/333333/FFFFFF?text=Product"} alt={product.name} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg leading-tight flex-1 pr-4">{product.name}</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                    <Star size={10} className="fill-amber-400" /> 4.8
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 mb-0.5">Market Price</p>
                    <p className="text-xl font-semibold text-white">₹{product.price} <span className="text-xs font-normal text-zinc-500">/{product.unit || 'Unit'}</span></p>
                  </div>
                  <button onClick={() => handleAddToCart(product.id)} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:bg-purple-500 group-hover:text-black transition-all">
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Banners */}
      <section className="py-12 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex flex-col items-start justify-center">
          <h3 className="text-2xl font-light mb-4">Bulk Orders? Need a CS?</h3>
          <p className="text-zinc-400 mb-6">For large commercial projects, use our RFQ engine to get competitive bids from 100+ suppliers instantly.</p>
          <Link href="/login" className="text-white border border-zinc-700 px-6 py-2 rounded-full hover:bg-zinc-800 transition-colors">
            Go to Contractor Hub
          </Link>
        </div>
        <div className="bg-purple-900/20 border border-purple-500/20 p-8 rounded-3xl flex flex-col items-start justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <div />
          </div>
          <h3 className="text-2xl font-light mb-4 text-purple-100">Sell on Maal-Material</h3>
          <p className="text-purple-300/70 mb-6 max-w-xs">Register your hardware shop or dealership and get daily local leads directly on your phone.</p>
          <Link href="/login" className="bg-purple-500 text-black font-medium px-6 py-2 rounded-full hover:bg-purple-400 transition-colors">
            Open Seller Hub
          </Link>
        </div>
      </section>
    </div>
  );
}
