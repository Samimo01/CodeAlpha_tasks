import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { IconButton } from "@/components/common/IconButton";
import { FlipCard } from "@/components/card/FlipCard";
import { ExitSessionDialog } from "@/components/dialogs/ExitSessionDialog";
import { useCards } from "@/hooks/useCards";
import { useReview } from "@/hooks/useReview";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const collectionId = Number(id);
  const router = useRouter();

  const { cards, loading } = useCards(collectionId);
  const review = useReview(cards);

  const [exitDialog, setExitDialog] = useState(false);

  const navigatedRef = useRef(false);

  const handleMark = (correct: boolean) => {
    review.markAnswer(correct);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Redirect to result when all cards are answered.
  useEffect(() => {
    if (review.isFinished && !navigatedRef.current) {
      navigatedRef.current = true;
      const t = setTimeout(() => {
        router.replace({
          pathname: "/result",
          params: {
            score: String(review.answeredCount),
            total: String(review.total),
            collectionId: String(collectionId),
          },
        });
      }, 180);
      return () => clearTimeout(t);
    }
    // Reset flag when not finished (e.g. new session)
    if (!review.isFinished) {
      navigatedRef.current = false;
    }
  }, [review.isFinished, review.answeredCount, review.total, collectionId, router]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!review.current) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No cards to review.</Text>
      </View>
    );
  }

  const progress = review.index / review.total;

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <IconButton name="close" size={16} ghost onPress={() => setExitDialog(true)} />
        <Text style={styles.counter}>
          Question {review.index + 1}/{review.total}
        </Text>
        <View style={styles.spacer} />
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <Text style={styles.caption}>
        {review.isAnswered
          ? "Card already answered"
          : "Tap the card to flip it, swipe to answer"}
      </Text>

      <View style={styles.swipeZone}>
        <Text style={[styles.swipe, styles.swipeLeft, review.isAnswered && styles.swipeDisabled]}>
          Incorrect
        </Text>
        <View style={styles.flipWrap}>
          <FlipCard
            question={review.current.question}
            answer={review.current.answer}
            face={review.face}
            answered={review.isAnswered}
            resultCorrect={review.currentResult}
            onFlip={review.flip}
            onMark={handleMark}
          />
        </View>
        <Text style={[styles.swipe, styles.swipeRight, review.isAnswered && styles.swipeDisabled]}>
          Correct
        </Text>
      </View>

      <View style={styles.navBar}>
        <IconButton
          name="chevron-left"
          size={22}
          style={[styles.navBtn, review.index === 0 && styles.navBtnDisabled]}
          onPress={review.goPrev}
        />
        <IconButton
          name="chevron-right"
          size={22}
          style={[styles.navBtn, review.index >= review.total - 1 && styles.navBtnDisabled]}
          onPress={review.goNext}
        />
      </View>

      <ExitSessionDialog
        visible={exitDialog}
        onCancel={() => setExitDialog(false)}
        onConfirm={() => {
          setExitDialog(false);
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 60,
    paddingHorizontal: 22,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.inkFaint,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  spacer: {
    width: 32,
  },
  counter: {
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 14,
    color: colors.ink,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.line,
    borderRadius: 999,
    overflow: "hidden",
    marginVertical: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 999,
  },
  caption: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: "center",
    marginBottom: 16,
  },
  swipeZone: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 22,
  },
  flipWrap: {
    flex: 1,
    justifyContent: "center",
  },
  swipe: {
    fontFamily: typography.title,
    fontWeight: "700",
    fontSize: 10.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    opacity: 0.55,
  },
  swipeLeft: {
    color: colors.danger,
  },
  swipeRight: {
    color: colors.success,
  },
  swipeDisabled: {
    opacity: 0.15,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
    paddingBottom: 6,
  },
  navBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  navBtnDisabled: {
    opacity: 0.35,
  },
  navBtnLabel: {
    fontSize: 22,
    color: colors.inkSoft,
  },
});
