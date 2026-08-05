import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppButton } from "@/components/common/AppButton";
import { ProgressRing } from "@/components/card/ProgressRing";
import { calculatePercentage } from "@/services/ReviewService";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

const ENCOURAGE_HIGH = [
  "Great performance — most cards are mastered.",
  "Strong review pace — keep it up.",
  "Solid session, progress is looking good.",
];
const ENCOURAGE_LOW = [
  "A little more practice and you'll master it.",
  "This collection deserves another review.",
  "Not mastered yet — another try will help.",
];

function getEncouragement(pct: number): string {
  const pool = pct >= 50 ? ENCOURAGE_HIGH : ENCOURAGE_LOW;
  return pool[Math.floor(pct / 10) % pool.length];
}

export default function ResultScreen() {
  const router = useRouter();
  const { score: scoreStr, total: totalStr, collectionId } = useLocalSearchParams<{
    score: string;
    total: string;
    collectionId: string;
  }>();

  const score = Number(scoreStr ?? 0);
  const total = Number(totalStr ?? 0);
  const pct = useMemo(() => calculatePercentage(score, total), [score, total]);
  const message = useMemo(() => getEncouragement(pct), [pct]);

  const handleRestart = () => {
    if (collectionId) {
      router.replace(`/review/${collectionId}`);
    }
  };

  const handleQuit = () => {
    router.dismissTo("/");
  };

  return (
    <View style={styles.root}>
      <View style={styles.ringWrap}>
        <ProgressRing score={score} total={total} pct={pct} />
      </View>

      <Text style={styles.encourage}>{message}</Text>

      <View style={styles.bottomActions}>
        <AppButton label="Retry" variant="outline" full onPress={handleRestart} />
        <AppButton label="Quit" variant="primary" full onPress={handleQuit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingTop: 40,
  },
  ringWrap: {
    marginBottom: 36,
  },
  encourage: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: "center",
    marginTop: -20,
    marginBottom: 20,
    paddingHorizontal: 6,
  },
  bottomActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
});
