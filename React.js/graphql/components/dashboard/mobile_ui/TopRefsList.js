import React, { useState } from 'react';
import styled from 'styled-components';
import colors from '../../../styles/colors';
import BaseModal, { ModalList } from '../../modals/BaseModal';

import NoContent from '../../../shared/NoContent';

const ListWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 60vh;
`;

const ListContainer = styled.ul`
  width: 100%;
  position: relative;
  height: auto;
  max-height: 60vh;
  overflow: auto;
  display: grid;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.05);
  margin: 0;
  grid-template-columns: 1fr;
`;

const ListHeader = styled.div`
  font-weight: 450;
  font-size: 1.2rem !important;
  padding: 7px 0px;
  color: #333333;
  list-style-type: none;
  display: flex;
  justify-content: space-around;
  position: sticky;
  top: 0;
  align-items: center;
  height: auto;
  min-height: 50px;
  font-size: 17px;
  text-align: start;
  border: 1px solid ${colors.grey6};
  background: ${colors.white};
  z-index: 15;
`;
const ListHeaderItem = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  flex: 1;
  display: flex;
  height: 100%;
`;

const ListItem = styled.li`
  cursor: pointer;
  font-size: 1.2rem !important;

  color: #333333;
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: auto;
  min-height: 50px;
  font-size: 17px;
  position: relative;
  text-align: start;
  border: 1px solid ${colors.grey6};
`;

const Key = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
`;

const Value = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
`;

export default function ContactsList({ contacts }) {
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [contactData, setContactData] = useState({});

  const listItemClick = (contactData) => {
    setContactData(contactData);

    setDetailsModalVisible(true);
  };

  return (
    <ListWrapper>
      <BaseModal
        open={detailsModalVisible}
        modalType={ModalList.ReferrerDetailsModal}
        onClose={setDetailsModalVisible}
        contactData={contactData}
      />

      {contacts && contacts.length > 0 ? (
        <ListContainer>
          <ListHeader>
            <ListHeaderItem>Phone Number</ListHeaderItem>
            <ListHeaderItem>Ref Conversion Rate</ListHeaderItem>
          </ListHeader>
          {contacts.map((contact) => {
            return (
              <ListItem
                key={contact._id}
                onClick={() => listItemClick(contact)}
              >
                <Key>{contact.phoneNumber}</Key>
                <Value>{contact.conversionRate}%</Value>
              </ListItem>
            );
          })}
        </ListContainer>
      ) : (
        <>
          <NoContent header="No Referrers found" description="Your organization do'nt have any referrers yet." />
        </>
      )}
    </ListWrapper>
  );
}
