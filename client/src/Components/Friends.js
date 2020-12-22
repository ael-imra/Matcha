import React from "react";
import { IconAddMessage, IconCircle } from "./Icons";
import { data } from "../API/data";
import { ImageLoader } from "./ImageLoader";
import "../Css/Friends.css";
function calculatorLogTime(date) {
  const cmp = Date.now() - Date.parse(date);
  const days = parseInt(cmp / (864 * 100000));
  const hours = parseInt(cmp / (36 * 100000));
  const minutes = parseInt(cmp / (6 * 10000));
  const seconds = parseInt(cmp / 1000);
  if (days > 0) return `${days} day${days !== 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (seconds > 0) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
}
function Friend(props) {
  return (
    <div className="Friend">
      <div className="FriendImage">
        <ImageLoader
          className="FriendImageImage"
          src={props.image}
          alt={props.name}
        />
      </div>
      <div className="FriendInfo">
        <span>{props.name}</span>
        <span style={props.active ? { color: "#44db44" } : {}}>
          {props.active ? (
            <>
              <IconCircle width={8} fill="#44db44" /> Active now
            </>
          ) : (
            calculatorLogTime(props.date)
          )}
        </span>
      </div>
      <div className="FriendActions">
        <div className="FriendProfile">
          <button onClick={() => props.OpenChatBox(props.id)}>
            <IconAddMessage width={16} height={16} fill="#2d2d2d" />
          </button>
        </div>
      </div>
    </div>
  );
}
function Friends(props) {
  const dataFilter = data.filter(
    (obj) => obj.name.toLowerCase().indexOf(props.search.toLowerCase()) > -1
  );
  return (
    <div className="Friends" style={props.style ? props.style : {}}>
      {dataFilter.map((obj) => (
        <Friend
          id={obj.id}
          key={obj.id}
          image="http://localhost:5000/image/out.jpeg"
          name={obj.name}
          active={obj.active}
          date={obj.date}
          OpenChatBox={props.OpenChatBox}
        />
      ))}
    </div>
  );
}
export { Friends, calculatorLogTime };
