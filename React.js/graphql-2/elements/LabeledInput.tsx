import React from "react";
import styled from "styled-components";
import { Colors } from "../styles/Colors";
import Input, { InputProps } from './Input';
import Label from './Label';
import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.us';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const ErrorText = styled.div`
  color: ${Colors.Red};
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

 type PhoneInputProps = InputProps & {label?: string}


export function PhoneInput({
  label,
  ...inputProps
}: PhoneInputProps) {
  return (
    <Container>
      {label && <Label text={label} />}
      <Input {...inputProps} />
      {inputProps.error && <ErrorText>{inputProps.error}</ErrorText>}
    </Container>
  );
}


type LabeledInputProps = InputProps & {label?: string}

 function LabeledInput({
  label,
  ...inputProps
}: LabeledInputProps) {
  return (
    <Container>
      {label && <Label text={label} />}
      <Input {...inputProps} />
      {inputProps.error && <ErrorText>{inputProps.error}</ErrorText>}
    </Container>
  );
}

export default LabeledInput
