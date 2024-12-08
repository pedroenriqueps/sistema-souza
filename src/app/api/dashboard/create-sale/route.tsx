import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { FormdataClientInterface } from "@/app/components/Dashborads/Create-sales/Form-client-sale";
import { FormClientDataInterface } from "@/app/components/Dashborads/Create-sales/Form-products-sale"

export async function POST(request: NextRequest) {
    try {
        const { dataClient, itemsSale }: { dataClient: FormdataClientInterface, itemsSale: FormClientDataInterface[] } = await request.json();

        const newDataClient = await prisma.dataClientSale.create({
            data: {
                clientName: dataClient.clientName,
                dateSale: new Date(dataClient.dateSale),
                delivery: dataClient.delivery,
                neighborhood: dataClient.neighborhood,
                road: dataClient.road,
                houseNumber: dataClient.houseNumber,
                reference: dataClient.reference,
                paymentMethod: dataClient.paymentMethod,
                paymentInstallments: dataClient.paymentInstallments,
                itemsSale: {
                    create: itemsSale.map((item) => ({
                        productName: item.productName,
                        quantity: item.quantity,
                        valueUnit: item.valueUnit,
                    })),
                },
            },
            include: { itemsSale: true },
        });

        const productQuantities: Record<string, number> = {};

        itemsSale.forEach((item) => {
            if (productQuantities[item.productName]) {
                productQuantities[item.productName] += item.quantity;
            } else {
                productQuantities[item.productName] = item.quantity;
            }
        });

        for (const productName in productQuantities) {
            const quantityToDeduct = productQuantities[productName];

            const stockItem = await prisma.stock.findUnique({
                where: { productName },
            });

            if (!stockItem) {
                return NextResponse.json(
                    { message: `Produto ${productName} não encontrado no estoque.` },
                    { status: 404 }
                );
            }

            if (stockItem.quantity < quantityToDeduct) {
                return NextResponse.json(
                    { message: `Estoque insuficiente para o produto ${productName}.` },
                    { status: 400 }
                );
            }

            await prisma.stock.update({
                where: { productName },
                data: { quantity: stockItem.quantity - quantityToDeduct },
            });
        }

        return NextResponse.json(
            { message: "Venda registrada com sucesso e estoque atualizado", data: newDataClient },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error(error);
        return NextResponse.json(
            { message: "Erro interno do servidor", error: (error as Error).message },
            { status: 500 }
        );
    }
}
