"use client";

import { Suspense, useState } from "react";
import { LoadingSkeleton } from "../../Loading/Loading-skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { InputField } from "../../Input-field/Input-field";
import { useForm } from "react-hook-form";
import { useShopping, ShoppingItem, Item } from "@/context/list-shopping/list-shopping";

interface FormFilterShoppings {
    initialDate: string;
    endDate: string;
}

export function ListShopping() {
    const { listShoppingItems, isLoading } = useShopping();
    const [filteredShoppingItems, setFilteredShoppingItems] = useState(listShoppingItems);
    const { register, handleSubmit, reset } = useForm<FormFilterShoppings>();

    const handleDateFilter = (data: FormFilterShoppings) => {
        const { initialDate, endDate } = data;

        if (initialDate && endDate) {
            const initialDateParsed = new Date(initialDate);
            const endDateParsed = new Date(endDate);

            const filteredItems = listShoppingItems.filter((shopping) => {
                const shoppingDate = new Date(shopping.dateShopping);
                return shoppingDate >= initialDateParsed && shoppingDate <= endDateParsed;
            });

            setFilteredShoppingItems(filteredItems);
        } else {
            setFilteredShoppingItems(listShoppingItems);
        }
    };

    const clearInputs = (e: React.MouseEvent) => {
        e.preventDefault();
        reset();
        setFilteredShoppingItems(listShoppingItems);
    };

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <div>
                <h1 className="title-h1">Lista de Compras</h1>
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
                        {filteredShoppingItems.length === 0 ? (
                            <p className="text-center text-lg text-gray-500">Nenhum item encontrado para o filtro selecionado.</p>
                        ) : (
                            filteredShoppingItems.map((shopping: ShoppingItem) => (
                                <div key={shopping.id} className="list-item-li gap-y-1">
                                    <h2>Fornecedor: {shopping.supplierName}</h2>
                                    <p>
                                        Data da Compra:{" "}
                                        {format(new Date(shopping.dateShopping), "dd/MM/yyyy", { locale: ptBR })}
                                    </p>
                                    <p>Parcelas: {shopping.numberInstallments}</p>
                                    <details>
                                        <summary className="cursor-pointer">Itens Comprados:</summary>
                                        {shopping.itemsShopping.map((item: Item) => (
                                            <ul key={item.id} className="mt-2">
                                                <li className="text-base font-thin p-3 border border-slate-600 rounded-md shadow-md">
                                                    <p>
                                                        <strong>Produto:</strong> {item.productName}
                                                    </p>
                                                    <p>
                                                        <strong>Quantidade:</strong> {item.quantity}
                                                    </p>
                                                    <p>
                                                        <strong>Preço Unitário:</strong>{" "}
                                                        {item.valueUnit.toLocaleString("pt-BR", {
                                                            style: "currency",
                                                            currency: "BRL",
                                                        })}
                                                    </p>
                                                    <p>
                                                        <strong>Porcentagem:</strong> {item.percentage}%
                                                    </p>
                                                </li>
                                            </ul>
                                        ))}
                                    </details>
                                </div>
                            )).reverse()
                        )}
                    </div>
                )}
            </div>
        </Suspense>
    );
}
