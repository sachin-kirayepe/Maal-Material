import { useEffect, useRef } from "react";
import { useLiveCommerceStore } from "../store/live-commerce-state";

export const useInventoryStream = () => {
  const { products, updateProductStock, updateProductPrice } = useLiveCommerceStore();
  const rafRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    // Simulate high-frequency WebSocket incoming ticks for live catalog
    const streamTicks = () => {
      const now = Date.now();
      // Tick every 800ms
      if (now - lastUpdateRef.current > 800) {
        lastUpdateRef.current = now;

        const keys = Object.keys(products);
        if (keys.length > 0) {
          // Pick a random product to update
          const randomKey = keys[Math.floor(Math.random() * keys.length)]!;
          const product = products[randomKey];

          if (product) {
            // Randomly adjust stock
            if (Math.random() > 0.7) {
              const stockChange = Math.floor(Math.random() * 5) - 2; // -2 to +2
              const newStock = Math.max(0, product.availableStock + stockChange);
              const trend = stockChange > 0 ? "UP" : stockChange < 0 ? "DOWN" : "STABLE";
              updateProductStock(randomKey as any, newStock, trend as any);
            }

            // Randomly adjust price
            if (Math.random() > 0.8) {
              const priceChange = Math.random() * 10 - 5; // -5 to +5
              const newPrice = Math.max(0.01, product.currentPrice + priceChange);
              updateProductPrice(randomKey as any, parseFloat(newPrice.toFixed(2)));
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(streamTicks);
    };

    rafRef.current = requestAnimationFrame(streamTicks);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [products, updateProductStock, updateProductPrice]);
};
