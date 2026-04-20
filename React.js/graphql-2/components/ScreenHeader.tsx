import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { DonationPortalState } from "../redux/store";
import { Colors } from "../styles/Colors";
import BackButton from './BackButton';
import { ScreenEnum } from '../redux/reducers/app.reducer';

const Container = styled.div`
  position: relative;
`;


type HeaderBarProps = {
  height: string;
}

const HeaderBar = styled.div<HeaderBarProps>`
  height: ${props => props.height};
  display: flex;
  flex-direction: row;
  background-color: ${Colors.White};
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
`;

const HeaderBarText = styled.div`
  font-size: 1.4rem;
  line-height: 140%;
  font-weight: 500;
  color: ${Colors.Grey1};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

type ScreenHeaderProps = {
  title?: string;
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
  title,
 }) => {
  /** State **/
  const { screen } = useSelector(
    (state: DonationPortalState) => state.app
  );

  /** Render **/
  const isDonateScreen = screen === ScreenEnum.Campaign;
  return (
    <Container>
      {title && (
        <HeaderBar height={isDonateScreen ? '10px' : '60px'}>
          <Row>
            {!isDonateScreen && <BackButton />}
          </Row>
        </HeaderBar>
      )}
    </Container>
  );
};

export default ScreenHeader;
