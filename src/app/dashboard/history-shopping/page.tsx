import { ListShopping } from "@/app/components/Dashborads/List-shopping/List-shopping";
import { HeaderMenuBar } from "@/app/components/Header/Header";

export default function Page() {
    return (
        <>
            <HeaderMenuBar />
            <main>
                <ListShopping />
            </main>
        </>
    )
}