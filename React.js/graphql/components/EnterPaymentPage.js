import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import colors from '../styles/colors';
import {
  GET_CURRENT_ORGANIZATION,
} from '../graphql/queries';
import Error from './Error';
import { FadeIn } from './Animation';
import EnterPayment from './EnterPayment';
import ChangePayment from './ChangePayment';
import Loader from './Loader';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
  width: 100%;
  justify-content: center;
  text-align: center;
`;

const Body = styled.div`
  /* display: flex;
  flex: 1;
  width: 100%; */
`;

const BodyText = styled.div`
  font-size: 1.4rem;
  color: ${colors.grey2};
  margin-bottom: 30px;
  line-height: 21px;
`;

const TopText = styled.div`
  font-size: 2rem;
  text-align: center;
  margin: 35px 0px;
`;

function EnterPaymentPage() {
  const history = useHistory();
  const [error, setError] = useState('');
  const { data, loading } = useQuery(GET_CURRENT_ORGANIZATION);

  if (loading) {
    return (
      <Loader />
    );
  }

  // if the user is a previous customer just update the card.
  // otherwise create a new stripe account.
  const isPreviousCustomer = data?.getCurrentOrganization?.subscriptionId;
  const bodyText = isPreviousCustomer
    ? 'You need to update your payment information to continue using check. If you have an outstanding balance, you will be charged.'
    : 'You will be charged an immediate $99.00 onboarding fee.';

  return (
    <Content>
      <FadeIn duration={0.6}>
        <TopText>
          Enter your payment information.
        </TopText>
        <BodyText>
          {bodyText}
        </BodyText>
        <BodyText>
          check will charge you credit card $.30 for every $1 of discount activated and for agreed upon fees for professional services automatically every month.
        </BodyText>
        <Body>
          {isPreviousCustomer ? (
            <ChangePayment
              setError={setError}
              onCompleted={() => {
                history.push('/dashboard');
              }}
            />
          ) : (
            <EnterPayment
              setError={setError}
              onCompleted={() => {
                history.push('/dashboard');
              }}
            />
          )}
          {error
            && (
            <Error
              error={error}
              margin="20px 0px 0px 0px"
            />
            )}
        </Body>
      </FadeIn>
    </Content>
  );
}

export default EnterPaymentPage;
