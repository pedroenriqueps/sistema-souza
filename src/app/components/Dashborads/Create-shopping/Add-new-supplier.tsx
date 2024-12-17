"use client";

import { useForm } from "react-hook-form";
import { InputField } from "../../Input-field/Input-field";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoIosLogOut } from "react-icons/io";
import { toast } from "react-toastify";
import axios from "axios";

export interface NewSuplierDataForm {
    newSupplier: string;
}

interface NewSupplierProps {
    setModalSuppliersProp: (value: boolean) => void;
    addSupplier: (supplier: NewSuplierDataForm) => void;
}

const schema = yup.object().shape({
    newSupplier: yup.string().required("Digite o nome do fornecedor").min(3, "Digite no mínimo 3 caracteres"),
});

export function AddNewSupplier({ setModalSuppliersProp, addSupplier }: NewSupplierProps) {
    const { register, handleSubmit } = useForm<NewSuplierDataForm>({
        resolver: yupResolver(schema),
    });

    const handleFormNewSupplier = async (data: NewSuplierDataForm) => {

        try {
            const response = await axios.post("/api/dashboard/create-supplier", data)
            addSupplier(data);
            setModalSuppliersProp(false);
            toast.success("Novo fornecedor adicionado")
            return response.data
        } catch (error: unknown) {
            console.error("Houve um erro ao adicionar fornecedor: ", error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    toast.error(`Erro: ${error.response.data?.message || 'Algo deu errado!'} - Código: ${error.response.status}`);
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

    const outToModal = () => {
        setModalSuppliersProp(false);
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(handleFormNewSupplier)}
                className="relative bg-green-400 w-[90%] rounded-md shadow-lg p-6 max-w-md"
            >
                <InputField
                    register={register}
                    name="newSupplier"
                    label="Novo fornecedor"
                />
                <button type="submit" className="buttons-forms mt-4">Add</button>
                <button type="button" onClick={outToModal} className="absolute top-2 right-2">
                    <IoIosLogOut size={25} />
                </button>
            </form>
        </>
    );
}
