import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { AppContext } from '../../context/AppContext';
import NoContent from '../../shared/NoContent';
import colors from '../../styles/colors';
import * as Price from '../../util/Price';

const TableContainer = styled.div`
  background: ${colors.white};
  width: 100%;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid ${colors.grey6};
  margin-bottom: 18px;

  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;

const TableHeader = styled.div`
  display: flex;
  
`;

const TableHeaderItem = styled.div`
  font-size: 1.2rem;
  color: ${colors.grey3};
  flex: ${(props) => props.flex || '1'};
  padding: 15px 25px;
  border-right: 1px solid ${colors.grey6};
`;

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const TableRow = styled.div`
  border-top: 1px solid ${colors.grey6};
  display: flex;
 

  &:hover {
    background: rgba(211, 211, 211, 0.1);
  }
  transition: all 0.1s;
`;

const TableRowItem = styled.div`
  font-size: 1.4rem;
  color: ${colors.grey1};
  flex: ${(props) => props.flex || '1'};
  color: ${(props) => (props.onClick ? colors.seaGreen : null)};
  cursor: ${(props) => (props.onClick ? 'pointer' : null)};
  padding: 15px 25px;
  border-right: 1px solid ${colors.grey6};
`;

const TopRefs = ({ contacts }) => {
  const { setApp } = useContext(AppContext);
  const history = useHistory();

  return (
    <>
      {contacts.length > 0
        ? (
          <TableContainer>
            <TableHeader>
              <TableHeaderItem>PHONE</TableHeaderItem>
              <TableHeaderItem>TOTAL REF DISCOUNT ACCEPTED</TableHeaderItem>
              <TableHeaderItem>TOTAL REF DISCOUNT REDEEMED </TableHeaderItem>
              <TableHeaderItem>TOTAL REF CONVERSION RATE</TableHeaderItem>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => {
                const refClickable = contact.totalAccepted > 0 || false;
                const redClickable = contact.totalRedeemed > 0 || false;

                return (
                  <TableRow key={contact._id}>
                    <TableRowItem>{contact.phoneNumber}</TableRowItem>
                    <TableRowItem
                      onClick={
                  refClickable
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
                      {`$${Price.output(contact.totalAmountAccepted || 0, true)}`}
                    </TableRowItem>
                    <TableRowItem
                      onClick={
                  redClickable
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
                      {`$${Price.output(contact.totalAmountRedeemed || 0, true)}`}
                    </TableRowItem>
                    <TableRowItem>{contact.conversionRate}%</TableRowItem>
                  </TableRow>
                );
              })}
            </TableBody>
          </TableContainer>
        )

        : <NoContent header="No Referrers found" description="Your organization do'nt have any referrers yet." />}
    </>
  );
};

export default TopRefs;
