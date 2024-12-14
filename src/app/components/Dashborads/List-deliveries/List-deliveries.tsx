'use client';
import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { LoadingSkeleton } from "../../Loading/Loading-skeleton";
import { toast } from "react-toastify";
import { FilterDeliveries } from "./Filter-deliveries";
import { ListItemsDelivery } from "./List-items-deliveries";

export interface ItemSale {
    productName: string;
    quantity: number;
}

export interface Delivery {
    clientName: string;
    neighborhood: string;
    road: string;
    houseNumber: string;
    reference: string;
    dateSale: string;
    itemsSale: ItemSale[];
}

interface CompletedItemsStatus {
    [deliveryIndex: number]: {
        [itemIndex: number]: boolean;
    };
}

export function ListDeliveries() {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
    const [completedItems, setCompletedItems] = useState<CompletedItemsStatus>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const response = await axios.get("/api/dashboard/list-deliveries");
                const data = response.data.data;
                setDeliveries(data);
                setFilteredDeliveries(data);
                loadCompletedItemsFromLocalStorage();
            } catch (error: unknown) {
                console.error("Erro ao buscar entregas:", error);
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

        fetchDeliveries();
    }, []);

    const loadCompletedItemsFromLocalStorage = () => {
        const savedCompletedItems = JSON.parse(localStorage.getItem("completedItems") || "{}");
        setCompletedItems(savedCompletedItems);
    };

    const saveCompletedItemsToLocalStorage = (newCompletedItems: CompletedItemsStatus) => {
        localStorage.setItem("completedItems", JSON.stringify(newCompletedItems));
    };

    const handleFilterChange = (filterValue: string) => {
        if (!filterValue) {
            setFilteredDeliveries(deliveries);
            return;
        }
        const lowerFilter = filterValue.toLowerCase();
        const filtered = deliveries.filter(delivery =>
            delivery.clientName.toLowerCase().includes(lowerFilter) ||
            delivery.neighborhood.toLowerCase().includes(lowerFilter) ||
            delivery.road.toLowerCase().includes(lowerFilter)
        );
        setFilteredDeliveries(filtered);
    };

    const toggleItemStatus = (deliveryIndex: number, itemIndex: number) => {
        const newCompletedItems = { ...completedItems };
        newCompletedItems[deliveryIndex] = {
            ...newCompletedItems[deliveryIndex],
            [itemIndex]: !newCompletedItems[deliveryIndex]?.[itemIndex],
        };
        setCompletedItems(newCompletedItems);
        saveCompletedItemsToLocalStorage(newCompletedItems);
    };

    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <div>
                <FilterDeliveries onFilterChange={handleFilterChange} />
                {isLoading ? (
                    <LoadingSkeleton />
                ) : (
                    <ListItemsDelivery
                        deliveries={filteredDeliveries}
                        completedItems={completedItems}
                        toggleItemStatus={toggleItemStatus}
                    />
                )}
            </div>
        </Suspense>
    );
}
