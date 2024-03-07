import Link from "next/link";

export default function Header(){
    return(
        <div className="flex w-full justify-between bg-black text-white px-4">
            <div className="">rantail</div>
            <div className="flex gap-4">
                <Link href='https://github.com/igoyalsamarth/rantail'>GITHUB</Link>
                <Link href='https://www.npmjs.com/package/rantail'>NPM</Link>
            </div>
        </div>
    );
}