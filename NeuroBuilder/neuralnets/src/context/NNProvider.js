import { createContext, useContext, useState } from "react";

const NNContext = createContext();
function NNProvider({ children }) {
  const [layer, setLayer] = useState(1);
  const [nnDetails,setNnDetails] = useState({})
  const [loss,setLoss] = useState([])
  const [lr,setLr] = useState(0.1);
  const [lossFn,setLossFn] = useState("");
  const [optimzer,setOptimizer] = useState("")
  const [epochs , setEpochs] = useState();
  function build(){
    const res=fetch("http://127.0.0.1:5000/net",{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify(nnDetails), 
    }).then((res)=>res.json()).then((res)=>console.log(res))
    setLoss(res['loss_history'])
  }

  function handleCode(){
    fetch('http://127.0.0.1:5000/getcode',{method:"POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify(nnDetails),}).then((res)=>res.json()).then((res)=>console.log(res))
  }
  return (
    <NNContext.Provider value={{epochs , setEpochs,optimzer,setOptimizer, setLr,lr,loss,layer, setLayer,nnDetails,handleCode ,setNnDetails ,build,lossFn,setLossFn}}>
      {children}
    </NNContext.Provider>
  );
}

function useNN() {
  const nn = useContext(NNContext);
  if (!nn) throw new Error("Using context from outside");
  return nn;
}
export { NNProvider, useNN };
