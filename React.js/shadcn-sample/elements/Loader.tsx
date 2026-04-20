import styled from "styled-components";
import Colors from "../../styles/Colors";

export const LoaderMain = styled.div`
  border: 4px solid ${Colors.White};
  border-radius: 50%;
  border-top: 6px solid ${Colors.Primary};
  width: 50px;
  height: 50px;
  -webkit-animation: spin 2s linear infinite;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 1.1s linear infinite;

  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const LoaderWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.White};
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background-color: #00000011;
  }
`;

const Loader = () => {
  return (
    <LoaderWrapper>
      <LoaderMain />
    </LoaderWrapper>
  );
};

export default Loader;
