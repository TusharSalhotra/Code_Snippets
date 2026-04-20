import React from 'react';
import styled from 'styled-components';
import Button from '../Button';
import colors from '../../styles/colors';

const Container = styled.div`
  padding: 20px 15px;
`;

const Text = styled.div`
  font-size: 1.4rem;
  color: ${colors.grey3};
`;

export default function LogoutModal({ close }) {
  
  return (
    <Container>
      <Text>
        Are you sure you want to sign out?
      </Text>
      <Button
        margin="30px 0px 0px 0px"
        text="SIGN OUT"
        width="100%"
        onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}
      />
      <Button
        margin="20px 0px 0px 0px"
        text="GO BACK"
        width="100%"
        onClick={() => close()}
      />
    </Container>
  );
}
