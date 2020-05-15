import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';

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
import { TransitionGroup, CSSTransition } from "react-transition-group";
import styled from "styled-components";
class AppRouter extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <AnimatedSwitch></AnimatedSwitch>
          {/* <Switch>
          <Route exact={true} path="/" component={LandingPage} />
          <Route exact path="/main" render={(props) => <Main {...props}/>}/>
          <Route path="/main/:date" render={(props) => <Main {...props}/>}/>

          <LoggedinRoute exact={true} path="/login" component={LoginContainer} />
          <LoggedinRoute exact={true} path="/signup" component={SignUpContainer} />
          <LoggedinRoute exact={true} path="/verify-code" component={ConfirmEmailContainer} />
          <LoggedinRoute exact={true} path="/reset-password" component={PasswordResetContainer} />
          <LoggedinRoute exact={true} path="/forgot-password" component={ForgotPasswordContainer} />
          </Switch> */}
        </div>
      </Router>
    );
  }
}

const AnimatedSwitch = withRouter(({ location}) => (
  <Wrapper>
    <TransitionGroup className="transition-group">
      <CSSTransition
        key={location.key}
        timeout={{ enter: 500, exit: 500 }}
        classNames="fade">
        <section className="route-section">
          <Switch location={location}>
            <Route exact={true} path="/" component={LandingPage} />
            <Route exact path="/main" render={(props) => <Main {...props}/>}/>
            <Route path="/main/:date" render={(props) => <Main {...props}/>}/>

            <LoggedinRoute exact={true} path="/login" component={LoginContainer} />
            <LoggedinRoute exact={true} path="/signup" component={SignUpContainer} />
            <LoggedinRoute exact={true} path="/verify-code" component={ConfirmEmailContainer} />
            <LoggedinRoute exact={true} path="/reset-password" component={PasswordResetContainer} />
            <LoggedinRoute exact={true} path="/forgot-password" component={ForgotPasswordContainer} />
          </Switch>
        </section>
      </CSSTransition>
    </TransitionGroup>
  </Wrapper>
))

const Wrapper = styled.div`
  .fade-enter {
    opacity: 0;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }

  .fade-exit {
    opacity: 1;
  }

  .fade-exit.fade-exit-active {
    opacity: 0;
    transition: opacity 500ms ease-out;
  }

  div.transition-group {
    position: relative;
  }

  section.route-section {
    position: absolute;
    width: 100%;
    top: 0vh;
    left: 0;
  }
`;

export default AppRouter;