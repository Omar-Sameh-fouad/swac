import type { Metadata } from "next";
import { SignupProvider } from "@/core/SignupContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swim Master",
  description: "Swim Master graduation project frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <SignupProvider>{children}</SignupProvider>
      </body>
    </html>
  );
}