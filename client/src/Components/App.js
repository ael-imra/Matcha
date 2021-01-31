import React, { useContext, useState} from 'react';
import '../Css/App.css';
import AppContext, { DataContext } from '../Context/AppContext';
import Header from './Header';
import Body from './Body';
import '../Css/Btn.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { ModeStyle } from '../Data/ModeStyle';


function App() {
  const ctx = useContext(DataContext)
  const [StateHome, ChangeHome] = useState(1);
  if (ctx.isLogin === 'Step' || ctx.isLogin === 'Not login') {
    return (
      <div className='App' style={ModeStyle[ctx.Mode].Dashboard}>
        <Header dataHome={{ StateHome, ChangeHome }} />
        <Body dataHome={{ StateHome, ChangeHome, ChangeIsLogin:ctx.changeIsLogin }} />
      </div>
    );
  }
  if (ctx.isLogin === 'Login') return <Dashboard ChangeIsLogin={ctx.changeIsLogin}/>;
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
