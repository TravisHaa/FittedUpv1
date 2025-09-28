import React, { PropsWithChildren } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MeshGradient from "@wilmxre/react-native-mesh-gradient";
import { LinearGradient } from "expo-linear-gradient";

type GradientBackgroundProps = PropsWithChildren<{
  colors?: string[];
  opacity?: number;
}>;

export default function GradientBackground({
  children,
  colors = ["#0ea5e9", "#22d3ee", "#14b8a6", "#2563eb"],
  opacity = 1,
}: GradientBackgroundProps) {
  const content = (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <LinearGradient
          colors={[colors[0], colors[2], colors[3]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { opacity }]}
        />
      ) : (
        <MeshGradient
          colors={colors}
          style={[StyleSheet.absoluteFill, { opacity }]}
          speed={0.3}
          startPoint={{ x: 0, y: 0 }}
          endPoint={{ x: 1, y: 1 }}
        />
      )}

      <View style={styles.content}>{children}</View>
    </View>
  );

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

