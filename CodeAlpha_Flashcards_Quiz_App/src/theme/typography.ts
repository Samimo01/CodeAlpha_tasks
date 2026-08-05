export const typography = {
  // Space Grotesk (titles, counters, buttons, brand)
  display: "SpaceGrotesk_700Bold",
  title: "SpaceGrotesk_600SemiBold",
  titleMedium: "SpaceGrotesk_500Medium",
  
  // Inter (body, inputs)
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemiBold: "Inter_600SemiBold",
} as const;

export type FontKey = keyof typeof typography;
