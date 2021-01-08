import React, { useContext } from 'react';
import '../Css/Profile.css';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab';
import InputTest from './InputTest';
import { DataContext } from '../Context/AppContext';
import { Validate } from './Validate';
import { getAge, isValidDate } from './ValidateDate';
import Axios from 'axios';
import data from '../Data/interests.json';
import { Select } from './Select';
import { useWindowSize } from './UseWindowSize';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function Profile() {
  const width = useWindowSize();
  const ctx = useContext(DataContext);
  const [findError, ChangeError] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [showUpdatePassword, changeShowUpdatePassword] = React.useState(false);
  const [infoUser, changeInfoUser] = React.useState({
    UserName: ctx.userInfo.UserName,
    Email: ctx.userInfo.Email,
    FirstName: ctx.userInfo.FirstName,
    LastName: ctx.userInfo.LastName,
    DateBirthday: ctx.userInfo.DataBirthday ? ctx.userInfo.DataBirthday.split('T')[0] : '',
    City: ctx.userInfo.City,
    Biography: ctx.userInfo.Biography,
    Sexual: ctx.userInfo.Sexual ? ctx.userInfo.Sexual : 'Male',
    Gender: ctx.userInfo.Gender ? ctx.userInfo.Gender : 'Male',
    ListInterest: ctx.userInfo.ListInterest ? JSON.parse(ctx.userInfo.ListInterest) : [],
    Images: JSON.parse(ctx.userInfo.Images),
  });
  const [password, changePassword] = React.useState({
    CurrentPassword: '',
    NewPassword: '',
    ConfirmPassword: '',
  });
  const Sexual = [
    {
      value: ' Woman',
      label: 'Woman',
    },
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Male Woman',
      label: 'Male And Female',
    },
  ];
  const Gender = [
    {
      value: ' Woman',
      label: 'Woman',
    },
    {
      value: 'Male',
      label: 'Male',
    },
  ];
  const formUpdatePasswordShow = () => {
    changeShowUpdatePassword(true);
  };

  const formUpdatePasswordClose = () => {
    changeShowUpdatePassword(false);
  };
  let changePasswordProfile = () => {
    try {
      Axios.post('http://localhost:5000/editProfile/changePasswordProfile', password, {
        headers: {
          authorization: `token ${localStorage.getItem('token')}`,
        },
      }).then((result) => {
        console.log(result.data);
        formUpdatePasswordClose();
      });
    } catch (error) {}
  };
  let makeImageDefault = (e) => {
    let arrayPicture = Array.from(document.querySelectorAll('.Image'));
    let index = arrayPicture.indexOf(e.target.closest('.Image')) + 1;
    try {
      Axios.post(
        'http://localhost:5000/editProfile/makeImageDefault',
        { index: index },
        {
          headers: {
            authorization: `token ${localStorage.getItem('token')}`,
          },
        }
      ).then((result) => {
        const arrayImage = infoUser.Images;
        [arrayImage[0], arrayImage[index]] = [arrayImage[index], arrayImage[0]];
        changeInfoUser({ ...infoUser, Images: [...arrayImage] });
      });
    } catch (error) {}
  };
  let deleteImage = (e) => {
    let arrayPicture = Array.from(document.querySelectorAll('.Image'));
    try {
      Axios.post(
        'http://localhost:5000/editProfile/deleteImage',
        { index: arrayPicture.indexOf(e.target.closest('.Image')) + 1 },
        {
          headers: {
            authorization: `token ${localStorage.getItem('token')}`,
          },
        }
      ).then((result) => {
        let arrayImage = infoUser.Images;
        arrayImage.splice(result.data.index, 1);
        changeInfoUser({ ...infoUser, Images: [...arrayImage] });
      });
    } catch (error) {}
  };
  const getImage = (e) => {
    let reader = new FileReader();
    reader.onload = function () {
      try {
        Axios.post(
          'http://localhost:5000/editProfile/addImage',
          { image: reader.result },
          {
            headers: {
              authorization: `token ${localStorage.getItem('token')}`,
            },
          }
        ).then((result) => {
          changeInfoUser({ ...infoUser, Images: result.data });
          console.log(result.data);
        });
      } catch (error) {}
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const UpdateInfoUser = () => {
    try {
      Axios.post('http://localhost:5000/editProfile/editInfoUser', infoUser, {
        headers: {
          authorization: `token ${localStorage.getItem('token')}`,
        },
      }).then((result) => {
        localStorage.setItem('token', result.data);
        ctx.changeUserInfo({ ...infoUser, ListInterest: JSON.stringify(infoUser.ListInterest), Images: ctx.userInfo.Images });
      });
    } catch (error) {}
  };
  const handleClose = () => {
    setOpen(false);
  };
  const ChangeSexual = (e) => {
    const val = e.target.value;
    changeInfoUser((oldValue) => {
      return { ...oldValue, Sexual: val };
    });
  };
  const ChangeGender = (e) => {
    const val = e.target.value;
    changeInfoUser((oldValue) => {
      return { ...oldValue, Gender: val };
    });
  };
  const ChangeDateBirthday = (e) => {
    const val = e.target.value;
    changeInfoUser((oldValue) => {
      return { ...oldValue, DateBirthday: val };
    });
  };
  let validationEdit = () => {
    let inputsInfo = Array.from(document.querySelectorAll('.profile input'));
    let inputsError = [];
    inputsInfo.forEach((inputInfo, key) => {
      if (key === 1) {
        try {
          Axios.get(`http://localhost:5000/user/verifierUserNameIsReadyTake/${inputInfo.value}`, {
            headers: {
              authorization: `token ${localStorage.getItem('token')}`,
            },
          }).then((result) => {
            if (result.data !== true) inputsError.push('User Name is already taken or something else');
          });
        } catch (error) {}
      }
      if (key === 2) {
        try {
          Axios.get(`http://localhost:5000/user/verifierEmailIsReadyTake/${inputInfo.value}`, {
            headers: {
              authorization: `token ${localStorage.getItem('token')}`,
            },
          }).then((result) => {
            if (result.data !== true) inputsError.push('email is already taken or something else');
          });
        } catch (error) {}
      }
      if (key === 3) {
        if (Validate('Name', inputInfo.value)) {
          changeInfoUser((oldValue) => {
            return { ...oldValue, FirstName: inputInfo.value };
          });
        } else {
          inputsError.push('first Name is not Valid, must be greater than 5 characters');
        }
      }
      if (key === 4) {
        if (Validate('Name', inputInfo.value)) {
          changeInfoUser((oldValue) => {
            return { ...oldValue, LastName: inputInfo.value };
          });
        } else {
          inputsError.push('lastName Name is not Valid, must be greater than 5 characters');
        }
      }
      if (key === 5) {
        if (isValidDate(inputInfo.value) && getAge(inputInfo.value) >= 18) {
          changeInfoUser((oldValue) => {
            return { ...oldValue, DateBirthday: inputInfo.value };
          });
        } else {
          inputsError.push('age is not Valid, must be greater than 18');
        }
      }
      if (key === 7) {
        if (inputInfo.value !== '') {
          changeInfoUser((oldValue) => {
            return { ...oldValue, Biography: inputInfo.value };
          });
        } else {
          inputsError.push('Biography is not Valid, must not be empty');
        }
      }
      if (key === 8) {
        if (inputInfo.value === 'Male' || inputInfo.value === ' Woman' || inputInfo.value === 'Male Woman') {
          changeInfoUser((oldValue) => {
            return { ...oldValue, Sexual: inputInfo.value };
          });
        } else {
          inputsError.push('Sexual is not valid');
        }
      }
      if (key === 9) {
        if (inputInfo.value === 'Male' || inputInfo.value === ' Woman') {
          changeInfoUser((oldValue) => {
            return { ...oldValue, Gender: inputInfo.value };
          });
        } else {
          inputsError.push('Sexual is not valid');
        }
      }
    });
    if (inputsError.every((items) => items === '')) UpdateInfoUser();
    else {
      ChangeError(inputsError);
      setOpen(true);
    }
  };
  return (
    <div className='profile'>
      <div>
        <div className='slide-in-left'>
          <img src={infoUser.Images[0]} className='ImageProfile' alt='...' />
          <div>
            <p className='UseName'>{ctx.userInfo.UserName}</p>
            <p className='Email'>{ctx.userInfo.Email}</p>
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

            <button className='ft_btn' style={{ marginTop: '30px', backgroundColor: 'rgb(49, 143, 181)' }} onClick={formUpdatePasswordShow}>
              Update Password
            </button>
          </div>
          {width <= 630 ? (
            <>
              <hr style={{ border: 'none', height: '0.1px', width: '97%' }} />
              <p>Photos</p>
            </>
          ) : (
            ''
          )}
        </div>

        <div className='slide-in-left'>
          {width > 630 ? (
            <div className='addImage'>
              <p>Add Image</p>
              <input type='file' accept='image/*' onChange={getImage} />
            </div>
          ) : (
            ''
          )}

          <div className='Images'>
            {infoUser.Images.map((value, key) =>
              key !== 0 ? (
                <div className='Image' key={key}>
                  <img src={value} alt='...' />
                  <Button
                    style={{
                      fontWeight: '600',
                      fontSize: '10px',
                      position: 'absolute',
                      transition: 'all 0.5s',
                      height: width <= 885 ? '30px' : 'auto',
                      padding: '8px',
                    }}
                    variant='contained'
                    onClick={deleteImage}
                    className='imageRemove'
                    color='secondary'
                    startIcon={<DeleteIcon />}>
                    Delete
                  </Button>
                  <Button
                    style={{
                      fontWeight: '600',
                      backgroundColor: '#03a9f1',
                      fontSize: '10px',
                      position: 'absolute',
                      transition: 'all 0.5s',
                      height: width <= 885 ? '30px' : 'auto',
                      padding: '8px',
                    }}
                    variant='contained'
                    onClick={makeImageDefault}
                    className='imageDefault'
                    color='secondary'
                    startIcon={<CheckIcon />}>
                    make default
                  </Button>
                </div>
              ) : (
                ''
              )
            )}
            {width <= 630 ? (
              <div className='addImage Image' style={{ height: '320px', paddingLeft: '0px', marginLeft: '10px' }}>
                <p>Add Image</p>
                <input type='file' accept='image/*' onChange={getImage} />
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      <div className='slide-in-right'>
        <p>Personal Information </p>
        <div></div>
        <div className='infoUser'>
          <p className='labelInfo'>UserName:</p>
          <InputTest
            DefaultValue={infoUser.UserName}
            Onchange={(userName) => {
              changeInfoUser((oldValue) => ({ ...oldValue, UserName: userName }));
            }}
            Type='text'
          />
        </div>
        <div className='infoUser'>
          <p className='labelInfo'>Email:</p>
          <InputTest
            DefaultValue={infoUser.Email}
            Onchange={(email) => {
              changeInfoUser((oldValue) => ({ ...oldValue, Email: email }));
            }}
            Type='email'
          />
        </div>
        <div className='infoUser'>
          <p className='labelInfo'>First Name:</p>
          <InputTest
            DefaultValue={infoUser.FirstName}
            Onchange={(firstName) => {
              changeInfoUser((oldValue) => ({ ...oldValue, FirstName: firstName }));
            }}
            Type='text'
          />
        </div>
        <div className='infoUser'>
          <p className='labelInfo'>Last Name:</p>
          <InputTest
            DefaultValue={infoUser.LastName}
            Onchange={(lastName) => {
              changeInfoUser((oldValue) => ({ ...oldValue, LastName: lastName }));
            }}
            Type='text'
          />
        </div>

        <div className='infoUser'>
          <p className='labelInfo'>DateBirthday</p>
          <input type='date' className='InputDate' style={{ color: ctx.Mode === 'Dark' ? 'white' : 'black' }} defaultValue={infoUser.DateBirthday} onChange={ChangeDateBirthday} />
        </div>
        <div className='infoUser'>
          <p className='labelInfo'>City :</p>
          <InputTest DefaultValue={infoUser.City} />
        </div>
        <div className='infoUser'>
          <p className='labelInfo'>Biography :</p>
          <InputTest
            DefaultValue={infoUser.Biography}
            Onchange={(biography) => {
              changeInfoUser((oldValue) => ({ ...oldValue, Biography: biography }));
            }}
            Type='text'
          />
        </div>
        <div className='infoUser'>
          <p className='labelInfo'>gender you are looking for :</p>
          <TextField id='outlined-select-currency' select variant='outlined' value={infoUser.Sexual} onChange={ChangeSexual} style={{ width: '100%', backgroundColor: '#eef2fe', borderRadius: '8px' }}>
            {Sexual.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className='infoUser'>
          <p className='labelInfo'>Gender</p>
          <TextField id='outlined-select-currency' select variant='outlined' value={infoUser.Gender} onChange={ChangeGender} style={{ width: '100%', backgroundColor: '#eef2fe', borderRadius: '8px', fontWeight: '600' }}>
            {Gender.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className='infoUser' style={{ alignItems: 'baseline' }}>
          <p className='labelInfo'>Gender</p>
          <Select
            list={data.data}
            active={infoUser.ListInterest}
            change={(listInterest) => {
              changeInfoUser((oldValue) => ({ ...oldValue, ListInterest: listInterest }));
            }}
          />
        </div>
        <div className='infoUser' style={{ justifyContent: 'center' }}>
          <button className='ft_btn' style={{ marginTop: '20px', backgroundColor: 'rgb(49, 143, 181)' }} onClick={validationEdit}>
            Edit profile
          </button>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={8000} onClose={handleClose}>
        <Alert severity='error' icon={false}>
          {findError.map((error, key) => (
            <p style={{ display: 'block', fontSize: '14px' }} key={key}>{`- ${error} !`}</p>
          ))}
        </Alert>
      </Snackbar>
      {/* <Dialog open={showUpdatePassword} onClose={formUpdatePasswordClose}>
        <div style={{ width: '500px', height: '500px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: '8px' }}>
          <div className='infoUser' style={{ justifyContent: 'center', width: '440px' }}>
            <p style={{ fontSize: '30px', fontWeight: '900', marginTop: '5px', marginBottom: '14px' }}>Change password </p>
          </div>
          <p style={{ marginLeft: '40px', marginRight: '30px', fontSize: '14px', fontWeight: '600' }}>create a password at least 8 characters with uppercase letters and numbers and numbers</p>
          <div className='infoUser' style={{ width: '440px' }}>
            <p className='labelInfo'>Current Password:</p>
            <InputTest
              DefaultValue={password.CurrentPassword}
              Onchange={(password) => {
                changePassword((oldValue) => ({ ...oldValue, CurrentPassword: password }));
              }}
              Type='password'
            />
          </div>
          <div className='infoUser' style={{ width: '440px' }}>
            <p className='labelInfo'>New Password:</p>
            <InputTest
              DefaultValue={password.NewPassword}
              Onchange={(newPassword) => {
                changePassword((oldValue) => ({ ...oldValue, NewPassword: newPassword }));
              }}
              Type='password'
            />
          </div>
          <div className='infoUser' style={{ width: '440px' }}>
            <p className='labelInfo'>Confirm password:</p>
            <InputTest
              DefaultValue={password.ConfirmPassword}
              Onchange={(confirmPassword) => {
                changePassword((oldValue) => ({ ...oldValue, ConfirmPassword: confirmPassword }));
              }}
              Type='password'
            />
          </div>
          <div className='infoUser' style={{ justifyContent: 'center', width: '440px' }}>
            <button className='ft_btn' style={{ marginTop: '20px', backgroundColor: 'rgb(49, 143, 181)' }} onClick={changePasswordProfile}>
              change Password
            </button>
          </div>
        </div>
      </Dialog> */}
      <Dialog open={showUpdatePassword} onClose={formUpdatePasswordClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>Change password</DialogTitle>
        <DialogContent>
          <DialogContentText>create a password at least 8 characters with uppercase letters and numbers and numbers.</DialogContentText>
          <InputTest
            DefaultValue={password.NewPassword}
            Onchange={(newPassword) => {
              changePassword((oldValue) => ({ ...oldValue, NewPassword: newPassword }));
            }}
            Type='password'
            PlaceHolder='Current Password'
            // Style={{pr}}
          />
          <InputTest
            DefaultValue={password.ConfirmPassword}
            Onchange={(confirmPassword) => {
              changePassword((oldValue) => ({ ...oldValue, ConfirmPassword: confirmPassword }));
            }}
            Type='password'
            PlaceHolder='New Password'
          />
          <InputTest
            DefaultValue={password.ConfirmPassword}
            Onchange={(confirmPassword) => {
              changePassword((oldValue) => ({ ...oldValue, ConfirmPassword: confirmPassword }));
            }}
            Type='password'
            PlaceHolder='Confirm password'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={changePasswordProfile} color='primary'>
            change Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
