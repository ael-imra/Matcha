import React from "react";
import "../Css/inputDate.css";
import { useWindowSize } from "./UseWindowSize";

const Step1 = (props) => {
  const width = useWindowSize();

  return (
    <>
      <p
        className='t3'
        style={{
          marginBottom: "37px",
          marginTop: "0px",
          color: props.Mode === "Dark" ? "white" : "black",
          fontSize: width <= 885 ? "18px" : "28px",
        }}
      >
        what's your date of birth ?
      </p>
      <input
        type='date'
        className='dateBirthday'
        onChange={(e) => {
          let DataStep1 = props.InfoStep;
          DataStep1.step1 = e.target.value;
          props.ChangeInfoStep({ ...DataStep1 });
        }}
        defaultValue={props.InfoStep.step1 !== "" ? props.InfoStep.step1 : "2015-07-25"}
      />
    </>
  );
};

export default Step1;
