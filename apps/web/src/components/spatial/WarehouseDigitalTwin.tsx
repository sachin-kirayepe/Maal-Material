import React, { useEffect } from "react";
import { Canvas as R3FCanvas } from "@react-three/fiber";
import {
  OrbitControls as DreiOrbitControls,
  Grid as DreiGrid,
  Environment as DreiEnvironment,
  ContactShadows as DreiContactShadows,
} from "@react-three/drei";
import { useSpatialStore } from "../../store/spatial-state";
import { IndustrialRackNode } from "./IndustrialRackNode";
import * as THREE from "three";

const Canvas = R3FCanvas as any;
const OrbitControls = DreiOrbitControls as any;
const Grid = DreiGrid as any;
const Environment = DreiEnvironment as any;
const ContactShadows = DreiContactShadows as any;

const Group = "group" as any;
const Mesh = "mesh" as any;
const PlaneGeometry = "planeGeometry" as any;
const MeshBasicMaterial = "meshBasicMaterial" as any;
const Color = "color" as any;
const Fog = "fog" as any;
const AmbientLight = "ambientLight" as any;
const DirectionalLight = "directionalLight" as any;
const PointLight = "pointLight" as any;

// A subtle glowing floor for the industrial environment
function DigitalTwinFloor() {
  return (
    <Group position={[0, -3.1, 0]}>
      <Grid
        infiniteGrid
        fadeDistance={50}
        sectionColor="#0ea5e9"
        cellColor="#1e293b"
        sectionSize={10}
        cellSize={2}
        sectionThickness={1.5}
        cellThickness={0.5}
      />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={50} blur={2} far={10} />
      <Mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <PlaneGeometry args={[100, 100]} />
        <MeshBasicMaterial color="#020617" />
      </Mesh>
    </Group>
  );
}

// Controls logic outside the canvas for zustand syncing
function SpatialCameraController() {
  const { cameraTarget } = useSpatialStore();

  return (
    <OrbitControls
      makeDefault
      target={new THREE.Vector3(...cameraTarget)}
      minDistance={10}
      maxDistance={80}
      maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below floor
      enableDamping
      dampingFactor={0.05}
    />
  );
}

export function WarehouseDigitalTwin() {
  const { nodes, isSimulationRunning } = useSpatialStore();

  useEffect(() => {
    if (!isSimulationRunning) return;

    // Fetch initial data
    (useSpatialStore.getState() as any).syncWithWarehouse();

    // Poll the backend every 5 seconds for live digital twin data
    // const interval = setInterval(() => {
      (useSpatialStore.getState() as any).syncWithWarehouse();
    // // }, timer); // Fixed by cleanup

    // return () => clearInterval(interval);
  }, [isSimulationRunning]);

  return (
    <div className="w-full h-full bg-slate-950 rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
      <Canvas
        shadows
        camera={{ position: [20, 25, 30], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        {/* Environment & Lighting */}
        <Color attach="background" args={["#020617"]} />
        <Fog attach="fog" args={["#020617", 30, 80]} />
        <AmbientLight intensity={0.4} />
        <DirectionalLight
          position={[10, 20, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <PointLight position={[-10, 10, -10]} intensity={2} color="#0ea5e9" distance={30} />
        <PointLight position={[10, 5, 10]} intensity={1} color="#ef4444" distance={20} />

        {/* Scene Objects */}
        <DigitalTwinFloor />

        {Object.values(nodes).map((node) => (
          <IndustrialRackNode key={node.id} node={node} />
        ))}

        {/* Camera Control */}
        <SpatialCameraController />
        <Environment preset="city" />
      </Canvas>

      {/* Simulation Watermark */}
      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/30 uppercase tracking-widest pointer-events-none">
        Spatial Operations Engine v9.0
      </div>
    </div>
  );
}
