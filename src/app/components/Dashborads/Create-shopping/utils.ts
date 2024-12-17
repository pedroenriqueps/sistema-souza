import * as yup from "yup"

export const schemaProducts = yup.object().shape({
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
    percentage: yup
        .number()
        .required("O percentual é obrigatório")
        .typeError("O percentual deve ser um número")
        .min(0, "O percentual não pode ser menor que 0")
        .max(200, "O percentual não pode ser maior que 100"),
});

export const schemaClient = yup.object().shape({
    supplierName: yup
        .string()
        .required("Escolha ou crie um fornecedor")
        .min(3, "O forncedor deve ter no mínimo 3 caracteres"),
    dateShopping: yup
        .string()
        .required("A data da compra é obrigatória")
        .matches(
            /^\d{2}\/\d{2}\/\d{4}$/,
            "O formato da data deve ser dd/mm/yyyy"
        ),
    numberInstallments: yup
        .number()
        .required("O número de parcelas é obrigatório")
        .min(1, "O número mínimo de parcelas deve ser 1"),
});

export const schemaDataShopping = yup.object().shape({
    dataClient: schemaClient,
    itemsShopping: yup
        .array()
        .of(schemaProducts)
        .min(1, "Pelo menos um item de compra deve ser informado")
        .required("Itens de compra são obrigatórios"),
});

