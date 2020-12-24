import React, { useContext } from "react";
import "../Css/ft-input.css";
import { DataContext } from "../Context/AppContext";

export default function InputTest() {
    const ctx = useContext(DataContext);
    let blue = (e) => {
      ctx.Mode === "Light" ? (e.target.className = "Input input-light") : (e.target.className = "Input input-dark");
    };
    let focus = (e) => {
      if (e.target.className === "Input input-error") e.target.placeholder = "";
      ctx.Mode === "Light" ? (e.target.className = "Input input-active-light") : (e.target.className = "Input input-active-dark");
    };

    return (
      <input
        onBlur={blue}
        onFocus={focus}
        className={ctx.Mode === "Light" ? "Input input-light" : "Input input-dark"}
      />
    );
}
