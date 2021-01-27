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
import { ModeStyle } from '../Data/ModeStyle';


function App() {
  let history = useHistory();
  const [StateHome, ChangeHome] = useState(1);
  const [isLogin, ChangeIsLogin] = useState('');
  const ctx = useContext(DataContext);
  Axios.defaults.headers.common['Authorization'] = `token ${localStorage.getItem('token')}`;
  useEffect(() => {
    try {
      Axios.get('/users')
        .then((result) => {
          if (result.data.IsActive === 2) history.push('/step');
          if (result.data.IsActive) ChangeIsLogin(result.data.IsActive === 1 ? 'Login' : result.data.IsActive === 2 ? 'Step' : 'Not login');
          else ChangeIsLogin('Not login');
        })
        .catch((error) => {});
    } catch (error) {}
    // eslint-disable-next-line
  }, []);
  console.log('App');
  if (isLogin === 'Step' || isLogin === 'Not login') {
    return (
      <div className='App' style={ModeStyle[ctx.Mode].Dashboard}>
        <Header dataHome={{ StateHome, ChangeHome }} />
        <Body dataHome={{ StateHome, ChangeHome, ChangeIsLogin }} />
      </div>
    );
  }
  if (isLogin === 'Login') return <Dashboard ChangeIsLogin={ChangeIsLogin}/>;
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
//DataBirthday
//

export default AppContainer;
