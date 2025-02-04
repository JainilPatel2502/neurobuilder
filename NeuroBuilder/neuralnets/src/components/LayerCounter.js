import { useNN } from "../context/NNProvider";

function LayerCounter() {
  const { layer, setLayer } = useNN();
  function handleInc(e) {
    setLayer(e.target.value);
  }
  return (
    <>
      <section>
        <button
          onClick={() => {
            if (layer < 2) return;
            setLayer(layer - 1);
          }}
        >
          -
        </button>
        <input type="number" value={layer} onChange={handleInc} />
        <button onClick={() => setLayer(layer + 1)}>+</button>
      </section>
    </>
  );
}

export default LayerCounter;
