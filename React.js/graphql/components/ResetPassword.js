import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import Button from './Button';
import colors from '../styles/colors';
import { PASSWORD_RESET } from '../graphql/queries';
import { getErrorMessage } from '../util/ErrorUtil';
import Input from './Input';
import Icon from './Icon';
import Error from './Error';
import Success from './Success';
import { IconEnum as Icons } from './Icons';
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
  text-align: center;
  margin-top: 60px;
`;

const BackContainer = styled.div`
  display: flex;
  cursor: pointer;
  position: absolute;
  align-items: center;
  top: 0px;
  left: 0px;
`;

const BackText = styled.div`
  margin-left: 5px;
  color: ${colors.grey3};
  font-size: 1.4rem;
`;

function ResetPassword({ history }) {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const code = new URLSearchParams(history.location.search).get('code');
  const [passwordReset, { loading }] = useMutation(PASSWORD_RESET, {
    variables: {
      password,
      code,
    },
    onError(error) {
      setErrorMsg(getErrorMessage(error));
      setSuccessMsg('');
    },
    onCompleted(data) {
      if (data && data.passwordReset && data.passwordReset.message) {
        if (data.passwordReset.status && data.passwordReset.status > 299) {
          setErrorMsg(data.passwordReset.message);
          setSuccessMsg('');
        } else {
          setErrorMsg('');
          setSuccessMsg(data.passwordReset.message);
        }
      } else {
        setErrorMsg('Something went wrong, please contact support');
        setSuccessMsg('');
      }
    },
  });

  if (!code) history.push('/forgotPassword');

  return (
    <Content>
      <FadeIn duration={0.5}>
        <TopText>
          Please choose a new password.
        </TopText>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            passwordReset();
          }}
        >
          <Input
            header="PASSWORD"
            type="password"
            required="required"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            width="100%"
          />
          <Button
            margin="40px 0px"
            text="SET NEW PASSWORD"
            type="submit"
            width="fit-content"
            loading={loading}
          />
        </Form>
        <BackContainer onClick={() => history.push('/login')}>
          <Icon
            icon={Icons.LeftArrow}
            size={14}
            active
          />
          <BackText>
            Back
          </BackText>
        </BackContainer>
        {errorMsg
          && (
          <Error
            error={errorMsg}
            margin="20px 0px 0px 0px"
          />
          )}
        {successMsg
          && (
          <Success
            message={successMsg}
            margin="20px 0px 0px 0px"
          />
          )}
        {successMsg
          && (
          <BottomText color={colors.seaGreen} onClick={() => history.push('/login')}>
            &nbsp;&nbsp;&nbsp;GO TO LOGIN
          </BottomText>
          )}
      </FadeIn>
    </Content>
  );
}

export default withRouter(ResetPassword);
