import Nav from "@/components/Nav";
import PanelShowcase from "@/components/PanelShowcase";
import Cursor from "@/components/Cursor";

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <PanelShowcase />
      </main>
    </>
  );
}
