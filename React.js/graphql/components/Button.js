import React from 'react';
import { darken } from 'polished';
import styled from 'styled-components';
import colors from '../styles/colors';
import Loader, { LoaderSizes } from './Loader';

const ButtonContainer = styled.button`
  -webkit-appearance: none;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  justify-content:center;
  align-items: center;
  background: ${(props) => props.background || colors.seaGreen};
  width: ${(props) => props.width || '150px'};
  padding: ${(props) => props.padding || '15px'};
  min-height: ${(props) => props.minHeight || null};
  min-width: ${(props) => props.minWidth || null};
  margin: ${(props) => props.margin || '0'};
  color: ${colors.white};
  font-size: 1.4rem;
  transition: all 0.3s;
  height: ${(props) => props.height || '40px'}; 
  font-weight: 600;
  display:flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) => (props.background
    ? darken('0.05', props.background)
    : darken('0.05', colors.seaGreen))};
  }

@media screen and (max-width:991px){
  height: ${(props) => props.height || '35px'}; 
  font-size: 12px;
  width: ${(props) => props.width || '70px'};

}

@media screen and (max-width:450px){
  width: ${(props) => props.xswidth || null};

}

`;

export default function Button({
  text, onClick, margin, type, width, loading, background, height, name, value, disabled, xswidth,
  padding, minWidth, minHeight,
}) {
  return (
    <ButtonContainer
      background={background || null}
      type={type || null}
      onClick={onClick || null}
      margin={margin}
      width={width}
      xswidth={xswidth || ''}
      height={height}
      name={name || null}
      value={value || null}
      disabled={disabled || false}
      padding={padding}
      minWidth={minWidth}
      minHeight={minHeight}
    >
      {loading
        ? (
          <Loader
            color={colors.white}
            size={LoaderSizes.VerySmall}
          />
        )
        : text}
    </ButtonContainer>
  );
}
