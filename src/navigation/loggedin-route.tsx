import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

/** Helpers */
import { validateToken } from '../auth/Utils/Helpers';

/** Constants */
import { AUTH_USER_TOKEN_KEY } from '../auth/Utils/constants';

const LoggedinRoute = ({ component: Component, ...rest }: any & { component: any }) => {
  const checkUserAuth = validateToken(localStorage.getItem(AUTH_USER_TOKEN_KEY));

  return (
    <Route
      {...rest}
      render={props => {
        return !checkUserAuth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/main/dashboard'
            }}
          />
        );
      }}
    />
  );
};

export default LoggedinRoute;