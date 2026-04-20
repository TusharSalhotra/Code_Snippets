import styled from 'styled-components';

export const Flex = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction};
  justify-content: ${(props) => props.justify};
  align-items: ${(props) => props.align};
  width: ${(props) => props.width};
  flex: ${(props) => props.flex};
  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
  height: ${(props) => props.height};
  border-right: ${(props) => props.borderRight};
  flex-wrap: ${(props) => props.flexWrap};
  position: ${(props) => props.position};
  top: ${(props) => props.top};
`;
