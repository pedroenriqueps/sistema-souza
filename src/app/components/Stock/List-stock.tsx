"use client"
import { Suspense, useState } from "react";
import { LoadingSkeleton } from "../Loading/Loading-skeleton";
import { FilterStock } from "./Filter-stock";
import { useStock, DataProductsStockInterface } from "@/context/stock/stock";

export function ListStock() {
    const { isLoading, filterStock } = useStock();
    const [filterValue, setFilterValue] = useState<string>("");
    const filteredStock = filterStock(filterValue);

    return (
        <div>
            <FilterStock onFilterChange={setFilterValue} />
            <Suspense fallback={<LoadingSkeleton />}>
                {isLoading ? <LoadingSkeleton /> : (
                    <div className="list-items">
                        {filteredStock.length === 0 ? (
                            <p>O seu estoque está vazio ou nenhum produto corresponde ao filtro!</p>
                        ) : filteredStock.map((item: DataProductsStockInterface) => (
                            <ul key={item.id} className="flex flex-col gap-y-1 mb-4 p-3 border rounded-md">
                                <li>Produto: {item.productName}</li>
                                <li>Quantidade: {item.quantity}</li>
                                <li>Valor: {item.valueUnit && !isNaN(item.valueUnit)
                                    ? item.valueUnit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                    : 'Valor inválido'}</li>
                            </ul>
                        )).reverse()}
                    </div>
                )}
            </Suspense>
        </div>
    );
}
