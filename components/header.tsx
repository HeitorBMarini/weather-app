import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
import logo from "@/components/imgs/logo.png";

export default function Header() {
  return (
    <div className=" border-b border-gray-200 dark:border-gray-700">
      <div className="container justify-between flex  mx-auto items-center p-4">
        <Image src={logo} alt="Logo" title="Logo" width={75} height={75} />

        <ModeToggle></ModeToggle>
      </div>
    </div>
  );
}
