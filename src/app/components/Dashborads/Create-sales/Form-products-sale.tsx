import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { InputField } from "../../Input-field/Input-field";
import { schemaProductsSale } from "./utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiTrash } from "react-icons/fi";
import { showYupErrors } from "../Create-shopping/utils";
import { toast } from "react-toastify";
import { useStock } from "@/context/stock/stock";
import { AxiosError } from "axios";

export interface FormClientDataInterface {
    productName: string;
    quantity: number;
    valueUnit: number;
}

interface PropsProductsInterface {
    itemsSale: Array<FormClientDataInterface>;
    setItemsSale: (value: FormClientDataInterface[]) => void;
}

export function FormProductsSale({ itemsSale, setItemsSale }: PropsProductsInterface) {
    const { register, handleSubmit, setFocus, setValue, formState: { errors }, reset } = useForm<FormClientDataInterface>({
        resolver: yupResolver(schemaProductsSale),
    });
    const { stock, isLoading } = useStock();
    const [suggestions, setSuggestions] = useState<FormClientDataInterface[]>([]);

    const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue('productName', value);

        if (value.length > 2) {
            const filteredSuggestions = stock
                .filter(product =>
                    product.productName.toLowerCase().includes(value.toLowerCase())
                )
                .map(product => ({
                    productName: product.productName,
                    quantity: product.quantity,
                    valueUnit: product.valueUnit
                }));
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: FormClientDataInterface) => {
        setValue('productName', suggestion.productName);
        setSuggestions([]);
        setFocus('quantity');
    };

    const handleFormProductsData = async (data: FormClientDataInterface) => {
        try {
            const matchedProduct = stock.find(product => product.productName === data.productName);

            if (matchedProduct) {
                if (data.quantity > matchedProduct.quantity) {
                    toast.error(`A quantidade do produto "${data.productName}" excede a quantidade disponível (${matchedProduct.quantity}).`);
                    return;
                }

                if (data.valueUnit <= matchedProduct.valueUnit) {
                    toast.error(`O valor unitário do produto "${data.productName}" deve ser maior que o valor registrado (${matchedProduct.valueUnit.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}).`);
                    return;
                }

                setItemsSale([...itemsSale, { ...data }]);
                reset();
                setFocus("productName");
                toast.success(`Produto "${data.productName}" adicionado com sucesso!`);
            } else {
                toast.error(`Produto "${data.productName}" não está cadastrado.`);
            }

        } catch (error: unknown) {
            console.error("Erro ao buscar o produto:", error);
            if (AxiosError) {
                toast.error("Erro ao adicionar o produto.");
            } else if (error instanceof Error) {
                toast.error(`Houve um erro inesperado: ${error.message}`);
            } else {
                toast.error("Erro desconhecido")
            }
        }
    };

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            showYupErrors(errors);
        }
    }, [errors]);

    const deleteSale = (index: number) => {
        const filterSale = itemsSale.filter((_, indexItem) => index !== indexItem);
        setItemsSale(filterSale);
    };

    return (
        <>
            {isLoading ? (
                <p>Carregando produtos...</p>
            ) : (
                <form onSubmit={handleSubmit(handleFormProductsData)} className="skeleton-forms">
                    <InputField
                        register={register}
                        name="productName"
                        label="Nome do produto"
                        placeholder="Nome completo do produto"
                        onChange={handleProductNameChange}
                        autoComplete="off"
                    />
                    {suggestions.length > 0 && (
                        <ul className="bg-slate-700 text-white rounded-md p-3">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="flex justify-between my-3 cursor-pointer hover:bg-slate-600 p-1 border-b border-white"
                                >
                                    <span>{suggestion.productName}</span>
                                    <span>{suggestion.quantity} un restantes</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <InputField
                        register={register}
                        name="quantity"
                        label="Quantidade"
                        placeholder="Digite somente números ex: 50"
                        type="number"
                        autoComplete="off"
                    />

                    <InputField
                        register={register}
                        name="valueUnit"
                        label="Valor por unidade"
                        placeholder="Digite o valor unitário"
                        type="number"
                        step="0.01"
                        autoComplete="off"
                    />
                    <button type="submit" className="buttons-forms">Adicionar Produto</button>
                </form>
            )}

            <div className="list-items h-80">
                {itemsSale.length === 0 ? (
                    <p className="text-center font-mono text-sm mt-10">As vendas adicionadas aparecerão aqui.</p>
                ) : (
                    itemsSale.map((item, index) => (
                        <ul key={index} className="list-item-li relative">
                            <li>Produto: {item.productName}</li>
                            <li>Quantidade: {item.quantity}</li>
                            <li>
                                Valor unitário: {item.valueUnit.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </li>
                            <button
                                type="button"
                                onClick={() => deleteSale(index)}
                                className="absolute top-2 right-2 text-red-600"
                            >
                                <FiTrash size={23} />
                            </button>
                        </ul>
                    ))
                )}
            </div>
        </>
    );
}
