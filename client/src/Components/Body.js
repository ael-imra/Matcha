import React, { useContext } from 'react'
import '../Css/body.css'
import ChatLogo from '../Images/online-world.svg'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { DataContext } from '../Context/AppContext'
import Home from './Home'
import { useWindowSize } from './UseWindowSize'
import Steps from './Steps'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import { BrowserRouter as Switch, Route } from 'react-router-dom'
import ResetPassword from './ResetPassword'
const Body = (props) => {
  const width = useWindowSize()
  const ctx = useContext(DataContext)
  const [showMessage, changeShowMessage] = React.useState(false)
  const handleClose = (event, reason) => {
    ctx.ChangeErrorMessages({
      error: '',
      warning: '',
      success: '',
    })
  }
  React.useEffect(() => {
    if (
      ctx.ErrorMessages.error !== '' ||
      ctx.ErrorMessages.warning !== '' ||
      ctx.ErrorMessages.success !== ''
    )
      changeShowMessage(true)
    else changeShowMessage(false)
  }, [
    ctx.ErrorMessages.error,
    ctx.ErrorMessages.warning,
    ctx.ErrorMessages.success,
  ])

  return (
    <div className="body">
      <Switch>
        <Route exact path="/">
          <>
            <TransitionGroup
              className="body-titre"
              style={{
                height:
                  props.dataHome.StateHome === 1 ||
                  props.dataHome.StateHome === 4
                    ? '360px'
                    : props.dataHome.StateHome === 5
                    ? '230px'
                    : props.dataHome.StateHome === 2
                    ? '562px'
                    : '487px',
                marginTop:
                  width <= 885
                    ? props.dataHome.StateHome === 1
                      ? '120px'
                      : '45px'
                    : '0px',
              }}
            >
              <CSSTransition
                key={props.dataHome.StateHome}
                timeout={800}
                classNames="alert"
                unmountOnExit
              >
                <Home dataHome={props.dataHome} />
              </CSSTransition>
            </TransitionGroup>
            <div className="body-img">
              <img src={ChatLogo} alt="..." />
            </div>
          </>
        </Route>
        <Route path="/Step/:token">
          <Steps dataHome={props.dataHome} />
        </Route>
        <Route path="/ForgatPassword/:token">
          <ResetPassword dataHome={props.dataHome} />
        </Route>
      </Switch>

      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        {ctx.ErrorMessages.error !== '' ? (
          <Alert severity="error">{ctx.ErrorMessages.error}</Alert>
        ) : ctx.ErrorMessages.warning !== '' ? (
          <Alert severity="warning">{ctx.ErrorMessages.warning}</Alert>
        ) : ctx.ErrorMessages.success !== '' ? (
          <Alert severity="success">{ctx.ErrorMessages.success}</Alert>
        ) : (
          <p></p>
        )}
      </Snackbar>
    </div>
  )
}

export default Body
