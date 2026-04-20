import React from "react";
import styled from "styled-components";
import { Colors } from '../styles/Colors';
import Icon, { Icons } from './Icon';

type CheckBoxProps = {
  active: boolean;
  onChange?: Function;
};

const Container = styled.div<CheckBoxProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  width: 16px;
  background-color: ${(props) => (props.active ? Colors.Pink : Colors.White)};
  border: 2px solid ${Colors.Pink};
  border-radius: 2px;

  &:hover {
    cursor: pointer;
  }
`;


const CheckBox: React.FC<CheckBoxProps> = ({
  active,
  onChange = () => {},
}) => {
  return (
    <Container
      active={active}
      onClick={() => onChange(!active)}
    >
      {active && <Icon icon={Icons.CheckRegular} color={Colors.White} size={14}/>}
    </Container>
  );
};

export default CheckBox;
