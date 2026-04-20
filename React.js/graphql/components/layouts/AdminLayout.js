/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Route, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment-timezone';
import {
  GET_CURRENT_USER,
  GET_CURRENT_ORGANIZATION,
} from '../../graphql/queries';
import SideNavigation from '../SideNavigation';
import { UserContext } from '../../context/UserContext';
import Loader from '../Loader';
import * as Intercom from '../../util/Intercom';
import { AppContext } from '../../context/AppContext';
import Header from '../Header';

const LoaderContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  bottom: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AdminLayoutContainer = styled.div`
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  overflow:auto;
`;

function AdminLayout({ component: Component, rolesAllowed, ...rest }) {
  // should combine into one query and use graphql how it is supposed to be used
  const { setApp } = useContext(AppContext);

  const { data, loading, error } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: 'network-only',
  });
  const { data: orgData, loading: orgLoading } = useQuery(
    GET_CURRENT_ORGANIZATION,
    {
      fetchPolicy: 'network-only',
      onCompleted(data) {
        const campaignPhoneNumber = data.getCurrentOrganization?.campaignPhoneNumber || '';
        const orgTimeZone = data.getCurrentOrganization?.timezone?.name || 'America/Denver';
        const offset = data.getCurrentOrganization?.timezone?.offset || -420;
        const dstOffset = data.getCurrentOrganization?.timezone?.dstOffset || -360;
        const isDst = moment.tz(new Date(),
          orgTimeZone).isDST();
        const orgTimeZoneOffset = (isDst ? Number(dstOffset) : Number(offset));
        const mmsEnabled = data.getCurrentOrganization?.mmsEnabled;

        setApp((app) => ({
          ...app, campaignPhoneNumber, orgTimeZoneOffset, orgTimeZone, mmsEnabled,
        }));
      },
    },
  );

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setApp((app) => ({ ...app, showSideNav: false }));
  }, [setApp]);

  useEffect(() => {
    if (data?.getCurrentUser) {
      setUser(data.getCurrentUser);
      Intercom.boot(data.getCurrentUser, data.getCurrentOrganization, false);
    }
  }, [data, setUser]);

  if (
    loading
    || orgLoading
    || (!data && !data.currentUser && !error)
    || (!user && !error)
  ) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  }

  if (error) {
    console.error(error);
  }

  const userHasRequiredRole = rolesAllowed.includes(
    user.currentOrganizationRole,
  );
  const isAuthed = !!localStorage.getItem('YOUR_DOMAIN_AUTH_TOKEN');
  const activeSubscriber = orgData?.getCurrentOrganization?.activeSubscriber
    || user.currentOrganizationRole === 'SuperAdmin';

  return (
    <Route
      exact
      {...rest}
      render={(matchProps) => (isAuthed && userHasRequiredRole && activeSubscriber ? (
        <AdminLayoutContainer>
          <Header currentOrganisation={orgData.getCurrentOrganization} />
          <SideNavigation />
          <Component {...matchProps} />
        </AdminLayoutContainer>
      ) : (
        <>
          {!isAuthed || !userHasRequiredRole ? (
            <Redirect to="/login" />
          ) : (
            <Redirect to="/enterPayment" /> // organization does not have an active subscription
          )}
        </>
      ))}
    />
  );
}

export default AdminLayout;
