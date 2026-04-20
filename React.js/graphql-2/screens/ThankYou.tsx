import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { DonationPortalState } from "../redux/store";
import IOrganization from "@demo/models/.dist/interfaces/IOrganization";
import { Colors } from "../styles/Colors";
import ScreenHeader from "../components/ScreenHeader";
import ICreateDonationParams from "@demo/models/.dist/interfaces/ICreateDonationParams";
import * as AppActions from "../redux/actions/app.actions";
import Flex from "../elements/Flex";
import TextArea from "../elements/TextArea";
import useShowNext from "../hooks/useShowNext.hook";
type ContainerProps = {
  showNext: boolean;
}

const Container = styled.div<ContainerProps>`
position: relative;
margin-top: -50px;
background-color: ${Colors.White};
border-radius: 15px;
overflow: hidden;
height: calc(100% - ${props => props.showNext ?"335px": "275px"});
@media screen and (max-device-width: 991px) and (orientation: landscape){
  overflow:initial;
  height:auto;
 }
`;

const Content = styled.div`
padding: 0 30px;
overflow: auto;
overflow-x: hidden;
padding-top: 12px;
padding-bottom: 12px;
height: calc(100% - 24px);
@media screen and (max-device-width: 991px) and (orientation: landscape){
  overflow: initial;
  overflow-x: initial;
 }
`;

const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6.4rem;
`;

const BigText = styled.div`
  font-size: 2.4rem;
  font-weight: 800;
  color: ${Colors.Grey1};
  text-align: center;
`;

const SmallText = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  color: ${Colors.Grey2};
  margin: 15px 0px;
`;

const Image = styled.img`
  position: relative;
  width: 100%;
  margin-top: 5px;
  margin-bottom: 15px;
  border-radius: 10px;
`;

type ConfirmDonationProps = {
  organization: IOrganization;
};

const ConfirmDonation: React.FC<ConfirmDonationProps> = () => {
  /** State **/
  const { app } = useSelector((state: DonationPortalState) => state);
  const {
    createDonationParams: { amount, message },
  } = app;
  const showNext = useShowNext();
  /** Actions **/
  const dispatch = useDispatch();

  /** Render **/
  return (
    <Container showNext={showNext}>
      <ScreenHeader />
      <Content>
        <Image src="https://media.giphy.com/media/IcGkqdUmYLFGE/giphy.gif" />
        <BigText>Thank you!</BigText>      
      </Content>
    </Container>
  );
};

export default ConfirmDonation;
