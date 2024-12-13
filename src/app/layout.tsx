import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { StockProvider } from "@/context/stock/stock"
import { SalesProvider } from "@/context/list-sale/list-sale"
import { ShoppingProvider } from "@/context/list-shopping/list-shopping";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sistema souza",
  description: "site para controle de produtos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <ShoppingProvider>
          <SalesProvider>
            <StockProvider >
              {children}
            </StockProvider>
          </SalesProvider>
        </ShoppingProvider>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          limit={1}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

      </body>
    </html>
  );
}
