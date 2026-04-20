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
import IAddress from "@demo/models/.dist/interfaces/IAddress";
import Select from 'react-select';
import { IUSstates } from '@demo/models/.dist/interfaces/IUSstates';
import { any } from "@hapi/joi";
import useShowNext from "../hooks/useShowNext.hook";
type ContainerProps = {
  showNext: boolean;
}
type styledselectprops = {
  hasError: string
}

const StyledSelect = styled(Select) <styledselectprops>`
div[class*="-control"]{
  border:${props => props.hasError ? "1px solid red" : "1px solid #E0E0E0"} !important;
}
`
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
  @media screen and (max-device-width: 991px) and (orientation: landscape){
    overflow: initial;
    overflow-x: initial;
   }
`;
const SmallText = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${Colors.Grey2};
  margin-left: 10px;
`;
const DropDown = styled.div`
  width: 50%;
  position: relative;
`;

const StyleState = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ZipCode = styled.div`
  width: 48%;
`;

const ErrorText = styled.div`
  color: ${Colors.Red};
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: -9px;
`;

const colourStyles = {
  menu: (base: any) => ({
    ...base,
    height: "auto",
    position: "absolute",
  }),
  menuPortal: (base: any) => ({  // to popout dropdown options outside overflow
    ...base,
    zIndex: 9999
  })
};



type UserAddressInfoProps = {
  organization: IOrganization;
};

const UserAddressInfo: React.FC<UserAddressInfoProps> = () => {

  /** State **/
  const { app } = useSelector((state: DonationPortalState) => state);
  const {
    createDonationParams: { name, phoneNumber, address, anonymous, optInToCommunication},
  } = app;
  const { streetAddress = "", city = "", state = "", zip = "" }: IAddress = address
  const errors: any = app.errors
  /** Actions **/
  const dispatch = useDispatch();
  const setCreateDonationParams = (data: any) => {}
  const setError = (key: ErrorKeyEnum, errorMsg: string) =>
    dispatch(AppActions.setError(key, errorMsg));

  //enum to array conversion
  const showNext = useShowNext();
  const statesArray = [];

  for (const [propertyKey, propertyValue] of Object.entries(IUSstates)) {
    if (!Number.isNaN(Number(propertyKey))) {
      continue;
    }
    statesArray.push({ label: propertyValue, value: propertyKey });
  }
  type selectedStateType={
    value:string,
    label:string
  }

  const [selectedState, setSelectedState] = useState<selectedStateType|null>(()=>{
    if(state){
      return {
        label:state,
        value:state
      }
    }
    return null
  });

  useEffect(() => {
    setCreateDonationParams({ address: { ...address, state: selectedState?.value as any } });
  }, [selectedState])

  /** Render **/
  return (
    <Container showNext={showNext}>
      <ScreenHeader title="Contact Info" />
      <Content>
        <Label text="Your mailing address" />
        <LabeledInput
          type="text"
          placeholder="Street Address"
          value={streetAddress}
          width="100%"
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            const { value } = event.currentTarget; 
            setCreateDonationParams({ address: { ...address, streetAddress: value } });
          }}
          margin="0px 0px 10px 0px"
          error={errors["streetAddress"]}
        />
        <LabeledInput
          type="text"
          placeholder="City"
          value={city}
          width="100%"
          onChange={(event: React.FormEvent<HTMLInputElement>) => {
            const { value } = event.currentTarget;
            setCreateDonationParams({ address: { ...address, city: value } });
          }}
          margin="0px 0px 10px 0px"
          error={errors["city"]}
        />
        <StyleState>
          <DropDown>
          <StyledSelect
              hasError={errors["state"]}
              maxMenuHeight={150}
              className="test"
              value={selectedState}
              onChange={({ value }: any) => {
                setSelectedState({label:value,value})
              }}
              placeholder="State"
              options={statesArray}
              styles={colourStyles}
              menuPortalTarget={document.body}
            />
            <ErrorText>{errors["state"]}</ErrorText>
          </DropDown>
          <ZipCode>
            <LabeledInput
              placeholder="ZIP"
              value={zip}
              width="100%"
              onChange={(event: React.FormEvent<HTMLInputElement>) => {
                const { value } = event.currentTarget;
                let numbers = /^[-+]?[0-9]+$/;
               if(value.match(numbers) || value === ""){
                setCreateDonationParams({ address: { ...address, zip: value?.replace(new RegExp(' ',"g"),'').toString() }});
              }}
            }
              margin="0px 0px 10px 0px"
              error={errors["zip"]}
              maxLength={5}
            />
          </ZipCode>
        </StyleState>
      </Content>
    </Container>
  );
};

export default UserAddressInfo;
