import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const { newSupplier } = await request.json();

        if (!newSupplier || typeof newSupplier !== "string") {
            return NextResponse.json(
                { message: "Adicione o fornecedor antes de enviar" },
                { status: 400 }
            );
        }

        const existingSupplier = await prisma.suppliers.findFirst({
            where: { newSupplier: newSupplier }
        });

        if (existingSupplier) {
            return NextResponse.json(
                { message: "Fornecedor já existe" },
                { status: 409 }
            );
        }

        const newDataSupplier = await prisma.suppliers.create({
            data: { newSupplier: newSupplier }
        });

        return NextResponse.json(
            {
                message: "Fornecedor criado com sucesso",
                data: newDataSupplier
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error(error);
        return NextResponse.json(
            {
                message: "Erro interno do servidor", error: (error as Error).message
            },
            { status: 500 }
        );
    }
}
