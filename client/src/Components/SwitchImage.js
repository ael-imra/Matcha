import React, { useContext } from 'react'
import { DataContext } from '../Context/AppContext'
import step1Light from '../Images/Step1Light.gif'
import step3Light from '../Images/Step3Light.gif'
import step5Light from '../Images/Step5Light.gif'
import step6Light from '../Images/Step6Light.gif'
import step6Dark from '../Images/Step6Dark.gif'
import step1Dark from '../Images/Step1Dark.gif'
import step3Dark from '../Images/Step3Dark.gif'
import step5Dark from '../Images/Step5Dark.gif'
import finch from '../Images/finish.svg'

const SwitchImage = (props) => {
  const ctx = useContext(DataContext)
  let GetImage = () => {
    if (props.NrStep === 1) return ctx.Mode !== 'Dark' ? step1Light : step1Dark
    else if (props.NrStep === 2)
      return ctx.Mode !== 'Dark' ? step5Light : step5Dark
    else if (props.NrStep === 3)
      return ctx.Mode !== 'Dark' ? step3Light : step3Dark
    else if (props.NrStep === 4)
      return ctx.Mode !== 'Dark' ? step6Light : step6Dark
    else if (props.NrStep === 5) return finch
  }
  console.log()

  return <img src={GetImage()} alt="..." />
}

export default SwitchImage
