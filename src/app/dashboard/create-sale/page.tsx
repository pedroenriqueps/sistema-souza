import { FormClientSale } from "@/app/components/Dashborads/Create-sales/Form-client-sale";
import { HeaderMenuBar } from "@/app/components/Header/Header";

export default function Page() {
    return (
        <>
            <HeaderMenuBar />
            <main>
                <FormClientSale />
            </main>
        </>
    )
}