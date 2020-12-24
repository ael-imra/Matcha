import React, { useContext, useState, useEffect } from 'react';
import '../Css/App.css';
import AppContext, { DataContext } from '../Context/AppContext';
import Header from './Header';
import Body from './Body';
import '../Css/Btn.css';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Dashboard } from './Dashboard';

function App() {
  let history = useHistory();
  const [StateHome, ChangeHome] = useState(1);
  const [isLogin, ChangeIsLogin] = useState(0);
  const ctx = useContext(DataContext);
  useEffect(() => {
    document.querySelector('body').style.backgroundColor = ctx.Mode === 'Light' ? '#ffffff' : '#292f3f';
  }, [ctx.Mode]);
  useEffect(() => {
    try {
      Axios.post(
        'http://localhost:5000/users/user',
        {},
        {
          headers: {
            authorization: `token ${localStorage.getItem('token')}`,
          },
        }
      )
        .then((result) => {
          if (Object.prototype.toString.call(result.data[0]) === '[object Object]') {
            if (result.data[0].City === 'xxx') {
              history.push(`/step/${result.data[0].Token}`);
              ChangeIsLogin(1);
            } else ChangeIsLogin(2);
          } else ChangeIsLogin(1);
        })
        .catch((error) => {
          ChangeIsLogin(1);
        });
    } catch (error) {}
    // eslint-disable-next-line
  }, [isLogin]);

  if (isLogin === 1)
    return (
      <div className='App'>
        <Header dataHome={{ StateHome, ChangeHome }} />
        <Body dataHome={{ StateHome, ChangeHome, ChangeIsLogin }} />
      </div>
    );
  else if (isLogin === 2) return <Dashboard IsLogin={isLogin} ChangeIsLogin={ChangeIsLogin} />;
  else return '';
}

function AppContainer() {
  return (
    <AppContext>
      <Router>
        <Switch>
          <Route>
            <App />
          </Route>
        </Switch>
      </Router>
    </AppContext>
  );
}

export default AppContainer;
