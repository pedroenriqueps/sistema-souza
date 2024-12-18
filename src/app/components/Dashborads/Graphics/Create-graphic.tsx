"use client";
import { Suspense } from "react";
import { LoadingSkeleton } from "../../Loading/Loading-skeleton";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { useStock } from "@/context/stock/stock";
import { useSales } from "@/context/list-sale/list-sale";

interface ItemSale {
    productName: string
    quantity: number
}

interface DataClientSale {
    itemsSale: ItemSale[]
}

export function CreateGraphic() {
    const { stock, isLoading: isStockLoading } = useStock();
    const { listSales, isLoading: isSalesLoading } = useSales();

    const stockChartData = stock.map((item) => ({
        productName: item.productName,
        quantity: item.quantity
    }));

    const salesData = listSales.reduce<Record<string, number>>((acc, sale: DataClientSale) => {
        sale.itemsSale.forEach((item) => {
            const { productName, quantity } = item;
            acc[productName] = (acc[productName] || 0) + quantity;
        });
        return acc;
    }, {});

    const salesChartData = Object.entries(salesData).map(([productName, quantity]) => ({
        productName,
        quantity
    }));

    const isLoading = isStockLoading || isSalesLoading;

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <div>
                {stock.length === 0 && listSales.length === 0 ? (
                    <p className="text-center">Estoque e vendas vazios, sem itens para gerar gráficos</p>
                ) : isLoading ? (
                    <LoadingSkeleton />
                ) : (
                    <div className="flex flex-col items-center space-y-10">
                        <div className="w-full max-w-4xl">
                            <h3 className="text-center text-xl font-bold mb-4">
                                Produtos em Estoque
                            </h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stockChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="productName" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="quantity" fill="#8884d8" name="Estoque" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="w-full max-w-4xl">
                            <h3 className="text-center text-xl font-bold mb-4">
                                Produtos Mais Vendidos
                            </h3>
                            {salesChartData.length === 0 ? (
                                <p className="text-center">Nenhuma venda registrada para gerar gráfico</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={salesChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="productName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="quantity" fill="#82ca9d" name="Vendas" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Suspense>
    );
}
