import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sz | cadastro",
    description: "site para controle de produtos",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            {children}

        </main>

    );
}
