import type { Metadata } from "next";
import { IBM_Plex_Sans, Lato, Poppins } from "next/font/google";
import "./globals.scss";
import { Providers } from "./providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: {
    default: "Starsoft — Marketplace de NFTs",
    template: "%s | Starsoft",
  },
  description:
    "Marketplace de NFTs da Starsoft: explore a coleção, adicione itens à mochila e finalize sua compra.",
  applicationName: "Starsoft NFT Marketplace",
  openGraph: {
    title: "Starsoft — Marketplace de NFTs",
    description:
      "Explore a coleção de NFTs da Starsoft e monte sua mochila de compras.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Starsoft — Marketplace de NFTs",
    description:
      "Explore a coleção de NFTs da Starsoft e monte sua mochila de compras.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${ibmPlexSans.variable} ${poppins.className} ${lato.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
