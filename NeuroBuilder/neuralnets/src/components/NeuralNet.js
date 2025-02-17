import { useEffect, useState } from "react";
import { useNN } from "../context/NNProvider";
import Layer from "./Layer";
import "./main.css";
function NeuralNet({
  neuronsPerLayer,
  setNeuronsPerLayer,
  setActivationsPerLayer,
  setInitializationPerLayer,
  setRegularizationPerLayer,
  maxNeuron,
}) {
  const { layer } = useNN();
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const updateConnections = () => {
      const layers = document.querySelectorAll(".lay");
      console.log(layer);

      let newConnections = [];
      for (let i = 0; i < layers.length - 1; i++) {
        const currentLayer = layers[i];
        const nextLayer = layers[i + 1];
        const currentNeurons = currentLayer.querySelectorAll(".fl");
        console.log(currentNeurons);
        const nextNeurons = nextLayer.querySelectorAll(".fl");

        currentNeurons.forEach((currNeuron) => {
          const currentRect = currNeuron.getBoundingClientRect();
          const currentX = currentRect.left + currentRect.width / 2;
          const currentY = currentRect.top + currentRect.height / 2;

          nextNeurons.forEach((nextNeuron) => {
            const nextRect = nextNeuron.getBoundingClientRect();
            const nextX = nextRect.left + nextRect.width / 2;
            const nextY = nextRect.top + nextRect.height / 2;

            newConnections.push({
              x1: currentX,
              y1: currentY,
              x2: nextX,
              y2: nextY,
            });
          });
        });
      }

      setConnections(newConnections);
    };

    const timeoutId = setTimeout(updateConnections, 10);

    return () => clearTimeout(timeoutId);
  }, [maxNeuron, layer, neuronsPerLayer]);

  return (
    <div className="container">
      <svg className="networksvg">
        {connections.map((line, i) => (
          <line key={i} x1={line.x1} x2={line.x2} y1={line.y1} y2={line.y2} />
        ))}
      </svg>
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
