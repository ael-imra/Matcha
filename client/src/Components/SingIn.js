import React, { useContext, useState } from "react";
import SingSocialMedia from "./SingSocialMedia";
import { DataContext } from "../Context/AppContext";
import Line from "./Line";
import Axios from "axios";
import Input from "./Input";
import { useWindowSize } from "./UseWindowSize";
import { useHistory } from "react-router-dom";
import { Validate } from "./Validate";
const SingIn = (props) => {
  const ctx = useContext(DataContext);
  const [DataInput, saveDataInput] = useState({ Email: "", Password: "" });
  const width = useWindowSize();
  let history = useHistory();
  let login = () => {
    if (Validate("Password", DataInput.Password) && Validate("Email", DataInput.Email)) {
      try {
        Axios.post("/Authentication/Login", {
          Password: DataInput.Password,
          Email: DataInput.Email,
        })
          .then(async (result) => {
            if (typeof result.data === "object") {
              localStorage.setItem("token", result.data.accessToken);
              if (result.data.data.IsActive === 1) {
                localStorage.setItem("userInfo", JSON.stringify({ FirstName: result.data.data.FirstName, Image: result.data.data.Images, UserName: result.data.data.UserName, LastName: result.data.data.LastName }));
                props.dataHome.ChangeIsLogin("Login");
              } else if (result.data.data.IsActive === 2) {
                localStorage.setItem("userInfo", JSON.stringify({ FirstName: result.data.data.FirstName, UserName: result.data.data.UserName, LastName: result.data.data.LastName }));
                history.push("/step");
                props.dataHome.ChangeIsLogin("Step");
              }
            } else {
              if (result.data === "account is not active")
                props.dataHome.ChangeErrorMessages({
                  error: "",
                  warning: "This account is deactivated please visit your email",
                  success: "",
                });
              else
                props.dataHome.ChangeErrorMessages({
                  error: "We couldn’t find an account matching the Email and password you entered.Please check your Email and password and try again.",
                  warning: "",
                  success: "",
                });
            }
          })
          .catch((error) => {
            props.dataHome.ChangeErrorMessages({
              error: "",
              warning: error,
              success: "",
            });
          });
      } catch (error) {}
    } else {
      props.dataHome.ChangeErrorMessages({
        error: "some Information is not valid",
        warning: "",
        success: "",
      });
    }
  };
  return (
    <div className='sing'>
      <p className='t1' style={{ color: ctx.cache.Mode === "Dark" ? "white" : "black" }}>
        Sing in To matcha
      </p>
      <SingSocialMedia titre='sing in with Google' type='sing in' ChangeIsLogin={props.dataHome.ChangeIsLogin} />
      <Line str={"Or"} color={ctx.cache.Mode} />
      <div className='form-sing'>
        <div className='form-group' style={{ width: "100%" }}>
          <p
            style={{
              color: ctx.cache.Mode === "Dark" ? "white" : "black",
            }}
          >
            Email
          </p>
          <Input
            DefaultValue={DataInput.Email}
            Onchange={(email) => {
              saveDataInput((oldValue) => ({ ...oldValue, Email: email }));
            }}
            Disabled='false'
            Type='email'
          />
        </div>
        <div className='form-group' style={{ width: "100%" }}>
          <p
            style={{
              color: ctx.cache.Mode === "Dark" ? "white" : "black",
            }}
          >
            Password
          </p>
          <Input
            DefaultValue={DataInput.Password}
            Onchange={(password) => {
              saveDataInput((oldValue) => ({ ...oldValue, Password: password }));
            }}
            Disabled='false'
            Type='password'
            OnEnter={login}
          />
        </div>
        <div
          style={{
            width: "100%",
            height: "30px",
            position: "relative",
          }}
        >
          <p
            style={{
              position: "absolute",
              right: "15px",
              cursor: "pointer",
              top: "5px",
              color: ctx.cache.Mode === "Dark" ? "white" : "black",
            }}
            onClick={() => {
              props.dataHome.ChangeHome(4);
            }}
            className='t2'
          >
            forgot password?
          </p>
        </div>
        <button
          onClick={login}
          className='ft_btn'
          style={{
            paddingLeft: "25px",
            paddingRight: "25px",
            marginTop: width <= 885 ? "35px" : "20px",
            backgroundColor: "#03a9f1",
          }}
        >
          login
        </button>
        <p
          style={{
            color: ctx.cache.Mode === "Dark" ? "white" : "black",
          }}
        >
          Already a member?
          <span
            onClick={() => {
              props.dataHome.ChangeHome(2);
            }}
          >
            Sing in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SingIn;
