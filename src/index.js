import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import shuffle from "shuffle-array";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import { start } from "./Confetti";

function Confetti() {
  useEffect(() => {
    start();
  });
  return <canvas id="canvas" />;
}

function Tile({ children, onToggle, isSet }) {
  return (
    <div onClick={onToggle} className={`tile ${isSet ? "tile--set" : ""}`}>
      {children}
    </div>
  );
}

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const numbers = [1, 16, 31, 46, 61]
  .map((num) => {
    return shuffle(
      getRandom(
        Array.from({ length: 15 }, (_, i) => i + num),
        5
      )
    );
  })
  .flat();

function App() {
  const [state, setState] = useState({ checked: {} });
  const isWon = (checked) => {
    const range = [0, 1, 2, 3, 4];
    return (
      undefined !==
        range.find((row) =>
          range.every((column) => checked[row * 5 + column])
        ) ||
      undefined !==
        range.find((column) =>
          range.every((row) => checked[row * 5 + column])
        ) ||
      range.every((index) => checked[index * 5 + index]) ||
      range.every((index) => checked[index * 5 + 4 - index])
    );
  };

  const toggle = (id) =>
    setState((state) => {
      const checked = { ...state.checked, [id]: !state.checked[id] };
      const won = isWon(checked);
      return {
        ...state,
        checked,
        won
      };
    });

  return (
    <div className="App">
      <div className="letter-wrapper">
        {["B", "I", "N", "G", "O"].map((letter, i) => (
          <h1 key={i} className="letter">
            {letter}
          </h1>
        ))}
      </div>
      <div className="wrapper">
        {numbers.map((num, i) => (
          <Tile key={num} isSet={!!state.checked[i]} onToggle={() => toggle(i)}>
            {i === 12 ? "FREE" : num}
          </Tile>
        ))}
      </div>
      <button
        className="btn btn-danger"
        onClick={() => setState({ checked: {} })}
      >
        Clear Board
      </button>
      {state.won ? <Confetti /> : null}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
