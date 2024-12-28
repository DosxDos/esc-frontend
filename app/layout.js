import React from "react";
import "./globals.css";
import TranslationProvider from "@/components/TranslationProvider";
import StoreProvider from "@/components/StoreProvider";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import ThemeWrapper from "@/components/ThemeWrapper";

export const metadata = {
  title:
    "Energia Solar Canarias - Instalación de Paneles Solares y Energía Renovable",
  description:
    "Energia Solar Canarias ofrece instalación de paneles solares, energía solar fotovoltaica y soluciones de autoconsumo solar en Tenerife, Gran Canaria, Lanzarote, y más.",
  authors: [{ name: "Energia Solar Canarias" }],
  icons: {
    icon: "/assets/icons/favicon.ico",
    shortcut: "/assets/icons/maskable-icon.png",
    apple: "/assets/icons/maskable-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta
          name="apple-mobile-web-app-title"
          content="Energia Solar Canarias"
        />
      </head>
      <body>
        <StoreProvider>
          <ThemeWrapper>
            <TranslationProvider>{children}</TranslationProvider>
          </ThemeWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
