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
            is: "yes",
            then: (schema) =>
                schema.required("O bairro é obrigatório para entrega."),
            otherwise: (schema) => schema.nullable(),
        }),
    road: yup
        .string()
        .nullable()
        .when("delivery", {
            is: "yes",
            then: (schema) =>
                schema.required("A rua é obrigatória para entrega."),
            otherwise: (schema) => schema.nullable(),
        }),
    houseNumber: yup
        .number()
        .nullable()
        .typeError("O número da casa deve ser um número.")
        .when("delivery", {
            is: "yes",
            then: (schema) =>
                schema.required("O número da casa é obrigatório para entrega."),
            otherwise: (schema) => schema.nullable(),
        }),
    paymentMethod: yup
        .string()
        .oneOf(
            ["pix", "card", "money"],
            "O método de pagamento deve ser pix, cartão ou dinheiro"
        )
        .required("O método de pagamento é obrigatório"),
    paymentInstallments: yup
        .string()
        .required("O número de parcelas é obrigatório"),
    reference: yup
        .string()
        .nullable()
        .when("delivery", {
            is: "yes",
            then: (schema) =>
                schema.required("A referência é obrigatória para entrega."),
            otherwise: (schema) => schema.nullable(),
        }),
});


export const schemaProductsSale = yup.object({
    productName: yup
        .string()
        .required("O nome do produto é obrigatório.")
        .min(3, "O tamanho mínimo de caracteres é 3"),
    quantity: yup
        .number()
        .required("A quantidade é obrigatória.")
        .min(1, "A quantidade deve ser no mínimo 1."),
    valueUnit: yup
        .number()
        .required("O valor unitário é obrigatório.")
        .positive("O valor deve ser positivo.")
});
