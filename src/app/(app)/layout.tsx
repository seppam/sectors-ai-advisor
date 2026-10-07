import MainShell from "@/components/MainShell";

// P3-2: Route group layout — all pages inside (app)/ share the same shell.
// Previously /chat, /settings, etc. were standalone routes that rendered
// without TopBar/BottomNav when visited directly. Now they all get the shell.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <MainShell>{children}</MainShell>;
}
