import { useState } from "react";
import TestComponent from "./components/testComponent";
function App() {
  const [number, setNumber] = useState(0)
  return (
    <div>
      <p className="text-3xl font-black">test2</p>
      <div className={`text-sm font-black`}>test-3</div>
      <button onClick={()=> setNumber(number+1)} className={`border-[5px] border-yellow-500 rounded-lg ${number%2 === 0 ? 'bg-orange-500 font-bold' : 'bg-blue-500 font-black'} `}>Press Me</button>
      <TestComponent/>
    </div>
  )
}

export default App;