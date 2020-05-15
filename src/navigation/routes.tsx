import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

/** Container components */
import LoginContainer from '../auth/Containers/LoginContainer';
import SignUpContainer from '../auth/Containers/SignUpContainer';
import ConfirmEmailContainer from '../auth/Containers/ConfirmEmailContainer';
import ForgotPasswordContainer from '../auth/Containers/ForgotPasswordContainer';
import PasswordResetContainer from '../auth/Containers/PasswordResetContainer';
import LandingPage from '../views/landing/landing';
import Main from '../views/main/main';

/** private route component */
import LoggedinRoute from './loggedin-route';

class AppRouter extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
          <Route exact={true} path="/" component={LandingPage} />
          <Route exact path="/main" render={(props) => <Main {...props}/>}/>
          <Route path="/main/:date" render={(props) => <Main {...props}/>}/>

          <LoggedinRoute exact={true} path="/login" component={LoginContainer} />
          <LoggedinRoute exact={true} path="/signup" component={SignUpContainer} />
          <LoggedinRoute exact={true} path="/verify-code" component={ConfirmEmailContainer} />
          <LoggedinRoute exact={true} path="/reset-password" component={PasswordResetContainer} />
          <LoggedinRoute exact={true} path="/forgot-password" component={ForgotPasswordContainer} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default AppRouter;