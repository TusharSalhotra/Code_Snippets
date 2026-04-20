import React, { useState } from 'react';
import styled from 'styled-components';
import Icon from './Icon';
import { IconEnum as Icons } from './Icons';
import colors from '../styles/colors';
import BaseModal, { ModalList } from './modals/BaseModal';

const Container = styled.div`
  width: 100%;
  height: 50px;
  background: ${colors.white};
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
  position: fixed;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
`;

const NavText = styled.div`
  font-size: 1.4rem;
  color: ${colors.grey1};
  font-weight: 500;
`;

const MobileTopNav = () => {
  const [logoutModalIsVisible, setLogoutModalIsVisible] = useState(false);

  return (
    <>
      <BaseModal
        open={logoutModalIsVisible}
        modalType={ModalList.LogoutModal}
        onClose={setLogoutModalIsVisible}
      />
      <Container>
        <NavText>
          Redeem Discount
        </NavText>
        <Icon
          icon={Icons.SignOut}
          onClick={() => setLogoutModalIsVisible(true)}
          size={16}
        />
      </Container>
    </>
  );
};

export default MobileTopNav;
