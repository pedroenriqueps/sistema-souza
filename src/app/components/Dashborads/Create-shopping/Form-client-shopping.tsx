"use client"
import { useForm } from "react-hook-form";
import { InputField } from "../../Input-field/Input-field";
import { IoMdAdd } from "react-icons/io";
import { Suspense, useEffect, useState } from "react";
import { AddNewSupplier, NewSuplierDataForm } from "./Add-new-supplier";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";
import { FormProducts, FormProductsDataInterface } from "./Form-products-shopping";
import { schemaClient } from "./utils";
import { LoadingSkeleton } from "../../Loading/Loading-skeleton";
import { showYupErrors } from "@/utils/show-errors";

export interface FormClientDataInterface {
    supplierName: string;
    dateShopping: string;
    numberInstallments: number;
}

export function FormClientData() {
    const [suppliers, setSuppliers] = useState<NewSuplierDataForm[]>([]);
    const [itemsShopping, setItemsShopping] = useState<FormProductsDataInterface[]>([]);
    const [modalSuppliers, setModalSuppliers] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { register, handleSubmit, watch, reset, formState } = useForm<FormClientDataInterface>({
        resolver: yupResolver(schemaClient),
        defaultValues: {
            dateShopping: new Date().toLocaleDateString("pt-BR"),
            numberInstallments: 0
        },
    });

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get("/api/dashboard/list-supplier");

                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    setSuppliers(response.data.data);
                } else {
                    toast.error("Erro ao buscar fornecedores: resposta inválida.");
                }

            } catch (error: unknown) {
                console.error("Houve um erro ao buscar fornecedor", error);
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        toast.error(`Erro: ${error.response.data.message || 'Algo deu errado!'} - Código: ${error.response.status}`);
                        return
                    } else if (error.request) {
                        toast.error("Erro de rede: Não foi possível se comunicar com o servidor.");
                    } else {
                        toast.error("Erro inesperado: " + error.message);
                    }
                } else if (error instanceof Error) {
                    toast.error("Erro inesperado: " + error.message);
                } else {
                    toast.error("Erro desconhecido.");
                }
            }
        };

        fetchSuppliers();
    }, []);

    const handleFormClientData = async (data: FormClientDataInterface) => {
        if (itemsShopping.length === 0) {
            toast.error("Cadastre uma compra antes de enviar os dados");
            return;
        }

        const dateParts = data.dateShopping.split("/");
        const shoppingDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${new Date().toISOString().split('T')[1]}`);
        const dateISO = shoppingDate.toISOString();

        const dataClient = {
            supplierName: data.supplierName,
            dateShopping: dateISO,
            numberInstallments: data.numberInstallments,
        };

        setIsLoading(true);

        try {
            const response = await axios.post("/api/dashboard/create-shopping", { dataClient, itemsShopping });
            if (response.status === 201) {
                toast.success("Nova compra criada com sucesso.");
                setItemsShopping([])
                reset();
            }
        } catch (error: unknown) {
            console.error("Houve um erro ao criar compra", error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    toast.error(`Erro: ${error.response.data.message || 'Algo deu errado!'} - Código: ${error.response.status}`);
                } else if (error.request) {
                    toast.error("Erro de rede: Não foi possível se comunicar com o servidor.");
                } else {
                    toast.error("Erro inesperado: " + error.message);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalSupplier = () => {
        setModalSuppliers(!modalSuppliers);
    };

    const addSupplier = (supplier: { newSupplier: string }) => {
        setSuppliers((prevSuppliers) => [...prevSuppliers, supplier]);
    };

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <div className="relative">
                {modalSuppliers && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
                        <AddNewSupplier
                            setModalSuppliersProp={setModalSuppliers}
                            addSupplier={addSupplier}
                        />
                    </div>
                )}
                <FormProducts
                    itemsShopping={itemsShopping}
                    setItemsShopping={setItemsShopping}
                />

                <form onSubmit={handleSubmit(handleFormClientData, showYupErrors)} className="skeleton-forms">
                    <fieldset className="mb-3">
                        <label htmlFor="supplier" className="text-sm">
                            Adicione o fornecedor
                        </label>
                        <select
                            {...register("supplierName")}
                            className={`border rounded-md bg-transparent p-2 h-12 border-black outline-none focus:border-black focus:border-2 transition-opacity w-[80%] ${!watch("supplierName") ? "text-gray-400" : "text-black"
                                }`}
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Selecione um fornecedor
                            </option>
                            {suppliers.map((item: NewSuplierDataForm, index: number) => (
                                <option key={index} value={item.newSupplier}>
                                    {item.newSupplier}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={handleModalSupplier}
                            className="mx-4"
                        >
                            <IoMdAdd size={25} />
                        </button>
                    </fieldset>
                    <InputField
                        register={register}
                        name="dateShopping"
                        label="Data da compra"
                        placeholder="dd/mm/aaaa"
                    />
                    <InputField
                        register={register}
                        name="numberInstallments"
                        label="Número de parcelas"
                        placeholder="Digite a quantidade"
                        type="number"
                    />
                    <button
                        type="submit"
                        className={`buttons-forms ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={formState.isSubmitting || isLoading}
                    >
                        {isLoading ? (
                            <div className="buttons-forms">
                                <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            "Criar compra"
                        )}
                    </button>
                </form>
            </div>
        </Suspense>
    );
}
