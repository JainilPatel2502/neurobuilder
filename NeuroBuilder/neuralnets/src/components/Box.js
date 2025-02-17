import Neuron from "./Neuron";
import "./main.css";
function Box({ neurons, maxNeuron }) {
  return (
    <div
      style={{
        height: `${maxNeuron * 90}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center ",
        justifyContent: "center",
      }}
    >
      {Array.from({ length: neurons }, (_, index) => (
        <Neuron key={index} />
      ))}
    </div>
  );
}

export default Box;
