import React from 'react';
import { useWindowSize } from './UseWindowSize';

const Step3 = (props) => {
  const width = useWindowSize();
  let deActives = () => {
    let arrayBtn = Array.from(document.querySelectorAll('.Switch-btn button'));
    arrayBtn.forEach((btn) => {
      btn.classList.value = 'ft_btn-2';
    });
  };
  let btnActives = (e) => {
    deActives();
    e.target.classList.value = 'ft_btn-3';
    let DataStep3 = props.InfoStep;
    DataStep3.step3.youGender = document.querySelector('.ft_btn-3').innerHTML;
    props.ChangeInfoStep({ ...DataStep3 });
  };
  let ActivesBtn = (e) => {
    e.target.classList.value = e.target.classList.value === 'ft_btn-2' ? 'ft_btn-3' : 'ft_btn-2';
    let DataStep3 = props.InfoStep;
    let val = '';
    Array.from(document.querySelectorAll('.choose-btn .ft_btn-3')).forEach((value) => {
      val = value.innerHTML + ' ' + val;
    });
    DataStep3.step3.genderYouAreLooking = val.trim().split(' ');
    props.ChangeInfoStep({ ...DataStep3 });
  };
  return (
    <>
      <p
        className='t3'
        style={{
          color: props.Mode === 'Dark' ? 'white' : 'black',
          fontSize: width <= 885 ? '18px' : '23px',
        }}>
        What's you gender ?
      </p>
      <div className='Switch-btn'>
        <button className={`${props.InfoStep.step3.youGender === 'Male' ? 'ft_btn-3 AnimationBtn' : 'ft_btn-2'}`} onClick={btnActives}>
          Male
        </button>
        <button className={`${props.InfoStep.step3.youGender === 'Female' ? 'ft_btn-3 AnimationBtn' : 'ft_btn-2'}`} onClick={btnActives}>
          Female
        </button>
      </div>
      <p
        className='t3'
        style={{
          color: props.Mode === 'Dark' ? 'white' : 'black',
          fontSize: width <= 885 ? '15px' : '23px',
        }}>
        What gender you are looking for ?
      </p>
      <div className='choose-btn'>
        <button
          className={`${props.InfoStep.step3.genderYouAreLooking[1] === 'Male' || props.InfoStep.step3.genderYouAreLooking[0] === 'Male' ? 'ft_btn-3 AnimationBtn' : 'ft_btn-2'}`}
          onClick={ActivesBtn}>
          Male
        </button>
        <button
          className={`${
            props.InfoStep.step3.genderYouAreLooking[1] === 'Female' || props.InfoStep.step3.genderYouAreLooking[0] === 'Female' ? 'ft_btn-3 AnimationBtn' : 'ft_btn-2'
          }`}
          onClick={ActivesBtn}>
          Female
        </button>
      </div>
    </>
  );
};
export default Step3;
