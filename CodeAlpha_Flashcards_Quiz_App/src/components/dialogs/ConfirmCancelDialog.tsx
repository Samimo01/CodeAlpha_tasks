import React from "react";
import { StyleSheet } from "react-native";
import { Dialog, Portal, Button, Text } from "react-native-paper";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface Props {
  visible: boolean;
  onNo: () => void;
  onYes: () => void;
}

export function ConfirmCancelDialog({ visible, onNo, onYes }: Props) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onNo} style={styles.dialog}>
        <Dialog.Title style={styles.title}>Are you sure you want to cancel?</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.text}>
            Any unsaved changes will be lost.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button textColor={colors.ink} onPress={onNo}>
            No
          </Button>
          <Button textColor={colors.danger} onPress={onYes}>
            Yes
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
