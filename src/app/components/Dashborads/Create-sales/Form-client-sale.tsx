"use client";

import { useForm } from "react-hook-form";
import { InputField } from "../../Input-field/Input-field";
import { FormProductsSale } from "./Form-products-sale";
import { useState } from "react";
import { FormClientDataInterface } from "./Form-products-sale";
import { schemaClientSale } from "./utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputRadioField } from "@/app/components/Input-field/Input-radio-field";
import { toast } from "react-toastify";
import { showYupErrors } from "@/utils/show-errors";
import axios from "axios";


export interface FormdataClientInterface {
    clientName: string;
    dateSale: string;
    delivery: "yes" | "no";
    neighborhood?: string | null;
    road?: string | null;
    houseNumber?: number | null;
    reference?: string | null;
    paymentMethod: "pix" | "card" | "money";
    paymentInstallments: string;
}

export function FormClientSale() {
    const [itemsSale, setItemsSale] = useState<FormClientDataInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState,
    } = useForm<FormdataClientInterface>({
        resolver: yupResolver(schemaClientSale),
        defaultValues: {
            dateSale: new Date().toLocaleDateString("pt-BR"),
            delivery: "no",
            paymentMethod: "pix",
            paymentInstallments: "1",
        },
    });
    const deliveryYes: string = watch("delivery");

    const handleFormClientData = async (data: FormdataClientInterface) => {
        if (!itemsSale || itemsSale.length === 0) {
            toast.error("Cadastre uma venda antes de enviar os dados");
            return;
        }
        setIsLoading(true);
        try {
            const dateParts = data.dateSale.split("/");
            const saleDate = new Date(
                `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${new Date().toISOString().split("T")[1]}`
            );
            const dateISO = saleDate.toISOString();

            const dataClient = {
                clientName: data.clientName,
                dateSale: dateISO,
                delivery: data.delivery,
                paymentMethod: data.paymentMethod,
                paymentInstallments: data.paymentInstallments,
                neighborhood: data.neighborhood,
                road: data.road,
                houseNumber: data.houseNumber,
                reference: data.reference,
            };

            const response = await axios.post("/api/dashboard/create-sale", {
                dataClient,
                itemsSale,
            });

            if (response.status === 201) {
                toast.success("Nova venda adicionada com sucesso");
                setItemsSale([]);
                reset();
            }
        } catch (error: unknown) {
            console.error("Houve um erro ao criar a venda", error);

            if (axios.isAxiosError(error)) {
                const axiosError = error.response;
                if (axiosError) {
                    toast.error(
                        `Erro: ${axiosError.data?.message || "Algo deu errado!"} - Código: ${axiosError.status}`
                    );
                }
            } else if (error instanceof Error) {
                toast.error(`Erro inesperado: ${error.message}`);
            } else {
                toast.error("Erro desconhecido.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <FormProductsSale itemsSale={itemsSale} setItemsSale={setItemsSale} />
            <form onSubmit={handleSubmit(handleFormClientData, showYupErrors)} className="skeleton-forms">
                <InputField register={register} name="clientName" label="Nome do cliente" placeholder="Nome do cliente" />
                <InputField register={register} name="dateSale" label="Data da venda" placeholder="dd/mm/aaaa" />
                <div>
                    <div className="my-2">
                        <p className="text-sm">Entrega</p>
                        <div className="flex gap-x-5">
                            <InputRadioField register={register} name="delivery" id="yes" type="radio" value="yes" label="Sim" />
                            <InputRadioField register={register} name="delivery" id="no" type="radio" value="no" label="Não" />
                        </div>
                    </div>
                    {deliveryYes === "yes" && (
                        <div>
                            <InputField register={register} name="neighborhood" label="Digite o bairro" placeholder="Bairro" required />
                            <InputField register={register} name="road" label="Digite a rua" placeholder="Rua" required />
                            <InputField register={register} name="houseNumber" label="Número da casa" placeholder="Somente números" required />
                            <fieldset className="flex flex-col">
                                <label htmlFor="reference" className="text-sm">
                                    Digite alguma referência
                                </label>
                                <textarea
                                    {...register("reference")}
                                    id="reference"
                                    placeholder="Digite um texto pequeno..."
                                    cols={10}
                                    rows={6}
                                    className="p-3 border border-black outline-none focus:border-2"
                                ></textarea>
                            </fieldset>
                        </div>
                    )}
                </div>

                <div className="my-2">
                    <p className="text-sm">Forma de pagamento</p>
                    <div className="flex gap-x-5">
                        <InputRadioField register={register} name="paymentMethod" id="pix" type="radio" value="pix" label="Pix" />
                        <InputRadioField register={register} name="paymentMethod" id="money" type="radio" value="money" label="Dinheiro" />
                        <InputRadioField register={register} name="paymentMethod" id="card" type="radio" value="card" label="Cartão" />
                    </div>
                </div>

                <div className="my-2">
                    <p className="text-sm">Parcelas</p>
                    <div className="flex gap-x-5">
                        <InputRadioField register={register} name="paymentInstallments" id="one" type="radio" value={"1"} label="À vista" />
                        <InputRadioField register={register} name="paymentInstallments" id="two" type="radio" value={"2"} label="2" />
                        <InputRadioField register={register} name="paymentInstallments" id="three" type="radio" value={"3"} label="3" />
                        <InputRadioField register={register} name="paymentInstallments" id="four" type="radio" value={"4"} label="4" />
                    </div>
                </div>

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
                        "Criar venda"
                    )}
                </button>
            </form>
        </>
    );
}
