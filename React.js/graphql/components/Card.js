import React from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';

const CardContainer = styled.div`
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  padding: ${(props) => props.padding};
  min-height: ${(props) => props.height || '400px'};
  width: ${(props) => props.width};
  /* overflow: scroll; */
  background: ${colors.white};
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin: ${(props) => props.margin};

  @media screen and (max-width: 991px) {
    padding: 20px 17px;
    width: 100%;
  }
`;

export default function Card({
  height,
  width = '100%',
  margin = '0px',
  padding = '40px 70px',
  children,
}) {
  return (
    <CardContainer
      height={height}
      width={width}
      margin={margin}
      padding={padding}
    >
      {children}
    </CardContainer>
  );
}
