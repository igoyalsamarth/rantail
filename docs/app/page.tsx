import Link from "next/link";
import RantailInstallButton from "./components/rantailInstallButton";

export default function Home() {

  return (
    <div className="min-h-[calc(100vh-48px)] flex justify-center items-center flex-col gap-20 w-full">
      <div className="flex flex-col justify-center items-center w-full gap-10">
        <p className="border border-black rounded-full py-1 px-4">classNames encoder for Tailwind CSS</p>
        <p className="text-7xl text-center font-medium">Encode your Tailwind classes with unique and customizable cuid's</p>
      </div>
      <div className="flex flex-col justify-center items-center w-full gap-10">
        <p>Proudly Open Source. MIT License.</p>
        <div className="flex w-full justify-evenly items-center">
          <Link href='/docs' className="flex gap-2 hover:gap-3 duration-200 py-2 w-60 bg-black text-white justify-center">
            <p>Explore Documentation</p>
            <p>{'>'}</p>
          </Link>
          <RantailInstallButton />
        </div>
      </div>
    </div>
  );
}