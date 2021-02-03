import React from 'react'
import '../Css/Profile.css'
import Snackbar from '@material-ui/core/Snackbar'
import { Alert } from '@material-ui/lab'
import Axios from 'axios'
import Dialog from '@material-ui/core/Dialog'
import { useParams } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import PersonalInfo from './PersonalInfo'
import searchNotFound from '../Images/searchNotFound.svg'
import ImageAndInfo from './ImageAndInfo'
import UpdatePassword from './UpdatePassword'

export default function Profile(props) {
  let { userName } = useParams()
  const [findError, changeError] = React.useState([])
  const [showError, changeShowError] = React.useState(false)
  const [userNameAndEmail, changeUserNameAndEmail] = React.useState({
    email: '',
    userName: '',
    isProfileOfYou: '',
  })
  const [showUpdatePassword, changeShowUpdatePassword] = React.useState(false)
  const [showImage, changeImage] = React.useState({ state: false, src: '' })
  const [infoUser, changeInfoUser] = React.useState({
    UserName: '',
    Email: '',
    FirstName: '',
    LastName: '',
    DataBirthday: '1996-06-17',
    City: '',
    Biography: '',
    Sexual: 'Male',
    Gender: 'Male',
    ListInterest: [],
    Images: '',
  })
  const formUpdatePasswordClose = () => {
    changeShowUpdatePassword(false)
  }
  const exitFullscreenImage = () => {
    changeImage({ state: false, src: '' })
  }
  const handleClose = () => {
    changeShowError(false)
    changeError('')
  }
  React.useEffect(() => {
    try {
      Axios.post(`/Profile/GetUser/${userName}`, {})
        .then(async (result) => {
          if (result.data !== 'User not found')
            changeInfoUser({
              ...result.data,
              Images: JSON.parse(result.data.Images),
              ListInterest: JSON.parse(result.data.ListInterest),
              DataBirthday: result.data.DataBirthday.split('T')[0],
              Sexual: result.data.Sexual === 'Female Male' ? 'Male Female' : result.data.Sexual,
            })
          let results = await Axios.post(`/Profile/CheckProfileOfYou/${userName}`, {})
          changeUserNameAndEmail({
            email: result.data.Email,
            userName: result.data.UserName,
            isProfileOfYou: result.data !== 'User not found' ? results.data.isProfileOfYou : 'User not found',
            isNotReport: results.data.isNotReport,
          })
        })
        .catch((error) => {})
    } catch (error) {}
    // eslint-disable-next-line
  }, [userName])
  return (
    <div className="profile">
      {userNameAndEmail.isProfileOfYou !== '' && userNameAndEmail.isProfileOfYou !== 'User not found' ? (
        <>
          <ImageAndInfo InfoUser={infoUser} ChangeInfoUser={changeInfoUser} ChangeImage={changeImage} ChangeShowUpdatePassword={changeShowUpdatePassword} UserNameAndEmail={userNameAndEmail} ChangeShowError={changeShowError} ChangeError={changeError} userName={userName} changeUserNameAndEmail={changeUserNameAndEmail} changeUser={props.changeUser} user={props.user} />
          <PersonalInfo InfoUser={infoUser} ChangeInfoUser={changeInfoUser} UserNameAndEmail={userNameAndEmail} ChangeError={changeError} ChangeShowError={changeShowError} changeUserNameAndEmail={changeUserNameAndEmail} changeUser={props.changeUser} />
          <Snackbar open={showError} autoHideDuration={5000} onClose={handleClose}>
            {findError.length > 0 ? (
              <Alert severity="error" icon={false}>
                {findError.map((error, key) => (
                  <p style={{ display: 'block', fontSize: '14px' }} key={key}>{`- ${error} !`}</p>
                ))}
              </Alert>
            ) : (
              <Alert severity="success" icon={false}>
                <p style={{ display: 'block', fontSize: '15px' }}>{`- success Update `}</p>
              </Alert>
            )}
          </Snackbar>
          <UpdatePassword showUpdatePassword={showUpdatePassword} formUpdatePasswordClose={formUpdatePasswordClose} ChangeError={changeError} ChangeShowError={changeShowError} />
          <Dialog open={showImage.state} onClose={exitFullscreenImage}>
            <img alt="..." src={showImage.src} style={{ width: '100%' }} />
          </Dialog>
        </>
      ) : userNameAndEmail.isProfileOfYou !== 'User not found' ? (
        <div style={{ height: 'auto' }}>
          <CircularProgress color="secondary" style={{ backgroundColor: 'transparent' }} />
        </div>
      ) : (
        <div style={{ width: '100%', height: 'auto' }}>
          <img src={searchNotFound} style={{ width: '70%', maxWidth: '600px' }} alt="..." />
          <p className="labelInfo" style={{ textAlign: 'center', fontSize: '20px' }}>
            Ops ... User Not found
          </p>
        </div>
      )}
    </div>
  )
}
