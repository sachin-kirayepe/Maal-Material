import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { LayoutDashboard, ScanBarcode, RefreshCw } from "lucide-react-native";

// Screens
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { ScannerScreen } from "./src/screens/ScannerScreen";
import { SyncScreen } from "./src/screens/SyncScreen";
import { useSyncStore } from "./src/store/sync-engine";

const Tab = createBottomTabNavigator();

export default function App() {
  const { queue } = useSyncStore();
  const pendingCount = queue.filter((q) => q.status === "PENDING").length;

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#1e293b",
            borderTopColor: "#334155",
            paddingBottom: 8,
            paddingTop: 8,
            height: 64,
          },
          tabBarActiveTintColor: "#0ea5e9",
          tabBarInactiveTintColor: "#64748b",
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{
            tabBarIcon: ({ color, size }) => <ScanBarcode color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Offline Queue"
          component={SyncScreen}
          options={{
            tabBarIcon: ({ color, size }) => <RefreshCw color={color} size={size} />,
            tabBarBadge: pendingCount > 0 ? pendingCount : undefined,
            tabBarBadgeStyle: { backgroundColor: "#ef4444" },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
