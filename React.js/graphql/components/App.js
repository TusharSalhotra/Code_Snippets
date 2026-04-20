import React, { useState, useMemo, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createGlobalStyle } from 'styled-components';
import GlobalStyles from '../globalStyles';
import AccessLevels from '../util/AccessLevels';
// Auth Layout
import AuthLayout from './layouts/AuthLayout';
import EnterPaymentPage from './EnterPaymentPage';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Onboarding from './Onboarding';
// Admin Layout
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './dashboard/Dashboard';
import { UserContext } from '../context/UserContext';
import { AppContext } from '../context/AppContext';
import * as Intercom from '../util/Intercom';
import {
  useDesktopMedia,
} from '../util/MediaQuery';

// should do this the dotenv way to distingush between prod and staging/dev
// load stripe with public publishable keys
const stripePromise = ""

const fonts = [
  {
    cssSrc:
      'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700',
    family: 'Poppins',
  },
];

export default function App() {
  const [app, setApp] = useState(null);
  const [user, setUser] = useState(null);
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const appValue = useMemo(() => ({ app, setApp }), [app, setApp]);

  const isDesktop = useDesktopMedia();

  useEffect(() => {
    Intercom.connect();
  }, [user]);

  const HideToolTip = createGlobalStyle`
     .__react_component_tooltip{
      display: none;
    }
  
  `;

  return (
    <Router basename="/admin">
      <GlobalStyles />
      {!isDesktop && <HideToolTip />}
      <Elements stripe={stripePromise} options={{ fonts }}>
        <Switch>
          {/* Non-Authed routes */}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <AuthLayout path="/login" component={Login} />
          <AuthLayout path="/register" component={Register} />
          <AuthLayout path="/forgotPassword" component={ForgotPassword} />
          <AuthLayout path="/resetPassword" component={ResetPassword} />
          <AuthLayout path="/onboarding" component={Onboarding} />
          <AuthLayout path="/enterPayment" component={EnterPaymentPage} />
          {/* Auth required routes */}
          <AppContext.Provider value={appValue}>
            <UserContext.Provider value={userValue}>
              <AdminLayout
                path="/dashboard"
                component={Dashboard}
                rolesAllowed={[AccessLevels.SuperAdmin, AccessLevels.Admin]}
              />
            </UserContext.Provider>
          </AppContext.Provider>
          {/* 404 */}
          <Redirect to="/" />
        </Switch>
      </Elements>
    </Router>
  );
}
