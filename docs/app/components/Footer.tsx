import Link from "next/link";

export default function Footer() {
    return (
        <div className="flex w-full justify-around bg-black text-white">
            <div className="flex gap-4">
                <p>Created By: Samarth Goyal & Contributors.</p>
                <p>Font Form: Vollkorn</p>
            </div>
            <Link href='#'>Website Source</Link>
        </div>
    );
}