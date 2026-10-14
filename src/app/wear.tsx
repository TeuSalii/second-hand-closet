import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { capture } from "@/client/add-piece";
import { useCloset } from "@/client/closet-context";
import { colors } from "@/client/theme";

// "Wearing today": tap the pieces you have on, add a mirror photo if you like.
export default function WearToday() {
  const insets = useSafeAreaInsets();
  const { pieces, logWear } = useCloset();
  const [chosen, setChosen] = useState<string[]>([]);
  const [selfie, setSelfie] = useState<string | null>(null);

  // Only pieces the model has read: an unread piece has no name to show yet.
  const ready = pieces.filter((piece) => piece.status === "read");

  function toggle(id: string) {
    setChosen((current) => (current.includes(id) ? current.filter((c) => c !== id) : [...current, id]));
  }

  async function takeSelfie() {
    const photo = await capture(`selfie-${Date.now().toString(36)}.jpg`, false);
    if (photo !== null) setSelfie(photo);
  }

  function save() {
    logWear(chosen, selfie);
    router.back();
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={ready}
        keyExtractor={(piece) => piece.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          // The mirror photo is offered, never required: logging a wear must
          // stay a few taps, or it won't become a habit itself.
          <Pressable style={styles.selfieArea} onPress={() => takeSelfie().catch(console.warn)}>
            {selfie === null ? (
              <Text style={styles.selfieHint}>Add a mirror photo (optional)</Text>
            ) : (
              <>
                <Image source={selfie} style={styles.selfie} contentFit="cover" />
                <Text style={styles.muted}>Tap to retake</Text>
              </>
            )}
          </Pressable>
        }
        renderItem={({ item }) => {
          const on = chosen.includes(item.id);
          return (
            <Pressable style={styles.tile} onPress={() => toggle(item.id)}>
              <Image source={item.photo} style={[styles.photo, on && styles.photoOn]} contentFit="cover" />
              {on && <Text style={styles.check}>✓</Text>}
            </Pressable>
          );
        }}
      />
      <Pressable
        style={[styles.save, chosen.length === 0 && styles.saveOff, { marginBottom: insets.bottom + 16 }]}
        disabled={chosen.length === 0}
        onPress={save}
      >
        <Text style={styles.saveText}>
          {chosen.length === 0
            ? "Tap what you're wearing"
            : `Save ${chosen.length} ${chosen.length === 1 ? "piece" : "pieces"}`}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.page },
  list: { padding: 16, gap: 8 },
  row: { gap: 8 },
  selfieArea: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 72,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.line,
    padding: 12,
  },
  selfieHint: { fontSize: 15, color: colors.soft },
  selfie: { width: 120, height: 160, borderRadius: 12 },
  muted: { fontSize: 13, color: colors.muted },
  tile: { flex: 1, maxWidth: "33.333%" },
  photo: { aspectRatio: 1, borderRadius: 10, backgroundColor: colors.photoBack, borderWidth: 3, borderColor: "transparent" },
  photoOn: { borderColor: colors.ink },
  check: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 24,
    backgroundColor: colors.ink,
    color: colors.page,
    fontWeight: "700",
  },
  save: { marginHorizontal: 16, paddingVertical: 16, borderRadius: 999, alignItems: "center", backgroundColor: colors.ink },
  saveOff: { opacity: 0.35 },
  saveText: { fontSize: 16, fontWeight: "600", color: colors.page },
});
