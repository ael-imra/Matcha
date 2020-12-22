import React from "react";
import { IconArrowDown, IconArrowUp } from "./Icons";
import "../Css/Switch.css";
function Toggle(props) {
  const style = {
    transition: "all 0.5s",
    transform: props.list.indexOf(props.active)
      ? "translateX(29px)"
      : "translateX(5px)",
  };
  return (
    <div
      className="Toggle"
      style={props.style ? props.style : {}}
      onClick={() => props.switch()}
    >
      <div
        className="ToggleSwitcher"
        style={{
          backgroundColor: props.colors[props.list.indexOf(props.active)],
          ...style,
        }}
      ></div>
    </div>
  );
}
function Switch(props) {
  const translate = {
    Friends: 0,
    Messages: -28,
    Notification: -58,
  };
  function SwitchDown() {
    if (props.active === "Friends" || props.active === "Messages") {
      props.switch((oldValue) => {
        if (oldValue === "Friends") return "Messages";
        else if (oldValue === "Messages") return "Notification";
        return oldValue;
      });
    }
  }
  function SwitchUp() {
    if (props.active === "Notification" || props.active === "Messages") {
      props.switch((oldValue) => {
        if (oldValue === "Messages") return "Friends";
        else if (oldValue === "Notification") return "Messages";
        return oldValue;
      });
    }
  }
  return (
    <div className="Switch" style={props.style ? props.style : {}}>
      <div
        className="SwitchChooses"
        style={{ transform: `translateY(${translate[props.active]}px)` }}
      >
        {props.list.map((item, index) => (
          <div className="SwitchItem" key={index}>
            {item}
          </div>
        ))}
      </div>
      <div className="SwitchButtons">
        <IconArrowUp
          width={30}
          height={30}
          fill={props.style.color}
          onClick={SwitchUp}
          style={translate[props.active] === 0 ? { opacity: 0.3 } : {}}
        />
        <IconArrowDown
          width={30}
          height={30}
          fill={props.style.color}
          onClick={SwitchDown}
          style={
            translate[props.active] <= -1 * (props.list.length - 1) * 28
              ? { opacity: 0.3 }
              : {}
          }
        />
      </div>
    </div>
  );
}
export { Switch, Toggle };
