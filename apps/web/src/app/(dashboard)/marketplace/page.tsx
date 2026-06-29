"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Heart,
  Star,
  ChevronDown,
  X,
  Package,
  Truck,
  ShieldCheck,
  BadgePercent,
  Grid3X3,
  List,
  ChevronRight,
  Minus,
  Plus,
  Tag,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  mrp: number;
  unit: string;
  minOrder: number;
  rating: number;
  reviews: number;
  inStock: number;
  badge?: "bestseller" | "new" | "sale" | "bulk";
  specs: Record<string, string>;
  emoji: string;
  verified: boolean;
  deliveryDays: number;
}

interface CartItem {
  product: Product;
  qty: number;
}

// ─── Catalog Data ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "All Materials", icon: "🏗️" },
  { id: "cement", label: "Cement & Concrete", icon: "🧱" },
  { id: "steel", label: "Steel & Iron", icon: "⚙️" },
  { id: "bricks", label: "Bricks & Blocks", icon: "🧱" },
  { id: "sand", label: "Sand & Aggregates", icon: "🪨" },
  { id: "paint", label: "Paints & Coatings", icon: "🎨" },
  { id: "plumbing", label: "Plumbing", icon: "🔧" },
  { id: "electrical", label: "Electrical", icon: "⚡" },
  { id: "tiles", label: "Tiles & Flooring", icon: "🟫" },
  { id: "wood", label: "Wood & Timber", icon: "🪵" },
  { id: "safety", label: "Safety Equipment", icon: "🦺" },
  { id: "tools", label: "Tools & Machinery", icon: "🔨" },
];

const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "UltraTech OPC 53 Grade Cement",
    brand: "UltraTech",
    category: "cement",
    subcategory: "OPC Cement",
    price: 380,
    mrp: 420,
    unit: "bag (50kg)",
    minOrder: 10,
    rating: 4.7,
    reviews: 2341,
    inStock: 5000,
    badge: "bestseller",
    specs: { Grade: "OPC 53", Weight: "50 kg", Standard: "IS 12269:2013", Strength: "53 MPa" },
    emoji: "🧱",
    verified: true,
    deliveryDays: 2,
  },
  {
    id: "p2",
    name: "ACC Gold PPC Cement",
    brand: "ACC",
    category: "cement",
    subcategory: "PPC Cement",
    price: 360,
    mrp: 400,
    unit: "bag (50kg)",
    minOrder: 10,
    rating: 4.5,
    reviews: 1892,
    inStock: 3200,
    badge: "sale",
    specs: { Grade: "PPC", Weight: "50 kg", Standard: "IS 1489:1991", Blaine: "320 m²/kg" },
    emoji: "🧱",
    verified: true,
    deliveryDays: 2,
  },
  {
    id: "p3",
    name: "TMT Fe-500D Steel Bar 12mm",
    brand: "SAIL",
    category: "steel",
    subcategory: "TMT Bars",
    price: 72,
    mrp: 80,
    unit: "kg",
    minOrder: 100,
    rating: 4.8,
    reviews: 3120,
    inStock: 15000,
    badge: "bestseller",
    specs: { Grade: "Fe-500D", Diameter: "12 mm", Standard: "IS 1786:2008", Ductility: "Class D" },
    emoji: "⚙️",
    verified: true,
    deliveryDays: 3,
  },
  {
    id: "p4",
    name: "TATA Tiscon TMT 8mm Bar",
    brand: "TATA Steel",
    category: "steel",
    subcategory: "TMT Bars",
    price: 74,
    mrp: 82,
    unit: "kg",
    minOrder: 100,
    rating: 4.9,
    reviews: 4211,
    inStock: 22000,
    badge: "bestseller",
    specs: { Grade: "Fe-500D", Diameter: "8 mm", Standard: "IS 1786", Corrosion: "High Resistance" },
    emoji: "⚙️",
    verified: true,
    deliveryDays: 2,
  },
  {
    id: "p5",
    name: "Red Clay Bricks (First Class)",
    brand: "Local Kiln",
    category: "bricks",
    subcategory: "Clay Bricks",
    price: 8,
    mrp: 10,
    unit: "piece",
    minOrder: 500,
    rating: 4.3,
    reviews: 892,
    inStock: 100000,
    badge: "bulk",
    specs: { Type: "First Class", Size: "230×110×70 mm", Crushing: ">10 N/mm²", Water: "<20%" },
    emoji: "🧱",
    verified: true,
    deliveryDays: 1,
  },
  {
    id: "p6",
    name: "Fly Ash AAC Blocks 600×200×200",
    brand: "Siporex",
    category: "bricks",
    subcategory: "AAC Blocks",
    price: 55,
    mrp: 65,
    unit: "piece",
    minOrder: 200,
    rating: 4.6,
    reviews: 1423,
    inStock: 45000,
    badge: "new",
    specs: { Size: "600×200×200 mm", Density: "650 kg/m³", Thermal: "0.21 W/mK", Strength: "4 N/mm²" },
    emoji: "🟫",
    verified: true,
    deliveryDays: 3,
  },
  {
    id: "p7",
    name: "M-Sand (Manufactured Sand)",
    brand: "CRock",
    category: "sand",
    subcategory: "Manufactured Sand",
    price: 1800,
    mrp: 2100,
    unit: "tonne",
    minOrder: 5,
    rating: 4.4,
    reviews: 562,
    inStock: 800,
    badge: "sale",
    specs: { Type: "M-Sand", Zone: "Zone II", Silt: "<2%", Passing: "4.75 mm Sieve" },
    emoji: "🪨",
    verified: true,
    deliveryDays: 2,
  },
  {
    id: "p8",
    name: "Asian Paints Tractor Emulsion (20L)",
    brand: "Asian Paints",
    category: "paint",
    subcategory: "Interior Paints",
    price: 3200,
    mrp: 3750,
    unit: "20 Litre",
    minOrder: 1,
    rating: 4.6,
    reviews: 8931,
    inStock: 500,
    badge: "bestseller",
    specs: { Coverage: "80-90 sq ft/L", Finish: "Matt", Washability: "Excellent", Coats: "2 coats" },
    emoji: "🎨",
    verified: true,
    deliveryDays: 3,
  },
  {
    id: "p9",
    name: "Berger WeatherCoat All Guard (10L)",
    brand: "Berger",
    category: "paint",
    subcategory: "Exterior Paints",
    price: 4100,
    mrp: 4800,
    unit: "10 Litre",
    minOrder: 1,
    rating: 4.5,
    reviews: 3412,
    inStock: 230,
    badge: "sale",
    specs: { Coverage: "40-50 sq ft/L", Finish: "Sheen", Type: "Exterior", Waterproof: "Yes" },
    emoji: "🎨",
    verified: true,
    deliveryDays: 3,
  },
  {
    id: "p10",
    name: "CPVC Pipe 25mm x 3m",
    brand: "Astral",
    category: "plumbing",
    subcategory: "CPVC Pipes",
    price: 285,
    mrp: 340,
    unit: "piece (3m)",
    minOrder: 10,
    rating: 4.7,
    reviews: 2104,
    inStock: 5600,
    badge: "bestseller",
    specs: { Material: "CPVC", Diameter: "25 mm", Length: "3 m", Pressure: "PN 16 Rating" },
    emoji: "🔧",
    verified: true,
    deliveryDays: 2,
  },
  {
    id: "p11",
    name: "Havells 2.5 Sq mm FRLS Wire (90m)",
    brand: "Havells",
    category: "electrical",
    subcategory: "Wires & Cables",
    price: 2400,
    mrp: 2800,
    unit: "roll (90m)",
    minOrder: 1,
    rating: 4.8,
    reviews: 5678,
    inStock: 1200,
    badge: "bestseller",
    specs: { Size: "2.5 sq mm", Type: "FRLS", Length: "90 m", Standard: "IS 694" },
    emoji: "⚡",
    verified: true,
    deliveryDays: 2,
  },
  {
    id: "p12",
    name: "Kajaria Vitrified Floor Tile 2x2 ft",
    brand: "Kajaria",
    category: "tiles",
    subcategory: "Vitrified Tiles",
    price: 58,
    mrp: 72,
    unit: "sq ft",
    minOrder: 50,
    rating: 4.6,
    reviews: 3321,
    inStock: 10000,
    badge: "sale",
    specs: { Size: "600×600 mm", Finish: "Glossy", Water: "<0.08%", Strength: ">35 N/mm²" },
    emoji: "🟫",
    verified: true,
    deliveryDays: 5,
  },
  {
    id: "p13",
    name: "Safety Helmet (ISI Marked) - Orange",
    brand: "Karam",
    category: "safety",
    subcategory: "Head Protection",
    price: 350,
    mrp: 450,
    unit: "piece",
    minOrder: 5,
    rating: 4.5,
    reviews: 982,
    inStock: 3000,
    badge: "new",
    specs: { Standard: "IS 2925", Material: "HDPE", Color: "Orange", Class: "Class E" },
    emoji: "🦺",
    verified: true,
    deliveryDays: 1,
  },
  {
    id: "p14",
    name: "Kisan Bosch 13mm Rotary Hammer Drill",
    brand: "Bosch",
    category: "tools",
    subcategory: "Power Drills",
    price: 5800,
    mrp: 7200,
    unit: "piece",
    minOrder: 1,
    rating: 4.8,
    reviews: 4120,
    inStock: 340,
    badge: "sale",
    specs: { Power: "710 W", Chuck: "13 mm", Speed: "0-3000 RPM", Function: "Drill + Hammer" },
    emoji: "🔨",
    verified: true,
    deliveryDays: 3,
  },
  {
    id: "p15",
    name: "Meranti Plywood 12mm BWR Grade",
    brand: "Century Ply",
    category: "wood",
    subcategory: "BWR Plywood",
    price: 1650,
    mrp: 1900,
    unit: "sheet (8×4 ft)",
    minOrder: 5,
    rating: 4.7,
    reviews: 1804,
    inStock: 1500,
    badge: "bestseller",
    specs: { Grade: "BWR", Thickness: "12 mm", Size: "8×4 ft", Standard: "IS 303" },
    emoji: "🪵",
    verified: true,
    deliveryDays: 3,
  },
  {
    id: "p16",
    name: "20mm Crushed Stone Aggregate",
    brand: "BRP Aggregates",
    category: "sand",
    subcategory: "Coarse Aggregates",
    price: 950,
    mrp: 1100,
    unit: "tonne",
    minOrder: 5,
    rating: 4.3,
    reviews: 441,
    inStock: 2000,
    badge: undefined,
    specs: { Size: "20 mm", Type: "Crushed", "Los Angeles": "<30%", Absorption: "<2%" },
    emoji: "🪨",
    verified: true,
    deliveryDays: 2,
  },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Popularity" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "discount", label: "Discount" },
];

// ─── Badge Component ──────────────────────────────────────────────────────────
function ProductBadge({ badge }: { badge?: Product["badge"] }) {
  if (!badge) return null;
  const map = {
    bestseller: { label: "Bestseller", cls: "bg-amber-500 text-white" },
    new: { label: "New Launch", cls: "bg-emerald-500 text-white" },
    sale: { label: "SALE", cls: "bg-rose-500 text-white" },
    bulk: { label: "Bulk Deal", cls: "bg-blue-600 text-white" },
  };
  const { label, cls } = map[badge];
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${cls}`}>
      {label}
    </span>
  );
}

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-3 h-3 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-700 text-slate-700"}`}
          />
        ))}
      </div>
      <span className="text-xs text-slate-400">({count.toLocaleString()})</span>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, inCart, cartQty }: {
  product: Product;
  onAddToCart: (p: Product, qty: number) => void;
  inCart: boolean;
  cartQty: number;
}) {
  const [qty, setQty] = useState(product.minOrder);
  const [wishlisted, setWishlisted] = useState(false);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col">
      {/* Image Area */}
      <div className="relative h-44 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center flex-shrink-0">
        <span className="text-6xl select-none">{product.emoji}</span>
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <ProductBadge badge={product.badge} />
        </div>
        <button
          onClick={() => setWishlisted(!wishlisted)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-800/80 backdrop-blur flex items-center justify-center hover:bg-slate-700 transition-colors"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
        </button>
        {discount > 0 && (
          <div className="absolute bottom-3 right-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div>
          <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider mb-1">{product.brand}</p>
          <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">{product.subcategory}</p>
        </div>

        <StarRating rating={product.rating} count={product.reviews} />

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xl font-bold text-white">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 line-through">₹{product.mrp.toLocaleString()}</span>
          <span className="text-xs font-bold text-emerald-400">Save {discount}%</span>
        </div>
        <p className="text-[11px] text-slate-400">per {product.unit} • Min: {product.minOrder} {product.unit}s</p>

        {/* Key Specs */}
        <div className="bg-slate-800/60 rounded-lg p-2 mt-1">
          {Object.entries(product.specs).slice(0, 2).map(([k, v]) => (
            <div key={k} className="flex justify-between text-[11px]">
              <span className="text-slate-500">{k}</span>
              <span className="text-slate-300 font-medium">{v}</span>
            </div>
          ))}
        </div>

        {/* Delivery */}
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
          <Truck className="w-3 h-3" />
          <span>Delivery in {product.deliveryDays} day{product.deliveryDays > 1 ? "s" : ""}</span>
          {product.verified && (
            <>
              <span className="text-slate-600">•</span>
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400">Verified Supplier</span>
            </>
          )}
        </div>

        {/* Qty + Cart */}
        <div className="mt-auto pt-3 flex flex-col gap-2">
          {!inCart ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                  <button
                    onClick={() => setQty(Math.max(product.minOrder, qty - product.minOrder))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-12 text-center text-sm text-white font-medium">{qty}</span>
                  <button
                    onClick={() => setQty(qty + product.minOrder)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xs text-slate-500 flex-1 text-right">
                  = ₹{(product.price * qty).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => onAddToCart(product, qty)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/25"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </>
          ) : (
            <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              {cartQty} {product.unit}(s) in cart
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ items, onClose, onUpdateQty, onRemove }: {
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const savings = items.reduce((s, i) => s + (i.product.mrp - i.product.price) * i.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-slate-950 border-l border-slate-800 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-white text-lg">Cart ({items.length} items)</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <Package className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm mt-1">Add construction materials to get started</p>
            </div>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex gap-3">
                <div className="w-14 h-14 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl">
                  {product.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold line-clamp-2 leading-snug">{product.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{product.brand} • {product.unit}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                      <button onClick={() => onUpdateQty(product.id, qty - product.minOrder)} className="w-7 h-7 flex items-center justify-center hover:bg-slate-700 text-slate-300 transition-colors text-xs">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-sm text-white font-medium">{qty}</span>
                      <button onClick={() => onUpdateQty(product.id, qty + product.minOrder)} className="w-7 h-7 flex items-center justify-center hover:bg-slate-700 text-slate-300 transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-sm">₹{(product.price * qty).toLocaleString()}</p>
                      <button onClick={() => onRemove(product.id)} className="text-rose-400 text-[11px] hover:text-rose-300 transition-colors">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-800 space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
              <BadgePercent className="w-4 h-4 text-emerald-400" />
              <p className="text-emerald-400 text-sm font-medium">You save ₹{savings.toLocaleString()} on this order!</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{(total + savings).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>-₹{savings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-slate-800">
                <span>Total (incl. GST)</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]">
              Proceed to Order <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-slate-500">Secure payment • GST Invoice available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = PRODUCTS;
    if (selectedCategory !== "all") result = result.filter((p) => p.category === selectedCategory);
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()) || p.subcategory.toLowerCase().includes(search.toLowerCase()));
    result = result.sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "discount") return ((b.mrp - b.price) / b.mrp) - ((a.mrp - a.price) / a.mrp);
      return b.reviews - a.reviews;
    });
    return result;
  }, [selectedCategory, search, sort]);

  const totalCartItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalCartValue = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const handleAddToCart = (product: Product, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty } : i);
      return [...prev, { product, qty }];
    });
  };

  const handleUpdateQty = (id: string, qty: number) => {
    const product = PRODUCTS.find((p) => p.id === id)!;
    if (qty < product.minOrder) {
      setCart((prev) => prev.filter((i) => i.product.id !== id));
    } else {
      setCart((prev) => prev.map((i) => i.product.id === id ? { ...i, qty } : i));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Buy Materials</h1>
          <p className="text-sm text-slate-400 mt-0.5">Source verified construction materials from trusted suppliers</p>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/25"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden sm:block">Cart</span>
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
          {totalCartItems > 0 && (
            <span className="ml-1 text-sm font-bold">₹{totalCartValue.toLocaleString()}</span>
          )}
        </button>
      </div>

      {/* ── Trust Badges ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Truck className="w-4 h-4 text-blue-400" />, label: "Free Delivery", sub: "On orders >₹50,000" },
          { icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, label: "Verified Suppliers", sub: "Quality assured" },
          { icon: <BadgePercent className="w-4 h-4 text-amber-400" />, label: "Bulk Discounts", sub: "Up to 25% off" },
          { icon: <Tag className="w-4 h-4 text-purple-400" />, label: "GST Invoices", sub: "For all purchases" },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">{icon}</div>
            <div>
              <p className="text-white text-xs font-semibold">{label}</p>
              <p className="text-slate-500 text-[11px]">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search + Sort Bar ──────────────────────────────────── */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search cement, steel, bricks, paint..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-800 rounded-xl py-3 pl-4 pr-9 text-slate-300 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${showFilters ? "bg-blue-600/20 border-blue-500/50 text-blue-400" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <button onClick={() => setViewMode("grid")} className={`px-3 flex items-center transition-colors ${viewMode === "grid" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"}`}>
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode("list")} className={`px-3 flex items-center transition-colors ${viewMode === "list" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Category Pills ─────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${selectedCategory === cat.id
              ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Results Count ──────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing <span className="text-white font-semibold">{filtered.length}</span> products
          {selectedCategory !== "all" && <> in <span className="text-blue-400">{CATEGORIES.find((c) => c.id === selectedCategory)?.label}</span></>}
        </p>
      </div>

      {/* ── Products Grid ──────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-semibold text-slate-400">No products found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
          <button onClick={() => { setSearch(""); setSelectedCategory("all"); }} className="mt-4 text-blue-400 text-sm hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 sm:grid-cols-2"}`}>
          {filtered.map((product) => {
            const cartItem = cart.find((i) => i.product.id === product.id);
            return (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                inCart={!!cartItem}
                cartQty={cartItem?.qty ?? 0}
              />
            );
          })}
        </div>
      )}

      {/* ── Cart Drawer ────────────────────────────────────────── */}
      {cartOpen && (
        <CartDrawer
          items={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQty={handleUpdateQty}
          onRemove={(id) => setCart((prev) => prev.filter((i) => i.product.id !== id))}
        />
      )}
    </div>
  );
}
