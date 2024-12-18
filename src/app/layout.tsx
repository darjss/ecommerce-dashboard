import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "sonner";
// import { initializeLucia } from "@/auth";
import { ViewTransitions } from "next-view-transitions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // initializeLucia();
  return (


    <ViewTransitions>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="bg-background text-foreground">
          {children}
          <Toaster />
        </body>
      </html>
    </ViewTransitions>
  );
}
