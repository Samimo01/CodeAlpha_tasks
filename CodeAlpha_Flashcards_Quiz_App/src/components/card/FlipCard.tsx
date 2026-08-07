import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { ResultBadge } from "./ResultBadge";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface Props {
  question: string;
  answer: string;
  face: "question" | "answer";
  answered: boolean;
  resultCorrect?: boolean;
  onFlip: () => void;
  onMark: (correct: boolean) => void;
}

const THRESHOLD = 90;

export function FlipCard({
  question,
  answer,
  face,
  answered,
  resultCorrect,
  onFlip,
  onMark,
}: Props) {
  const progress = useSharedValue(face === "answer" ? 1 : 0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(progress.value, [0, 1], [0, 180])}deg` },
    ],
    backfaceVisibility: "hidden",
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateY: `${interpolate(progress.value, [0, 1], [180, 360])}deg` },
    ],
    backfaceVisibility: "hidden",
  }));

  const dragStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const rightStampOpacity = useAnimatedStyle(() => ({
    opacity: Math.max(0, translateX.value / THRESHOLD),
  }));
  const leftStampOpacity = useAnimatedStyle(() => ({
    opacity: Math.max(0, -translateX.value / THRESHOLD),
  }));

  useEffect(() => {
    progress.value = withTiming(face === "answer" ? 1 : 0, { duration: 500 });
  }, [face, progress]);

  const pan = Gesture.Pan()
    .enabled(!answered)
    .onUpdate((e) => {
      translateX.value = e.translationX;
      rotate.value = e.translationX / 20;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > THRESHOLD) {
        scheduleOnRN(onMark, e.translationX > 0);
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      } else if (Math.abs(e.translationX) < 6) {
        scheduleOnRN(onFlip);
        translateX.value = withTiming(0);
        rotate.value = withTiming(0);
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const tap = Gesture.Tap().onEnd(() => {
    if (!answered) scheduleOnRN(onFlip);
  });

  return (
    <GestureDetector gesture={Gesture.Race(pan, tap)}>
      <Animated.View style={[styles.dragLayer, dragStyle]}>
        {/* Front face (question) */}
        <Animated.View style={[styles.flip, frontStyle]}>
          <View style={[styles.face, styles.front]}>
            {answered && resultCorrect !== undefined && (
              <ResultBadge correct={resultCorrect} />
            )}
            <Text style={[styles.eyebrow, styles.frontEyebrow]}>Question</Text>
            <Text style={styles.text}>{question}</Text>
          </View>
        </Animated.View>

        {/* Back face (answer) */}
        <Animated.View style={[styles.flip, backStyle]}>
          <View style={[styles.face, styles.back]}>
            {answered && resultCorrect !== undefined && (
              <ResultBadge correct={resultCorrect} />
            )}
            <Text style={[styles.eyebrow, styles.backEyebrow]}>Réponse</Text>
            <Text style={styles.text}>{answer}</Text>
          </View>
        </Animated.View>

        {!answered && (
          <>
            <Animated.View style={[styles.stamp, styles.stampRight, rightStampOpacity]}>
              <Text style={[styles.stampIcon, { color: colors.success }]}>✓</Text>
            </Animated.View>
            <Animated.View style={[styles.stamp, styles.stampLeft, leftStampOpacity]}>
              <Text style={[styles.stampIcon, { color: colors.danger }]}>✕</Text>
            </Animated.View>
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  dragLayer: {
    width: "100%",
    height: 220,
    position: "relative",
  },
  flip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
  },
  face: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    padding: 26,
    gap: 10,
    backfaceVisibility: "hidden",
  },
  front: {
    backgroundColor: colors.surface,
  },
  back: {
    backgroundColor: colors.surfaceAlt,
    borderColor: "transparent",
  },
  eyebrow: {
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  frontEyebrow: {
    color: colors.inkFaint,
  },
  backEyebrow: {
    color: colors.accent,
  },
  text: {
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 25,
    color: colors.ink,
    textAlign: "center",
  },
  stamp: {
    position: "absolute",
    top: 14,
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  stampRight: {
    right: 14,
    backgroundColor: colors.successSoft,
  },
  stampLeft: {
    left: 14,
    backgroundColor: colors.dangerSoft,
  },
  stampIcon: {
    fontSize: 18,
    fontWeight: "700",
  },
});
