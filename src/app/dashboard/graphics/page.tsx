import { CreateGraphic } from "@/app/components/Dashborads/Graphics/Create-graphic";
import { HeaderMenuBar } from "@/app/components/Header/Header";

export default function Page() {
    return (
        <>
            <HeaderMenuBar />
            <main>
                <CreateGraphic />
            </main>
        </>
    )
}