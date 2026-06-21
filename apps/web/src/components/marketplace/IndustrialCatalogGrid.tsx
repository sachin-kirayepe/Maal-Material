import React from "react";
import {
  ShoppingCart as ShoppingCartIcon,
  MessageSquare as MessageSquareIcon,
  Info as InfoIcon,
} from "lucide-react";
import { useAINegotiationStore } from "../../stores/aiNegotiationStore";

const ShoppingCart = ShoppingCartIcon as any;
const MessageSquare = MessageSquareIcon as any;
const Info = InfoIcon as any;

const INDUSTRIAL_CATALOG = [
  {
    id: "prod-crane-800",
    name: "Titanium Lattice Boom Crawler Crane",
    category: "Heavy Machinery",
    basePrice: 2450000,
    inStock: 12,
    specs: "Lift Capacity: 800t | Boom Length: 156m",
    image: "bg-slate-800", // Placeholder
  },
  {
    id: "prod-excavator-x5",
    name: "X5 Autonomous Mining Excavator",
    category: "Autonomous Vehicles",
    basePrice: 1250000,
    inStock: 45,
    specs: "Bucket Capacity: 22m³ | AI Vision System v3",
    image: "bg-slate-700",
  },
  {
    id: "prod-server-rack",
    name: "Quantum-Ready HPC Server Cluster",
    category: "IT Infrastructure",
    basePrice: 850000,
    inStock: 120,
    specs: "Processing: 50 PFLOPS | Cooling: Immersion",
    image: "bg-slate-600",
  },
  {
    id: "prod-drone-swarm",
    name: "Logistics Delivery Drone Swarm (100 units)",
    category: "Aerospace",
    basePrice: 450000,
    inStock: 8,
    specs: "Payload: 50kg/unit | Range: 400km",
    image: "bg-slate-500",
  },
];

export function IndustrialCatalogGrid() {
  const { startNegotiation } = useAINegotiationStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {INDUSTRIAL_CATALOG.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col"
        >
          <div
            className={`h-48 ${item.image} flex items-center justify-center relative overflow-hidden`}
          >
            {/* Abstract representation of the product */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <span className="text-white font-black text-xl tracking-widest opacity-30 group-hover:scale-110 transition-transform">
              {item.category.toUpperCase()}
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">
                {item.category}
              </span>
              <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                Stock: {item.inStock}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 flex-1">
              {item.name}
            </h3>

            <div className="flex items-center text-xs text-gray-500 mb-4 font-mono bg-gray-50 p-2 rounded border border-gray-100">
              <Info className="w-4 h-4 mr-1 text-gray-400" />
              {item.specs}
            </div>

            <div className="mt-auto">
              <div className="text-2xl font-black text-gray-900 mb-4">
                ${(item.basePrice / 1000000).toFixed(2)}
                <span className="text-sm font-bold text-gray-500">M / unit</span>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors text-sm">
                  <ShoppingCart className="w-4 h-4 mr-2" /> Cart
                </button>
                <button
                  onClick={() => startNegotiation(item.id, item.basePrice, item.name)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors shadow-sm text-sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Negotiate
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
