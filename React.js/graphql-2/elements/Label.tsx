import React from "react";
import styled from "styled-components";
import { Colors } from "../styles/Colors";

type ContainerProps = {
  margin: string;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: ${(props) => props.margin};
  /* height: 15px; */
`;

const Text = styled.div`
  position: relative;
  font-size: 1.2rem;
  color: ${Colors.Grey1};
  font-weight: 800;
`;

type LabelProps = {
  text: string
  margin?: string;
};

const Label: React.FC<LabelProps> = ({ text, margin = '0 0 10px' }) => {
  return (
    <Container margin={margin}>
      <Text>
        {text}
      </Text>
    </Container>
  );
};

export default Label;
