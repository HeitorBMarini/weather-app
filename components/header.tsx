import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import logo from "@/components/imgs/logo.png";
import CitySearch from "./city-search";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Weather App, início">
          <Image src={logo} alt="" width={40} height={40} priority />
          <span className="hidden font-semibold tracking-tight sm:inline">Weather App</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <CitySearch />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
