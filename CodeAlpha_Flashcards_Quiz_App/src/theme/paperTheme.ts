import { MD3DarkTheme } from "react-native-paper";
import { colors } from "./colors";

export const paperTheme = {
  ...MD3DarkTheme,
  roundness: 10,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.accent,
    onPrimary: colors.accentInk,
    background: colors.bg,
    onBackground: colors.ink,
    surface: colors.surface,
    onSurface: colors.ink,
    surfaceVariant: colors.surfaceAlt,
    onSurfaceVariant: colors.inkSoft,
    outline: colors.line,
    error: colors.danger,
    onError: "#1B1220",
    secondaryContainer: colors.surfaceAlt,
    onSecondaryContainer: colors.ink,
    surfaceDisabled: "rgba(242,242,246,0.12)",
    onSurfaceDisabled: colors.inkFaint,
  },
};
