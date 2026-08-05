import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  score: number;
  total: number;
  pct: number;
}

export function ProgressRing({ score, total, pct }: Props) {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(pct / 100, { duration: 700 });
  }, [pct, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - progress.value * circumference,
  }));

  const tone = pct >= 70 ? colors.success : pct >= 40 ? colors.accent : colors.danger;

  return (
    <View style={styles.wrap}>
      <Svg width={180} height={180} viewBox="0 0 180 180">
        <Circle
          cx={90}
          cy={90}
          r={radius}
          fill="none"
          stroke={colors.line}
          strokeWidth={12}
        />
        <AnimatedCircle
          cx={90}
          cy={90}
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform="rotate(-90 90 90)"
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.score}>
          {score}/{total}
        </Text>
        <Text style={styles.pct}>{pct}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
  },
  score: {
    fontFamily: typography.display,
    fontWeight: "700",
    fontSize: 26,
    color: colors.ink,
  },
  pct: {
    fontFamily: typography.body,
    fontSize: 12.5,
    color: colors.inkSoft,
    marginTop: 2,
  },
});
