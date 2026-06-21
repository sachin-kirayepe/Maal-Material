import React, { useState, useEffect } from "react";
import { IndustrialProduct, useLiveCommerceStore } from "../../store/live-commerce-state";
import {
  Package as PackageIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Minus as MinusIcon,
  Clock as ClockIcon,
  ShieldCheck as ShieldCheckIcon,
  ShoppingCart as ShoppingCartIcon,
} from "lucide-react";
import { Button } from "@constructos/ui";
const Package = PackageIcon as any;
const TrendingUp = TrendingUpIcon as any;
const TrendingDown = TrendingDownIcon as any;
const Minus = MinusIcon as any;
const Clock = ClockIcon as any;
const ShieldCheck = ShieldCheckIcon as any;
const ShoppingCart = ShoppingCartIcon as any;

interface InventoryTickerCardProps {
  product: IndustrialProduct;
}

export function InventoryTickerCard({ product }: InventoryTickerCardProps) {
  const { addItemToDraft } = useLiveCommerceStore();
  const [isFlashing, setIsFlashing] = useState(false);
  const [prevStock, setPrevStock] = useState(product.availableStock);
  const [prevPrice, setPrevPrice] = useState(product.currentPrice);

  useEffect(() => {
    if (product.availableStock !== prevStock || product.currentPrice !== prevPrice) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 300);
      setPrevStock(product.availableStock);
      setPrevPrice(product.currentPrice);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [product.availableStock, product.currentPrice]);

  const handleAdd = () => {
    addItemToDraft(product.id, 1);
  };

  const getTrendIcon = () => {
    switch (product.trend) {
      case "UP":
        return <TrendingUp className="w-3 h-3 text-emerald-500" />;
      case "DOWN":
        return <TrendingDown className="w-3 h-3 text-rose-500" />;
      default:
        return <Minus className="w-3 h-3 text-slate-400" />;
    }
  };

  const getTrendColor = () => {
    switch (product.trend) {
      case "UP":
        return "text-emerald-400";
      case "DOWN":
        return "text-rose-400";
      default:
        return "text-slate-300";
    }
  };

  return (
    <div
      className={`relative flex flex-col glass-panel p-4 border transition-colors duration-300 ${
        isFlashing
          ? "border-primary/50 shadow-[0_0_15px_rgba(0,255,255,0.2)] bg-primary/5"
          : "border-white/10 bg-black/40 hover:bg-black/60 hover:border-white/20"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold text-white truncate max-w-[180px]">{product.name}</h3>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            {product.sku}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <span
              className={`text-lg font-bold ${isFlashing ? "text-primary" : "text-white"} font-mono`}
            >
              ${product.currentPrice.toFixed(2)}
            </span>
            {getTrendIcon()}
          </div>
          <span className="text-[9px] text-muted-foreground uppercase">
            Base: ${product.basePrice}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        <span className="px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary text-[9px] font-mono uppercase border border-primary/20">
          {product.category}
        </span>
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 rounded-sm bg-white/5 text-slate-300 text-[9px] font-mono uppercase border border-white/10"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 bg-black/30 rounded-lg p-2 border border-white/5">
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1">
            <Package className="w-3 h-3" /> Live Stock
          </span>
          <span className={`font-mono font-bold text-sm ${getTrendColor()} transition-colors`}>
            {product.availableStock.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" /> ETA
          </span>
          <span className="font-mono text-slate-200 text-sm">{product.deliveryEtaDays} Days</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/10">
        <div className="flex items-center gap-1 text-[10px] text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          <span>Score: {product.reliabilityScore}%</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="h-7 text-xs px-3 bg-primary/10 hover:bg-primary/20 text-primary border-primary/30"
          disabled={product.availableStock === 0}
        >
          <ShoppingCart className="w-3 h-3 mr-2" />
          {product.availableStock === 0 ? "OUT OF STOCK" : "ADD TO RFQ"}
        </Button>
      </div>
    </div>
  );
}
