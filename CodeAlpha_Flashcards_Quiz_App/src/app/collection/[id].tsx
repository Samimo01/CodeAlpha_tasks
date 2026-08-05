import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Snackbar } from "react-native-paper";
import { IconButton } from "@/components/common/IconButton";
import { AppButton } from "@/components/common/AppButton";
import { ConfirmCancelDialog } from "@/components/dialogs/ConfirmCancelDialog";
import { BlockedDeleteDialog } from "@/components/dialogs/BlockedDeleteDialog";
import { CardFormDialog } from "@/components/dialogs/CardFormDialog";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCards } from "@/hooks/useCards";
import { Card } from "@/types";
import { useCollections } from "@/hooks/useCollections";
import { collectionRepository } from "@/database/repositories/CollectionRepository";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export default function EditCollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const collectionId = Number(id);
  const router = useRouter();

const { update } = useCollections();
  const { cards, loading, addCard, updateCard, deleteCard, undoDelete, clearDeleted, deleted } =
    useCards(collectionId);

  const [name, setName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [blockedDelete, setBlockedDelete] = useState(false);
  const [formKey, setFormKey] = useState(0);

  // Auto-dismiss the undo snackbar after ~4 seconds.
  useEffect(() => {
    if (!deleted) return;
    const t = setTimeout(() => clearDeleted(), 4000);
    return () => {
      clearTimeout(t);
      clearDeleted();
    };
  }, [deleted, clearDeleted]);

  useEffect(() => {
    let active = true;
    (async () => {
      const col = await collectionRepository.getById(collectionId);
      if (active && col) {
        setName(col.name);
        setOriginalName(col.name);
      }
    })();
    return () => {
      active = false;
    };
  }, [collectionId]);

  // Track initial cards to detect changes
  const [originalCards, setOriginalCards] = useState<Card[]>([]);

  useEffect(() => {
    if (!loading && cards.length > 0 && originalCards.length === 0) {
      setOriginalCards(cards);
    }
  }, [loading, cards]);

  const dirty = name.trim() !== originalName || cards.length !== originalCards.length ||
    cards.some((card, i) => {
      const orig = originalCards[i];
      return !orig || card.question !== orig.question || card.answer !== orig.answer || card.id !== orig.id;
    });

  const openAdd = () => {
    setEditingId(null);
    setFormKey((k) => k + 1);
    setFormVisible(true);
  };

  const openEdit = (cardId: number) => {
    setEditingId(cardId);
    setFormKey((k) => k + 1);
    setFormVisible(true);
  };

  const handleFormConfirm = async (question: string, answer: string) => {
    if (editingId) {
      await updateCard(editingId, question, answer);
    } else {
      await addCard(question, answer);
    }
    setFormVisible(false);
    setEditingId(null);
  };

  const handleDeleteCard = async (cardId: number) => {
    const success = await deleteCard(cardId);
    if (!success) {
      setBlockedDelete(true);
    }
  };

  const handleCancel = () => {
    if (dirty) {
      setCancelDialog(true);
    } else {
      router.back();
    }
  };

  const handleConfirm = async () => {
    if (!name.trim() || (!loading && cards.length === 0)) return;
    if (name.trim() !== originalName) {
      await update(collectionId, name);
    }
    await router.back();
  };

  const confirmDisabled = !name.trim() || (!loading && cards.length === 0);

  const editingCard = editingId ? cards.find((c) => c.id === editingId) : null;

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
        />

        {loading ? (
          <ActivityIndicator color={colors.accent} style={styles.loading} />
        ) : (
          <View style={styles.list}>
            {cards.map((card) => (
              <View style={styles.row} key={card.id}>
                <Pressable style={styles.rowTap} onPress={() => openEdit(card.id)}>
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
                  onPress={() => handleDeleteCard(card.id)}
                />
              </View>
            ))}

            <Pressable style={styles.addRow} onPress={openAdd}>
              <MaterialCommunityIcons name="plus" size={16} color={colors.accent} />
              <Text style={styles.addRowText}>Add a card</Text>
            </Pressable>
          </View>
        )}

        {!loading && cards.length === 0 && (
          <Text style={styles.hint}>
            Add at least one card before saving.
          </Text>
        )}
      </ScrollView>

      <View style={styles.bottomActions}>
        <AppButton label="Cancel" variant="outline" full onPress={handleCancel} />
        <AppButton
          label="Confirm"
          variant="primary"
          full
          disabled={confirmDisabled}
          onPress={handleConfirm}
        />
      </View>

      <CardFormDialog
        key={formKey}
        visible={formVisible}
        editingId={editingId}
        initialQuestion={editingCard?.question}
        initialAnswer={editingCard?.answer}
        onCancel={() => {
          setFormVisible(false);
          setEditingId(null);
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
        visible={deleted !== null}
        onDismiss={() => clearDeleted()}
        action={{ label: "Undo", onPress: () => undoDelete() }}
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
  loading: {
    marginTop: 30,
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
