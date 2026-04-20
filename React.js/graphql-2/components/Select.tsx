import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Colors } from "../styles/Colors";
import Icon from '../elements/Icon';
import * as Polished from 'polished';


type OptionContainerProps = {
  active?: boolean;
}

const OptionContainer = styled.div<OptionContainerProps>`
  height: 50px;
  background: ${props => {
    if(props.active) {
      return `${Polished.rgba(Colors.Pink, 0.05)};`;
    }

    return Colors.White;
  }};
  border: ${props => {
    if(props.active) {
      return `1px solid ${Colors.Pink};`;
    }

    return `1px solid ${Colors.Grey5}`;
  }};
  border-radius: 10px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  transition: all 0.1s;

  > div {
    color: ${props => {
      if(props.active) {
        return Colors.Pink;
      }
      return Colors.Grey4;
    }};
  }

  &:hover {
    cursor: ${(props) => (props.onClick ? "pointer" : null)};
    background: ${Polished.rgba(Colors.Pink, 0.05)};
    border: 1px solid ${Colors.Pink};

    > div {
      color: ${Colors.Pink};
    }
  }
`;

const Text = styled.div`
  font-size: 1.4rem;
  margin-left: 10px;
  font-weight: 800;
`;

type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void;

type Option = {
  text: string;
  icon: any;
  onClick: ClickHandler;
  active?: boolean;
};

type OptionProps = {
  option: Option;
}

const Option: React.FC<OptionProps> = ({
  option: { text, icon, onClick, active }
}: OptionProps) => {
  return (
    <OptionContainer onClick={onClick} active={active}>
      <Icon icon={icon} margin="0 0 0 15px" size="14px" />
      <Text>{text}</Text>
    </OptionContainer>
  );
};

const SelectContainer = styled.div`
  margin: 15px 0;
`;

type SelectProps = {
  options: Option[];
}

const Select: React.FC<SelectProps> = ({ options }) => {
  return (
    <SelectContainer>
      {options.map((option, index) => (
        <Option key={index} option={option} />
      ))}
    </SelectContainer>
  );
}

export default Select;
