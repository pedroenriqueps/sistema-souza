import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const dataClientShopping = await prisma.dataClientShopping.findMany({
            include: {
                itemsShopping: true,
            },
        });

        if (dataClientShopping.length === 0) {
            return NextResponse.json(
                {
                    status: "success",
                    message: "Nenhum dado encontrado",
                    data: [],
                },
                { status: 200 }
            );
        }

        const formattedData = dataClientShopping.map((item) => ({
            ...item,
            dateShopping: item.dateShopping.toISOString(),
        }));

        return NextResponse.json(
            {
                status: "success",
                message: "Dados encontrados com sucesso",
                data: formattedData,
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
