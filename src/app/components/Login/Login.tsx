"use client"
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "../Input-field/Input-field";
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { HeaderAuth } from "../Header/Header";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import { showYupErrors } from "@/utils/show-errors";

const schema = yup.object().shape({
    username: yup
        .string()
        .required("O nome de usuśrio é obrigatório")
        .min(3, "O número de caractere deve ser maior que 3")
        .max(34, "O username deve ser menor que 34"),
    password: yup
        .string()
        .required("A senha é obrigatória")
        .min(6, "A senha deve ser maior que 6")
        .max(34, "A senha deve ser menor que 34")
})

interface FormLoginInterface {
    username: string
    password: string
}

export function Login() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormLoginInterface>({
        resolver: yupResolver(schema)
    })

    const handleLoginForm = async (data: FormLoginInterface) => {
        if (Object.keys(errors).length > 0) {
            toast.error("Por favor, corrija os erros de formulário.");
        }

        try {
            const response = await axios.post("/api/user/login", data)
            if (response.status === 201) {
                reset();
                toast.success("Usuário logado com sucesso!");
                window.location.href = "/"
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const errorMessage = error.response.data.message;
                    toast.error(errorMessage);
                    console.error("Erro ao criar usuário:", errorMessage);
                } else {
                    const errorMsg = "Erro inesperado. Tente novamente.";
                    toast.error(errorMsg);
                    console.log("Erro inesperado", error);
                }
            }
        }
    }

    return (
        <>
            <HeaderAuth />
            <form onSubmit={handleSubmit(handleLoginForm, showYupErrors)} className="skeleton-forms">
                <InputField
                    register={register}
                    name="username"
                    type="text"
                    label="Nome de usuário"
                />

                <InputField
                    register={register}
                    name="password"
                    type="password"
                    label="Senha de acesso"
                />
                <button type="submit" className="buttons-forms">Entrar</button>
                <div className="flex items-center justify-center mt-4">
                    <p>Ainda não tem conta? </p> <Link href="/user/register" className="text-blue-500 font-semibold ml-1">Clique aqui</Link>
                </div>
            </form>

        </>
    )
}
