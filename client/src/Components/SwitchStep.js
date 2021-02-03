import React from 'react'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import Step4 from './Step4'
const SwitchStep = (props) => {
  if (props.NrStep === 1) return <Step1 Mode={props.Mode} InfoStep={props.InfoStep} ChangeInfoStep={props.ChangeInfoStep} />
  else if (props.NrStep === 2) return <Step2 Mode={props.Mode} InfoStep={props.InfoStep} ChangeInfoStep={props.ChangeInfoStep} />
  else if (props.NrStep === 3) return <Step3 Mode={props.Mode} InfoStep={props.InfoStep} ChangeInfoStep={props.ChangeInfoStep} />
  else if (props.NrStep === 4) return <Step4 Mode={props.Mode} InfoStep={props.InfoStep} ChangeInfoStep={props.ChangeInfoStep} />
}

export default SwitchStep
