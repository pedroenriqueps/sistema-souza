'use client';

interface FilterDeliveriesProps {
    onFilterChange: (filterValue: string) => void;
}

export function FilterDeliveries({ onFilterChange }: FilterDeliveriesProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange(event.target.value);
    };

    return (
        <fieldset className="flex justify-center mb-6">
            <input
                type="text"
                placeholder="Filtrar entregas por cliente, bairro ou rua..."
                onChange={handleChange}
                className="border border-black focus:border-2 p-2 outline-none rounded-md shadow-md w-[80%]"
            />
        </fieldset>
    );
}
