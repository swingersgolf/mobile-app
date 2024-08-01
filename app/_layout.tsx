import React from "react";
import { Slot } from "expo-router";
import { SessionProvider } from "../contexts/AuthContext";

export default function Root() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
