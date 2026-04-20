import React from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';

export const LoaderSizes = Object.freeze({
  VerySmall: 'VerySmall',
  Small: 'Small',
  Medium: 'Medium',
  Large: 'Large',
});

const LoaderSizesMap = {
  [LoaderSizes.VerySmall]: 24,
  [LoaderSizes.Small]: 30,
  [LoaderSizes.Medium]: 40,
  [LoaderSizes.Large]: 60,
};

const scale = (size, scale) => `${size * scale}px`;

const StyledLoader = styled.div`
  position: relative;
  top: 1.5px;

  .lds-ring {
    display: inline-block;
    position: relative;
    width: ${(props) => scale(props.size, 1)};
    height: ${(props) => scale(props.size, 1)};
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${(props) => scale(props.size, 0.8)};
    height: ${(props) => scale(props.size, 0.8)};
    margin: ${(props) => scale(props.size, 0.1)};
    border: ${(props) => scale(props.size, 0.066)} solid ${(props) => props.color};
    border-radius: 50%;
    animation: lds-ring 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${(props) => props.color} transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.2s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.1s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function Loader({
  size = LoaderSizes.Large,
  color = colors.seaGreen,
}) {
  return (
    <StyledLoader
      size={LoaderSizesMap[size]}
      color={color}
    >
      <div className="lds-ring">
        <div />
        <div />
        {/* <div></div> */}
        <div />
      </div>
    </StyledLoader>
  );
}
