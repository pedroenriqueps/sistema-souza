import { HeaderMenuBar } from "@/app/components/Header/Header";
import { ListSale } from "@/app/components/Dashborads/List-sale/List-sale";

export default function Page() {
    return (
        <>
            <HeaderMenuBar />
            <main>
                <ListSale />
            </main>
        </>
    )
}