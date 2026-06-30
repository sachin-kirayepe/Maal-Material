"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Heart,
  Star,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Package,
  Truck,
  ShieldCheck,
  BadgePercent,
  Grid3X3,
  List,
  Minus,
  Plus,
  Tag,
  CheckCircle2,
  MapPin,
  Flame,
  Zap,
  TrendingUp,
  Clock,
  Eye,
  Share2,
  ArrowUpDown,
  Filter,
  Sparkles,
  BadgeCheck,
  Store,
  Phone,
  MessageSquare,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronUp,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import { ApiClient } from "@/lib/api-client";
import { useEcommerceStore } from "@/stores/ecommerceStore";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  slug?: string;
  sku?: string;
  barcode?: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  brand?: string;
  manufacturer?: string;
  categoryId?: string;
  subCategoryId?: string;
  unitId?: string;
  purchasePrice?: number;
  sellingPrice: number;
  mrp?: number;
  taxPercent?: number;
  taxCategory?: string;
  minimumStock?: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  trackInventory?: boolean;
  weight?: string;
  dimensions?: string;
  hsn?: string;
  totalStock?: number;
  categories?: { id: string; name: string; image?: string } | null;
  subCategories?: { id: string; name: string } | null;
  units?: { id: string; name: string; abbreviation?: string } | null;
  warehouseStocks?: { quantity: number; warehouses?: { name: string; city?: string } }[];
  _count?: { productVariants?: number; stockMovements?: number };
  createdAt?: string;
  updatedAt?: string;
}

interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  subCategories?: { id: string; name: string }[];
  _count?: { products?: number };
}

interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

// ─── Category Icon Mapping ──────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  cement: "🧱",
  concrete: "🧱",
  steel: "⚙️",
  iron: "⚙️",
  bricks: "🧱",
  blocks: "🧱",
  sand: "🪨",
  aggregates: "🪨",
  paint: "🎨",
  coatings: "🎨",
  plumbing: "🔧",
  pipes: "🔧",
  electrical: "⚡",
  wiring: "⚡",
  tiles: "🟫",
  flooring: "🟫",
  wood: "🪵",
  timber: "🪵",
  safety: "🦺",
  helmet: "🦺",
  tools: "🔨",
  machinery: "🔨",
  sanitary: "🚿",
  hardware: "🔩",
  default: "📦",
};

function getCategoryIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return CATEGORY_ICONS.default;
}

// ─── Product Image Placeholder ──────────────────────────────────────────────
function getProductEmoji(product: Product): string {
  const name = (product.name + " " + (product.categories?.name || "")).toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (name.includes(key)) return icon;
  }
  return "📦";
}

// ─── Format Helpers ─────────────────────────────────────────────────────────
function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function getDiscount(mrp: number | undefined, selling: number): number {
  if (!mrp || mrp <= selling) return 0;
  return Math.round(((mrp - selling) / mrp) * 100);
}

function getStockStatus(stock: number | undefined): { label: string; color: string } {
  if (!stock || stock <= 0) return { label: "Out of Stock", color: "text-red-500" };
  if (stock < 10) return { label: `Only ${stock} left`, color: "text-amber-600" };
  if (stock < 50) return { label: "Limited Stock", color: "text-amber-500" };
  return { label: "In Stock", color: "text-emerald-600" };
}

// ─── Skeleton Components ────────────────────────────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-52 bg-gradient-to-br from-gray-100 to-gray-50" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-100 rounded-full w-16" />
        <div className="h-4 bg-gray-100 rounded-full w-full" />
        <div className="h-4 bg-gray-100 rounded-full w-3/4" />
        <div className="flex gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-3.5 h-3.5 bg-gray-100 rounded-sm" />
          ))}
        </div>
        <div className="flex items-end gap-2 mt-3">
          <div className="h-7 bg-gray-100 rounded-lg w-20" />
          <div className="h-4 bg-gray-100 rounded-lg w-14" />
        </div>
        <div className="h-3 bg-gray-50 rounded w-28 mt-1" />
        <div className="h-10 bg-gray-100 rounded-xl w-full mt-4" />
      </div>
    </div>
  );
}

function CategoryPillSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex-shrink-0 animate-pulse">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl" />
          <div className="h-3 bg-gray-100 rounded mt-2 mx-auto w-14" />
        </div>
      ))}
    </div>
  );
}

// ─── Star Rating ────────────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5 bg-emerald-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
        <span>{rating.toFixed(1)}</span>
        <Star className="w-2.5 h-2.5 fill-current" />
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-400 font-medium">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}

// ─── Product Card ───────────────────────────────────────────────────────────
function ProductCard({
  product,
  onAddToCart,
  viewMode = "grid",
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
  viewMode?: "grid" | "list";
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const discount = getDiscount(product.mrp, product.sellingPrice);
  const stockStatus = getStockStatus(product.totalStock);
  const unitName = product.units?.abbreviation || product.units?.name || "unit";

  const handleCardClick = () => {
    router.push(`/marketplace/${product.id}`);
  };

  if (viewMode === "list") {
    return (
      <div
        className="group bg-white border border-gray-100 hover:border-blue-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer flex"
        onClick={handleCardClick}
      >
        {/* Image */}
        <div className="relative w-48 flex-shrink-0 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl select-none opacity-80">{getProductEmoji(product)}</span>
          )}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              {discount}% OFF
            </div>
          )}
        </div>
        {/* Details */}
        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div>
            {product.brand && (
              <p className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider mb-1">
                {product.brand}
              </p>
            )}
            <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
            {product.categories?.name && (
              <p className="text-xs text-gray-400 mt-1">{product.categories.name}</p>
            )}
            {product.shortDescription && (
              <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{product.shortDescription}</p>
            )}
          </div>
          <div className="flex items-end justify-between mt-3">
            <div>
              <div className="flex items-end gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(product.sellingPrice)}
                </span>
                {product.mrp && product.mrp > product.sellingPrice && (
                  <span className="text-sm text-gray-400 line-through mb-0.5">
                    {formatPrice(product.mrp)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">per {unitName} • excl. GST</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${stockStatus.color}`}>
                {stockStatus.label}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                disabled={!product.totalStock}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
              >
                <ShoppingCart className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      className="group bg-white border border-gray-100 hover:border-blue-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image Area */}
      <div className="relative h-52 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-6xl select-none opacity-80 transition-transform duration-500 group-hover:scale-110">
            {getProductEmoji(product)}
          </span>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
            {discount}% OFF
          </div>
        )}

        {/* Featured badge */}
        {product.isFeatured && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Featured
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setWishlisted(!wishlisted);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            wishlisted
              ? "bg-red-50 text-red-500 shadow-sm"
              : "bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 shadow-sm"
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Quick actions on hover */}
        <div
          className={`absolute bottom-3 right-3 flex gap-1.5 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.info("Link copied to clipboard!");
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/marketplace/${product.id}`);
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Brand */}
        {product.brand && (
          <p className="text-[11px] text-blue-600 font-semibold uppercase tracking-wider mb-1">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Category */}
        {product.categories?.name && (
          <p className="text-[11px] text-gray-400 mt-1">{product.categories.name}</p>
        )}

        {/* Price */}
        <div className="mt-3">
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.sellingPrice)}
            </span>
            {product.mrp && product.mrp > product.sellingPrice && (
              <span className="text-xs text-gray-400 line-through mb-0.5">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">
            per {unitName} • excl. GST
          </p>
        </div>

        {/* Stock & Delivery */}
        <div className="flex items-center gap-3 mt-3 text-[11px]">
          <span className={`font-medium ${stockStatus.color} flex items-center gap-1`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              stockStatus.color.includes("emerald") ? "bg-emerald-500" :
              stockStatus.color.includes("amber") ? "bg-amber-500" : "bg-red-500"
            }`} />
            {stockStatus.label}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-500 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            2-5 days
          </span>
        </div>

        {/* Verified + GST */}
        <div className="flex items-center gap-2 mt-2">
          <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
            <ShieldCheck className="w-3 h-3" />
            Verified
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
            <BadgeCheck className="w-3 h-3" />
            GST
          </span>
        </div>

        {/* Add to Cart */}
        <div className="mt-auto pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={!product.totalStock}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.totalStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Drawer ────────────────────────────────────────────────────────────
function CartDrawer({
  items,
  onClose,
  onRemove,
}: {
  items: any[];
  onClose: () => void;
  onRemove: (productId: string) => void;
}) {
  const total = items?.reduce((s: number, i: any) => s + (i.product?.sellingPrice || 0) * (i.quantity || 1), 0) || 0;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Shopping Cart</h2>
              <p className="text-xs text-gray-400">{items?.length || 0} items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {!items?.length ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-gray-200" />
              </div>
              <p className="font-semibold text-gray-900 text-lg">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1 max-w-[240px]">
                Browse the marketplace and add construction materials to get started
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item: any) => (
              <div
                key={item.id || item.productId}
                className="bg-gray-50 rounded-xl p-4 flex gap-4 relative group"
              >
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0 text-2xl border border-gray-100">
                  {item.product?.image ? (
                    <img src={item.product.image} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span>{getProductEmoji(item.product || {})}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug pr-6">
                    {item.product?.name || "Product"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Qty: {item.quantity || 1}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {formatPrice((item.product?.sellingPrice || 0) * (item.quantity || 1))}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(item.productId || item.product?.id)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items?.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 bg-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Total (excl. GST)</span>
              <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-base active:scale-[0.98]">
              Proceed to Checkout
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure payment • GST Invoice included
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────
function EmptyProductState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Package className="w-12 h-12 text-blue-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-900">No products found</h3>
      <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
        We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
      </p>
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={onReset}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}

// ─── Error State ────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="text-center py-20 bg-white border border-red-100 rounded-2xl">
      <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-10 h-10 text-red-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">Something went wrong</h3>
      <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}

// ─── Sort Options ───────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "sellingPrice:asc", label: "Price: Low to High" },
  { value: "sellingPrice:desc", label: "Price: High to Low" },
  { value: "name:asc", label: "Name: A to Z" },
  { value: "name:desc", label: "Name: Z to A" },
];

// ─── Trust Badges ───────────────────────────────────────────────────────────
const TRUST_BADGES = [
  {
    icon: <Truck className="w-5 h-5 text-blue-600" />,
    label: "Free Delivery",
    sub: "On orders above ₹50,000",
    bg: "bg-blue-50",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
    label: "Verified Suppliers",
    sub: "Quality assured materials",
    bg: "bg-emerald-50",
  },
  {
    icon: <BadgePercent className="w-5 h-5 text-purple-600" />,
    label: "Bulk Discounts",
    sub: "Up to 25% off on bulk",
    bg: "bg-purple-50",
  },
  {
    icon: <Tag className="w-5 h-5 text-amber-600" />,
    label: "GST Invoices",
    sub: "For all B2B purchases",
    bg: "bg-amber-50",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function MarketplacePage() {
  const router = useRouter();

  // ── State ───────────────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  // Cart
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Debounced Search ────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Fetch Products ──────────────────────────────────────────────────────
  const fetchProducts = useCallback(
    async (page = 1, append = false) => {
      if (!append) setIsLoading(true);
      else setIsLoadingMore(true);
      setError(null);

      try {
        const params: Record<string, string | number | boolean> = {
          page,
          limit: 20,
          sortBy,
          sortOrder,
          isActive: true,
        };
        if (debouncedSearch) params.search = debouncedSearch;
        if (selectedCategory) params.categoryId = selectedCategory;
        if (selectedBrand) params.brand = selectedBrand;

        const response = await ApiClient.get<any>("/products", { params });
        const data = response?.data || response;
        const items: Product[] = data?.items || data || [];
        const paginationMeta: PaginationMeta = data?.meta || {
          totalItems: items.length,
          itemCount: items.length,
          itemsPerPage: 20,
          totalPages: 1,
          currentPage: 1,
        };

        if (append) {
          setProducts((prev) => [...prev, ...items]);
        } else {
          setProducts(items);
        }
        setMeta(paginationMeta);
      } catch (err: any) {
        setError(err.message || "Failed to load products");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [debouncedSearch, selectedCategory, selectedBrand, sortBy, sortOrder]
  );

  // ── Fetch Categories ────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    try {
      const response = await ApiClient.get<any>("/categories");
      const data = response?.data || response;
      setCategories(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  // ── Fetch Cart ──────────────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    try {
      const response = await ApiClient.get<any>("/cart");
      const data = response?.data || response;
      setCartItems(data?.items || []);
    } catch (err: any) {
      // Cart might be empty/not found — that's ok
      setCartItems([]);
    }
  }, []);

  // ── Initial Load ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchCategories();
    fetchCart();
  }, [fetchCategories, fetchCart]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [fetchProducts, currentPage]);

  // ── Add to Cart ─────────────────────────────────────────────────────────
  const handleAddToCart = async (product: Product) => {
    setCartLoading(true);
    try {
      await ApiClient.post<any>("/cart/items", {
        productId: product.id,
        quantity: 1,
      });
      toast.success(`${product.name} added to cart`, {
        description: "You can view your cart anytime",
      });
      await fetchCart();
    } catch (err: any) {
      toast.error("Failed to add to cart", {
        description: err.message || "Please try again",
      });
    } finally {
      setCartLoading(false);
    }
  };

  // ── Remove from Cart ───────────────────────────────────────────────────
  const handleRemoveFromCart = async (productId: string) => {
    try {
      await ApiClient.delete<any>(`/cart/items/${productId}`);
      await fetchCart();
      toast.success("Item removed from cart");
    } catch (err: any) {
      toast.error("Failed to remove item");
    }
  };

  // ── Category scroll ─────────────────────────────────────────────────────
  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      categoryScrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ── Reset Filters ───────────────────────────────────────────────────────
  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  // ── Unique brands from products ─────────────────────────────────────────
  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brandSet.add(p.brand);
    });
    return Array.from(brandSet).sort();
  }, [products]);

  const totalCartItems = cartItems?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50/80 pb-24 lg:pb-8">

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STICKY TOP BAR */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">

            {/* Logo/Title */}
            <div className="hidden lg:block flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Marketplace</h1>
              <p className="text-[11px] text-gray-400 font-medium">B2B Construction Materials</p>
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search cement, steel, tiles, paints, tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.97]"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Cart</span>
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TRUST BADGES */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {TRUST_BADGES.map(({ icon, label, sub, bg }) => (
            <div
              key={label}
              className="bg-white border border-gray-100 rounded-xl p-3.5 flex items-center gap-3 hover:shadow-md transition-all duration-200 cursor-default"
            >
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {icon}
              </div>
              <div className="min-w-0">
                <p className="text-gray-900 text-sm font-semibold truncate">{label}</p>
                <p className="text-gray-400 text-[11px] font-medium truncate">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CATEGORY HORIZONTAL SCROLL */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Shop by Category</h2>
            <div className="flex gap-1">
              <button
                onClick={() => scrollCategories("left")}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => scrollCategories("right")}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {!categories.length ? (
            <CategoryPillSkeleton />
          ) : (
            <div
              ref={categoryScrollRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* All */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setCurrentPage(1);
                }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 w-20 group transition-all ${
                  !selectedCategory ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                    !selectedCategory
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                      : "bg-gray-50 border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50"
                  }`}
                >
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <span
                  className={`text-[11px] font-semibold text-center leading-tight ${
                    !selectedCategory ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  All
                </span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                    setCurrentPage(1);
                  }}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 w-20 group transition-all ${
                    selectedCategory === cat.id ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 shadow-lg shadow-blue-200 scale-105"
                        : "bg-gray-50 border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50"
                    }`}
                  >
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <span>{getCategoryIcon(cat.name)}</span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-semibold text-center leading-tight line-clamp-2 ${
                      selectedCategory === cat.id ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MAIN CONTENT AREA */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="flex gap-6 items-start">

          {/* ── FILTERS SIDEBAR (Desktop) ──────────────────────────────────── */}
          <div className="hidden lg:block w-60 flex-shrink-0 sticky top-24">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  Filters
                </h3>
                {(selectedCategory || selectedBrand) && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-blue-600 font-semibold hover:text-blue-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Brand Filter */}
              {brands.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Brand
                  </h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => {
                          setSelectedBrand(selectedBrand === brand ? null : brand);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedBrand === brand
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              {categories.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Category
                  </h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                          selectedCategory === cat.id
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-base">{getCategoryIcon(cat.name)}</span>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Quick Filters
                </h4>
                <div className="space-y-1">
                  <label className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-gray-600">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    In Stock Only
                  </label>
                  <label className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-gray-600">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    GST Verified
                  </label>
                  <label className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-gray-600">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    Featured Only
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ── PRODUCT FEED ────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="bg-white border border-gray-100 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                <p className="text-sm text-gray-500 font-medium">
                  {isLoading ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    <>
                      <span className="text-gray-900 font-bold">{meta?.totalItems || products.length}</span>
                      {" "}products
                      {selectedCategory && (
                        <>
                          {" "}in{" "}
                          <span className="text-blue-600 font-semibold">
                            {categories.find((c) => c.id === selectedCategory)?.name}
                          </span>
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={`${sortBy}:${sortOrder}`}
                    onChange={(e) => {
                      const [sb, so] = e.target.value.split(":");
                      setSortBy(sb);
                      setSortOrder(so);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-sm text-gray-600 font-medium focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 cursor-pointer"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-all ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-all ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Active Filters ──────────────────────────────────────────── */}
            {(selectedCategory || selectedBrand || debouncedSearch) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-gray-400 font-medium">Active:</span>
                {debouncedSearch && (
                  <button
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                  >
                    "{debouncedSearch}"
                    <X className="w-3 h-3" />
                  </button>
                )}
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                  >
                    {categories.find((c) => c.id === selectedCategory)?.name || "Category"}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {selectedBrand && (
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                  >
                    {selectedBrand}
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={resetFilters}
                  className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* ── Product Grid ────────────────────────────────────────────── */}
            {error ? (
              <ErrorState
                message={error}
                onRetry={() => fetchProducts(currentPage)}
              />
            ) : isLoading ? (
              <div
                className={`grid gap-5 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyProductState onReset={resetFilters} />
            ) : (
              <>
                <div
                  className={`grid gap-5 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                              currentPage === page
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      {meta.totalPages > 5 && (
                        <>
                          <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
                          <button
                            onClick={() => setCurrentPage(meta.totalPages)}
                            className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                              currentPage === meta.totalPages
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {meta.totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    <button
                      disabled={currentPage >= meta.totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Load More (alternative) */}
                {isLoadingMore && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MOBILE BOTTOM NAV */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50 px-4 py-2 safe-area-bottom">
        <div className="flex items-center justify-around">
          <button
            onClick={() => router.push("/marketplace")}
            className="flex flex-col items-center gap-0.5 py-1 text-blue-600"
          >
            <Store className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Shop</span>
          </button>
          <button
            onClick={() => searchInputRef.current?.focus()}
            className="flex flex-col items-center gap-0.5 py-1 text-gray-400 hover:text-gray-600"
          >
            <Search className="w-5 h-5" />
            <span className="text-[10px] font-medium">Search</span>
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1 text-gray-400 hover:text-gray-600 relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-0.5 right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
            <span className="text-[10px] font-medium">Cart</span>
          </button>
          <button
            onClick={() => router.push("/orders")}
            className="flex flex-col items-center gap-0.5 py-1 text-gray-400 hover:text-gray-600"
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] font-medium">Orders</span>
          </button>
          <button
            onClick={() => router.push("/settings")}
            className="flex flex-col items-center gap-0.5 py-1 text-gray-400 hover:text-gray-600"
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Wishlist</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MOBILE FILTER BOTTOM SHEET */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-white px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Brand Filter */}
              {brands.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Brand</h4>
                  <div className="flex flex-wrap gap-2">
                    {brands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => {
                          setSelectedBrand(selectedBrand === brand ? null : brand);
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedBrand === brand
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === cat.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {getCategoryIcon(cat.name)} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm"
              >
                Clear All
              </button>
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setShowFilters(false);
                }}
                className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CART DRAWER */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onRemove={handleRemoveFromCart}
        />
      )}
    </div>
  );
}
