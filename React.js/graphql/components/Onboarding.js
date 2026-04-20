import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_USER_ROLES } from '../graphql/queries';
import Loader from './Loader';
import RoleInvite from './RoleInvite';
import Organization from './Organization';

export default function Onboarding() {
  const [hasInvites, setHasInvites] = useState(false);
  const { data, loading, error } = useQuery(GET_USER_ROLES);

  useEffect(() => {
    if (data && data.getUserRoles) {
      setHasInvites(data.getUserRoles.find((r) => !r.acceptedAt));
    }
  }, [data]);

  if (loading && !data && !error) {
    return (
      <Loader />
    );
  }

  return hasInvites ? <RoleInvite roles={data.getUserRoles} /> : <Organization />;
}
