import type { Metadata } from "next";
import { Merriweather, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SuvidhaVoiceCompanion from "@/components/SuvidhaVoiceCompanion";
import CitizenLoginModal from "@/components/CitizenLoginModal";
import NotificationToast from "@/components/NotificationToast";
import GoogleTranslate from "@/components/GoogleTranslate";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SUVIDHA - Concessional Loan & Scheme Assistance Portal | भारत सरकार",
  description:
    "Official single-window portal for concessional credit, interest subventions, education subsidies, and welfare schemes with zero intermediary fees.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/suvidha-logo.png", sizes: "1024x1024", type: "image/png" },
    ],
    apple: "/images/suvidha-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${merriweather.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        <AppProvider>
          <GoogleTranslate />
          <Header />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
          <SuvidhaVoiceCompanion />
          <CitizenLoginModal />
          <NotificationToast />
        </AppProvider>
      </body>
    </html>
  );
}
