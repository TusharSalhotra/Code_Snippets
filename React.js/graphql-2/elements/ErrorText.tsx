import React from "react";
import styled from "styled-components";
import { Colors } from "../styles/Colors";

type ErrorTextProps = {
  large?: boolean;
  align?: string;
};

const ErrorText = styled.div<ErrorTextProps>`
  color: ${Colors.Red};
  font-size: ${(props) => (props.large ? "1.4rem" : "1.5rem")};
  font-weight: 600;
  text-align: ${(props) => props.align || "center"};
    position: absolute;
    width: 100%;
`;

export default ErrorText;
