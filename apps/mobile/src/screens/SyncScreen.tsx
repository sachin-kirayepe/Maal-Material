import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useSyncStore, SyncAction } from "../store/sync-engine";
import { RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react-native";

export function SyncScreen() {
  const { queue, isOnline, processQueue, clearQueue, setOnlineStatus } = useSyncStore();

  const isSyncing = queue.some((q: any) => q.status === "SYNCING");

  const renderItem = ({ item }: { item: SyncAction }) => (
    <View style={styles.actionItem}>
      <View style={styles.actionIconContainer}>
        {item.status === "PENDING" && <Clock color="#f59e0b" size={20} />}
        {item.status === "SYNCING" && <RefreshCw color="#0ea5e9" size={20} />}
        {item.status === "FAILED" && <XCircle color="#ef4444" size={20} />}
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionType}>{item.type}</Text>
        <Text style={styles.actionPayload}>
          {item.type === "SCAN_INVENTORY"
            ? `Barcode: ${item.payload.barcode}`
            : JSON.stringify(item.payload)}
        </Text>
        <Text style={styles.actionTime}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          item.status === "PENDING"
            ? styles.statusPending
            : item.status === "SYNCING"
              ? styles.statusSyncing
              : styles.statusFailed,
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Offline Queue</Text>
        <Text style={styles.subtitle}>{queue.length} items in sync queue</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.networkToggle}>
          <Text style={styles.networkLabel}>Simulate Network:</Text>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              style={[styles.toggleBtn, isOnline && styles.toggleBtnActive]}
              onPress={() => setOnlineStatus(true)}
            >
              <Text style={[styles.toggleBtnText, isOnline && styles.toggleBtnTextActive]}>
                Online
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, !isOnline && styles.toggleBtnActiveOff]}
              onPress={() => setOnlineStatus(false)}
            >
              <Text style={[styles.toggleBtnText, !isOnline && styles.toggleBtnTextActive]}>
                Offline
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.syncButton,
            (isSyncing || !isOnline || queue.length === 0) && styles.syncButtonDisabled,
          ]}
          onPress={processQueue}
          disabled={isSyncing || !isOnline || queue.length === 0}
        >
          <RefreshCw color={isSyncing ? "#94a3b8" : "#ffffff"} size={20} />
          <Text style={[styles.syncButtonText, isSyncing && styles.syncButtonTextDisabled]}>
            {isSyncing ? "Syncing..." : "Force Sync Now"}
          </Text>
        </TouchableOpacity>
      </View>

      {queue.length === 0 ? (
        <View style={styles.emptyState}>
          <CheckCircle2 color="#10b981" size={48} />
          <Text style={styles.emptyStateTitle}>All Caught Up!</Text>
          <Text style={styles.emptyStateDesc}>
            There are no pending actions in the offline queue.
          </Text>
        </View>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {queue.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={clearQueue}>
          <Text style={styles.clearBtnText}>Clear Queue (Debug)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#1e293b",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    color: "#94a3b8",
    marginTop: 4,
  },
  controls: {
    padding: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  networkToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 12,
  },
  networkLabel: {
    color: "#94a3b8",
    fontWeight: "bold",
  },
  toggleGroup: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 4,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: "#064e3b",
  },
  toggleBtnActiveOff: {
    backgroundColor: "#7f1d1d",
  },
  toggleBtnText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "bold",
  },
  toggleBtnTextActive: {
    color: "#ffffff",
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0ea5e9",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  syncButtonDisabled: {
    backgroundColor: "#334155",
  },
  syncButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  syncButtonTextDisabled: {
    color: "#94a3b8",
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  actionContent: {
    flex: 1,
  },
  actionType: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  actionPayload: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 2,
  },
  actionTime: {
    color: "#64748b",
    fontSize: 10,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPending: {
    backgroundColor: "#f59e0b20",
  },
  statusSyncing: {
    backgroundColor: "#0ea5e920",
  },
  statusFailed: {
    backgroundColor: "#ef444420",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyStateTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
  },
  emptyStateDesc: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
  },
  clearBtn: {
    padding: 16,
    alignItems: "center",
  },
  clearBtnText: {
    color: "#ef4444",
    fontWeight: "bold",
  },
});
