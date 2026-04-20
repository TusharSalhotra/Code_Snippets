import React from 'react';
import styled from 'styled-components';
import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.us';
import colors from '../styles/colors';
import { Flex } from './Flex';

const InputContainer = styled.div`
  width: ${(props) => props.width};
  max-width: 100%;
  margin:${(props) => props.margin || null};

  @media screen and (max-width:991px){
    width: ${(props) => props.width || '100%'}
  }
  @media screen and (max-width:450px){
    width: ${(props) => props.xswidth || null}
  }
`;

const TextAreaStyle = styled.textarea`
  width: ${(props) => props.width};
  padding: 10px;
  border-radius: 5px;
  background: ${colors.white};
  border: 1px solid ${colors.grey5};
  height: 120px;
  font-family: 'Poppins', sans-serif !important;
  box-sizing: border-box;
  max-width: ${(props) => props.maxWidth};
`;

const InputStyle = styled.input`
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  padding: 0px 10px;
  border-radius: ${(props) => props.radius || '5px'};
  background: ${colors.white};
  border: 1px solid ${colors.grey5};
  box-sizing: border-box;
  padding:${(props) => props.padding || ''};

  &:focus {
    border: 1px solid ${colors.grey3};
  }
  @media screen and (max-width:991px){
    width:${(props) => props.width || '100%'};
  }
`;

const AddressContainer = styled.div`
  width: ${(props) => props.width};
  border-radius: 5px;
  background: ${colors.white};
  display: flex;
  flex-direction: column;
`;

const AddressInputStyle = styled.input`
  padding: 10px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border-radius: ${(props) => props.borderRadius};
  background: ${colors.white};
  border: 1px solid ${colors.grey5};
  box-sizing: border-box;

  &:focus {
    border: 1px solid ${colors.grey3};
  }
`;

const PhoneInputStyle = styled(Cleave)`
  width: ${(props) => props.width || '100%'};
  padding: 10px;
  border-radius: 5px;
  background: ${colors.white};
  border: 1px solid ${colors.grey5};
  box-sizing: border-box;
  height: ${(props) => props.height || '40px'};

  &:focus {
    border: 1px solid ${colors.grey3};
  }
  @media screen and (max-width:991px){
    width: ${(props) => props.width || '100%'}
  }

  @media screen and (max-width:450px){
    width: ${(props) => props.xswidth || null}
  }
`;

const HeaderStyle = styled.div`
  font-size: 1.2rem;
  color: ${colors.grey3};
  margin: ${(props) => (props.top ? '0px 0px 10px 0px' : '30px 0px 10px 0px')};
`;

const FooterStyle = styled.div`
  font-size: 1.2rem;
  margin-top: 10px;
  color: ${colors.grey3};
`;

const Suffix = styled.div`
  color: ${colors.grey3};
  font-size: 1.4rem;
  font-weight: 600;
  margin-left: 10px;
`;

const DollarLabel = styled.div`
  background: ${colors.grey5};
  color: ${colors.grey3};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 1.4rem;
  height: ${(props) => props.height || '40px'};
  width: 25px;
  border-radius: 5px 0px 0px 5px;
`;

const PercentLabel = styled.div`
  background: ${colors.grey5};
  color: ${colors.grey3};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 1.4rem;
  height: ${(props) => props.height || '40px'};
  width: 25px;
  border-radius: 0 5px 5px 0;
`;

export default function Input({
  width,
  header,
  footer,
  type,
  placeholder,
  name,
  value,
  onChange,
  top,
  margin,
  checked,
  required,
  minLength,
  height,
  maxLength,
  readOnly,
  padding,
  xswidth,

}) {
  return (
    <InputContainer
      width={width || '400px'}
      margin={margin || ''}
      xswidth={xswidth}
    >
      {header && (
      <HeaderStyle
        top={top}
      >
        {header}
      </HeaderStyle>
      )}
      <InputStyle
        height={height || '40px'}
        width={width || '100%'}
        type={type || 'text'}
        placeholder={placeholder || ''}
        value={value || ''}
        name={name || ''}
        onChange={onChange || null}
        checked={checked || ''}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        readOnly={readOnly || null}
        padding={padding || ''}
      />
      {footer && (
      <FooterStyle>
        {footer}
      </FooterStyle>
      )}
    </InputContainer>
  );
}

export function TextAreaInput({
  width,
  header,
  footer,
  type,
  placeholder,
  name,
  value,
  onChange,
  maxWidth,
  top,
  required,
  minLength,
  note,
}) {
  return (
    <InputContainer>
      {header && (
      <HeaderStyle
        top={top}
      >
        {header}
      </HeaderStyle>
      )}
      <TextAreaStyle
        width={width || '100%'}
        type={type || 'text'}
        placeholder={placeholder || ''}
        name={name || ''}
        value={value || ''}
        onChange={onChange || null}
        required={required}
        minLength={minLength}
        maxWidth={maxWidth || ''}
      />
      {footer && (
      <FooterStyle>
        {footer}
      </FooterStyle>
      )}
      {note && (
      <FooterStyle>
        {note}
      </FooterStyle>
      )}
    </InputContainer>
  );
}

export function AddressInput({
  header,
  footer,
  top,
  width,
  address1Value,
  address1OnChange,
  address2Value,
  address2OnChange,
  cityValue,
  cityOnChange,
  stateValue,
  stateOnChange,
  zipValue,
  zipOnChange,
}) {
  return (
    <InputContainer
      width={width || '400px'}
    >
      {header && (
      <HeaderStyle
        top={top}
      >
        {header}
      </HeaderStyle>
      )}
      <AddressContainer
        width={width || '100%'}
      >
        <AddressInputStyle
          type="text"
          placeholder="Address 1"
          value={address1Value}
          onChange={address1OnChange}
        />
        <AddressInputStyle
          type="text"
          placeholder="Address 2"
          value={address2Value}
          onChange={address2OnChange}
        />
        <Flex>
          <AddressInputStyle
            type="text"
            placeholder="City"
            value={cityValue}
            onChange={cityOnChange}
          />
          <AddressInputStyle
            type="text"
            placeholder="State"
            value={stateValue}
            onChange={stateOnChange}
            maxLength={2}
          />
          <AddressInputStyle
            type="text"
            placeholder="Zip"
            value={zipValue}
            onChange={zipOnChange}
          />
        </Flex>
      </AddressContainer>
      {footer && (
      <FooterStyle>
        {footer}
      </FooterStyle>
      )}
    </InputContainer>
  );
}

export function PhoneNumberInput({
  height,
  width,
  header,
  footer,
  xswidth,
  type,
  placeholder,
  value,
  onChange,
  top,
  readOnly,
  required,
}) {
  return (
    <InputContainer
      width={width || '100%'}
      xswidth={xswidth || null}
    >
      {header && (
      <HeaderStyle
        top={top}
      >
        {header}
      </HeaderStyle>
      )}
      <PhoneInputStyle
        height={height || '40px'}
        width="100%"
        type={type || 'text'}
        placeholder={placeholder || ''}
        xswidth={xswidth || null}
        value={value || ''}
        onChange={onChange || null}
        required={required}
        options={{ phone: true, phoneRegionCode: 'US' }}
        readOnly={readOnly || null}
        maxLength={14} // need to fix that weird edge case with multiple 1's at beginning of phone number
        id="phoneInput"
      />
      {footer && (
      <FooterStyle>
        {footer}
      </FooterStyle>
      )}
    </InputContainer>
  );
}

export function MoneyInput({
  height,
  width,
  header,
  footer,
  type,
  placeholder,
  value,
  onChange,
  top,
  required,
  margin,

}) {
  return (
    <InputContainer width={width || '400px'} margin={margin}>
      {header && (
      <HeaderStyle
        top={top}
      >
        {header}
      </HeaderStyle>
      )}
      <Flex height={height || null} align="center">
        <DollarLabel height={height || null}>$</DollarLabel>
        <InputStyle
          height={height || '40px'}
          width={width || '100%'}
          type={type || 'text'}
          placeholder={placeholder || ''}
          value={value || ''}
          onChange={onChange || null}
          required={required}
          radius="0px 5px 5px 0px"
        />
      </Flex>
      {footer && (
      <FooterStyle>
        {footer}
      </FooterStyle>
      )}
    </InputContainer>
  );
}

export function PercentInput({
  height,
  width,
  header,
  footer,
  type,
  placeholder,
  value,
  onChange,
  top,
  required,
  margin,

}) {
  return (
    <InputContainer width={width || '400px'} margin={margin}>
      {header && (
      <HeaderStyle
        top={top}
      >
        {header}
      </HeaderStyle>
      )}
      <Flex height={height || null} align="center">

        <InputStyle
          height={height || '40px'}
          width={width || '100%'}
          type={type || 'text'}
          placeholder={placeholder || ''}
          value={value || ''}
          onChange={onChange || null}
          required={required}
          radius="5px 0px 0px 5px"
        />
        <PercentLabel height={height || null}>%</PercentLabel>
      </Flex>
      {footer && (
      <FooterStyle>
        {footer}
      </FooterStyle>
      )}
    </InputContainer>
  );
}

export function SuffixedInput({
  height,
  width,
  header,
  footer,
  type,
  placeholder,
  value,
  onChange,
  top,
  required,
  suffix,
}) {
  return (
    <InputContainer>
      {header && (
      <HeaderStyle
        top={top}
      >
        {header}
      </HeaderStyle>
      )}
      <Flex align="center">
        <InputStyle
          height={height || '40px'}
          width={width || '50px'}
          type={type || 'text'}
          placeholder={placeholder || ''}
          value={value || ''}
          onChange={onChange || null}
          required={required}
        />
        <Suffix>
          {suffix}
        </Suffix>
      </Flex>
      {footer && (
      <FooterStyle>
        {footer}
      </FooterStyle>
      )}
    </InputContainer>
  );
}
