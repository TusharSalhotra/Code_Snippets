import { Flex } from "components/SharedStyles";
import styled from "styled-components";
import Colors from "../../styles/Colors";
import BgImg from "assets/Images/pexels-pixabay-531880.jpg";

type Props = {
  children: JSX.Element;
};

export const LayoutContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #035b8a2c;
  overflow: hidden;
  background-image: url(${BgImg});
  background-repeat: no-repeat;
  background-size: cover;
`;

export const LeftContainer = styled.div``;

export const InnerContent = styled(Flex)`
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 70%;
  gap: 0;
  margin: 0 auto;
  @media (max-width: 991px) {
    width: 80%;
  }
`;

export const OuterWrapper = styled.div`
  width: 100%;
  height: 490px;
  background: ${Colors.Primary};
  color: ${Colors.White};
  padding: 20px 20px 20px 45px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 0 16px #0000002b;
`;

export const RightContainer = styled.div`
  background: ${Colors.White};
  padding: 50px 30px;
  position: relative;
  right: -10px;
  z-index: 1;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 0 16px #0000002b;
`;

export const InnerWrapper = styled.div``;

export const Label = styled.h1`
  font-size: 45px;
  font-weight: 600;
  margin: 0;
`;
export const MainHeading = styled.h2`
  font-size: 25px;
  margin: 0;
  padding: 2px 0 20px;
`;

export const BodyText = styled.div`
  font-size: 16px;
  letter-spacing: 0.4px;
  line-height: 21px;
`;

export const BottomForm = styled.div``;

const UnAuthenticatedLayout = (props: Props) => {
  return (
    <LayoutContainer>
      <InnerContent>
        <RightContainer>{props.children}</RightContainer>
        <OuterWrapper>
          <InnerWrapper>
            <Label>Welcome to</Label>
            <MainHeading>ABC ENGINEERING</MainHeading>
            <BodyText>
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a
              piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard
              McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur.
            </BodyText>
          </InnerWrapper>
        </OuterWrapper>
      </InnerContent>
    </LayoutContainer>
  );
};

export default UnAuthenticatedLayout;
