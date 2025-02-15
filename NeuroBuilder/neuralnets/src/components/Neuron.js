import styles from "./Neuron.module.css";
function Neuron() {
  return (
    <div className={styles.fl}>
      <div className={styles.neuron}>{Math.random().toLocaleString()}</div>
    </div>
  );
}

export default Neuron;
