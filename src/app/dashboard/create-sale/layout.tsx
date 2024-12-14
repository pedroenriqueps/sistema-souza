import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sz | cadastrar vendas",
    description: "site para controle de produtos",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>

    );
}