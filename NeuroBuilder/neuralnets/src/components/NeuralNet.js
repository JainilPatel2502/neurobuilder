import { useNN } from "../context/NNProvider";
import Layer from "./Layer";
import styles from "./NeuralNet.module.css";
function NeuralNet({
  setNeuronsPerLayer,
  setActivationsPerLayer,
  setInitializationPerLayer,
  setRegularizationPerLayer,
  maxNeuron,
}) {
  const { layer } = useNN();

  return (
    <div className={styles.container}>
      {Array.from({ length: layer }, (_, i) => (
        <Layer
          key={i}
          index={i}
          setNeuronsPerLayer={setNeuronsPerLayer}
          setRegularizationPerLayer={setRegularizationPerLayer}
          setActivationsPerLayer={setActivationsPerLayer}
          setInitializationPerLayer={setInitializationPerLayer}
          maxNeuron={maxNeuron}
        />
      ))}
    </div>
  );
}

export default NeuralNet;
