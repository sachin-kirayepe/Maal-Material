import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges as DreiEdges, Html as DreiHtml } from "@react-three/drei";
import * as THREE from "three";

const Edges = DreiEdges as any;
const Html = DreiHtml as any;
const Group = "group" as any;
const Mesh = "mesh" as any;
const BoxGeometry = "boxGeometry" as any;
const MeshStandardMaterial = "meshStandardMaterial" as any;
import { SpatialNode, useSpatialStore } from "../../store/spatial-state";

export function IndustrialRackNode({ node }: { node: SpatialNode }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { simulationMode, selectedNodeId, setSelectedNodeId } = useSpatialStore();
  const [hovered, setHovered] = useState(false);

  const isSelected = selectedNodeId === node.id;

  // Determine color based on Simulation Mode
  let targetColor = "#1e293b"; // Base slate-800
  if (simulationMode === "heatmap") {
    // Heatmap based on temperature (0-100)
    if (node.temperature > 85)
      targetColor = "#ef4444"; // Red
    else if (node.temperature > 60)
      targetColor = "#f59e0b"; // Amber
    else targetColor = "#10b981"; // Emerald
  } else if (simulationMode === "predictive") {
    // Show load percentage
    if (node.loadPercentage > 95)
      targetColor = "#a855f7"; // Purple warning
    else if (node.loadPercentage > 75)
      targetColor = "#3b82f6"; // Blue
    else targetColor = "#0ea5e9"; // Light blue
  } else {
    // Standard mode - subtle colors
    targetColor = node.type === "machine" ? "#475569" : "#334155";
  }

  if (hovered || isSelected) {
    targetColor = "#ffffff";
  }

  // Animate color transition smoothly
  useFrame((state, delta) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.color.lerp(new THREE.Color(targetColor), 5 * delta);

      // Pulse if critical in standard mode
      if (simulationMode === "standard" && node.status === "critical") {
        material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
        material.emissive = new THREE.Color("#ef4444");
      } else if (!isSelected) {
        material.emissiveIntensity = 0;
      } else {
        material.emissiveIntensity = 0.3;
        material.emissive = new THREE.Color(targetColor);
      }
    }
  });

  return (
    <Group position={node.position}>
      <Mesh
        ref={meshRef}
        onClick={(e: any) => {
          e.stopPropagation();
          setSelectedNodeId(node.id);
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {node.type === "machine" ? (
          <BoxGeometry args={[4, 3, 4]} />
        ) : (
          <BoxGeometry args={[2, 6, 8]} />
        )}
        <MeshStandardMaterial color={targetColor} roughness={0.3} metalness={0.8} />

        {/* Futuristic Edges */}
        <Edges
          linewidth={isSelected ? 3 : 1}
          threshold={15}
          color={isSelected ? "#0ea5e9" : "#000000"}
        />
      </Mesh>

      {/* 3D Space UI Label (Visible when selected) */}
      {isSelected && (
        <Html
          position={[0, node.type === "machine" ? 2 : 4, 0]}
          center
          className="pointer-events-none"
        >
          <div className="bg-black/90 border border-primary/50 text-white p-3 rounded-lg shadow-[0_0_20px_rgba(14,165,233,0.3)] w-48 backdrop-blur-md animate-in zoom-in duration-200">
            <h3 className="font-bold text-sm text-primary mb-1">{node.metadata.name}</h3>
            <p className="text-[10px] text-slate-400 mb-2">{node.metadata.description}</p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-slate-500">Status</span>
                <p
                  className={`font-bold ${node.status === "optimal" ? "text-emerald-400" : node.status === "critical" ? "text-red-400" : "text-amber-400"}`}
                >
                  {node.status.toUpperCase()}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Temp</span>
                <p className="font-mono text-white">{node.temperature}°C</p>
              </div>
              <div>
                <span className="text-slate-500">Load</span>
                <p className="font-mono text-white">{node.loadPercentage}%</p>
              </div>
            </div>
          </div>
        </Html>
      )}
    </Group>
  );
}
