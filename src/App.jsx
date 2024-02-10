import { useState } from "react";
function App() {
  const [number, setNumber] = useState(0)
  return (
    <div>
      <p className="text-3xl font-black">test2</p>
      <div className={`text-sm font-black`}>test-3</div>
      <button onClick={()=> setNumber(number+1)} className={` ${number%2 === 0 ? 'bg-orange-500' : 'bg-blue-500'} `}>Press Me</button>
    </div>
  )
}

export default App;