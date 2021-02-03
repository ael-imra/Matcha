import React from 'react'
import Textarea from './Textarea'
import data from '../Data/interests.json'
import { Select } from './Select'
const Step2 = (props) => {
  return (
    <>
      <Textarea InfoStep={props.InfoStep} ChangeInfoStep={props.ChangeInfoStep} />
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Select
          list={data.data}
          active={props.InfoStep.step4.yourInterest}
          change={(arr) =>
            props.ChangeInfoStep((oldValue) => ({
              ...oldValue,
              step4: { ...oldValue.step4, yourInterest: arr },
            }))
          }
        />
      </div>
    </>
  )
}
export default Step2
