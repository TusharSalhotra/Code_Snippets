import Header from "components/header/Header";
import { Card } from "components/SharedStyles";
import Sidebar, { SideBarWidth } from "components/side-nav/SideBar";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Colors from "styles/Colors";

const AppWrapperDiv = styled.div`
  width: 100vw;
  height: 100vh;
`;
const ChildrenWrapper = styled.div`
  background-color: ${Colors.Grey};
  height: calc(100% - 70px);
  width: 100vw;
  position: relative;
  left: 0;
  top: 70px;
  padding: 15px;
  overflow: hidden auto;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;

  &.open {
    left: ${SideBarWidth?.width};
    width: calc(100vw - ${SideBarWidth?.width});
  }
`;

type Props = {
  children: JSX.Element;
};

const AuthenticatedLayout = (props: Props) => {
  const { isSideNav } = useSelector((state: any) => state.app);
  return (
    <AppWrapperDiv>
      <Header className={isSideNav ? "open" : ""} />
      <Sidebar className={isSideNav ? "open" : ""} />
      <ChildrenWrapper className={isSideNav ? "open" : ""}>
        <Card> {props.children}</Card>
      </ChildrenWrapper>
    </AppWrapperDiv>
  );
};

export default AuthenticatedLayout;
