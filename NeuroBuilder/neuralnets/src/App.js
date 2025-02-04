import { useState } from "react";
import LayerCounter from "./components/LayerCounter";
import NeuralNet from "./components/NeuralNet";
import { useNN } from "./context/NNProvider";

function App() {
  const { layer ,setNnDetails,build,loss,lr,setLr,epochs , setEpochs,setLossFn,lossFn,handleCode,optimzer,setOptimizer} = useNN();
  const [neuronsPerLayer, setNeuronsPerLayer] = useState([]);
  const [actiavtionsPerLayer,setActivationsPerLayer] = useState([])
  const [initializationPerLayer,setInitializationPerLayer] = useState([])
  const [regularizationPerLayer,setRegularizationPerLayer] = useState([]);
  function handlePrintDetails() {
    const neuralnetdet={
        "layers":layer,
        neuronsPerLayer,
        actiavtionsPerLayer,
        initializationPerLayer,
        regularizationPerLayer,
        lr,
        lossFn,
        optimzer,
        epochs
    }
    setNnDetails(neuralnetdet)
    console.log(neuralnetdet)
  }
  
  return (
    <>
      <NeuralNet setNeuronsPerLayer={setNeuronsPerLayer} setActivationsPerLayer={setActivationsPerLayer} setInitializationPerLayer={setInitializationPerLayer} setRegularizationPerLayer={setRegularizationPerLayer} />
      <LayerCounter />
      <button onClick={handlePrintDetails } >Network Details</button>
      <button onClick={build}>Build Network</button>
      
      Learning Rate
      <input onChange={(e)=>setLr(Number(e.target.value))} />
      <select onChange={(e) => setLossFn(e.target.value)} defaultValue="">
        <option value="" disabled>Select Loss Function</option>
        <option value="Huber">Huber</option>
        <option value="MSE">MSE</option>
        <option value="MAE">MAE</option>
        <option value="Categorical Crossentropy">Categorical Crossentropy</option>
        <option value="Binary Cross Entropy">Binary Cross Entropy</option>
      </select>


      <select onChange={(e) => setOptimizer(e.target.value)}>
      <option value="" disabled>Select Optimzer</option>
        <option value={optimzer} >SGD</option>
        <option value={optimzer} >RMS Prop</option>
        <option value={optimzer} >Adam</option>
      </select>
      <button onClick={handleCode}>Code</button>


      Epochs
      <input value={epochs} onChange={(e)=>setEpochs(Number(e.target.value))}/>
    </>
  );
}

export default App;
