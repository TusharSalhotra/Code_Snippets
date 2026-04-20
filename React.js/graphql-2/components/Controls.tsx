import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { DonationPortalState } from "../redux/store";
import { Colors } from "../styles/Colors";
import Button, { ButtonTypes } from "../elements/Button";
import * as Polished from "polished";
import useShowNext from "../hooks/useShowNext.hook";
import { FadeIn } from "../elements/Motion";
import * as AppActions from "../redux/actions/app.actions";
import { ScreenEnum, ErrorKeyEnum } from "../redux/reducers/app.reducer";
import IOrganization from "@demo/models/.dist/interfaces/IOrganization";
import ErrorText  from "../elements/ErrorText";
import { inIframe } from "../utils/Tools";
import { OrganizationStatusEnum } from "@demo/models/.dist/enums/OrganizationStatusEnum";
import { DonationPercentEnum } from '@demo/models/.dist/enums/DonationPercentEnum';
import * as Schema from "../utils/Schema";

const Container = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  z-index: 2000;
  @media screen and (max-device-width: 991px) and (orientation: landscape){
    position: relative;
  }
`;

const ButtonContainer = styled(FadeIn)`
  width: calc(100% - 60px);
  padding:10px 30px;
  background-color: ${Polished.rgba(Colors.White, 0.0)};
  height:auto;

`;

const NewErrorText = styled(ErrorText)`
  color: #EE5050;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  position: absolute;
  width: 100%;
  top: auto;
  left: 29px;
  background: #ffff;
  padding: 15px;
  width: calc(84% - 30px);
  word-break: break-word;
  border: 2px solid #ddd;
  bottom: 146px;
  text-align: left;
  border-radius: 10px;

`;

const PaymentInfo = styled.div`
  position: relative;
  background-color: ${Colors.Grey6};
  padding: 10px 30px;
`;

const Row = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const LineItem = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${Colors.Grey3};
  margin-bottom: 5px;
`;

const Logo = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: ${Colors.Grey1};
`;

const Total = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 800;
  color: ${Colors.Grey1};
`;

type ControlsProps = {
  organization: IOrganization;
};

const Controls: React.FC<ControlsProps> = ({ organization }) => {
  /** Hooks **/
  const showNext = useShowNext();
  const setError = (key: ErrorKeyEnum, errorMsg: string) => dispatch(AppActions.setError(key, errorMsg));
  /** State **/
  const { app } = useSelector((state: DonationPortalState) => state);
  const {
    loading,
    screen,
    errors,
    createDonationParams: { donationAmount, amount, coverFees, email, name, url, phoneNumber, address: { streetAddress, city, state, zip }, donorType },
  } = app;

  const error = errors[ErrorKeyEnum.Global];

  /** Actions **/
  const dispatch = useDispatch();
  const navigateForward = () => {
    switch (app.screen) {
      case ScreenEnum.Campaign: {
        dispatch(AppActions.navigateForward())
      }
        break;
      case ScreenEnum.Donate: {
        dispatch(AppActions.navigateForward())
      }
        break;
      case ScreenEnum.Email: {
        const params = Schema.email.validate({ email });
        const { error: schemaError } = params;
        let FieldName: any = Object.keys(params.value)[0];
        if (schemaError) {
          const { message, field } = JSON.parse(schemaError.message);
          setError(FieldName, message);
          return false;
        }
        else {
          setError(FieldName, "");
        };
        dispatch(AppActions.navigateForward())
      }
        break;
      case ScreenEnum.DonationType: {
        dispatch(AppActions.navigateForward())
      }
        break;
      case ScreenEnum.DonorType: {
        dispatch(AppActions.navigateForward())
      }
        break;
      case ScreenEnum.UserInfo: {
        const params = Schema.validateIndividual({ name, phoneNumber } as any);
        Object.keys(params?.value).forEach(function (key) {
          console.log(key, params?.value[key]);
          setError((key as any), "");
        });
        if (params?.error?.details) {
          
          params?.error?.details.map((error) => {
            let fieldName = error?.context?.key as any;
            setError(fieldName, error?.message);
          });
          return false;
        }
        dispatch(AppActions.navigateForward())
      }
        break;
      case ScreenEnum.UserAddressInfo: {
        const params = Schema.validateAddresUser({ streetAddress, city, state, zip } as any);
        Object.keys(params?.value).forEach(function (key) {
          console.log(key, params?.value[key]);
          setError((key as any), "");
        });
        if (params?.error?.details) {
          params?.error?.details.map((error) => {
            let fieldName = error?.context?.key as any;
            let message = error?.message
            setError(fieldName, message);
          });
          return false;
        }
        dispatch(AppActions.navigateForward())
      }
        break;
      case ScreenEnum.BusinessInfo: {
        const params = Schema.validateBusiness({ name, url } as any);
        Object.keys(params?.value).forEach(function (key) {
          console.log(key, params?.value[key]);
          setError((key as any), "");
        });

        if (params?.error?.details) {
          params?.error?.details.map((error) => {
            let fieldName = error?.context?.key as any;
            setError(fieldName, error?.message);
          });
          return false;
        }
        dispatch(AppActions.navigateForward())
      }
        break;
      case ScreenEnum.BusinessAddressInfo: {
        const params = Schema.validateAddresBusiness({ streetAddress, city, state, zip } as any);
        Object.keys(params?.value).forEach(function (key) {
          console.log(key, params?.value[key]);
          setError((key as any), "");
        });

        if (params?.error?.details) {
          params?.error?.details.map((error) => {
            let fieldName = error?.context?.key as any;
            setError(fieldName, error?.message);
          });
          return false;
        }
        dispatch(AppActions.navigateForward())
      }
        break;
      case ScreenEnum.EnterPayment: {
        dispatch(AppActions.navigateForward())
      }
        break;
      case ScreenEnum.ConfirmDonation: {
        dispatch(AppActions.navigateForward())
      }
        break;
      case ScreenEnum.ThankYou: {
        dispatch(AppActions.navigateForward())
      }
    }
  };

  let buttonText = "Next";

  if (screen === ScreenEnum.ConfirmDonation) {
    buttonText = "Confirm Donation";
  }

  if (screen === ScreenEnum.ThankYou) {
    buttonText = inIframe() ? "Close Window" : "Back to Donate";
  }

  let fee = 0;
  if (coverFees) {
    const amountInNumber: number = Number(donationAmount)
    const feePercentInNumber: number = Number(DonationPercentEnum.DonationChargeFees)
    fee = (amountInNumber / feePercentInNumber) - amountInNumber;
  }

  /** Render **/
  return (
    <Container>
      
      {showNext && (
        <ButtonContainer>
          <Button
            type={ButtonTypes.Submit}
            text={buttonText}
            onClick={() => (loading ? null : navigateForward())}
            loading={loading}
          />
        </ButtonContainer>
      )}

      
      {(organization.hasActiveSubscription &&
        organization.stripeConnectId &&
        organization.status === OrganizationStatusEnum.Active) ||
        ((!organization.needSubscription) && organization.stripeConnectId) ? (
        <PaymentInfo>
          <Row>
            <LineItem>Donation Amount</LineItem>
            <LineItem>${Number(donationAmount).toFixed(2)}</LineItem>
          </Row>
          <Row>
            <LineItem>Fees</LineItem>
            <LineItem>${Number(fee).toFixed(2)}</LineItem>
          </Row>
          <Row>
            <Total>Total</Total>
            <Total>${(Number(donationAmount) + Number(fee)).toFixed(2)}</Total>
          </Row>
        </PaymentInfo>
      ) : null}
     
    </Container>
  );
};

export default Controls;
