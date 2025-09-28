import React, { PropsWithChildren } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

type GlassViewProps = PropsWithChildren<{
  intensity?: number;
  tint?: "light" | "dark" | "default";
  style?: ViewStyle | ViewStyle[];
  borderColor?: string;
  backgroundColor?: string;
}>;

export default function GlassView({
  children,
  intensity = 40,
  tint = "default",
  style,
  borderColor = "rgba(255,255,255,0.15)",
  backgroundColor = "rgba(255,255,255,0.08)",
}: GlassViewProps) {
  return (
    <View style={[styles.wrapper, { borderColor }, Array.isArray(style) ? style : [style]]}>
      <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      <View style={[styles.inner, { backgroundColor }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: 16,
  },
  inner: {
    padding: 12,
  },
});

