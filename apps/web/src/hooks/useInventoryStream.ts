import { useEffect, useRef } from "react";
import { useLiveCommerceStore } from "../store/live-commerce-state";

export const useInventoryStream = () => {
  const { products, updateProductStock, updateProductPrice } = useLiveCommerceStore();
  const rafRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    // Simulation removed to avoid dummy data

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [products, updateProductStock, updateProductPrice]);
};
