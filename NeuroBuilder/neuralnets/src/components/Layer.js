import Counter from "./Counter";
import Box from "./Box";
import { useEffect, useState } from "react";
import styles from "./Layer.module.css";
import RightClick from "./RightClick";
function Layer({
  setNeuronsPerLayer,
  index,
  setActivationsPerLayer,
  setInitializationPerLayer,
  setRegularizationPerLayer
}) {
  const [neurons, setNeurons] = useState(1);
  const [activationFunction, setActivationFunction] = useState("ReLU");
  const [intialization, setInitialization] = useState("Normalized");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [regularization, setRegularization] = useState("L1 Regularization");

  const handleRightClick = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.pageX, y: e.pageY });
    setShowMenu(true);
  };

  const handleClick = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };
  useEffect(
    function () {
      setNeuronsPerLayer((prev) => {
        const updated = [...prev];
        updated[index] = neurons;
        return updated;
      });
    },
    [neurons, index, setNeuronsPerLayer, intialization, activationFunction]
  );

  useEffect(
    function () {
      setActivationsPerLayer((prev) => {
        const updated = [...prev];
        updated[index] = activationFunction;
        return updated;
      });
    },
    [activationFunction, index, setActivationsPerLayer]
  );
  useEffect(
    function () {
      setRegularizationPerLayer((prev) => {
        const updated = [...prev];
        updated[index] = regularization;
        return updated;
      });
    },
    [regularization, index, setRegularizationPerLayer]
  );

  useEffect(
    function () {
      setInitializationPerLayer((prev) => {
        const updated = [...prev];
        updated[index] = intialization;
        return updated;
      });
    },
    [index, intialization, setInitializationPerLayer]
  );
  return (
    <div
      className={styles.layer}
      onContextMenu={handleRightClick}
      onClick={handleClick}
      onDoubleClick={handleRightClick}
    >
      <Counter neurons={neurons} setNeurons={setNeurons} />
      <Box neurons={neurons} />
      <RightClick
        menuPosition={menuPosition}
        showMenu={showMenu}
        setRegularization={setRegularization}
        setActivationFunction={setActivationFunction}
        setInitialization={setInitialization}
      />
      <p>
        {intialization},{activationFunction},{regularization}
      </p>
    </div>
  );
}

export default Layer;
