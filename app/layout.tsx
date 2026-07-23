import "@/styles/globals.css";

export const metadata = {
  title: "Divine Awakening Leadership Portal",
  description: "Quarterly development, accountability, and Head Coach selection system"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
