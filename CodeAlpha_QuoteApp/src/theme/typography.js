export const typography = {
  // Quote text (Lora Italic)
  quote: {
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 24,
    lineHeight: 35, // 24 * 1.45
    color: "#1B2733", // ink
  },
  quoteSmall: {
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 15,
    lineHeight: 22, // 15 * 1.45
    color: "#1B2733", // ink
  },

  // Author text (sans-serif, caps)
  author: {
    fontFamily: "System",
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#8CA0AC", // muted
  },

  // UI labels (chips, tabs)
  label: {
    fontFamily: "System",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontFamily: "System",
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  buttonLabel: {
    fontFamily: "System",
    fontSize: 13,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // Title
  title: {
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 22,
    color: "#1B2733", // ink
  },

  // Empty state
  emptyState: {
    fontFamily: "Lora_400Regular_Italic",
    fontSize: 15,
    fontStyle: "italic",
    color: "#8CA0AC", // muted
  },
};