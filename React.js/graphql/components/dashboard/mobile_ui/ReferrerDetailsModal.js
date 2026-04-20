import { useMutation } from '@apollo/react-hooks';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Button from '../../Button';
import * as Price from '../../../util/Price';
import { SEND_WELCOME_TEXT } from '../../../graphql/queries';
import colors from '../../../styles/colors';
import * as Time from '../../../util/Time';
import { AppContext } from '../../../context/AppContext';

const ListWrapper = styled.ul`
  width: calc(85vw - 20px);
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
  margin: 0 10px;
  list-style: none;
  padding: 0 15px;
  overflow: auto;
  max-height: 60vh;
  position: relative;
`;

const ListItem = styled.li`
  min-height: 30px;
  border-bottom: 1px solid ${colors.grey5};
  padding: 10px;
  margin-bottom: 5x;
  font-size: 13px;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  color: ${(props) => (props.onClick ? colors.seaGreen : null)};
`;

const ListKey = styled.div`
  display: flex;
  flex:1;
  font-weight: 450;
 
`;

const ListValue = styled.div`
  display: flex;
  
  padding-left: 10px;
  justify-content:flex-start;
`;

const ButtonContainer = styled.div`
  padding: 20px 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-radius: 7px;
  min-height: 40px;
  position: sticky;
  bottom: 0;
  background-color: ${colors.white};
`;

const ReferrerDetailsModal = ({ contactData: contact }) => {
  const { setApp } = useContext(AppContext);
  const history = useHistory();
  const [sendWelcome] = useMutation(SEND_WELCOME_TEXT, {
    variables: {
      phoneNumbers: [contact.phoneNumber],
    },
    onError(error) {
      console.log(error);
    },
    onCompleted() {
      console.log('Welcomed');
    },
  });

  const hasBeenWelcomed = contact.welcomed > Time.now() - Time.DAY * 7;

  const refAcceptedClickable = (contact.totalAmountAccepted > 0) || false;

  const redeemClickable = (contact.totalAmountRedeemed > 0) || false;

  return (
    <ListWrapper>
      {contact && (
        <>
          {/* <ListHeader>{contact.phoneNumber}</ListHeader> */}
          <ListItem>
            <ListKey>Phone Number:</ListKey>{' '}
            <ListValue> {contact.phoneNumber}</ListValue>
          </ListItem>
          <ListItem onClick={
                  refAcceptedClickable
                    ? () => {
                      setApp((app) => ({
                        ...app,
                        getRefsQuery: {
                          phoneNumber: contact.phoneNumber,
                          couponType: 'accepted',
                          _id: contact._id,
                        },
                      }));
                      history.push('/customers');
                    }
                    : null
                }
          >
            <ListKey>Total Ref Discount Accepted :</ListKey>{' '}
            <ListValue>
              {`$${Price.output(contact.totalAmountAccepted || 0, true)}`}
            </ListValue>
          </ListItem>
          <ListItem onClick={
                  redeemClickable
                    ? () => {
                      setApp((app) => ({
                        ...app,
                        getRefsQuery: {
                          phoneNumber: contact.phoneNumber,
                          couponType: 'redeemed',
                          _id: contact._id,
                        },
                      }));
                      history.push('/customers');
                    }
                    : null
                }
          >
            <ListKey>Total Ref Discount Redeemed :</ListKey>
            <ListValue> {`$${Price.output(contact.totalAmountRedeemed || 0, true)}`}</ListValue>
          </ListItem>
          <ListItem>
            <ListKey>Total Ref Conversion Rate :</ListKey>
            <ListValue>
              {contact.conversionRate}%
            </ListValue>
          </ListItem>

          {!hasBeenWelcomed && (
          <ButtonContainer>
            <Button
              text="Send Welcome"
              onClick={() => sendWelcome()}
              width="70%"
              type="button"
              padding="0px"
              height="35px"
            />
          </ButtonContainer>
          )}
        </>
      )}
    </ListWrapper>
  );
};

export default ReferrerDetailsModal;
