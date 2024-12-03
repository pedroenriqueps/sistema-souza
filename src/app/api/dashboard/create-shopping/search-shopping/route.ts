import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const productName = searchParams.get("productName");

    try {
        if (productName) {
            const products = await prisma.itemShopping.findMany({
                where: {
                    productName: {
                        contains: productName,
                    },
                },
                select: {
                    productName: true,
                    quantity: true,
                    valueUnit: true,
                },
            });

            if (products.length === 0) {
                return NextResponse.json(
                    { message: `Produto "${productName}" não encontrado.` },
                    { status: 404 }
                );
            }

            return NextResponse.json(products, { status: 200 });
        }

        const allProducts = await prisma.itemShopping.findMany({
            select: {
                productName: true,
                quantity: true,
                valueUnit: true,
            },
        });

        return NextResponse.json(allProducts, { status: 200 });

    } catch (error: any) {
        console.error("Erro ao buscar o produto:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor.", error: error.message },
            { status: 500 }
        );
    }
}
