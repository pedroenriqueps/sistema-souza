"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { InputField } from "../Input-field/Input-field";
import { schema } from "./utils";
import { HeaderAuth } from "../Header/Header";
import { toast } from "react-toastify";
import { showYupErrors } from "@/utils/show-errors";
import Link from "next/link";

interface RegisterLoginInterface {
    username: string;
    accessKey: string;
    password: string;
    repeatPassword: string;
}

export default function Register() {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RegisterLoginInterface>({
        resolver: yupResolver(schema),
    });

    const handleRegisterForm = async (data: RegisterLoginInterface) => {
        if (Object.keys(errors).length > 0) {
            toast.error("Por favor, corrija os erros de formulário.");
        }

        try {
            const response = await axios.post("/api/user/register/", data);
            if (response.status === 201) {
                reset();
                toast.success("Usuário criado com sucesso!");
                window.location.href = "/user/login"
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
    };

    return (
        <>
            <HeaderAuth />
            <form onSubmit={handleSubmit(handleRegisterForm, showYupErrors)} className="skeleton-forms">
                <InputField
                    name="username"
                    register={register}
                    type="text"
                    label="Nome de usuário"
                />
                <InputField
                    name="accessKey"
                    register={register}
                    type="text"
                    label="Chave secreta"
                />
                <InputField
                    name="password"
                    register={register}
                    type="password"
                    label="Crie uma senha"
                />
                <InputField
                    name="repeatPassword"
                    register={register}
                    type="password"
                    label="Repita a senha"
                />
                <button type="submit" className="buttons-forms" disabled={isSubmitting}>Criar conta</button>

                <div className="flex items-center justify-center mt-4">
                    <p>Já tem conta? </p> <Link href="/user/login" className="text-blue-500 font-semibold ml-1">Clique aqui</Link>
                </div>
            </form>
        </>
    );
}
