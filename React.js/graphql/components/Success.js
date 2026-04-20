import React from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';
import Icon from './Icon';
import { IconEnum as Icons } from './Icons';

const SuccessContainer = styled.div`
  color: ${colors.grey1};
  margin: ${(props) => props.margin || '0px'};
  text-align: center;
  align-items: center;
  font-size: 1.2rem;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
`;

export default function Success({ message, margin }) {
  return (
    <SuccessContainer margin={margin}>
      <Icon
        icon={Icons.CheckCircleSolid}
        margin="0px 10px 0px 0px"
        size={15}
        activeColor={colors.green}
        active
      />
      {message}
    </SuccessContainer>
  );
}
