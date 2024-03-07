'use client'

import { useState } from "react";

export default function RantailInstallButton(){

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
    return(<>
        <button className="border border-black px-4 py-1" onClick={() => copyToClipboard('npm install rantail')}>npm install rantail</button>
        {active && <div className="bg-black text-white px-4 py-1 fixed bottom-10 rounded-lg">Copied to clipboard</div>}
        </>
    );
}