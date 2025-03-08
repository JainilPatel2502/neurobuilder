import { useNN } from "../context/NNProvider";
import "./main.css";
function Neuron() {
  const { nnDetails } = useNN();
  return (
    <div className="fl">
      <div className="neuron">
        {Math.random().toLocaleString()}
        {nnDetails[1]}
      </div>
    </div>
  );
}

export default Neuron;
