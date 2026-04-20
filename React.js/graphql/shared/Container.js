import styled from 'styled-components';

const Container = styled.main`
  width: 100%;
  overflow:auto;
  /* max-width: 1300px; */
  display:flex;
  justify-content: center !important;
  align-items: center;
  flex-direction: column;
  padding-right: 50px;
  padding-left: 130px;
  position: relative;

  @media screen and (max-width: 991px) {
    padding:0 20px;
    
  }
`;

export default Container;
