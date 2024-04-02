import Link from "next/link";
import RantailInstallButton from "./components/rantailInstallButton";

export default function Home() {

  return (
    <div className="min-h-[calc(100vh-102px)] flex justify-center items-center flex-col gap-20 w-full">
      <div className="flex flex-col justify-center items-center w-full gap-10">
        <p className="border-2 border-[#1f1f1f] rounded-full pt-2 pb-1 px-4 text-white">classNames encoder for Tailwind CSS</p>
        <p className="text-7xl text-center font-medium text-white">Encode your Tailwind classes with unique and customizable cuid's</p>
      </div>
      <div className="flex flex-col justify-center items-center w-full gap-10">
        <p className="text-white">Proudly Open Source. MIT License.</p>
        <div className="flex w-full justify-evenly items-center">
          <Link href='https://github.com/igoyalsamarth/rantail/blob/main/README.md' className="flex gap-2 rounded-lg hover:gap-3 duration-200 pt-2 pb-1 w-60 bg-white text-black font-semibold justify-center">
            <p>Explore Documentation</p>
            <p>{'>'}</p>
          </Link>
          <RantailInstallButton />
        </div>
      </div>
    </div>
  );
}