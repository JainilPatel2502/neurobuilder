import Neuron from "./Neuron";

function Box({ neurons }) {
  return (
    <div>
      {Array.from({ length: neurons }, (_, index) => (
        <Neuron key={index} />
      ))}
    </div>
  );
}

export default Box;
