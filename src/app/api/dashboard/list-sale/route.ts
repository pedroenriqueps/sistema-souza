import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const dataClientSale = await prisma.dataClientSale.findMany({
            include: {
                itemsSale: true
            },
        })

        if (dataClientSale.length === 0) {
            return NextResponse.json(
                {
                    status: "success",
                    message: "Nenhum dado encontrado",
                    data: []
                },
                { status: 200 }
            )
        }

        const formattedData = dataClientSale.map((item) => ({
            ...item,
            dateSale: item.dateSale.toISOString()
        }))

        return NextResponse.json(
            {
                status: "success",
                message: "Dados encontrados com sucesso",
                data: formattedData
            }
        )
    } catch (error: unknown) {
        console.error("Erro ao buscar dados:", error);
        return NextResponse.json(
            {
                status: "error",
                message: "Erro ao buscar os dados do shopping",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
} 