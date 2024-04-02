'use client'

import { useState } from "react";

export default function RantailInstallButton() {

  const [active, setActive] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setActive(true)
      setTimeout(() => {
        setActive(false)
      }, 2000)
    } catch (err) {
      console.log(err)
    }
  };
  return (<>
    <button className="border-2 rounded-lg border-[#1f1f1f] px-4 pb-1 pt-2 text-white" onClick={() => copyToClipboard('npm install rantail')}>npm install rantail</button>
    {active && <div className="bg-white text-black px-4 pt-2 pb-1 fixed bottom-10 rounded-lg">Copied to clipboard</div>}
  </>
  );
}