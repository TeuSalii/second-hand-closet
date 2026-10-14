import { Stack } from "expo-router";

import { ClosetProvider } from "@/client/closet-context";

// The provider sits above the Stack, so every screen shares one closet.
export default function RootLayout() {
  return (
    <ClosetProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "My closet" }} />
        <Stack.Screen name="piece/[id]" options={{ title: "" }} />
        {/* A modal: it slides up over the closet, a short task you finish and leave. */}
        <Stack.Screen name="wear" options={{ title: "Wearing today", presentation: "modal" }} />
      </Stack>
    </ClosetProvider>
  );
}
