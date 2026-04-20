import React from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';

const NoContentContainer = styled.div`
  width:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: ${colors.white};
  text-align: center;
`;

const NoContentBody = styled.div`
height: 55vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const NoContentHeader = styled.div`
  font-weight: 600;
  font-size: 1.4rem;
  color: ${colors.grey1};
  margin-bottom: 10px;
`;

const NoContentText = styled.div`
  font-weight: 500;
  font-size: 1.2rem;
  color: ${colors.grey3};
`;

const NoContent = ({ header = 'header', description = 'description' }) => (
  <NoContentContainer>
    <NoContentBody>
      <NoContentHeader>{header}</NoContentHeader>
      <NoContentText>
        {description}
      </NoContentText>
    </NoContentBody>
  </NoContentContainer>
);

export default NoContent;
