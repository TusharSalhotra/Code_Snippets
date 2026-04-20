import React from "react";
import styled from 'styled-components';
import { Colors } from '../styles/Colors';
import * as Polished from 'polished';

type StyledInputProps = {
  margin?: string;
  padding?: string;
  width: string;
  error?: boolean;
}

const InputStyled = styled.input<StyledInputProps>`
  /* background-color: ${Colors.VeryLightBlue}; */
  color: ${Colors.Grey1};
  outline: none;
  border: 0px;
  border-radius: 10px;
  height: 48px;
  width: ${props => props.width};
  font-size: 1.4rem;
  font-weight: 500;
  padding: 0 0 0 10px;
  transition: all 0.2s;
  margin: ${props => props.error ? false : props.margin};
  padding: ${props => props.padding};
  border: ${props =>
    props.error
      ? `1px solid ${Colors.Red}`
      : `1px solid ${Colors.Grey5}`};

  ::placeholder {
    color: ${Colors.Grey4};
    // font-family: 'Nunito Sans';
    font-weight: 600;
  }

  &:hover {
    /* background-color: ${Polished.darken(0.01, Colors.VeryLightBlue)}; */
    /* border: ${props =>
      props.error
        ? `1px solid ${Colors.Red}`
        : `1px solid ${Polished.darken(0.01, Colors.VeryLightBlue)}`}; */
  }

  &:focus {
    /* background-color: ${Polished.darken(0.02, Colors.VeryLightBlue)}; */
    /* border: ${props =>
      props.error
        ? `1px solid ${Colors.Red}`
        : `1px solid ${Polished.darken(0.02, Colors.VeryLightBlue)}`}; */
  }
`;

export type InputProps = {
  autoFocus?: boolean | undefined;
  placeholder?: string;
  value: string;
  defaultValue?: string;
  type?: string;
  onChange?: any;
  onBlur?: any;
  onFocus?: any;
  margin?: string;
  padding?: string;
  width?: string;
  onKeyPress?:any;
  error?: string | null;
  maxLength?: number;
};

export default function Input({
  autoFocus,
  placeholder,
  value,
  defaultValue,
  type = 'text',
  onChange,
  onBlur,
  onFocus,
  margin,
  padding,
  width = 'fill-available',
  onKeyPress,
  error,
  maxLength,
}: InputProps) {
  return (
    <InputStyled
      autoFocus={autoFocus}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      type={type}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      margin={margin}
      padding={padding}
      width={width}
      onKeyPress={onKeyPress}
      error={Boolean(error)}
      maxLength={maxLength}
    />
  );
}
