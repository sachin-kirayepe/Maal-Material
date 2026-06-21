import React from "react";
import { usePathname } from "next/navigation";
import { useMultiplayerStore } from "../../store/multiplayer-state";
import { MousePointer2 as MousePointer2Icon } from "lucide-react";
const MousePointer2 = MousePointer2Icon as any;

export function MultiplayerCursorOverlay() {
  const pathname = usePathname();
  const { cursors, activeUsers } = useMultiplayerStore();

  const cursorsArray = Object.values(cursors).filter((c: any) => c.route === pathname);

  if (cursorsArray.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {cursorsArray.map((cursor) => {
        const user = activeUsers[cursor.userId];
        if (!user) return null;

        // Smooth translation using hardware acceleration
        const style = {
          transform: `translate(${cursor.x}px, ${cursor.y}px)`,
          transition: "transform 0.15s cubic-bezier(0.1, 0.9, 0.2, 1)",
        };

        return (
          <div key={cursor.userId} className="absolute top-0 left-0" style={style}>
            <MousePointer2
              className={`w-4 h-4 ${cursor.isClicking ? "scale-75" : "scale-100"} transition-transform duration-100`}
              style={{
                color: getTailwindColorHex(user.color),
                fill: getTailwindColorHex(user.color),
              }}
            />
            <div
              className="mt-2 ml-4 px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-xl opacity-80"
              style={{ backgroundColor: getTailwindColorHex(user.color) }}
            >
              {user.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Utility to convert our tailwind bg classes to hex for the cursor SVG
function getTailwindColorHex(bgClass: string) {
  switch (bgClass) {
    case "bg-emerald-500":
      return "#10b981";
    case "bg-blue-500":
      return "#3b82f6";
    case "bg-purple-500":
      return "#a855f7";
    case "bg-amber-500":
      return "#f59e0b";
    case "bg-rose-500":
      return "#f43f5e";
    default:
      return "#0ea5e9";
  }
}
