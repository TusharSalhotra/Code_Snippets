import styled from "styled-components";
import Colors from "../../styles/Colors";
import { LoaderMain } from "./Loader";

const LoaderWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.White};
`;

const AppLoader = () => {
  return (
    <LoaderWrapper>
      <LoaderMain />
    </LoaderWrapper>
  );
};

export default AppLoader;
