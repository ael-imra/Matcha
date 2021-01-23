import React, { useState} from 'react';
import '../Css/App.css';
import AppContext from '../Context/AppContext';
import Header from './Header';
import Body from './Body';
import '../Css/Btn.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Dashboard } from './Dashboard';

function App() {
  // let history = useHistory();
  const [StateHome, ChangeHome] = useState(1);
  // const ctx = useContext(DataContext);
  // useEffect(() => {
  //   document.querySelector('body').style.backgroundColor = ctx.Mode === 'Light' ? '#ffffff' : '#292f3f';
  // }, [ctx.Mode]);
  // useEffect(() => {
  //   try {
  //     Axios.post('Users/user',
  //       {},
  //     )
  //       .then((result) => {
  //         if (Object.prototype.toString.call(result.data[0]) === '[object Object]') {
  //           if (result.data[0].City === 'xxx') {
  //             history.push(`/step/${result.data[0].Token}`);
  //           } else {
  //             ctx.changeUserInfo({ ...result.data[0] });
  //           }
  //         } else ctx.changeUserInfo({});
  //       })
  //       .catch((error) => {
  //         ctx.changeUserInfo({});
  //       });
  //   } catch (error) {}
  //   // eslint-disable-next-line
  // }, []);
  console.log("inside app")
  if (!localStorage.getItem('token'))
    return (
      <div className='App'>
        <Header dataHome={{ StateHome, ChangeHome }} />
        <Body dataHome={{ StateHome, ChangeHome }} />
      </div>
    );
  else if (localStorage.getItem('token'))
    return <Dashboard />;
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
