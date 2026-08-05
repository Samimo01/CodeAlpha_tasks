import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { Dialog, Portal, Button, Text } from "react-native-paper";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface Props {
  visible: boolean;
  editingId: number | null;
  initialQuestion?: string;
  initialAnswer?: string;
  onCancel: () => void;
  onConfirm: (question: string, answer: string) => void;
}

export function CardFormDialog({
  visible,
  editingId,
  initialQuestion = "",
  initialAnswer = "",
  onCancel,
  onConfirm,
}: Props) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);

  useEffect(() => {
    if (visible) {
      setQuestion(initialQuestion);
      setAnswer(initialAnswer);
    }
  }, [visible, editingId, initialQuestion, initialAnswer]);

  const canConfirm = question.trim().length > 0 && answer.trim().length > 0;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={styles.dialog}>
        <Dialog.Title style={styles.title}>
          {editingId ? "Edit card" : "Add a card"}
        </Dialog.Title>
        <Dialog.Content>
          <TextInput
            style={styles.input}
            placeholder="Question"
            placeholderTextColor={colors.inkFaint}
            value={question}
            onChangeText={setQuestion}
            autoFocus
          />
          <TextInput
            style={[styles.input, styles.inputSpacing]}
            placeholder="Answer"
            placeholderTextColor={colors.inkFaint}
            value={answer}
            onChangeText={setAnswer}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button textColor={colors.ink} onPress={onCancel}>
            Cancel
          </Button>
          <Button
            mode="contained"
            buttonColor={colors.accent}
            textColor={colors.accentInk}
            disabled={!canConfirm}
            onPress={() => onConfirm(question, answer)}
          >
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 22,
  },
  title: {
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 16,
    color: colors.ink,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    color: colors.ink,
    fontFamily: typography.body,
    fontSize: 14,
  },
  inputSpacing: {
    marginTop: 10,
  },
});
