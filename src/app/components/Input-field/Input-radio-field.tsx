"use client";

import { FC } from "react";
import { UseFormRegister } from "react-hook-form";

interface InputRadioFieldProps {
    name: string;
    label?: string;
    type: string;
    id: string;
    value?: string | number;
    register: UseFormRegister<any>;
}

export const InputRadioField: FC<InputRadioFieldProps> = ({ name, label, id, type, value, register, ...rest }) => {
    return (
        <fieldset>
            <input type={type} id={id} value={value} {...register(name)} {...rest} />
            {label && (
                <label htmlFor={id} className="ml-2">
                    {label}
                </label>
            )}
        </fieldset>
    );
};
