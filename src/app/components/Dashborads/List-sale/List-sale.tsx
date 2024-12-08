"use client";
import { Suspense, useState } from "react";
import { LoadingSkeleton } from "@/app/components/Loading/Loading-skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { InputField } from "@/app/components/Input-field/Input-field";
import { useForm } from "react-hook-form";
import { useSales } from "@/context/list-sale/list-sale";


interface FormFilterSales {
    initialDate: string;
    endDate: string;
}

export function ListSale() {
    const { listSales, isLoading } = useSales();
    const [filteredSales, setFilteredSales] = useState(listSales);
    const { register, handleSubmit, reset } = useForm<FormFilterSales>();

    const handleDateFilter = (data: FormFilterSales) => {
        const { initialDate, endDate } = data;

        if (initialDate && endDate) {
            const initialDateParsed = new Date(initialDate);
            const endDateParsed = new Date(endDate);

            const filteredItems = listSales.filter((sale) => {
                const saleDate = new Date(sale.dateSale);
                return saleDate >= initialDateParsed && saleDate <= endDateParsed;
            });

            setFilteredSales(filteredItems);
        } else {
            setFilteredSales(listSales);
        }
    };

    const clearInputs = (e: React.MouseEvent) => {
        e.preventDefault();
        reset();
        setFilteredSales(listSales);
    };

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <div>
                <h1 className="title-h1">Lista de Vendas</h1>
                <form onSubmit={handleSubmit(handleDateFilter)} className="skeleton-forms w-[65%] mx-auto">
                    <InputField register={register} name="initialDate" type="date" label="De" />
                    <InputField register={register} name="endDate" type="date" label="Até" />
                    <fieldset className="flex items-center justify-between">
                        <button className="buttons-forms w-[45%]" type="submit">
                            Filtrar
                        </button>
                        <button onClick={clearInputs} className="buttons-forms w-[45%]" type="button">
                            X
                        </button>
                    </fieldset>
                </form>

                {isLoading ? (
                    <LoadingSkeleton />
                ) : (
                    <div className="list-items">
                        {filteredSales.length === 0 ? (
                            <p className="text-center text-lg text-gray-500">
                                Nenhum item encontrado para o filtro selecionado.
                            </p>
                        ) : (
                            filteredSales.map((sale) => (
                                <div key={sale.id} className="list-item-li gap-y-1">
                                    <h2>Cliente: {sale.clientName}</h2>
                                    <p>
                                        Data da Venda:{" "}
                                        {format(new Date(sale.dateSale), "dd/MM/yyyy", { locale: ptBR })}
                                    </p>
                                    <p>Parcelas: {sale.paymentInstallments}</p>
                                    <p>Método de Pagamento: {sale.paymentMethod}</p>
                                    <details>
                                        <summary className="cursor-pointer">Itens Vendidos:</summary>
                                        {sale.itemsSale.map((item) => (
                                            <ul key={item.id} className="mt-2">
                                                <li className="text-base font-thin p-3 border border-slate-600 rounded-md shadow-md">
                                                    <p>
                                                        <strong>Produto:</strong> {item.productName}
                                                    </p>
                                                    <p>
                                                        <strong>Quantidade:</strong> {item.quantity}
                                                    </p>
                                                </li>
                                            </ul>
                                        ))}
                                    </details>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </Suspense>
    );
}
