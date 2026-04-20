/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import colors from '../../styles/colors';
import { media } from '../../util/MediaQuery';
import * as Intercom from '../../util/Intercom';

const LayoutContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: ${colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.white};
  border-radius: 5px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;


  ${media.desktop`
    &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: grey;
    border-radius: 10px;
  }
    overflow-y:auto;
    height: 605px;
    width: 400px;
    padding: 30px;
  `};

  ${media.mobile`
    height: 100vh;
    width: 100vw;
    padding: 10px;
  `};
`;

export default function AuthLayout({ history, component: Component, ...rest }) {
  Intercom.boot({}, {}, false);

  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <LayoutContainer>
          <FormContainer>
            <Component {...matchProps} />
          </FormContainer>
        </LayoutContainer>
      )}
    />
  );
}
