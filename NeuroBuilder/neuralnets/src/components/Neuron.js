import "./main.css";
function Neuron() {
  return (
    <div className="fl">
      <div className="neuron">{Math.random().toLocaleString()}</div>
    </div>
  );
}

export default Neuron;
