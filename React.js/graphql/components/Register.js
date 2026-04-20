import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import Button from './Button';
import colors from '../styles/colors';
import { REGISTER_USER } from '../graphql/queries';
import { getErrorMessage } from '../util/ErrorUtil';
import Error from './Error';
import Input, { PhoneNumberInput } from './Input';
import { Flex } from './Flex';
import { FadeIn } from './Animation';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TopText = styled.div`
  font-size: 2rem;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
  width: 100%;
  justify-content: center;
`;

const BottomText = styled.div`
  font-size: 1.2rem;
  color: ${(props) => props.color || `${colors.grey3}`};
  cursor: ${(props) => (props.onClick ? 'pointer' : null)};
`;

const NameContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const TOS = styled.div`
  color: ${colors.grey3};
  margin: 25px 0px 10px 0px;
  text-align: center;
`;

const TOSLink = styled.a`
  color: ${colors.seaGreen};
`;

const Spacer = styled.div`
  width: 15px;
`;

function Register({ history }) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [register, { loading }] = useMutation(REGISTER_USER, {
    variables: {
      email,
      firstName,
      lastName,
      phoneNumber,
      password,
    },
    onError(error) {
      setErrorMsg(getErrorMessage(error));
    },
    onCompleted(data) {
      localStorage.setItem('YOUR_DOMAIN_AUTH_TOKEN', data.register.token);
      history.push('/onboarding');
    },
  });

  return (
    <Content>
      <FadeIn duration={0.6}>
        <TopText>
          Let's make you an account.
        </TopText>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            register();
          }}
        >
          <NameContainer>
            <Input
              type="text"
              header="FIRST NAME"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              width="100%"
            />
            <Spacer />
            <Input
              type="text"
              header="LAST NAME"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              width="100%"
            />
          </NameContainer>
          <Input
            type="email"
            header="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            width="100%"
          />
          <PhoneNumberInput
            type="tel"
            header="PHONE NUMBER"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            width="100%"
          />
          <Input
            type="password"
            header="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            width="100%"
          />
          <TOS>
            By registering, you agree to check's&nbsp;
            <TOSLink
              href="https://intercom.help/check-this-out/en/articles/4339634-check-this-out-terms-of-use-and-privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Use and Privacy Policy
            </TOSLink>
          </TOS>
          <Button
            margin="0px 0px 30px 0px"
            text="REGISTER"
            type="submit"
            loading={loading}
            width="100%"
          />
        </Form>
        <Flex justify="center">
          <BottomText>
            ALREADY HAVE AN ACCOUNT?
          </BottomText>
          <BottomText color={colors.seaGreen} onClick={() => history.push('/login')}>
          &nbsp;&nbsp;&nbsp;SIGN IN
          </BottomText>
        </Flex>
        {errorMsg
          && (
          <Error
            error={errorMsg}
            margin="10px 0px 0px 0px"
          />
          )}
      </FadeIn>
    </Content>
  );
}

export default withRouter(Register);
