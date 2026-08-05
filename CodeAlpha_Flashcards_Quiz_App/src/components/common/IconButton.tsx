import React from "react";
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

interface Props {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  danger?: boolean;
  ghost?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function IconButton({
  name,
  onPress,
  size = 18,
  color,
  danger = false,
  ghost = false,
  style,
  testID,
}: Props) {
  const resolvedColor = color ?? (danger ? colors.inkFaint : ghost ? colors.inkFaint : colors.inkSoft);
  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.btn,
        danger && { backgroundColor: pressed ? colors.dangerSoft : "transparent" },
        !danger && pressed && { backgroundColor: colors.bg },
        style,
      ]}
    >
      <MaterialCommunityIcons name={name} size={size} color={resolvedColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
