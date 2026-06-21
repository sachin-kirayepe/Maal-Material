import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useSyncStore } from "../store/sync-engine";
import { Activity, Package, AlertTriangle, CheckCircle2 } from "lucide-react-native";

export function DashboardScreen() {
  const { isOnline, queue, lastSync } = useSyncStore();

  const pendingActions = queue.filter((q: any) => q.status === "PENDING").length;
  const failedActions = queue.filter((q: any) => q.status === "FAILED").length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Field Command</Text>
        <View style={[styles.statusBadge, isOnline ? styles.statusOnline : styles.statusOffline]}>
          <Text style={styles.statusText}>{isOnline ? "ONLINE" : "OFFLINE"}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Activity color="#0ea5e9" size={24} />
          <Text style={styles.cardValue}>12</Text>
          <Text style={styles.cardLabel}>Active Work Orders</Text>
        </View>

        <View style={styles.card}>
          <Package color="#10b981" size={24} />
          <Text style={styles.cardValue}>840</Text>
          <Text style={styles.cardLabel}>Units Scanned</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sync Status</Text>
        <View style={styles.syncCard}>
          <View style={styles.syncRow}>
            <Text style={styles.syncLabel}>Pending Sync Queue:</Text>
            <Text style={styles.syncValue}>{pendingActions} actions</Text>
          </View>
          <View style={styles.syncRow}>
            <Text style={styles.syncLabel}>Failed Actions:</Text>
            <Text style={[styles.syncValue, failedActions > 0 && styles.errorText]}>
              {failedActions}
            </Text>
          </View>
          <View style={styles.syncRow}>
            <Text style={styles.syncLabel}>Last Sync:</Text>
            <Text style={styles.syncValue}>
              {lastSync ? new Date(lastSync).toLocaleTimeString() : "Never"}
            </Text>
          </View>

          {pendingActions > 0 && !isOnline && (
            <View style={styles.warningBox}>
              <AlertTriangle color="#f59e0b" size={20} />
              <Text style={styles.warningText}>
                You are currently offline. Actions are queued and will automatically sync when
                connection is restored.
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent AI Insights</Text>
        <View style={styles.insightCard}>
          <CheckCircle2 color="#10b981" size={20} />
          <Text style={styles.insightText}>
            Warehouse Zone C is currently operating at 94% efficiency. No immediate interventions
            required.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOnline: {
    backgroundColor: "#064e3b",
  },
  statusOffline: {
    backgroundColor: "#7f1d1d",
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 12,
  },
  cardLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  syncCard: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  syncRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  syncLabel: {
    color: "#94a3b8",
  },
  syncValue: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  errorText: {
    color: "#ef4444",
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#451a03",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
    gap: 12,
  },
  warningText: {
    color: "#fcd34d",
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  insightCard: {
    flexDirection: "row",
    backgroundColor: "#064e3b",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  insightText: {
    color: "#d1fae5",
    flex: 1,
    lineHeight: 20,
  },
});
