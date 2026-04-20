import React from 'react';
import styled from 'styled-components';
import Loader from '../components/Loader';
import colors from '../styles/colors';
import Icon from '../components/Icon';

export const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

export const SectionHeader = styled.header`
  display: flex;
  width: 100%;
  flex-direction: ${(props) => props.headerDirection || 'row'};
`;

export const HeaderText = styled.h3`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: clamp(2rem,4.5vw,2.7rem) !important;
  color: ${colors.grey1};
  margin: 10px 10px;
`;

export const Toolbar = styled.div`
  display: flex;
  padding: 12px;
  flex-flow: row wrap;
`;

export const ToolbarItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  font-weight: ${(props) => (props.active ? '600' : '500')};
  color: ${(props) => (props.active ? colors.seaGreen : colors.grey3)};
  margin-right: 15px;
  font-size: 1.4rem;
  cursor: pointer;
  width:max-content;
  border-radius: 10px;
  padding: 5px 10px;
  background: ${(props) => (props.active ? 'rgba(26, 188, 156, 0.1)' : null)};
  @media screen and (max-width:991px){
    ${(props) => (props.headerDirection === 'column' && 'margin-top:10px')};
  }
`;

export const SectionContent = styled.div`
  display: flex;
  width: ${(props) => props.width || '100%'};
  min-height: 50vh;
  justify-content: ${(props) => (props.loading === '1' ? 'center' : 'flex-start')};
  align-items: ${(props) => (props.loading === '1' ? 'center' : 'flex-start')};
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
  margin: 20px 0;
  position: relative;
  flex-direction: ${(props) => props.contentDirection || null};

  @media screen and (max-width: 991px) {
    width: 100%;
  }
`;

const Section = ({
  headerTitle = 'Header Title',
  toolbarItems = [],
  loading = false,
  width,
  headerDirection,
  contentDirection,
  children,
}) => {
  return (
    <SectionContainer>
      <SectionHeader headerDirection={headerDirection}>
        <HeaderText>{headerTitle}</HeaderText>
        {toolbarItems.length > 0 && (
          <Toolbar>
            {toolbarItems.map((item, index) => {
              return (
                <ToolbarItem
                  active={item.active}
                  onClick={item.onClick}
                  key={index}
                  headerDirection={headerDirection}
                >
                  {item.icon && (
                    <Icon
                      icon={item.icon}
                      size={14}
                      margin="0px 10px 0px 0px"
                    />
                  )}

                  {item.text}
                </ToolbarItem>

              );
            })}
          </Toolbar>
        )}
      </SectionHeader>

      <SectionContent
        loading={loading ? '1' : '0'}
        width={width}
        contentDirection={contentDirection}
      >
        {loading ? <Loader /> : children}
      </SectionContent>
    </SectionContainer>
  );
};

export default Section;
