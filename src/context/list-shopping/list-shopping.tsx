"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

export interface Item {
    id: string;
    productName: string;
    quantity: number;
    valueUnit: number;
    percentage: number;
}

export interface ShoppingItem {
    id: string;
    supplierName: string;
    dateShopping: string;
    numberInstallments: number;
    itemsShopping: Item[];
}

interface ShoppingContextType {
    listShoppingItems: ShoppingItem[];
    isLoading: boolean;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const ShoppingProvider = ({ children }: { children: ReactNode }) => {
    const [listShoppingItems, setListShoppingItems] = useState<ShoppingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchShoppingItems = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get("/api/dashboard/list-shopping");
                if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
                    setListShoppingItems(response.data.data);
                } else {
                    console.error("A resposta da API não contém dados esperados");
                }
            } catch (error) {
                console.error("Erro ao carregar compras", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShoppingItems();
    }, []);

    return (
        <ShoppingContext.Provider value={{ listShoppingItems, isLoading }}>
            {children}
        </ShoppingContext.Provider>
    );
};

export const useShopping = () => {
    const context = useContext(ShoppingContext);
    if (!context) {
        throw new Error("useShopping deve ser usado dentro de um ShoppingProvider");
    }
    return context;
};
