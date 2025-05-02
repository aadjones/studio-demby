import { Navbar } from "./Nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "./Footer";
import { ThemeProvider } from "./ThemeSwitch";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex flex-col min-h-screen items-center">
        <div className="w-full max-w-[960px] px-4 sm:px-6 md:px-8">
          <Navbar />
          <main className="flex-auto min-w-0 mt-2 md:mt-6 flex flex-col">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </div>
    </ThemeProvider>
  );
} 