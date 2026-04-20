import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import Button from './Button';
import colors from '../styles/colors';
import { PASSWORD_LOGIN, GET_CURRENT_USER } from '../graphql/queries';
import { getErrorMessage } from '../util/ErrorUtil';
import Error from './Error';
import Input from './Input';
import { Flex } from './Flex';
import { FadeIn } from './Animation';
import Logo from '../assets/images/cto-full-logo.png';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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

const LogoImage = styled.img`
  width: 200px;
  margin-bottom: 20px;
`;

const ForgotPasswordText = styled.div`
  margin-top: 15px;
  font-size: 1rem;
  color: ${colors.seaGreen};
  align-self: baseline;
  cursor: pointer;
`;

const Spacer = styled.div`
  height: 5px;
`;

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [passwordLogin, { loading }] = useMutation(PASSWORD_LOGIN, {
    variables: {
      email,
      password,
    },
    onError(error) {
      setErrorMsg(getErrorMessage(error));
    },
    onCompleted(data) {
      if (data && data.passwordLogin && data.passwordLogin.token) {
        localStorage.setItem('YOUR_DOMAIN_AUTH_TOKEN', data.passwordLogin.token);
        getUser();
      } else {
        setErrorMsg('Something went wrong, please contact support');
      }
    },
  });
  const [getUser, { loading: userLoading }] = useLazyQuery(GET_CURRENT_USER, {
    onCompleted(data) {
      if (data?.getCurrentUser) {
        if (!data.getCurrentUser.organizationContextId) {
          history.push('/onboarding');
        } else {
          history.push('/redeemCoupon');
        }
      } else {
        setErrorMsg('Something went wrong, please contact support');
      }
    },
    onError(error) {
      setErrorMsg(getErrorMessage(error));
    },
  });

  return (
    <Content>
      <LogoImage src={Logo} />
      <FadeIn duration={0.6}>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            passwordLogin();
          }}
        >
          <Input
            header="EMAIL"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            width="100%"
          />
          <Input
            header="PASSWORD"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            width="100%"
          />
          <ForgotPasswordText onClick={() => history.push('/forgotPassword')}>
            FORGOT PASSWORD?
          </ForgotPasswordText>
          <Button
            margin="40px 0px"
            width="30%"
            text="SIGN IN"
            type="submit"
            padding="0px"
            loading={loading || userLoading}
          />
        </Form>
        <Flex align="center" direction="column" margin="0px 0px 25px 0px">
          <BottomText>
            DON'T HAVE AN ORGANIZATION ACCOUNT?
          </BottomText>
          <Spacer />
          <BottomText color={colors.seaGreen} onClick={() => history.push('/register')}>
          &nbsp;&nbsp;&nbsp;SIGN UP
          </BottomText>
        </Flex>
        <Flex align="center" direction="column">
          <BottomText>
            DON'T WORK FOR AN ORGANIZATION?
          </BottomText>
          <Spacer />
          <BottomText color={colors.seaGreen} onClick={() => window.location.assign(`${window.location.origin}/user/home`)}>
            CHECK YOUR USER BALANCE HERE
          </BottomText>
        </Flex>
        {errorMsg
          && (
          <Error
            error={errorMsg}
            margin="20px 0px 0px 0px"
          />
          )}
      </FadeIn>
    </Content>
  );
}

export default Login;
