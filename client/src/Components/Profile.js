import React from 'react';
import '../Css/Profile.css';
import ImageProfile from '../Images/user.jpg';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputTest from './InputTest';

export default function Profile() {
  const [currency, setCurrency] = React.useState('male');
  const currencies = [
    {
      value: 'female',
      label: 'Female',
    },
    {
      value: 'male',
      label: 'Male',
    },
  ];
  const handleChange = (event) => {
    setCurrency(event.target.value);
  };
  return (
    <div className='profile'>
      <div>
        <div>
          <img src={ImageProfile} className='ImageProfile' alt='...' />
          <p className='UseName'>sel-hamr</p>
          <p className='Email'>soufiane.hamri07@gmail.com</p>
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
          <button className='ft_btn' style={{ marginTop: '20px', backgroundColor: 'rgb(49, 143, 181)' }}>
            Edit profile
          </button>
        </div>
        <div>
          <p>Photos</p>
          <div className='Images'>
            <img src={ImageProfile} alt='...' />
            <img src={ImageProfile} alt='...' />
            <img src={ImageProfile} alt='...' />
            <img src={ImageProfile} alt='...' />
          </div>
        </div>
      </div>
      <div>
        <p>Personal Information </p>
        <div></div>
        <div className='infoUser'>
          <p className='test'>First Name:</p>
          <InputTest />
        </div>

        <div className='infoUser'>
          <p className='test'>Last Name:</p>
          <InputTest />
        </div>

        <div className='infoUser'>
          <p className='test'>DateBirthday</p>
          <InputTest />
        </div>
        <div className='infoUser'>
          <p className='test'>City :</p>
          <InputTest />
        </div>
        <div className='infoUser'>
          <p className='test'>Biography :</p>
          <textarea className={`${'Light' === 'Light' ? 'input-light' : 'input-dark'} Input textarea`} placeholder='Describe yourself ? ...' maxLength='100'></textarea>
        </div>
        <div className='infoUser'>
          <p className='test'>gender you are looking for :</p>
          <TextField id='outlined-select-currency' select variant='outlined' value={currency} onChange={handleChange} style={{ width: '100%', backgroundColor: '#eef2fe', borderRadius: '8px' }}>
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className='infoUser'>
          <p className='test'>Gender</p>
          <TextField id='outlined-select-currency' select variant='outlined' value={currency} onChange={handleChange} style={{ width: '100%', backgroundColor: '#eef2fe', borderRadius: '8px', fontWeight: '600' }}>
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </div>
    </div>
  );
}
