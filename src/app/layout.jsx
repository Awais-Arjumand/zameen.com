import { Josefin_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import CustomSessionProvider from "./components/Providers/SessionProvider";

const JosefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
});


export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${JosefinSans.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <CustomSessionProvider>
          <ClientLayout>{children}</ClientLayout>
        </CustomSessionProvider>
      </body>
    </html>
  );
}
