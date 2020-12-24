import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../Context/AppContext';
import '../Css/step.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import SwitchStep from './SwitchStep';
import SwitchImage from './SwitchImage';
import Button from '@material-ui/core/Button';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

let Steps = (props) => {
  if (props.index !== 4)
    return (
      <>
        <div
          className='Circle'
          style={{
            backgroundColor: props.index <= props.NrStep ? '#03a9f1' : '#C4C4C4',
            color: props.index <= props.NrStep ? '#dee5fc' : '#373e4e',
          }}>
          {props.index}
        </div>
        <div
          className='LineStep'
          style={{
            backgroundColor: props.index <= props.NrStep - 1 ? '#03a9f1' : '#C4C4C4',
            color: props.index <= props.NrStep ? '#dee5fc' : '#373e4e',
          }}></div>
      </>
    );
  else
    return (
      <div
        className='Circle'
        style={{
          backgroundColor: props.index <= props.NrStep ? '#03a9f1' : '#C4C4C4',
          color: props.index <= props.NrStep ? '#dee5fc' : '#373e4e',
        }}>
        4
      </div>
    );
};

const Step = (props) => {
  const ctx = useContext(DataContext);

  let delativeCircle = (steps) => {
    steps.forEach((step) => {
      step.classList.value = 'Circle';
    });
  };
  const [NbrStep, changeNrbStep] = useState(1);
  let { token } = useParams();
  let history = useHistory();
  const [infoStep, changeInfoStep] = useState({
    step1: '',
    step2: { country: null, latitude: '', longitude: '' },
    step3: { youGender: '', genderYouAreLooking: [''] },
    step4: { DescribeYourself: '', yourInterest: [] },
    step5: [],
  });
  const steps = [1, 2, 3, 4];
  let completeInsertUsers = () => {
    try {
      Axios.post(`http://localhost:5000/users/completeInsert`, { ...infoStep, token })
        .then((result) => {
          ctx.ChangeErrorMessages({
            error: '',
            warning: '',
            success: 'successful complete sign up',
          });
          props.dataHome.ChangeIsLogin(2);
          history.push(`/`);
        })
        .catch((error) => {});
    } catch (error) {
      console.log('health check error');
    }
  };
  React.useEffect(() => {
    function success(pos) {
      let DataStep = infoStep;
      DataStep.step2.country = null;
      DataStep.step2.latitude = pos.coords.latitude;
      DataStep.step2.longitude = pos.coords.longitude;
      changeInfoStep({ ...DataStep });
    }
    function error(err) {}
    navigator.geolocation.getCurrentPosition(success, error);
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    let array_ul = Array.from(document.querySelectorAll('.Circle'));
    delativeCircle(array_ul);
    array_ul[NbrStep - 1].classList.add('Circle-active');
  }, [NbrStep]);
  React.useEffect(() => {
    let didMount = false;
    if (!didMount)
      try {
        Axios.get(`http://localhost:5000/user/verifierToken/${token}`)
          .then((result) => {
            if (result.data[0].Count === 0) {
              ctx.ChangeErrorMessages({
                error: 'Token not found',
                warning: '',
                success: '',
              });
              history.push(`/`);
            }
          })
          .catch((error) => {});
      } catch (error) {
        console.log('health check error');
      }
    return () => (didMount = true);
    //eslint-disable-next-line
  }, []);
  // if (!didMount) {
  //   return null;
  // }

  return (
    <div className='Step'>
      <div className='Info-step'>
        <p className='t3' style={{ color: ctx.Mode === 'Dark' ? 'white' : 'black' }}>
          {NbrStep !== 5 ? `Steps ${NbrStep}` : 'Finish'}
        </p>
        <TransitionGroup>
          <CSSTransition key={NbrStep} timeout={800} classNames='SwitchStep' unmountOnExit>
            <SwitchStep NrStep={NbrStep} Mode={ctx.Mode} InfoStep={infoStep} ChangeInfoStep={changeInfoStep} />
          </CSSTransition>
        </TransitionGroup>
        {NbrStep !== 5 ? (
          <div>
            <Button
              variant='outlined'
              size='large'
              color='primary'
              onClick={() => {
                if (NbrStep - 1 !== 0) changeNrbStep(NbrStep - 1);
              }}
              style={{
                fontWeight: '900',
                borderWidth: '1.2px',
                borderRadius: '10px',
                borderColor: '#03a9f1',
                color: '#03a9f1',
              }}>
              Back
            </Button>
            <Button
              variant='contained'
              size='large'
              color='primary'
              onClick={() => {
                if (NbrStep + 1 !== 7) {
                  if (NbrStep === 1) {
                    if (infoStep.step1 !== '') changeNrbStep(NbrStep + 1);
                    else
                      ctx.ChangeErrorMessages({
                        error: 'Error age must be greater than 18',
                        warning: '',
                        success: '',
                      });
                  }

                  if (NbrStep === 2)
                    if (infoStep.step4.DescribeYourself !== '' && infoStep.step4.yourInterest[0] !== '') changeNrbStep(NbrStep + 1);
                    else
                      ctx.ChangeErrorMessages({
                        error: 'Error empty intra',
                        warning: '',
                        success: '',
                      });

                  if (NbrStep === 3) {
                    if (infoStep.step3.youGender !== '' && infoStep.step3.genderYouAreLooking[0] !== '') changeNrbStep(NbrStep + 1);
                    else
                      ctx.ChangeErrorMessages({
                        error: 'Error empty button',
                        warning: '',
                        success: '',
                      });
                  }
                  if (NbrStep === 4) {
                    let findImageDefault = (arrayImage) => {
                      let isDefault = false;
                      arrayImage.forEach((Image) => {
                        if (Image.default === 1) isDefault = true;
                      });
                      return isDefault ? true : false;
                    };
                    if (infoStep.step5.length >= 1 && findImageDefault(infoStep.step5)) {
                      completeInsertUsers();
                    } else
                      ctx.ChangeErrorMessages({
                        error: 'please choose Image',
                        warning: '',
                        success: '',
                      });
                  }
                }
              }}
              style={{
                fontWeight: '900',
                borderRadius: '10px',
                backgroundColor: '#03a9f1',
              }}>
              {NbrStep < 4 ? 'Next' : 'Finish'}
            </Button>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className='Step-count'>
        {steps.map((step) => (
          <Steps key={step} index={step} NrStep={NbrStep} />
        ))}
      </div>
      <TransitionGroup className='Image-step'>
        <CSSTransition key={NbrStep} timeout={800} classNames='SwitchStep' unmountOnExit>
          <SwitchImage NrStep={NbrStep} />
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default Step;
