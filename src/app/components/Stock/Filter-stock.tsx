'use client'

interface FilterStockProps {
    onFilterChange: (filterValue: string) => void;
}

export function FilterStock({ onFilterChange }: FilterStockProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange(event.target.value);
    };

    return (
        <fieldset className="flex justify-center mb-10">
            <input
                type="text"
                placeholder="Filtrar produtos..."
                onChange={handleChange}
                className="border border-black focus:border-2 p-2 outline-none rounded-md shadow-md w-[80%]"
            />
        </fieldset>
    );
}
