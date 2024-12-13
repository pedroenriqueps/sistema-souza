"use client"
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="text-2xl font-semibold">Página não encontrada!!!</h1>

            <Image src="/logo.png" alt="Souza construções" width={360} height={100} />
            <p className="font-semibold">Error 404.</p>
            <button type="button" className="buttons-forms">
                <Link href="/">Ir para a página inicial</Link>
            </button>
        </main>
    )
}