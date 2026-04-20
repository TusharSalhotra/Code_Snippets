import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Icon from './Icon';
import { IconEnum as Icons } from './Icons';
import colors from '../styles/colors';
import AccessLevels from '../util/AccessLevels';
import { UserContext } from '../context/UserContext';
import { media } from '../util/MediaQuery';
import Logo from '../assets/images/cto-logo-bug.png';
import BaseModal, { ModalList } from './modals/BaseModal';
import { AppContext } from '../context/AppContext';

const SideNavContainer = styled.nav`
  overflow: auto;
  width: 80px;
  min-width: 80px;
  height: 100%;
  background: ${colors.white};
  flex-direction: column;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
  align-items: center;
  top: 0;
  left: 0;
  transition: 0.5s;
  z-index: ${(props) => (props.display ? '900' : '1')};
  position: fixed;
  ${media.desktop`
    display: flex;
  `};

  @media screen and (max-width: 991px) {
    width: 250px;
    min-width: 250px;
    top: 0;
    left: ${(props) => (props.display === '1' ? '0' : '-250px')};
  }
`;

const SideNavInner = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: inherit;
`;
const NavItem = styled.div`
  margin-bottom: 50px;
  color: ${(props) => (props.active ? colors.seaGreen : colors.grey3)};
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 991px) {
    margin-bottom: 25px;
    position: relative;

    align-items: center;
    justify-content: unset;
    display: flex;
    padding: 6px 25px;
    color: ${(props) => (props.active ? colors.seaGreen : colors.grey3)};
  }
`;

const MenuText = styled.span`
  position: absolute;
  left: ${(props) => (props.bottom ? '70%' : '21%')};
  padding: 0 0 0 14px;
  font-size: 14px;
  display: none;

  @media screen and (max-width: 991px) {
    display: block;
  }
`;

const LogoImg = styled.img`
  width: 50px;
`;

const LogoSquare = styled.div`
  width: 100%;
  height: 80px;
  background: ${colors.grey6};
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BottomButtons = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  width: 80px;
  justify-content: center;
  background-color: ${colors.white};
  @media screen and (max-width: 991px) {
    justify-content: flex-start;
    position: relative;
    padding-left: unset;
  }
`;

function GetSideNavButtons({ push }, app, closeNavBar) {
  const { campaignId } = useParams();
  const navigateCloseNav = (path) => {
    closeNavBar();
    push(path);
  };

  return [
    {
      icon: Icons.HomeRegular,
      onClick: () => navigateCloseNav('/dashboard'),
      active: ['/admin/dashboard'],
      text: 'Dashboard',
      accessLevels: [AccessLevels.SuperAdmin, AccessLevels.Admin],
    },
    {
      icon: Icons.UsersRegular,
      onClick: () => navigateCloseNav('/customers'),
      active: ['/admin/customers'],
      text: 'Contacts',
      accessLevels: [AccessLevels.SuperAdmin, AccessLevels.Admin],
    },
    {
      icon: Icons.TagRegular,
      onClick: () => navigateCloseNav('/redeemCoupon'),
      active: ['/admin/redeemCoupon'],
      text: 'Redeem Discount',
      accessLevels: [
        AccessLevels.SuperAdmin,
        AccessLevels.Admin,
        AccessLevels.Server,
      ],
    },
    ...(app?.campaignPhoneNumber
      ? [
        {
          icon: Icons.SmsRegular,
          onClick: () => navigateCloseNav('/campaigns'),
          active: [
            '/admin/campaigns',
            '/admin/campaigns/new',
            `/admin/campaigns/id=${campaignId}`,
          ],
          text: 'SMS Campaigns',
          accessLevels: [AccessLevels.SuperAdmin, AccessLevels.Admin],
        },
      ]
      : []),
    {
      icon: Icons.CogsRegular,
      onClick: () => navigateCloseNav('/settings'),
      active: ['/admin/settings'],
      text: 'Settings',
      accessLevels: [AccessLevels.SuperAdmin, AccessLevels.Admin],
    },
    {
      icon: Icons.UsersAdminRegular,
      onClick: () => navigateCloseNav('/superAdminCustomers'),
      active: ['/admin/superAdminCustomers'],
      text: 'Superadmin Customers',
      accessLevels: [
        AccessLevels.SuperAdmin,
        // AccessLevels.Admin,
      ],
    },

    {
      icon: Icons.SuperAdmin,
      onClick: () => navigateCloseNav('/superAdmin'),
      active: ['/admin/superAdmin'],
      text: 'Superadmin',
      accessLevels: [
        AccessLevels.SuperAdmin,
        // AccessLevels.Admin,
      ],
    },
  ];
}

function getBottomButtons(setLogoutModalIsVisible, closeNavBar) {
  return [
    {
      icon: Icons.SignOut,
      onClick: () => {
        closeNavBar();
        setLogoutModalIsVisible(true);
      },
      active: [],
      text: 'Logout',
      accessLevels: [
        AccessLevels.SuperAdmin,
        AccessLevels.Admin,
        AccessLevels.Server,
      ],
    },
  ];
}

function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler],
  );
}

function SideNavigation() {
  const ref = useRef();
  const { app, setApp } = useContext(AppContext);
  const history = useHistory();
  const [logoutModalIsVisible, setLogoutModalIsVisible] = useState(false);
  const { user } = useContext(UserContext);
  const accessLevel = user.currentOrganizationRole;

  const closeNavBar = () => {
    setApp({ ...app, showSideNav: false });
  };

  useOnClickOutside(ref, () => {
    closeNavBar(false);
  });

  useEffect(() => {
    setApp((app) => ({ ...app, showSideNav: false }));
  }, [setApp]);

  return (
    <>
      <BaseModal
        open={logoutModalIsVisible}
        modalType={ModalList.LogoutModal}
        onClose={setLogoutModalIsVisible}
      />
      <SideNavContainer
        display={app?.showSideNav ? '1' : ''}
        id="leftNavBar"
        ref={ref}
      >
        <SideNavInner>
          <LogoSquare>
            <LogoImg src={Logo} />
          </LogoSquare>
          {GetSideNavButtons(history, app, closeNavBar).map((b, i) => {
            const pathname = window.location.pathname;

            return (
              <React.Fragment key={i}>
                {b.accessLevels.includes(accessLevel) && (
                  <NavItem
                    key={i}
                    data-tip={b.text}
                    onClick={() => b.onClick()}
                    active={b.active.includes(pathname) ? 1 : 0}
                  >
                    <Icon
                      active={b.active.includes(pathname) ? 1 : 0}
                      icon={b.icon}
                    />
                    <MenuText>{b.text}</MenuText>
                  </NavItem>
                )}
              </React.Fragment>
            );
          })}
          <BottomButtons>
            {getBottomButtons(setLogoutModalIsVisible, closeNavBar).map(
              (b, i) => {
                return (
                  <React.Fragment key={i}>
                    {b.accessLevels.includes(accessLevel) && (
                      <NavItem onClick={b.onClick} data-tip={b.text}>
                        <Icon
                          icon={b.icon}
                          active={
                            b.active.includes(window.location.pathname) ? 1 : 0
                          }
                        />
                        <MenuText bottom>{b.text}</MenuText>
                      </NavItem>
                    )}
                  </React.Fragment>
                );
              },
            )}
          </BottomButtons>
        </SideNavInner>
        <ReactTooltip place="right" type="dark" effect="solid" />
      </SideNavContainer>
    </>
  );
}

export default SideNavigation;
