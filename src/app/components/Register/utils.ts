import * as yup from "yup"

export const schema = yup.object().shape({
    username: yup
        .string()
        .required("O nome de usuário é obrigatório")
        .min(3, "O tamanho mínimo do nome de usuário é 3")
        .max(34, "O tamanho máximo do nome de usuário é 34")
        .transform((value: string) => (value ? value.toUpperCase() : value)),
    accessKey: yup
        .string()
        .required("A chave de acesso é obrigatória")
        .length(6, "A chave de acesso deve ter exatamente 6 caracteres")
        .transform((value: string) => (value ? value.toUpperCase() : value)),
    password: yup
        .string()
        .required("A senha é obrigatória")
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
        .matches(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
        .matches(/[0-9]/, "A senha deve conter pelo menos um número")
        .matches(/[@$!%*?&#]/, "A senha deve conter pelo menos um caractere especial"),
    repeatPassword: yup
        .string()
        .oneOf([yup.ref('password'), undefined], "As senhas devem ser iguais")
        .required("A confirmação de senha é obrigatória")
});
