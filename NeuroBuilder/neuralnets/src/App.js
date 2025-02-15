import { useEffect, useState } from "react";
import LayerCounter from "./components/LayerCounter";
import NeuralNet from "./components/NeuralNet";
import { useNN } from "./context/NNProvider";
import { useNavigate } from "react-router";
function App() {
  const {
    layer,
    setNnDetails,
    build,
    lr,
    setLr,
    epochs,
    setEpochs,
    lossFn,
    setLossFn,
    optimzer,
    setOptimizer,
    batchSize,
    setBatchSize,
    handleCode,
  } = useNN();

  const [neuronsPerLayer, setNeuronsPerLayer] = useState([]);
  const [actiavtionsPerLayer, setActivationsPerLayer] = useState([]);
  const [initializationPerLayer, setInitializationPerLayer] = useState([]);
  const [regularizationPerLayer, setRegularizationPerLayer] = useState([]);
  const [maxNeuron, setMaxNeuron] = useState(0);
  const navigate = useNavigate();
  function handlePrintDetails() {
    const neuralnetdet = {
      layers: layer,
      neuronsPerLayer,
      actiavtionsPerLayer,
      initializationPerLayer,
      regularizationPerLayer,
      lr,
      lossFn,
      optimzer,
      epochs,
      batchSize,
    };
    console.log(neuralnetdet);
    setNnDetails(neuralnetdet);
  }
  useEffect(
    function () {
      let max = neuronsPerLayer[0];
      for (let i = 0; i < neuronsPerLayer.length; i++) {
        if (max < neuronsPerLayer[i]) max = neuronsPerLayer[i];
      }
      // console.log(max);
      // setMaxNeuron(max);
      setMaxNeuron(max);
    },
    [neuronsPerLayer, setMaxNeuron]
  );
  return (
    <div>
      <NeuralNet
        setNeuronsPerLayer={setNeuronsPerLayer}
        setActivationsPerLayer={setActivationsPerLayer}
        setInitializationPerLayer={setInitializationPerLayer}
        setRegularizationPerLayer={setRegularizationPerLayer}
        maxNeuron={maxNeuron}
      />
      <LayerCounter />
      <button onClick={handlePrintDetails}>Network Details</button>
      <button onClick={build}>Build Network</button>
      Learning Rate
      <input onChange={(e) => setLr(Number(e.target.value))} />
      <select onChange={(e) => setLossFn(e.target.value)} defaultValue="">
        <option value="" disabled>
          Select Loss Function
        </option>
        <option value="Huber">Huber</option>
        <option value="MSE">MSE</option>
        <option value="MAE">MAE</option>
        <option value="Categorical Crossentropy">
          Categorical Crossentropy
        </option>
        <option value="Binary Cross Entropy">Binary Cross Entropy</option>
      </select>
      <select onChange={(e) => setOptimizer(e.target.value)}>
        <option value="" disabled>
          Select Optimzer
        </option>
        <option value="SGD">SGD</option>
        <option value="RMS Prop">RMS Prop</option>
        <option value="Adam">Adam</option>
        <option value="AdamW">AdamW </option>
        <option value="Adadelta">Adadelta</option>
        <option value="LBFGS ">Limited-memory BFGS</option>
      </select>
      <button onClick={handleCode}>Code</button>
      Epochs
      <input
        value={epochs}
        onChange={(e) => setEpochs(Number(e.target.value))}
      />
      Batch Size
      <input
        value={batchSize}
        onChange={(e) => setBatchSize(Number(e.target.value))}
      />
      <button onClick={() => navigate("/plots")}>Plot</button>
    </div>
  );
}

export default App;
