"use client";

import { FC } from "react";
import { UseFormRegister } from "react-hook-form";
import { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string
    register: UseFormRegister<any>;
}

export const InputField: FC<InputFieldProps> = ({
    name,
    label,
    register,
    ...rest
}) => {
    return (
        <fieldset className="flex flex-col pb-3  relative">
            <label className="text-sm" htmlFor={name}>{label}</label>
            <input
                className="border rounded-md bg-transparent p-2 h-12 border-black outline-none focus:border-black focus:border-2 transition-opacity placeholder:text-sm"
                {...register(name)}
                {...rest}
            />
        </fieldset >

    );
};

