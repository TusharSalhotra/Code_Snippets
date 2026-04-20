import React from "react";
import styled from "styled-components";
import { COLORS } from "../styles/Colors";

const LoaderMain = styled.div`
  border: 6px solid ${COLORS.white};
  border-radius: 50%;
  border-top: 6px solid ${COLORS.secondary};
  width: 50px;
  height: 50px;
  -webkit-animation: spin 2s linear infinite;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 1.1s linear infinite;

  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const LoaderWrapper = styled.div`
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.bodyBackground};
`;

const Loader = () => {
  return (
    <LoaderWrapper>
      <LoaderMain />
    </LoaderWrapper>
  );
};

export default Loader;
