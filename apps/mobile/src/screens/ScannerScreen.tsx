import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSyncStore } from "../store/sync-engine";
import { ScanLine, Box } from "lucide-react-native";

export function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { addAction } = useSyncStore();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);

    // Create an offline-first action to process this scan
    addAction({
      type: "SCAN_INVENTORY",
      payload: { barcode: data, scanType: type, location: "WAREHOUSE_A_ZONE_3" },
    });

    Alert.alert("Asset Scanned", `Barcode: ${data}\nQueued for synchronization.`, [
      { text: "Scan Next", onPress: () => setScanned(false) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventory Scanner</Text>
        <Text style={styles.subtitle}>Align barcode within the frame</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.scanTarget}>
              <ScanLine color="#0ea5e9" size={48} />
            </View>
          </View>
        </CameraView>
      </View>

      <View style={styles.footer}>
        <View style={styles.actionCard}>
          <Box color="#ffffff" size={24} />
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Manual Entry</Text>
            <Text style={styles.actionDesc}>Cannot scan? Enter ID manually.</Text>
          </View>
        </View>
      </View>
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
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanTarget: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#0ea5e9",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  footer: {
    padding: 24,
    backgroundColor: "#1e293b",
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#334155",
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  actionDesc: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 2,
  },
  text: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0ea5e9",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 40,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
