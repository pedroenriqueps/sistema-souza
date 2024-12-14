import { FormClientData } from "@/app/components/Dashborads/Create-shopping/Form-client-shopping";
import { HeaderMenuBar } from "@/app/components/Header/Header";

export default function Shopping() {
    return (
        <>
            <HeaderMenuBar />
            <main>
                <FormClientData />
            </main>
        </>
    )
}