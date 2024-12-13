import { HeaderMenuBar } from "./components/Header/Header";
import { ListStock } from "./components/Stock/List-stock";

export default function Home() {
  return (
    <>
      <HeaderMenuBar />
      <main>
        <ListStock />
      </main>
    </>
  );
}
