"use client";

import { redirect } from "next/navigation";

// Root "/" redirects to the chat app.
// All app pages live under /(app)/ and share the MainShell layout.
export default function RootPage() {
  redirect("/chat");
}
