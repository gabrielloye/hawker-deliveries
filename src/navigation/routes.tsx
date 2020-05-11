import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

/** Container components */
import DashBoardContainer from '../auth/Containers/DashboardContainer';
import LoginContainer from '../auth/Containers/LoginContainer';
import SignUpContainer from '../auth/Containers/SignUpContainer';
import ConfirmEmailContainer from '../auth/Containers/ConfirmEmailContainer';
import ForgotPasswordContainer from '../auth/Containers/ForgotPasswordContainer';
import PasswordResetContainer from '../auth/Containers/PasswordResetContainer';

/** private route component */
import PrivateRoute from './private-route';

class AppRouter extends React.Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <PrivateRoute exact={true} path="/dashboard" component={DashBoardContainer} />
          <Route exact={true} path="/" component={LoginContainer} />
          <Route exact={true} path="/login" component={LoginContainer} />
          <Route exact={true} path="/signup" component={SignUpContainer} />
          <Route exact={true} path="/verify-code" component={ConfirmEmailContainer} />
          <Route exact={true} path="/reset-password" component={PasswordResetContainer} />
          <Route exact={true} path="/forgot-password" component={ForgotPasswordContainer} />
        </React.Fragment>
      </Router>
    );
  }
}

export default AppRouter;