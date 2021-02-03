import React, { useState, useContext } from "react";
import { DataContext } from "../Context/AppContext";
import "../Css/step.css";
import SwitchStep from "./SwitchStep";
import SwitchImage from "./SwitchImage";
import Button from "@material-ui/core/Button";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getAge, isValidDate } from "./Validate";

let Steps = (props) => {
  if (props.index !== 4)
    return (
      <>
        <div
          className='Circle'
          style={{
            backgroundColor: props.index <= props.NrStep ? "#03a9f1" : "var(--background-Input)",
            color: props.index <= props.NrStep ? "#dee5fc" : "var(--background-Input-color)",
          }}
        >
          {props.index}
        </div>
        <div
          className='LineStep'
          style={{
            backgroundColor: props.index <= props.NrStep - 1 ? "#03a9f1" : "var(--background-Input)",
            color: props.index <= props.NrStep ? "#dee5fc" : "var(--background-Input-color)",
          }}
        ></div>
      </>
    );
  else
    return (
      <div
        className='Circle'
        style={{
          backgroundColor: props.index <= props.NrStep ? "#03a9f1" : "var(--background-Input)",
          color: props.index <= props.NrStep ? "#dee5fc" : "var(--background-Input-color)",
        }}
      >
        4
      </div>
    );
};

const Step = (props) => {
  const ctx = useContext(DataContext);
  const [NbrStep, changeNrbStep] = useState(1);
  const [checkStep, changeCheckStep] = useState("");
  let history = useHistory();
  const [infoStep, changeInfoStep] = useState({
    step1: "",
    step2: { country: null, latitude: "", longitude: "" },
    step3: { youGender: "", genderYouAreLooking: [""] },
    step4: { DescribeYourself: "", yourInterest: [] },
    step5: [],
  });
  const steps = [1, 2, 3, 4];
  let completeInsertUsers = () => {
    changeCheckStep(1);
    try {
      Axios.post(`/Authentication/CompleteInsert`, {
        ...infoStep,
      })
        .then((result) => {
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              ...userInfo,
              Image: JSON.parse(result.data.Images)[0],
            })
          );
          props.dataHome.ChangeIsLogin("Login");
          history.push(`/`);
        })
        .catch((error) => {});
    } catch (error) {}
  };
  React.useEffect(() => {
    function success(pos) {
      let DataStep = infoStep;
      DataStep.step2.country = null;
      DataStep.step2.latitude = pos.coords.latitude;
      DataStep.step2.longitude = pos.coords.longitude;
      changeInfoStep({ ...DataStep });
    }
    function error(err) {}
    navigator.geolocation.getCurrentPosition(success, error);
    // eslint-disable-next-line
  }, []);
  React.useEffect(() => {
    let unmount = false;
    Axios.defaults.headers.common["Authorization"] = `token ${localStorage.getItem("token")}`;
    try {
      Axios.get("/users")
        .then((result) => {
          if (!unmount && result.data !== 2) history.push("/");
          if (!unmount) changeCheckStep(result.data);
        })
        .catch();
    } catch (error) {}
    return () => {
      unmount = true;
    };
    //eslint-disable-next-line
  }, []);
  if (checkStep === 2)
    return (
      <div className='Step'>
        <div className='Info-step'>
          <p className='t3' style={{ color: ctx.Mode === "Dark" ? "white" : "black" }}>
            {`Steps ${NbrStep}`}
          </p>
          <div>
            <SwitchStep NrStep={NbrStep} Mode={ctx.Mode} InfoStep={infoStep} ChangeInfoStep={changeInfoStep} />
          </div>
          <div>
            <Button
              variant='outlined'
              size='large'
              color='primary'
              onClick={() => {
                if (NbrStep - 1 !== 0) changeNrbStep(NbrStep - 1);
              }}
              style={{
                fontWeight: "900",
                borderWidth: "1.2px",
                borderRadius: "10px",
                borderColor: "#03a9f1",
                color: "#03a9f1",
              }}
            >
              Back
            </Button>
            <Button
              variant='contained'
              size='large'
              color='primary'
              onClick={() => {
                if (NbrStep === 1) {
                  if (infoStep.step1 && isValidDate(infoStep.step1) && getAge(infoStep.step1) >= 18) changeNrbStep(NbrStep + 1);
                  else
                    props.dataHome.ChangeErrorMessages({
                      error: "Error age must be greater than 18",
                      warning: "",
                      success: "",
                    });
                }
                if (NbrStep === 2)
                  if (infoStep.step4.DescribeYourself !== "" && infoStep.step4.yourInterest !== 0 && infoStep.step4.yourInterest.length <= 5 && infoStep.step4.yourInterest.length !== 0 && infoStep.step4.DescribeYourself.length <= 100) changeNrbStep(NbrStep + 1);
                  else
                    props.dataHome.ChangeErrorMessages({
                      error: "Error empty same Information",
                      warning: "",
                      success: "",
                    });

                if (NbrStep === 3) {
                  if (
                    (infoStep.step3.youGender === "Male" || infoStep.step3.youGender === "Female") &&
                    (infoStep.step3.genderYouAreLooking.toString().replace(",", " ").trim() === "Male" ||
                      infoStep.step3.genderYouAreLooking.toString().replace(",", " ").trim() === "Female" ||
                      infoStep.step3.genderYouAreLooking.toString().replace(",", " ").trim() === "Female Male" ||
                      infoStep.step3.genderYouAreLooking.toString().replace(",", " ").trim() === "Male Female")
                  )
                    changeNrbStep(NbrStep + 1);
                  else
                    props.dataHome.ChangeErrorMessages({
                      error: "Error empty button",
                      warning: "",
                      success: "",
                    });
                }
                if (NbrStep === 4)
                  if (infoStep.step5.length === 0 || (infoStep.step5.every((image) => image.default === 0 || image.default === 1) && infoStep.step5.findIndex((x) => x.default === 1) !== -1)) completeInsertUsers();
                  else
                    props.dataHome.ChangeErrorMessages({
                      error: "Error in images",
                      warning: "",
                      success: "",
                    });
              }}
              style={{
                fontWeight: "900",
                borderRadius: "10px",
                backgroundColor: "#03a9f1",
              }}
            >
              {NbrStep < 4 ? "Next" : "Finish"}
            </Button>
          </div>
        </div>
        <div className='Step-count'>
          {steps.map((step) => (
            <Steps key={step} index={step} NrStep={NbrStep} />
          ))}
        </div>
        <SwitchImage NrStep={NbrStep} />
      </div>
    );
  else return <CircularProgress color='secondary' />;
};

export default Step;
