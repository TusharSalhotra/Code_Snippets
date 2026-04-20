import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import Button from './Button';
import colors from '../styles/colors';
import { PASSWORD_FORGOT } from '../graphql/queries';
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

function ForgotPassword({ history }) {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [passwordForgot] = useMutation(PASSWORD_FORGOT, {
    variables: {
      email,
    },
    onError(error) {
      setErrorMsg(getErrorMessage(error));
    },
    onCompleted(data) {
      if (data?.passwordForgot?.message) {
        setSuccessMsg(data.passwordForgot.message);
        setEmail('');
      } else {
        setErrorMsg('Something went wrong, please contact support');
      }
    },
  });
  return (
    <Content>
      <FadeIn duration={0.5}>
        <TopText>
          Don't worry, we'll help you out.
        </TopText>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            passwordForgot();
          }}
        >
          <Input
            header="EMAIL"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width="100%"
          />
          <Button
            margin="40px 0px"
            text="SEND RESET INSTRUCTIONS"
            type="submit"
            width="fit-content"
          />
        </Form>
        <BackContainer onClick={() => history.push('/Login')}>
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
      </FadeIn>
    </Content>
  );
}

export default withRouter(ForgotPassword);
