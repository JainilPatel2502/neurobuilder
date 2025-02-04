function Counter({ neurons, setNeurons }) {
  function handleInc(e) {
    setNeurons(e.target.value);
  }
  return (
    <>
      <section>
        <button
          onClick={() => {
            if (neurons < 2) return;
            setNeurons(neurons - 1);
          }}
        >
          -
        </button>
        <input type="number" value={neurons} onChange={handleInc} />
        <button onClick={() => setNeurons(neurons + 1)}>+</button>
      </section>
    </>
  );
}

export default Counter;
