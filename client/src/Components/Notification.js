import React from "react";
import { data } from "../API/Notification";
import { ConvertDate } from "./Messages";
import { ImageLoader } from "./ImageLoader";
import "../Css/Notification.css";

function Notice(props) {
  const colors = {
    New: "#33daad",
    Like: "#ff9790",
    User: "#708dfd",
  };
  const Component = props.action;
  return (
    <div className="Notice" onClick={props.onClick}>
      <ImageLoader className="NoticeImage" src={props.img} alt={props.name} />
      <div className="NoticeColumn">
        <div className="NoticeRow">
          <div className="NoticeUserName">{props.name}</div>
          <div className="NoticeDate">{ConvertDate(props.date)}</div>
        </div>
        <div className="NoticeRow" style={{ margin: "6px 0" }}>
          <div
            className="NoticeContent"
            style={{ color: colors[props.actionName] }}
          >
            {props.content}
          </div>
          <div style={{ width: "10%" }}>
            <Component width={20} height={20} fill={colors[props.actionName]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Notification(props) {
  return (
    <div className="Notification" style={props.style ? props.style : {}}>
      {data.map((obj, index) => (
        <Notice
          key={index}
          {...obj}
          img="http://localhost:5000/image/out.jpeg"
        />
      ))}
    </div>
  );
}
export { Notification };
