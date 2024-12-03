import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { parseISO, isValid } from "date-fns";

export async function POST(request: NextRequest) {
    try {
        const { dataClient, itemsShopping } = await request.json();
        const { supplierName, dateShopping, numberInstallments } = dataClient;

        if (!supplierName || !dateShopping || !numberInstallments) {
            return NextResponse.json(
                { message: "Fornecedor, data da compra e número de parcelas são obrigatórios" },
                { status: 400 }
            );
        }

        const parsedDate = parseISO(dateShopping);
        if (!isValid(parsedDate)) {
            return NextResponse.json(
                { message: "Data da compra é inválida" },
                { status: 400 }
            );
        }

        if (!itemsShopping || itemsShopping.length === 0) {
            return NextResponse.json(
                { message: "Cadastre um item antes de enviar os dados" },
                { status: 400 }
            );
        }

        const newDataClient = await prisma.dataClientShopping.create({
            data: {
                supplierName,
                dateShopping: parsedDate,
                numberInstallments,
                itemsShopping: {
                    create: itemsShopping,
                },
            },
            include: { itemsShopping: true },
        });

        for (const item of itemsShopping) {

            const existingStock = await prisma.stock.findFirst({
                where: { productName: item.productName },
            });

            const updatedValueUnit = item.valueUnit * 1.50;

            if (existingStock) {

                await prisma.stock.update({
                    where: { id: existingStock.id },
                    data: {
                        quantity: existingStock.quantity + item.quantity,
                        valueUnit: { set: updatedValueUnit }
                    },
                });

            } else {

                await prisma.stock.create({
                    data: {
                        productName: item.productName,
                        valueUnit: updatedValueUnit,
                        quantity: item.quantity,
                    },
                });

            }
        }


        return NextResponse.json(
            { message: "Compra registrada com sucesso", data: newDataClient },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Erro ao registrar compra:', error);
        return NextResponse.json(
            { message: "Erro interno do servidor", error: error.message },
            { status: 500 }
        );
    }
}
