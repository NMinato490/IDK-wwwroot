import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider, themeInitScript } from "@repo/ui";

export const metadata: Metadata = {
  title: "Site1",
  description: "Site1 — Turbo monorepo app (wwwroot)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
