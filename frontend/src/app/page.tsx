import Image from "next/image";
import Header from "@/app/components/ui_components/Header";
import classes from './App.module.css';
import resets from './components/_resets.module.css';
import { MacBookPro162 } from './components/FigmaComponents/MacBookPro162';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-24 md:p-24">
      <Header />

      <div className={`${resets.clapyResets} ${classes.root}`}>
        <MacBookPro162 />
      </div>
    </main>
  );
}
