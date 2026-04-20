import React from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';

const Container = styled.div`
  height: 70px;
  min-height: 70px;
  padding: 0px 20px;
  background: ${colors.white};
  border-bottom: 1px solid ${colors.grey6};
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const RenderLeft = styled.div`
`;

const RenderRight = styled.div`
`;

function PageSubHeader({
  renderLeft,
  renderRight,
}) {
  return (
    <Container>
      <RenderLeft>
        {renderLeft}
      </RenderLeft>
      <RenderRight>
        {renderRight}
      </RenderRight>
    </Container>
  );
}

export default PageSubHeader;
