import * as yup from "yup"
import { toast } from "react-toastify";

export const showYupErrors = (error: unknown) => {
    if (error instanceof yup.ValidationError) {
        error.inner.forEach((err) => {
            if (err.message) {
                toast.error(err.message)
            }
        })
    }
};