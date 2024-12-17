"use client"
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "../../Input-field/Input-field";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaProducts } from "./utils";
import { showYupErrors } from "@/utils/show-errors"
import { toast } from "react-toastify";
import { FiTrash } from "react-icons/fi";
import { useStock } from "@/context/stock/stock";
import { LoadingSkeleton } from "../../Loading/Loading-skeleton";

export interface FormProductsDataInterface {
    productName: string;
    quantity: number;
    valueUnit: number;
    percentage: number;
    data?: object;
}

interface PropsProductsInterface {
    itemsShopping: Array<FormProductsDataInterface>;
    setItemsShopping: (value: FormProductsDataInterface[]) => void;
}

export function FormProducts({ itemsShopping, setItemsShopping }: PropsProductsInterface) {
    const { register, handleSubmit, reset, setFocus, setValue, formState: { errors } } = useForm<FormProductsDataInterface>({
        resolver: yupResolver(schemaProducts),
    });

    const { stock, isLoading } = useStock();
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue('productName', value);

        if (value.length > 2) {
            const filteredSuggestions = stock
                .map((product) => product.productName)
                .filter((productName) =>
                    productName.toLowerCase().includes(value.toLowerCase())
                );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setValue('productName', suggestion);
        setSuggestions([]);
        setFocus("quantity");
    };

    const handleFormProductsData = (data: FormProductsDataInterface) => {
        const formattedData: FormProductsDataInterface = {
            ...data,
            valueUnit: parseFloat(data.valueUnit.toString()),
            quantity: parseInt(data.quantity.toString(), 10),
            percentage: parseFloat(data.percentage.toString()),
        };

        setItemsShopping([...itemsShopping, formattedData]);
        toast.success("Produto adicionado com sucesso!");
        reset();
        setFocus("productName");
    };

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            showYupErrors(errors);
        }
    }, [errors]);

    const deleteShopping = (index: number) => {
        const filterShopping = itemsShopping.filter((_, indexItem) => index !== indexItem);
        setItemsShopping(filterShopping);
    };

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            {isLoading ? (
                <p>Carregando produtos...</p>
            ) : (
                <form onSubmit={handleSubmit(handleFormProductsData)} className="skeleton-forms">
                    <InputField
                        register={register}
                        name="productName"
                        label="Nome do produto"
                        placeholder="Digite como está na nota"
                        onChange={handleProductNameChange}
                        autoComplete="off"
                    />
                    {suggestions.length > 0 && (
                        <ul className="bg-slate-700 text-white rounded-md p-3">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="my-3 cursor-pointer border-b border-white"
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                    <InputField register={register} name="quantity" label="Quantidade" placeholder="Digite somente números ex: 50" type="number" />
                    <InputField register={register} name="valueUnit" label="Valor bruto por unidade" placeholder="Digite o valor bruto" />
                    <InputField register={register} name="percentage" label="Porcentagem" placeholder="Digite a porcentagem" />
                    <button type="submit" className="buttons-forms">Add compra</button>
                </form>
            )}

            <div className="list-items h-80">
                {itemsShopping.length === 0 ? (
                    <p className="text-center font-mono text-sm mt-10">As compras adicionadas aparecerão aqui.</p>
                ) : (
                    itemsShopping.map((item, index) => (
                        <ul key={index} className="list-item-li relative">
                            <li>Produto: {item.productName}</li>
                            <li>Quantidade: {item.quantity}</li>
                            <li>Valor: {item.valueUnit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</li>
                            <li>Porcentagem: {item.percentage}{item.percentage && "%"}</li>
                            <button type="button" onClick={() => deleteShopping(index)} className="absolute top-2 right-2 text-red-600">
                                <FiTrash size={23} />
                            </button>
                        </ul>
                    ))
                )}
            </div>
        </Suspense>
    );
}
