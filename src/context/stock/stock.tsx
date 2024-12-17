"use client"
import axios from "axios";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";

export interface DataProductsStockInterface {
    id: number;
    productName: string;
    quantity: number;
    valueUnit: number;
}

interface StockContextInterface {
    stock: DataProductsStockInterface[];
    isLoading: boolean;
    filterStock: (filterValue: string) => DataProductsStockInterface[];
}

const StockContext = createContext<StockContextInterface | undefined>(undefined);

export const StockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [stock, setStock] = useState<DataProductsStockInterface[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const response = await axios.get("/api/stock");
                if (response.status === 200) {
                    setStock(response.data.data);
                }
            } catch (error: unknown) {
                console.error("Houve um erro ao listar estoque:", error);
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
        fetchStock();
    }, []);

    const filterStock = (filterValue: string) => {
        return stock.filter(item =>
            item.productName.toLowerCase().includes(filterValue.toLowerCase())
        );
    };

    return (
        <StockContext.Provider value={{ stock, isLoading, filterStock }}>
            {children}
        </StockContext.Provider>
    );
};

export const useStock = (): StockContextInterface => {
    const context = useContext(StockContext);
    if (!context) {
        throw new Error("useStock deve ser usado dentro de um StockProvider");
    }
    return context;
};
