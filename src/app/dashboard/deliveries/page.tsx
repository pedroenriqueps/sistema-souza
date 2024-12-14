import { ListDeliveries } from "@/app/components/Dashborads/List-deliveries/List-deliveries";
import { HeaderMenuBar } from "@/app/components/Header/Header";

export default function Page() {
    return (
        <>
            <HeaderMenuBar />
            <main>
                <ListDeliveries />
            </main>
        </>
    )
}