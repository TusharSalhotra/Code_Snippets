import React from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';
import Icon from './Icon';
import { IconEnum as Icons } from './Icons';

const ErrorContainer = styled.div`
  color: ${colors.grey1};
  margin: ${(props) => props.margin || '0px'};
  text-align: ${(props) => props.textAlign || 'center'};;
  align-items: center;
  font-size: 1.2rem;
  position: ${(props) => props.position || 'absolute'};
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
`;

export default function Error({ error, margin, position, textAlign }) {
  return (
    <ErrorContainer margin={margin} position={position} textAlign={textAlign}>
      <Icon
        icon={Icons.Warning}
        margin="0px 10px 0px 0px"
        size={15}
        activeColor={colors.yellow}
        active
      />
      {error}
    </ErrorContainer>
  );
}
