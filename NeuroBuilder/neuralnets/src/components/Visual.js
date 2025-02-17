import Plot from "react-plotly.js";
import { useNN } from "../context/NNProvider";
import { useVisualize } from "../context/VisualProvider";
import { useEffect, useState } from "react";
function Visual() {
  const { data, epochs, layer } = useNN();
  const { epo, setEpo, lay, setLay, type, setType } = useVisualize();
  const [mini, setMini] = useState(0);
  const [maxi, setMaxi] = useState(0);
  function epoArray(epochs) {
    let arr = [];
    for (let i = 0; i < epochs; i++) {
      arr.push(i + 1);
    }
    return arr;
  }

  useEffect(
    function () {
      function min(data) {
        let min = data[0][0];
        for (let i = 1; i < data.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[i][j] < min) {
              min = data[i][j];
            }
          }
        }
        setMini(min);
      }
      function max(data) {
        let max = data[0][0];
        for (let i = 1; i < data.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (data[i][j] > max) {
              max = data[i][j];
            }
          }
        }
        setMaxi(max);
      }
      min(data[type][epo + 1][lay + 1]);
      max(data[type][epo + 1][lay + 1]);
    },
    [mini, maxi, data, type, epo, lay]
  );

  return (
    <div>
      <select onChange={(e) => setType(e.target.value)}>
        <option value="weights">weights</option>
        <option value="weightGrad">weightGrad</option>
        <option value="biases">biases</option>
        <option value="biasGrad">biasGrad</option>
      </select>
      LayerCounter
      <input
        value={lay}
        onChange={(e) => {
          console.log(lay);
          if (lay >= layer) return lay;
          setLay(Number(e.target.value));
        }}
      />
      <button
        onClick={() => {
          if (epo >= epochs - 2) return epo;
          setEpo((epo) => Number(epo + 1));
          console.log(epo);
        }}
      >
        Next
      </button>
      <button
        onClick={() => {
          setEpo((epo) => {
            if (epo < 1) return epo;
            return Number(epo - 1);
          });
          console.log(epo);
        }}
      >
        Prev
      </button>
      <Plot
        data={[
          {
            x: epoArray(epochs),
            y: data.train_losses,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "green" },
          },
        ]}
        layout={{ title: "Basic Line Chart" }}
      />
      <Plot
        data={[
          {
            z: data[type][epo + 1][lay + 1],
            type: "contour",
            colorscale: "heatmap", // Color theme
            contours: {
              start: mini, // Minimum contour value
              end: maxi, // Maximum contour value
              size: 0.1, // Step size between contours
            },
          },
        ]}
        layout={{
          title: "Contour Plot Example",
          xaxis: { title: "X-Axis" },
          yaxis: { title: "Y-Axis" },
        }}
      />
    </div>
  );
}

export default Visual;
