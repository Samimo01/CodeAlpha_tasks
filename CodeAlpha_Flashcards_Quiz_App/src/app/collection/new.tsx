import React, { useMemo, useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Snackbar } from "react-native-paper";
import { IconButton } from "@/components/common/IconButton";
import { AppButton } from "@/components/common/AppButton";
import { ConfirmCancelDialog } from "@/components/dialogs/ConfirmCancelDialog";
import { BlockedDeleteDialog } from "@/components/dialogs/BlockedDeleteDialog";
import { CardFormDialog } from "@/components/dialogs/CardFormDialog";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCollections } from "@/hooks/useCollections";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface DraftCard {
  localId: number;
  question: string;
  answer: string;
}

interface DeletedCardState {
  card: DraftCard;
  index: number;
}

let idCounter = 0;
const nextLocalId = () => ++idCounter;

export default function NewCollectionScreen() {
  const router = useRouter();
  const { create } = useCollections();

  const [name, setName] = useState("");
  const [cards, setCards] = useState<DraftCard[]>([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<DraftCard | null>(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [blockedDelete, setBlockedDelete] = useState(false);
  const [snackbar, setSnackbar] = useState<DeletedCardState | null>(null);
  const deletedRef = useRef<DeletedCardState | null>(null);
  const [formKey, setFormKey] = useState(0);

  // Clean up snackbar state on unmount (navigation away)
  useEffect(() => {
    return () => {
      deletedRef.current = null;
      setSnackbar(null);
    };
  }, []);

  const dirty = name.trim().length > 0 || cards.length > 0;

  const openAdd = () => {
    setEditing(null);
    setFormKey((k) => k + 1);
    setFormVisible(true);
  };

  const openEdit = (card: DraftCard) => {
    setEditing(card);
    setFormKey((k) => k + 1);
    setFormVisible(true);
  };

  const handleFormConfirm = (question: string, answer: string) => {
    if (editing) {
      setCards((c) =>
        c.map((x) => (x.localId === editing.localId ? { ...x, question, answer } : x))
      );
    } else {
      setCards((c) => [...c, { localId: nextLocalId(), question, answer }]);
    }
    setFormVisible(false);
    setEditing(null);
  };

  const handleDeleteCard = (card: DraftCard) => {
    if (cards.length <= 1) {
      setBlockedDelete(true);
      return;
    }
    const index = cards.findIndex((c) => c.localId === card.localId);
    const entry = { card, index };
    deletedRef.current = entry;
    setSnackbar(entry);
    setCards((c) => c.filter((x) => x.localId !== card.localId));
  };

  const undoDelete = () => {
    const entry = deletedRef.current;
    if (!entry) return;
    deletedRef.current = null;
    setSnackbar(null);
    setCards((c) => {
      const arr = [...c];
      arr.splice(Math.min(entry.index, arr.length), 0, entry.card);
      return arr;
    });
  };

  const handleCancel = () => {
    if (dirty) {
      setCancelDialog(true);
    } else {
      router.back();
    }
  };

  const handleConfirm = async () => {
    if (!name.trim() || cards.length === 0) return;
    const newCollection = await create(name, cards);
    await router.replace("/");
  };

  const confirmDisabled = !name.trim() || cards.length === 0;

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.fieldLabel}>Collection name</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Collection name"
          placeholderTextColor={colors.inkFaint}
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <View style={styles.list}>
          {cards.map((card) => (
            <View style={styles.row} key={card.localId}>
              <Pressable style={styles.rowTap} onPress={() => openEdit(card)}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {card.question}
                </Text>
                <Text style={styles.rowSub} numberOfLines={1}>
                  {card.answer}
                </Text>
              </Pressable>
              <IconButton
                name="trash-can-outline"
                size={16}
                danger
                style={styles.trashBtn}
                onPress={() => handleDeleteCard(card)}
              />
            </View>
          ))}

          <Pressable style={styles.addRow} onPress={openAdd}>
            <MaterialCommunityIcons name="plus" size={16} color={colors.accent} />
            <Text style={styles.addRowText}>Add a card</Text>
          </Pressable>
        </View>

        {cards.length === 0 && (
          <Text style={styles.hint}>
            Add at least one card before saving.
          </Text>
        )}
      </ScrollView>

      <View style={styles.bottomActions}>
        <AppButton label="Cancel" variant="outline" full onPress={handleCancel} />
        <AppButton label="Confirm" variant="primary" full disabled={confirmDisabled} onPress={handleConfirm} />
      </View>

      <CardFormDialog
        key={formKey}
        visible={formVisible}
        editingId={editing?.localId ?? null}
        initialQuestion={editing?.question}
        initialAnswer={editing?.answer}
        onCancel={() => {
          setFormVisible(false);
          setEditing(null);
        }}
        onConfirm={handleFormConfirm}
      />

      <ConfirmCancelDialog
        visible={cancelDialog}
        onNo={() => setCancelDialog(false)}
        onYes={() => {
          setCancelDialog(false);
          router.back();
        }}
      />

      <BlockedDeleteDialog
        visible={blockedDelete}
        onDismiss={() => setBlockedDelete(false)}
      />

      <Snackbar
        visible={snackbar !== null}
        onDismiss={() => {
          deletedRef.current = null;
          setSnackbar(null);
        }}
        duration={4000}
        action={{
          label: "Undo",
          onPress: undoDelete,
        }}
        style={styles.snackbar}
      >
        Card deleted
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 60,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingBottom: 26,
  },
  fieldLabel: {
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 11.5,
    letterSpacing: 0.4,
    color: colors.inkFaint,
    textTransform: "uppercase",
    marginTop: 10,
    marginBottom: 6,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.surfaceAlt,
    marginBottom: 16,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
  },
  rowTap: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 16,
    justifyContent: "center",
    gap: 3,
  },
  rowTitle: {
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 14,
    color: colors.ink,
  },
  rowSub: {
    fontFamily: typography.body,
    fontSize: 12.5,
    color: colors.inkSoft,
  },
  trashBtn: {
    alignSelf: "center",
    marginHorizontal: 6,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.line,
    marginTop: 2,
  },
  addRowText: {
    fontFamily: typography.title,
    fontWeight: "600",
    fontSize: 13,
    color: colors.accent,
  },
  hint: {
    fontFamily: typography.body,
    fontSize: 11.5,
    color: colors.inkFaint,
    textAlign: "center",
    marginTop: 8,
  },
  bottomActions: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 26,
  },
  snackbar: {
    backgroundColor: colors.surfaceAlt,
  },
});
