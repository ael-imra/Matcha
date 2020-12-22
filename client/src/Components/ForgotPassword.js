import React, { useRef, useState, useEffect, useContext } from "react";
import Input from "./Input";
import { useWindowSize } from "./UseWindowSize";
import { DataContext } from "../Context/AppContext";
import Axios from "axios";

const ForgotPassword = (props) => {
  const [findError, ChangeError] = useState([""]);
  const inputRef = useRef([]);
  const width = useWindowSize();
  const ctx = useContext(DataContext);
  inputRef.current = new Array(1);
  useEffect(() => {
    inputRef.current[0].focus();
  }, []);
  return (
    <div className="abs">
      <p style={{ color: ctx.Mode === "Dark" ? "white" : "black" }} className="t3">
        Forgat Password
      </p>
      <p className="t2" style={{ color: ctx.Mode === "Dark" ? "white" : "black" }}>
        enter your email address to reset your password
      </p>
      <Input type="email" name="Email" checkError={{ findError, ChangeError }} index={0} Ref={inputRef} />
      <button
        onClick={() => {
          let i = 0;
          findError.forEach((item, key) => {
            if (item !== true) {
              inputRef.current[0].value = "";
              inputRef.current[0].className = "Input input-error";
              inputRef.current[0].placeholder = findError[key];
              i = 1;
            }
          });
          if (i !== 1) {
            try {
              Axios.post("http://localhost:5000/user/ForgatPassword", {
                email: inputRef.current[0].value,
              })
                .then((result) => {
                  if (result.data === "email not found") {
                    ctx.ChangeErrorMessages({
                      error: "Oops! something is wrong with your email",
                      warning: "",
                      success: "",
                    });
                    inputRef.current[0].value = "";
                    inputRef.current[0].className = "Input input-error";
                    inputRef.current[0].placeholder = "Email not found";
                  } else {
                    ctx.ChangeErrorMessages({
                      error: "",
                      warning: "",
                      success: "Send email success please go to email to reset password",
                    });
                    props.dataHome.ChangeHome(1);
                  }
                })
                .catch((error) => {
                  ctx.ChangeErrorMessages({
                    error: "",
                    warning: "Error: Network Error",
                    success: "",
                  });
                });
            } catch (error) {
              console.log(error);
            }
          }
        }}
        className="ft_btn"
        style={{
          paddingLeft: "25px",
          paddingRight: "25px",
          marginTop: width <= 885 ? "35px" : "20px",
          backgroundColor: "#03a9f1",
        }}
      >
        Send
      </button>
    </div>
  );
};

export default ForgotPassword;
