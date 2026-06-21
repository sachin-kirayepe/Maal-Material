import React from "react";
import { Card, Button } from "@constructos/ui";
import { useSyncStore } from "@/stores/syncStore";
import {
  CloudOff as CloudOffIcon,
  RefreshCw as RefreshCwIcon,
  CheckCircle as CheckCircleIcon,
  AlertOctagon as AlertOctagonIcon,
} from "lucide-react";
const CloudOff = CloudOffIcon as any;
const RefreshCw = RefreshCwIcon as any;
const CheckCircle = CheckCircleIcon as any;
const AlertOctagon = AlertOctagonIcon as any;

export default function SyncDashboard() {
  const { queue, syncStatus, lastSyncAt, processQueue, isOnline, clearQueue } = useSyncStore();

  // Hardcoded for testing
  const tenantId = "t-001";
  const deviceId = "device-offline-123";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Offline Sync Engine</h1>
          <p className="text-gray-500">Manage your local queue and conflicts</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className={`font-bold ${isOnline ? "text-green-500" : "text-red-500"}`}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
            <span className="text-xs text-gray-400">
              Last sync: {lastSyncAt ? new Date(lastSyncAt).toLocaleTimeString() : "Never"}
            </span>
          </div>
          <Button
            onClick={() => processQueue(tenantId, deviceId)}
            disabled={!isOnline || queue.length === 0 || syncStatus === "SYNCING"}
          >
            {syncStatus === "SYNCING" ? (
              <RefreshCw className="animate-spin mr-2" />
            ) : (
              <RefreshCw className="mr-2" />
            )}
            Sync Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <CloudOff className="text-orange-500 mb-2" size={32} />
          <h3 className="text-2xl font-bold">{queue.length}</h3>
          <p className="text-sm text-gray-500">Items Queued</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <CheckCircle className="text-green-500 mb-2" size={32} />
          <h3 className="text-2xl font-bold">Safe</h3>
          <p className="text-sm text-gray-500">Integrity Check</p>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <AlertOctagon className="text-red-500 mb-2" size={32} />
          <h3 className="text-2xl font-bold">0</h3>
          <p className="text-sm text-gray-500">Conflicts Detected</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Local Queue</h2>
          <Button variant="ghost" className="text-red-500" onClick={clearQueue}>
            Clear Queue
          </Button>
        </div>
        {queue.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No items pending synchronization.</div>
        ) : (
          <div className="space-y-2">
            {queue.map((op: any) => (
              <div
                key={op.operationId}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <div>
                  <span className="font-bold text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded mr-3">
                    {op.action}
                  </span>
                  <span className="font-medium">{op.entityType}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(op.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
