import { useNN } from "../context/NNProvider";
import Layer from "./Layer";

function NeuralNet({ setNeuronsPerLayer , setActivationsPerLayer ,setInitializationPerLayer , setRegularizationPerLayer }) {
  const { layer } = useNN();

  return (
    <>
      {Array.from({ length: layer }, (_, i) => (
        <Layer key={i} index={i} setNeuronsPerLayer={setNeuronsPerLayer} setRegularizationPerLayer={setRegularizationPerLayer} setActivationsPerLayer={setActivationsPerLayer} setInitializationPerLayer={setInitializationPerLayer} />
      ))}
    </>
  );
}

export default NeuralNet;
