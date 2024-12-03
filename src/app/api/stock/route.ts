import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const dataClientStock = await prisma.stock.findMany()

        if (dataClientStock.length === 0) {
            return NextResponse.json(
                {
                    status: "success",
                    message: "Nenhum dado encontrado",
                    data: [],
                }, { status: 200 }
            )
        }
        return NextResponse.json(
            {
                status: "success",
                message: "Dados encontrados com sucesso",
                data: dataClientStock,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Erro ao buscar dados:", error);
        return NextResponse.json(
            {
                status: "error",
                message: "Erro ao buscar os dados do estoque",
                error: error.message,
            },
            { status: 500 }
        );
    }
}