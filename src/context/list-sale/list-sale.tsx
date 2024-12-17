"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface ItemSale {
    id: string;
    productName: string;
    quantity: number;
    valueUnit: number;
    totalValue: number;
}

interface Sale {
    id: string;
    clientName: string;
    dateSale: string;
    delivery: string;
    neighborhood?: string;
    road?: string;
    houseNumber?: number;
    reference?: string;
    paymentMethod: string;
    paymentInstallments: string;
    itemsSale: ItemSale[];
}

interface SalesContextType {
    listSales: Sale[];
    isLoading: boolean;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider = ({ children }: { children: ReactNode }) => {
    const [listSales, setListSales] = useState<Sale[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get("/api/dashboard/list-sale");
                if (
                    response.data &&
                    response.data.status === "success" &&
                    Array.isArray(response.data.data)
                ) {
                    setListSales(response.data.data);
                } else {
                    console.error("A resposta da API não contém dados esperados");
                }
            } catch (error) {
                console.error("Erro ao carregar vendas", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSales();
    }, []);

    return (
        <SalesContext.Provider value={{ listSales, isLoading }}>
            {children}
        </SalesContext.Provider>
    );
};

export const useSales = () => {
    const context = useContext(SalesContext);
    if (!context) {
        throw new Error("useSales deve ser usado dentro de um SalesProvider");
    }
    return context;
};
