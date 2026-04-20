import React from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';

const CardStyled = styled.div`
  position: relative;
  background-color: ${colors.white};
  width: ${(props) => props.width || '315px'};
  /* max-height: 320px; */
  max-width: ${(props) => props.maxWidth || null};
  margin: ${(props) => props.margin || '0px 30px 30px 0px'};
  float: left;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 5px;
`;

const CardHeader = styled.div`
  border-radius: 5px 5px 0px 0px;
  position: relative;
  padding: 15px 15px 10px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CardTitleText = styled.div`
  position: relative;
  font-size: 1.4rem;
  font-weight: 500;
  color: ${colors.grey1};
`;

const HeaderRenderRight = styled.div``;

export const CardHeaderNumber = styled.div`
  font-weight: 600;
  font-size: clamp(1rem,4vw,2.7rem);
  color: ${colors.grey1};
  margin-bottom: 20px;
`;

export const CardHeaderNumberSubtitle = styled.div`
  font-size: 1.2rem;
  color: ${colors.grey2};
  margin: -15px 0px 20px 0px;
`;

export const CardSubtitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.grey1};
  margin-bottom: 10px;
`;

export const FlexCardContent = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 10px;

  &:last-of-type {
    margin-bottom: ${(props) => props.lastMargin};
  }
`;

export const FlexCardSubContent = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: -5px;
  margin-bottom: 15px;

  &:last-of-type {
    margin-bottom: 0px;
  }
`;

export const CardContentText = styled.div`
  font-size: 1.4rem;
  color: ${colors.grey2};
  word-break: ${(props) => (props.breakWord ? 'break-word' : null)};
`;

export const CardContentSubText = styled.div`
  font-size: 1.2rem;
  color: ${colors.grey3};
  word-break: ${(props) => (props.breakWord ? 'break-word' : null)};
`;

const CardContentContainer = styled.div`
  padding: ${(props) => (props.padding ? props.padding : '0px 15px 15px 15px')};
`;

export function Card({
  title, headerRenderRight, children, width, margin, maxWidth, padding, custom,
}) {
  return (
    <CardStyled width={width} margin={margin} maxWidth={maxWidth}>
      {!custom && (
      <CardHeader>
        <CardTitle>
          <CardTitleText>{title}</CardTitleText>
        </CardTitle>
        <HeaderRenderRight>{headerRenderRight}</HeaderRenderRight>
      </CardHeader>
      )}
      <CardContentContainer padding={padding}>
        {children}
      </CardContentContainer>
    </CardStyled>
  );
}

export function CardContentLine({
  left, right, subLeft, subRight,
}) {
  return (
    <>
      <FlexCardContent lastMargin={(subLeft || subRight) ? '10px' : '0px'}>
        <CardContentText breakWord>{left || ''}</CardContentText>
        <CardContentText>{right || ''}</CardContentText>
      </FlexCardContent>
      {(subLeft || subRight)
      && (
      <FlexCardSubContent>
        <CardContentSubText breakWord>{subLeft || ''}</CardContentSubText>
        <CardContentSubText>{subRight || ''}</CardContentSubText>
      </FlexCardSubContent>
      )}
    </>
  );
}
