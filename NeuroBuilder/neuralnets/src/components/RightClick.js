import React from "react";

function RightClick({ menuPosition, showMenu, setActivationFunction ,setInitialization ,setRegularization }) {
  if (!showMenu) return null;

  const style = {
    position: "absolute",
    top: menuPosition.y,
    left: menuPosition.x,
    backgroundColor: "#f2f2f2",
    border: "1px solid gray",
    boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
    zIndex: 1000,
  };

  return (
    <div style={style} >
      <ul style={{ listStyleType: "none", margin: 0, padding: "5px" }}>
        <li onClick={() => setActivationFunction("ReLU")}>ReLU</li>
        <li onClick={() => setActivationFunction("TanH")}>TanH</li>
        <li onClick={() => setActivationFunction("LeakyReLU")}>LeakyReLU</li>
        <li onClick={() => setInitialization("He Normalization")}>He Normalization</li>
        <li onClick={() => setRegularization("L1 regularization")}>L1 regularization</li>
        <li onClick={() => setRegularization("L2 regularization")}>L2 regularization</li>
        <input/>
      </ul>
    </div>
  );
}

export default RightClick;
