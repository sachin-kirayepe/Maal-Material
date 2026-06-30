"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  BadgeCheck,
  Package,
  MapPin,
  Phone,
  MessageSquare,
  ChevronRight,
  Minus,
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
  Store,
  FileText,
  Download,
  Info,
  CheckCircle2,
  Copy,
  ExternalLink,
  Zap,
  Clock,
  Tag,
  BadgePercent,
} from "lucide-react";
import { ApiClient } from "@/lib/api-client";
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
}

// ─── Helpers ────────────────────────────────────────────────────────────────
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

function getStockStatus(stock: number | undefined): { label: string; color: string; bg: string } {
  if (!stock || stock <= 0) return { label: "Out of Stock", color: "text-red-600", bg: "bg-red-50" };
  if (stock < 10) return { label: `Only ${stock} left — Hurry!`, color: "text-amber-600", bg: "bg-amber-50" };
  if (stock < 50) return { label: "Limited Stock", color: "text-amber-600", bg: "bg-amber-50" };
  return { label: "In Stock", color: "text-emerald-600", bg: "bg-emerald-50" };
}

const CATEGORY_ICONS: Record<string, string> = {
  cement: "🧱", steel: "⚙️", bricks: "🧱", sand: "🪨", paint: "🎨",
  plumbing: "🔧", electrical: "⚡", tiles: "🟫", wood: "🪵",
  safety: "🦺", tools: "🔨", default: "📦",
};

function getProductEmoji(product: Product): string {
  const name = (product.name + " " + (product.categories?.name || "")).toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (name.includes(key)) return icon;
  }
  return CATEGORY_ICONS.default;
}

// ─── Skeleton ───────────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/80 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="h-5 bg-gray-100 rounded w-48 mb-6" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl h-96" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 rounded w-20" />
            <div className="h-6 bg-gray-100 rounded w-full" />
            <div className="h-6 bg-gray-100 rounded w-3/4" />
            <div className="h-8 bg-gray-100 rounded w-32 mt-4" />
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-12 bg-gray-100 rounded-xl w-full mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT DETAILS PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  // ── Fetch Product ────────────────────────────────────────────────────
  const fetchProduct = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiClient.get<any>(`/products/${productId}`);
      const data = response?.data || response;
      setProduct(data);

      // Fetch related products from same category
      if (data?.categoryId) {
        try {
          const relRes = await ApiClient.get<any>("/products", {
            params: { categoryId: data.categoryId, limit: 6, isActive: true },
          });
          const relData = relRes?.data || relRes;
          const items = relData?.items || relData || [];
          setRelatedProducts(items.filter((p: Product) => p.id !== productId).slice(0, 4));
        } catch {
          // Non-critical
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load product");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) fetchProduct();
  }, [fetchProduct, productId]);

  // ── Add to Cart ─────────────────────────────────────────────────────
  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await ApiClient.post<any>("/cart/items", {
        productId: product.id,
        quantity,
      });
      toast.success(`${product.name} added to cart`, {
        description: `Qty: ${quantity}`,
      });
    } catch (err: any) {
      toast.error("Failed to add to cart", { description: err.message });
    } finally {
      setAddingToCart(false);
    }
  };

  if (isLoading) return <DetailSkeleton />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50/80 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Product not found</h3>
          <p className="text-sm text-gray-400 mt-2">{error || "This product may have been removed."}</p>
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={fetchProduct}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const discount = getDiscount(product.mrp, product.sellingPrice);
  const stockStatus = getStockStatus(product.totalStock);
  const unitName = product.units?.abbreviation || product.units?.name || "unit";

  return (
    <div className="min-h-screen bg-gray-50/80 pb-24 lg:pb-8">
      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => router.push("/marketplace")}
              className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Marketplace
            </button>
            {product.categories?.name && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <span className="text-gray-400">{product.categories.name}</span>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-700 font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Main Content ────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* ── Image Section ──────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden relative group">
              <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-12">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <span className="text-[120px] select-none opacity-70">{getProductEmoji(product)}</span>
                )}
              </div>

              {/* Badges */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
                  {discount}% OFF
                </div>
              )}
              {product.isFeatured && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Featured
                </div>
              )}

              {/* Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    wishlisted
                      ? "bg-red-50 text-red-500"
                      : "bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500"
                  } shadow-sm`}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}
                  className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Product Info ────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Brand & Category */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.brand && (
                <span className="text-xs text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-lg">
                  {product.brand}
                </span>
              )}
              {product.categories?.name && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">
                  {product.categories.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-500 text-sm leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Seller
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                <BadgeCheck className="w-3.5 h-3.5" />
                GST Invoiced
              </span>
              {product.hsn && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                  HSN: {product.hsn}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-5 border border-blue-100">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.sellingPrice)}
                </span>
                {product.mrp && product.mrp > product.sellingPrice && (
                  <span className="text-lg text-gray-400 line-through mb-1">
                    {formatPrice(product.mrp)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-sm text-emerald-600 font-bold mb-1">
                    Save {formatPrice(product.mrp! - product.sellingPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                per {unitName} • {product.taxPercent ? `${product.taxPercent}% GST applicable` : "excl. GST"}
              </p>

              {/* Bulk pricing hint */}
              <div className="mt-3 flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                <BadgePercent className="w-3.5 h-3.5" />
                <span className="font-medium">Bulk order? Contact seller for special pricing</span>
              </div>
            </div>

            {/* Stock Status */}
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${stockStatus.bg}`}>
              <span className={`w-2 h-2 rounded-full ${
                stockStatus.color.includes("emerald") ? "bg-emerald-500" :
                stockStatus.color.includes("amber") ? "bg-amber-500 animate-pulse" : "bg-red-500"
              }`} />
              <span className={`text-sm font-semibold ${stockStatus.color}`}>
                {stockStatus.label}
              </span>
              {product.totalStock !== undefined && product.totalStock > 0 && (
                <span className="text-xs text-gray-400">
                  ({product.totalStock.toLocaleString()} {unitName}s available)
                </span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-14 text-center text-sm font-bold text-gray-900 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-400">
                  Total: <span className="text-gray-900 font-bold">{formatPrice(product.sellingPrice * quantity)}</span>
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || !product.totalStock}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-base flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  {addingToCart ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
                <button className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-base transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                  Buy Now
                </button>
              </div>

              {/* Contact Seller */}
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Seller
                </button>
                <button className="flex-1 py-2.5 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Request Quote
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4.5 h-4.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Delivery in 2-5 business days</p>
                  <p className="text-xs text-gray-400">Free delivery on orders above ₹50,000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Quality Guaranteed</p>
                  <p className="text-xs text-gray-400">Verified seller • Genuine products only</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4.5 h-4.5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">GST Invoice Available</p>
                  <p className="text-xs text-gray-400">Proper tax documentation for all B2B purchases</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TABS: Description / Specifications / Reviews */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="mt-10">
          <div className="flex gap-1 border-b border-gray-200 mb-6">
            {(["description", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold transition-colors relative ${
                  activeTab === tab
                    ? "text-blue-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "description" ? "Description" : tab === "specs" ? "Specifications" : "Reviews"}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            {activeTab === "description" && (
              <div className="prose prose-sm max-w-none text-gray-600">
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <div className="text-center py-10">
                    <Info className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400">No detailed description available for this product.</p>
                    <p className="text-xs text-gray-300 mt-1">Contact the seller for more information.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-3">
                {[
                  { label: "SKU", value: product.sku },
                  { label: "Barcode", value: product.barcode },
                  { label: "Brand", value: product.brand },
                  { label: "Manufacturer", value: product.manufacturer },
                  { label: "Category", value: product.categories?.name },
                  { label: "Sub-Category", value: product.subCategories?.name },
                  { label: "Unit", value: product.units?.name },
                  { label: "Weight", value: product.weight },
                  { label: "Dimensions", value: product.dimensions },
                  { label: "HSN Code", value: product.hsn },
                  { label: "Tax Rate", value: product.taxPercent ? `${product.taxPercent}%` : undefined },
                ].filter(item => item.value).map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  </div>
                ))}
                {![product.sku, product.brand, product.manufacturer, product.weight].some(Boolean) && (
                  <div className="text-center py-10">
                    <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400">Specifications will be updated soon.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center py-12">
                <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No reviews yet</p>
                <p className="text-xs text-gray-400 mt-1">Be the first to review this product</p>
                <button className="mt-4 px-5 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WAREHOUSE AVAILABILITY */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {product.warehouseStocks && product.warehouseStocks.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Warehouse Availability</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {product.warehouseStocks.map((ws, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {ws.warehouses?.name || "Warehouse"}
                    </p>
                    {ws.warehouses?.city && (
                      <p className="text-xs text-gray-400">{ws.warehouses.city}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${ws.quantity > 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {ws.quantity}
                    </p>
                    <p className="text-[10px] text-gray-400">{unitName}s</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* RELATED PRODUCTS */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Related Products</h2>
              <button
                onClick={() => router.push(`/marketplace?categoryId=${product.categoryId}`)}
                className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <div
                  key={rp.id}
                  onClick={() => router.push(`/marketplace/${rp.id}`)}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="h-36 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                    {rp.image ? (
                      <img src={rp.image} alt={rp.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl opacity-70">{getProductEmoji(rp)}</span>
                    )}
                  </div>
                  <div className="p-3">
                    {rp.brand && (
                      <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider mb-0.5">
                        {rp.brand}
                      </p>
                    )}
                    <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {rp.name}
                    </h4>
                    <p className="text-sm font-bold text-gray-900 mt-2">{formatPrice(rp.sellingPrice)}</p>
                    {rp.mrp && rp.mrp > rp.sellingPrice && (
                      <p className="text-[10px] text-gray-400 line-through">{formatPrice(rp.mrp)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
