import Link from "next/link";

export default function Footer() {
    return (
        <div className="flex w-full justify-around items-center pt-2 pb-1 bg-[#0a0a0a] border-t-2 border-[#1f1f1f] text-white">
            <div className="flex gap-4 items-center">
                <p className="text-sm">Created By: Samarth Goyal & Contributors.</p>
                <p className="text-sm">Font Form: Vollkorn</p>
            </div>
            <Link href='https://github.com/igoyalsamarth/rantail/tree/main/docs' className="text-sm">Website Source</Link>
        </div>
    );
}