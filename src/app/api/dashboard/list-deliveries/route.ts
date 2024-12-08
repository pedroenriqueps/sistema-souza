import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const dataDeliveries = await prisma.dataClientSale.findMany({
            where: {
                delivery: "yes"
            },
            include: {
                itemsSale: true
            }
        });

        if (dataDeliveries.length === 0) {
            return NextResponse.json(
                {
                    status: "success",
                    message: "Nenhum dado encontrado",
                    data: []
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                status: "success",
                message: "Dados encontrados com sucesso",
                data: dataDeliveries
            },
            { status: 200 }
        );
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
