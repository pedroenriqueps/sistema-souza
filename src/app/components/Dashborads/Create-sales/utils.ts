import * as yup from "yup";

export const schemaClientSale = yup.object({
    clientName: yup
        .string()
        .required("O nome do cliente é obrigatório.")
        .min(3, "O tamanho mínimo de caracteres é 3"),
    dateSale: yup
        .string()
        .matches(
            /^\d{2}\/\d{2}\/\d{4}$/,
            "A data deve estar no formato dd/mm/aaaa."
        )
        .required("A data da venda é obrigatória."),
    delivery: yup
        .string()
        .oneOf(["yes", "no"], "O valor de entrega deve ser 'Sim' ou 'Não'.")
        .required("O campo entrega é obrigatório."),
    neighborhood: yup
        .string()
        .nullable()
        .when("delivery", {
            is: (delivery: string) => delivery === "yes", // Condição para quando delivery é "yes"
            then: yup.string().required("O bairro é obrigatório para entrega."),
            otherwise: yup.string().nullable(), // Quando não for "yes", o campo pode ser nulo
        }),
    road: yup
        .string()
        .nullable()
        .when("delivery", {
            is: (delivery: string) => delivery === "yes", // Condição para quando delivery é "yes"
            then: yup.string().required("A rua é obrigatória para entrega."),
            otherwise: yup.string().nullable(), // Quando não for "yes", o campo pode ser nulo
        }),
    houseNumber: yup
        .number()
        .nullable()
        .typeError("O número da casa deve ser um número.")
        .when("delivery", {
            is: (delivery: string) => delivery === "yes", // Condição para quando delivery é "yes"
            then: yup.number().required("O número da casa é obrigatório para entrega."),
            otherwise: yup.number().nullable(), // Quando não for "yes", o campo pode ser nulo
        }),
    paymentMethod: yup
        .string()
        .oneOf(["pix", "card", "money"], "O método de pagamento deve ser pix, cartão ou dinheiro")
        .required("O método de pagamento é obrigatório"),
    paymentInstallments: yup
        .string()
        .required("O número de parcelas é obrigatório"),
    reference: yup
        .string()
        .nullable()
        .when("delivery", {
            is: (delivery: string) => delivery === "yes", // Condição para quando delivery é "yes"
            then: yup.string().required("A referência é obrigatória para entrega."),
            otherwise: yup.string().nullable(), // Quando não for "yes", o campo pode ser nulo
        }),
});

export const schemaProductsSale = yup.object().shape({
    productName: yup
        .string()
        .required("O nome do produto é obrigatório")
        .min(3, "O produto deve ter no mínimo 3 caracteres"),
    quantity: yup
        .number()
        .required("A quantidade é obrigatória")
        .typeError("A quantidade deve ser um número")
        .min(1, "A quantidade deve ser no mínimo 1"),
    valueUnit: yup
        .number()
        .required("O valor unitário é obrigatório")
        .typeError("O valor unitário deve ser um número")
        .positive("O valor unitário deve ser maior que zero"),

});
