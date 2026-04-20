import React, { useEffect, useContext } from 'react';

import styled from 'styled-components';
import { AppContext } from '../context/AppContext';
import colors from '../styles/colors';
import BusinessPreview from './BusinessPreview';
import Icon from './Icon';
import { IconEnum as Icons } from './Icons';

const HeaderContainer = styled.div`
width: 100%;
padding-left: 80px;

@media (max-width:991px){
  padding: 0;
}


`;

const PosterImage = styled.div`
  background-image: ${(props) => `linear-gradient(179.56deg, rgba(0, 0, 0, 0) 58.09%, rgba(0, 0, 0, 0.5) 98.13%), url(${props.src})`};
  background-size: cover;
  background-position: center;
  background-origin: unset;
  position: relative;
  min-height: 160px;
  width: 100%;
  @media screen and (max-width: 991px){
    min-height: 100px;
  }
`;

const BusinessPreviewContainer = styled.div`
  position: absolute;
  bottom: -25px;
  left: 15px;
`;
const HeaderMagin = styled.div`
  margin-bottom:35px;
`;

const BarsContainer = styled.div`
    top: 25px;
    right: 35px;
    display: none;
    position: fixed;
    z-index:20;
    padding: 5px;
    background: rgba(237, 242, 239,0.4);
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    border-radius:7%;
    @media screen and (max-width:991px){
      display: block;

    }
  
`;

export default function Header({ currentOrganisation }) {
  const { app, setApp } = useContext(AppContext);

  useEffect(() => {
    setApp((app) => ({ ...app, showSideNav: false }));
  }, [setApp]);

  if (!currentOrganisation) {
    return null;
  }

  return (
    <HeaderContainer>

      <PosterImage src={currentOrganisation.posterImageUrl}>
        {
          !app.showSideNav
              && (
              <BarsContainer id="hamberger">
                <Icon
                  icon={Icons.MenuSolid}
                  inactiveColor={colors.seaGreen}
                  onClick={() => setApp((app) => ({ ...app, showSideNav: !app.showSideNav }))}
                />
              </BarsContainer>
              )
          }
        <BusinessPreviewContainer>
          <BusinessPreview organization={currentOrganisation} />
        </BusinessPreviewContainer>
      </PosterImage>
      <HeaderMagin />
    </HeaderContainer>
  );
}
