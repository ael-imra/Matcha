import React, { useContext } from 'react';
import { useWindowSize } from './UseWindowSize';
import Axios from 'axios';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Empty from '../Images/empty.svg';
import { checkImages } from './Validate';
import ReportIcon from '@material-ui/icons/Report';
import BlockIcon from '@material-ui/icons/Block';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useHistory } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ImageUser from './ImageUser';
import Skeleton from '@material-ui/lab/Skeleton';
import { DataContext } from '../Context/AppContext';

export default function ImageAndInfo(props) {
  const ctx = useContext(DataContext)
  let history = useHistory();
  const width = useWindowSize();
  const [ifUpload, changeIfUpload] = React.useState(0);
  const getImage = (e) => {
    if (ifUpload === 0) {
      if (props.InfoUser.Images.length < 5) {
        changeIfUpload(1);
        props.ChangeInfoUser({ ...props.InfoUser, Images: [...props.InfoUser.Images, 'XXX'] });
        let Images = props.InfoUser.Images;
        try {
          let reader = new FileReader();
          reader.onload = async function () {
            let image = reader.result;
            if (await checkImages([image])) {
              try {
                Axios.post('/Profile/AddImage', { image: image }).then((result) => {
                  changeIfUpload(0);
                  Images[props.InfoUser.Images.length] = image;
                  props.ChangeInfoUser({ ...props.InfoUser, Images: [...Images] });
                  if (Images.length === 1) {
                    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    props.changeUser((oldValue) => ({ ...oldValue, Image: result.data }));
                    localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, Image: result.data }));
                  }
                });
              } catch (error) {}
            } else {
              changeIfUpload(0);
              props.ChangeInfoUser({ ...props.InfoUser, Images: [...Images] });
              props.ChangeError(['Image is not valid']);
              props.ChangeShowError(true);
            }
          };
          reader.readAsDataURL(e.target.files[0]);
        } catch (error) {}
      } else {
        changeIfUpload(0);
        props.ChangeError(['you uploaded more than 5 images']);
        props.ChangeShowError(true);
      }
    }
  };

  let BlockUser = (e) => {
    try {
      Axios.post(`/Profile/BlockUser/${props.userName}`, {}).then((result) => {
        ctx.ref.removeFriend(props.userName)
        ctx.ref.removeNotification(props.userName)
        history.push('/');
      });
    } catch (error) {}
  };
  let ReportUser = (e) => {
    try {
      Axios.post(`/Profile/ReportUser/${props.userName}`, {}).then((result) => {
        if (result.data === 'successful') props.changeUserNameAndEmail({ ...props.UserNameAndEmail, isNotReport: false });
      });
    } catch (error) {}
  };

  let deleteImageProfile = (e) => {
    try {
      Axios.post('/Profile/DeleteImage', { index: 0 }).then((result) => {
        let arrayImage = props.InfoUser.Images;
        arrayImage.splice(0, 1);
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        props.changeUser((oldValue) => ({ ...oldValue, Image: arrayImage[0] }));
        localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, Image: arrayImage[0] }));
        props.ChangeInfoUser({ ...props.InfoUser, Images: [...arrayImage] });
      });
    } catch (error) {}
  };
  const formUpdatePasswordShow = () => {
    props.ChangeShowUpdatePassword(true);
  };
  return (
    <div>
      <div className='slide-in-left'>
        <div className='ImageProfile'>
          {props.InfoUser.Images.length !== 0 ? (
            props.InfoUser.Images[0] !== 'XXX' ? (
              <>
                <img src={props.InfoUser.Images[0]} alt='...' style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                {props.UserNameAndEmail.isProfileOfYou ? (
                  <div className='deleteProfile'>
                    <IconButton color='primary' component='span' onClick={deleteImageProfile}>
                      <DeleteIcon style={{ color: 'var(--color-QuickActionsMenu)' }} />
                    </IconButton>
                  </div>
                ) : (
                  ''
                )}
              </>
            ) : (
              <Skeleton variant='circle' style={{ borderRadius: '50%', width: '100%', height: '100%' }}></Skeleton>
            )
          ) : (
            <div className='no-image-profile'>{props.UserNameAndEmail.userName.substring(0, 2)}</div>
          )}
        </div>
        <div>
          <p className='UseName'>{props.UserNameAndEmail.userName}</p>
          <p className='Email'>{props.UserNameAndEmail.email}</p>
          <div className='CountReviewFriend'>
            <div>
              <p>4.5</p>
              <p>32 reviews</p>
            </div>
            <div></div>
            <div>
              <p>120</p>
              <p>Friends</p>
            </div>
          </div>
          {props.UserNameAndEmail.isProfileOfYou ? (
            <button
              className='ft_btn'
              style={{
                marginTop: '30px',
                backgroundColor: 'var(--background-Nav)',
              }}
              onClick={formUpdatePasswordShow}>
              Update Password
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}>
              <Button
                variant='contained'
                color='secondary'
                startIcon={<BlockIcon />}
                onClick={BlockUser}
                style={{
                  marginTop: '30px',
                  fontWeight: '600',
                  fontSize: '13px',
                  paddingBottom: '5px',
                  paddingTop: '5px',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  backgroundColor: 'var(--background-Nav)',
                }}>
                Block
              </Button>
              {props.UserNameAndEmail.isNotReport ? (
                <Button
                  variant='contained'
                  color='secondary'
                  onClick={ReportUser}
                  startIcon={<ReportIcon />}
                  style={{
                    marginTop: '30px',
                    fontWeight: '600',
                    fontSize: '13px',
                    paddingBottom: '5px',
                    paddingTop: '5px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    backgroundColor: 'var(--background-Nav)',
                  }}>
                  report
                </Button>
              ) : null}

              <Button
                variant='contained'
                color='secondary'
                startIcon={<FavoriteIcon />}
                style={{
                  marginTop: '30px',
                  fontWeight: '600',
                  fontSize: '13px',
                  paddingBottom: '5px',
                  paddingTop: '5px',
                  paddingLeft: '12px',
                  paddingRight: '12px',
                  backgroundColor: 'var(--background-Nav)',
                }}>
                Like
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className='slide-in-left'>
        {width > 630 && props.UserNameAndEmail.isProfileOfYou === true ? (
          <div className='addImage'>
            <p>Add Image</p>
            <input
              type='file'
              accept='image/*'
              onChange={getImage}
              onClick={(e) => {
                e.target.value = '';
              }}
            />
          </div>
        ) : (
          <>
            <hr style={{ border: 'none', height: '0.1px', width: '97%' }} />
            <p>Photos</p>
          </>
        )}
        <div className='Images'>
          {props.InfoUser.Images.length <= 1 ? (
            <div
              style={{
                display: 'flex',
                marginLeft: 'auto',
                marginRight: 'auto',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <img src={Empty} alt='...' style={{ width: '250px', marginBottom: '40px' }} />
              <p className='labelInfo' style={{ width: '137px' }}>
                Image Not Found
              </p>
            </div>
          ) : (
            props.InfoUser.Images.map((value, key) =>
              key !== 0 ? (
                value !== 'XXX' ? (
                  <ImageUser isProfileOfYou={props.UserNameAndEmail.isProfileOfYou} InfoUser={props.InfoUser} width={width} image={value} ChangeImage={props.ChangeImage} changeUser={props.changeUser} ChangeInfoUser={props.ChangeInfoUser} key={key} />
                ) : (
                  <div className='Image' key={key}>
                    <Skeleton variant='rect' width={220} height={320} style={{ borderRadius: '8px' }}></Skeleton>
                  </div>
                )
              ) : (
                ''
              )
            )
          )}
          {width <= 630 && props.UserNameAndEmail.isProfileOfYou === true ? (
            <div
              className='addImage Image'
              style={{
                height: '320px',
                paddingLeft: '0px',
                marginLeft: '10px',
              }}>
              <p>Add Image</p>
              <input
                type='file'
                accept='image/*'
                onChange={getImage}
                onClick={(e) => {
                  e.target.value = '';
                }}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
}
