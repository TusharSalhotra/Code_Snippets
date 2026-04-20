import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { DonationPortalState } from "../redux/store";
import IOrganization from "@demo/models/.dist/interfaces/IOrganization";
import { Colors } from "../styles/Colors";
import ScreenHeader from "../components/ScreenHeader";
import Label from "../elements/Label";
import ICreateDonationParams from "@demo/models/.dist/interfaces/ICreateDonationParams";
import * as AppActions from "../redux/actions/app.actions";
import { ErrorKeyEnum } from "../redux/reducers/app.reducer";
import LabeledInput from "../elements/LabeledInput";
import Cleave from 'cleave.js/react';
import 'cleave.js/dist/addons/cleave-phone.us';
import * as Polished from 'polished';
import Flex from "../elements/Flex";
import Checkbox from "../elements/Checkbox";
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
  height: calc(100% - 84px);
  @media screen and (max-device-width:991px) and (orientation: landscape){
    overflow: initial;
    overflow-x: initial;
   }
`;
const AnonText = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  color: ${Colors.Grey1};
  margin-left: 10px;
`;

const SmallText = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${Colors.Grey2};
  margin-left: 10px;
`;

type PhoneInputProps = {
  margin?: string;
  padding?: string;
  width?: string;
  error?: boolean;
}

const PhoneInput = styled(Cleave) <PhoneInputProps>`
  color: ${Colors.Grey1};
  outline: none;
  border: 0px;
  border-radius: 10px;
  height: 48px;
  width: ${props => props.width};
  font-size: 1.4rem;
  font-weight: 500;
  padding: 0 0 0 10px;
  transition: all 0.2s;
  padding: ${props => props.padding};
  border: ${props =>
    props.error
      ? `1px solid ${Colors.Red}`
      : `1px solid ${Colors.Grey5}`};

  ::placeholder {
    color: ${Colors.Grey4};
    // font-family: 'Nunito Sans';
    font-weight: 600;
  }

  &:hover {
    /* background-color: ${Polished.darken(0.01, Colors.VeryLightBlue)}; */
    /* border: ${props =>
    props.error
      ? `1px solid ${Colors.Red}`
      : `1px solid ${Polished.darken(0.01, Colors.VeryLightBlue)}`}; */
  }

  &:focus {
    /* background-color: ${Polished.darken(0.02, Colors.VeryLightBlue)}; */
    /* border: ${props =>
    props.error
      ? `1px solid ${Colors.Red}`
      : `1px solid ${Polished.darken(0.02, Colors.VeryLightBlue)}`}; */
  }

`
const ErrorText = styled.div`
  color: ${Colors.Red};
  font-size: 1.2rem;
  font-weight: 600;
`;

type UserInfoProps = {
  organization: IOrganization;
};

const UserInfo: React.FC<UserInfoProps> = () => {
  /** State **/
  const { app } = useSelector((state: DonationPortalState) => state);
  const [phone, setPhone] = useState('')
  const {
    createDonationParams: { name, phoneNumber, address, anonymous },
  } = app;
  const errors: any = app.errors
  const showNext = useShowNext();
  /** Actions **/
  const dispatch = useDispatch();
  const setCreateDonationParams = (data: any) => {

  }
  const setError = (key: ErrorKeyEnum, errorMsg: string) =>
    dispatch(AppActions.setError(key, errorMsg));


    useEffect(() => {
      setPhone(phoneNumber as string)
      
    }, [phoneNumber])

  /** Render **/
  return (
    <Container showNext={showNext}>
      <ScreenHeader title="Contact Info" />
      <Content>
        <Label text="Let's get some basics" />
        <LabeledInput
          autoFocus
          type="text"
          placeholder="Your full name"
          value={name}
          width="100%"
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            const value = event.currentTarget.value;
            setCreateDonationParams({ name: value });
          }}
          margin="0px 0px 10px 0px"
          error={errors["name"]}
        />
        <PhoneInput
          options={{ phone: true, phoneRegionCode: 'US' }}
          type="tel"
          width="100%"
          placeholder="Phone Number"
          value={phoneNumber || ""}
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            const value = event.currentTarget.value;
            // setPhone(value)
            const phone = value?.replace(new RegExp(' ',"g"),'')
            setCreateDonationParams({ phoneNumber: phone?.replace(/^0+/, '') });
          }}
          margin="0px 0px 10px 0px"
          error={errors["phoneNumber"]}
        />
        <ErrorText>{errors["phoneNumber"]}</ErrorText>
        <Flex margin="20px 0 0">
          <Checkbox
            active={anonymous}
            onChange={(active: boolean) =>
              setCreateDonationParams({ anonymous: active })
            }
          />
          <Flex direction="column">
            <AnonText>I want to donate anonymously</AnonText>
            <SmallText>
              Your donation will be attributed to "Anonymous Donor"
            </SmallText>
          </Flex>
        </Flex>
      </Content>
    </Container>
  );
};

export default UserInfo;
