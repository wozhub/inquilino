import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
    variable: "--font-eb-garamond",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Inquilino - Revisión de Contratos con IA",
    description:
        "Revisión de contratos de alquiler y gastos contra la legislación argentina vigente.",
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
            { url: "/favicon.ico" },
        ],
        apple: "/apple-touch-icon.png",
    },
    openGraph: {
        type: "website",
        siteName: "Inquilino",
        title: "Inquilino - Revisión de Contratos con IA",
        description:
            "Revisión de contratos de alquiler y gastos contra la legislación argentina vigente.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Inquilino - Revisión de Contratos con IA",
        description:
            "Revisión de contratos de alquiler y gastos contra la legislación argentina vigente.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${ebGaramond.variable} font-sans antialiased`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
