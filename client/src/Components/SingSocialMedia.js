import React, { useContext, useState } from "react";
import google from "../Images/google.svg";
import "../Css/singSocialMedia.css";
import { DataContext } from "../Context/AppContext";
import Input from "./Input";
import { ModeStyle } from "../Data/ModeStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Axios from "axios";
import { Validate } from "./Validate";
import GoogleLogin from "react-google-login";
import { useHistory } from "react-router-dom";

const SingSocialMedia = (props) => {
  const ctx = useContext(DataContext);
  const [showFormPassword, changeShowFormPassword] = useState(false);
  const [user, changeUser] = useState({
    IdToken: "",
    LastName: "",
    FirstName: "",
    Password: "",
  });
  let history = useHistory();
  const responseGoogle = (response) => {
    if (!response.error)
      try {
        if (props.type === "sing in") {
          if (Validate("Email", response.profileObj.email)) {
            try {
              Axios.post("/Authentication/LoginWithGoogle", {
                IdToken: response.tokenId,
              })
                .then((result) => {
                  if (typeof result.data === "object") {
                    localStorage.setItem("token", result.data.accessToken);
                    if (result.data.data.IsActive === 1) {
                      localStorage.setItem("userInfo", JSON.stringify({ FirstName: result.data.data.FirstName, Image: result.data.data.Images, UserName: result.data.data.UserName, LastName: result.data.data.LastName }));
                      props.ChangeIsLogin("Login");
                    } else if (result.data.data.IsActive === 2) {
                      localStorage.setItem("userInfo", JSON.stringify({ FirstName: result.data.data.FirstName, UserName: result.data.data.UserName, LastName: result.data.data.LastName }));
                      history.push("/step");
                      props.ChangeIsLogin("Step");
                    }
                  } else {
                    if (result.data === "account is not active") props.ChangeErrorMessages({ error: "", warning: "This Account is deactivated please visit your email", success: "" });
                    else {
                      props.ChangeErrorMessages({ error: "oops ... email not found", warning: "", success: "" });
                    }
                  }
                })
                .catch((error) => {});
            } catch (error) {}
          }
        } else {
          changeUser({
            UserName: response.profileObj.familyName.replace(" ", "").substring(0, 6) + response.uc.expires_at.toString().substring(response.uc.expires_at.toString().length - 4, response.uc.expires_at.toString().length),
            LastName: response.profileObj.familyName,
            FirstName: response.profileObj.givenName,
            Password: "",
            Email: response.profileObj.email,
          });
          changeShowFormPassword(true);
        }
      } catch (error) {}
  };
  const insert = () => {
    try {
      Axios.post("/Authentication/Insert", {
        UserName: user.UserName,
        LastName: user.LastName,
        FirstName: user.FirstName,
        Password: user.Password,
        Email: user.Email,
      })
        .then((result) => {
          if (result.data === "successful") props.ChangeHome(5);
        })
        .catch(() => {});
    } catch (error) {}
  };
  return (
    <div className='sing-social-media'>
      <div className='sing-gmail'>
        <img src={google} alt='...' />
        <p>{`${props.type === "sing in" ? "sing in with Google" : "sing up with Google"}`}</p>
        <GoogleLogin clientId='652872186498-sdfbthmnqp8tqnlnpmu3rsiv2v8rb8s5.apps.googleusercontent.com' buttonText='' onSuccess={responseGoogle} onFailure={responseGoogle} cookiePolicy={"single_host_origin"} />
      </div>
      <Dialog
        open={showFormPassword}
        onClose={() => {
          changeShowFormPassword(false);
        }}
        style={ModeStyle[ctx.cache.Mode].Dashboard}
      >
        <DialogTitle id='form-dialog-title'>Create password</DialogTitle>
        <DialogContent>
          <DialogContentText>create a password at least 8 characters with uppercase letters and numbers and numbers.</DialogContentText>
          <Input
            DefaultValue={user.Password}
            Onchange={(password) => {
              changeUser((oldValue) => ({ ...oldValue, Password: password }));
            }}
            Type='password'
            PlaceHolder='create Password'
            Style={{ marginBottom: "10px" }}
            Disabled='false'
          />
        </DialogContent>
        <DialogActions>
          <button
            className='ft_btn'
            style={{
              backgroundColor: "rgb(49, 143, 181)",
              marginBottom: "10px",
              marginRight: "15px",
            }}
            onClick={async () => {
              let errorInput = [];
              if (Validate("Email", user.Email)) {
                let emailIsReadyTake = await Axios.get(`Users/EmailIsReadyTake/${user.Email}`);
                if (!emailIsReadyTake.data) errorInput.push("Email is Ready take");
              } else errorInput.push("Email is not valid or empty");
              if (Validate("Username", user.UserName)) {
                let userNameIsReadyTake = await Axios.get(`Users/UserNameIsReadyTake/${user.UserName}`);
                if (!userNameIsReadyTake.data) errorInput.push("UserName is Ready take");
              } else errorInput.push("Username is not valid or empty");
              if (!Validate("Password", user.Password)) errorInput.push("Password is not valid");
              if (!Validate("Name", user.FirstName)) errorInput.push("FirstName is not valid");
              if (!Validate("Name", user.LastName)) errorInput.push("LastName is not valid");
              if (errorInput.length === 0) insert();
              else {
                props.ChangeErrorMessages({
                  warning: "",
                  error: await errorInput.map((element) => `* ${element}\n`),
                  success: "",
                });
              }
              changeShowFormPassword(false);
            }}
          >
            finish sing up
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SingSocialMedia;
