import React from "react";
import { usePathname } from "next/navigation";
import { useMultiplayerStore } from "../../store/multiplayer-state";
import { Activity as ActivityIcon, Users as UsersIcon } from "lucide-react";
const Activity = ActivityIcon as any;
const Users = UsersIcon as any;

export function LivePresenceBar() {
  const pathname = usePathname();
  const { activeUsers, toggleActivityFeed } = useMultiplayerStore();

  const usersArray = Object.values(activeUsers);

  // Split users into current route vs others
  const usersHere = usersArray.filter((u) => u.currentRoute === pathname);

  return (
    <div className="flex items-center gap-4">
      {/* Avatar Stack for users on the SAME route */}
      {usersHere.length > 0 && (
        <div className="hidden sm:flex items-center">
          <div className="flex -space-x-2">
            {usersHere.map((user, idx) => (
              <div
                key={user.id}
                className={`w-8 h-8 rounded-full border-2 border-slate-900 ${user.color} flex items-center justify-center text-[10px] font-bold text-white shadow-md z-${10 - idx} group relative cursor-pointer`}
              >
                {user.initials}

                {/* Tooltip */}
                <div className="absolute top-full mt-2 hidden group-hover:block bg-black/90 border border-white/10 p-2 rounded-lg text-xs w-32 z-50 animate-in fade-in zoom-in duration-200">
                  <p className="font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{user.role}</p>
                  <p className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                    Viewing current page
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Active Users Counter */}
      <button
        onClick={toggleActivityFeed}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group relative"
      >
        <Users className="w-4 h-4 text-slate-400 group-hover:text-white" />
        <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-white">
          {usersArray.length} Online
        </span>
        <Activity className="w-3 h-3 text-emerald-500 animate-pulse ml-1" />
      </button>
    </div>
  );
}
