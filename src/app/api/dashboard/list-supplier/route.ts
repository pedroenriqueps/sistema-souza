import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const dataSupplier = await prisma.suppliers.findMany()

        if (dataSupplier.length === 0) {
            return NextResponse.json(
                {
                    status: "success",
                    message: "Nenhum dado encontrado",
                    data: [],
                },
                { status: 200 }
            );
        }
        return NextResponse.json(
            {
                status: "success",
                message: "Dados encontrados com sucesso",
                data: dataSupplier,
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Erro ao buscar dados:", error);
        return NextResponse.json(
            {
                status: "error",
                message: "Erro ao buscar os fornecedores",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}