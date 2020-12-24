import React from 'react'
import '../Css/ShowError.css'
import { DataContext } from '../Context/AppContext'
import { language } from '../Data/language/language'

const ShowError = (props) => {
  const ctx = React.useContext(DataContext)
  React.useEffect(() => {
    setTimeout(function () {
      props.DataError.ChangeStateError(1)
    }, 4000000)
  })
  return (
    <div className="Container-Error">
      <p style={{ marginLeft: '20px', marginRight: '20px' }}>
        {props.DataError.showError === 1
          ? language[ctx.Lang].AccountDeactivated
          : language[ctx.Lang].FailLogin}
      </p>
    </div>
  )
}

export default ShowError
