'use client';

import { MdOutlineCheckCircle } from "react-icons/md";
import { Delivery } from "./List-deliveries";

interface DeliveriesListProps {
    deliveries: Delivery[];
    completedItems: { [deliveryIndex: number]: { [itemIndex: number]: boolean } };
    toggleItemStatus: (deliveryIndex: number, itemIndex: number) => void;
}

export function ListItemsDelivery({
    deliveries,
    completedItems,
    toggleItemStatus,
}: DeliveriesListProps) {
    return (
        <div className="list-items">
            {deliveries.length === 0 ? (
                <p>Nenhuma entrega encontrada</p>
            ) : (
                deliveries.map((delivery, deliveryIndex) => {
                    const allItemsChecked = delivery.itemsSale.every(
                        (_, itemIndex) => completedItems[deliveryIndex]?.[itemIndex]
                    );
                    return (
                        <ul
                            key={deliveryIndex}
                            className={`flex flex-col gap-y-1 mb-4 border rounded-md p-2 relative ${allItemsChecked ? "border-green-500 text-green-500" : "border-slate-300"
                                }`}
                        >
                            <li><strong>Cliente:</strong> {delivery.clientName}</li>
                            <li><strong>Bairro:</strong> {delivery.neighborhood}</li>
                            <li><strong>Rua:</strong> {delivery.road}, N: {delivery.houseNumber}</li>
                            <details>
                                <summary className="cursor-pointer">Materiais</summary>
                                {delivery.itemsSale.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className={`flex flex-wrap justify-between gap-y-3 p-2 border-b-2 ${allItemsChecked ? "border-green-500" : "border-slate-600"
                                            }`}
                                    >
                                        <li>Produto: {item.productName}</li>
                                        <li>Quantidade: {item.quantity}</li>
                                        <MdOutlineCheckCircle
                                            size={20}
                                            onClick={() => toggleItemStatus(deliveryIndex, itemIndex)}
                                            className={`${completedItems[deliveryIndex]?.[itemIndex]
                                                ? "text-green-500"
                                                : "text-gray-400"
                                                } cursor-pointer`}
                                        />
                                    </div>
                                ))}
                            </details>
                        </ul>
                    );
                })
            )}
        </div>
    );
}
