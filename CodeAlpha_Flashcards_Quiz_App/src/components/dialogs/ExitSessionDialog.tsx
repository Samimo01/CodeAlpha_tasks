import React from "react";
import { StyleSheet } from "react-native";
import { Dialog, Portal, Button, Text } from "react-native-paper";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ExitSessionDialog({ visible, onCancel, onConfirm }: Props) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={styles.dialog}>
        <Dialog.Title style={styles.title}>Exit session?</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.text}>
            All progress in this session will be lost.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button textColor={colors.ink} onPress={onCancel}>
            Cancel
          </Button>
          <Button textColor={colors.danger} onPress={onConfirm}>
            Exit
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
});
