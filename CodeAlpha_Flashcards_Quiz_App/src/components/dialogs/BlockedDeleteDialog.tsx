import React from "react";
import { StyleSheet } from "react-native";
import { Dialog, Portal, Button, Text } from "react-native-paper";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export function BlockedDeleteDialog({ visible, onDismiss }: Props) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>Deletion not allowed</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.text}>
            A collection must always contain at least one flashcard.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained"
            buttonColor={colors.accent}
            textColor={colors.accentInk}
            style={styles.confirmBtn}
            onPress={onDismiss}
          >
            Got it
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
  text: {
    fontFamily: typography.body,
    fontSize: 13.5,
    color: colors.inkSoft,
    lineHeight: 20,
  },
  confirmBtn: {
    flex: 1,
  },
});
