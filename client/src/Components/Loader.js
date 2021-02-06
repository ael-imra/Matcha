import React, { useEffect } from 'react'
// import { IconSpinner } from "./Icons";
import '../Css/Loader.css'

function Countdown(props) {
  useEffect(() => {
    let unmount = false
    const IntervalID = setInterval(() => {
      if (!unmount)
      {
        props.changeCounterInfo((oldValue) => ({
          ...oldValue,
          intervalID: IntervalID,
        }))
        props.changeCounterInfo((oldValue) => {
          if (oldValue.counter < oldValue.counterNumber) return { ...oldValue, counter: oldValue.counter + 1 }
          else {
            clearInterval(oldValue.intervalID)
            props.func()
            return { ...oldValue, hide: false, counter: 0 }
          }
        })
      }
    }, 1000) 
    return (()=>unmount = true)// eslint-disable-next-line
  }, [])
  return (
    <div className="Countdown" style={props.style ? props.style : {}}>
      {props.counterInfo.counterNumber - props.counterInfo.counter}
    </div>
  )
}

function Loader(props) {
  return (
    <div className="Loader" style={props.style ? props.style : {}}>
      <div className="LoaderSpinner"></div>
    </div>
  )
}

export { Loader, Countdown }
