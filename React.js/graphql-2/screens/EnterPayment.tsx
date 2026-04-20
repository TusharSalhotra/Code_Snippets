import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { DonationPortalState } from "../redux/store";
import IOrganization from "@demo/models/.dist/interfaces/IOrganization";
import { Colors } from "../styles/Colors";
import ScreenHeader from "../components/ScreenHeader";
import * as AppActions from "../redux/actions/app.actions";
import Flex from "../elements/Flex";
import Checkbox from "../elements/Checkbox";
import Icon, { Icons } from "../elements/Icon";
import ICreateDonationParams from "@demo/models/.dist/interfaces/ICreateDonationParams";
import * as Polished from "polished";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripeElementStyle } from "@stripe/stripe-js";
import ErrorText  from "../elements/ErrorText";
import { ErrorKeyEnum } from "../redux/reducers/app.reducer";
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
  .Element {
    margin: 0;
    max-width: 100%;
    flex: 1 0 auto;
    outline: 0;
    text-align: left;
    line-height: 1.21428571em;
    background: #fff;
    border-radius: 10px;
    transition: box-shadow 0.1s ease, border-color 0.1s ease;
    box-shadow: none;
    font-size: 14px;
    margin-top: 5px;
    padding: 1.4rem;
    padding-left: 3.7rem;
    height: 17px;
  }
`;

const Form = styled.form`
  /* display: flex; */
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  flex: 1;
`;

const Spacer = styled.div`
  flex: 0.075;
`;

const AnonText = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
  color: ${Colors.Grey1};
  margin-left: 10px;
`;

type ElementContainerProps = {
  focused: boolean;
};

const ElementContainer = styled.div<ElementContainerProps>`
  position: relative;
  flex: 1;

  .Element {
    border: 1px solid
      ${(props) => {
        if (props.focused) return Colors.Grey4;
        return Colors.Grey5;
      }};

    &:hover {
      border: 1px solid
        ${(props) => {
          if (props.focused) return Colors.Grey4;
          return Polished.darken(0.05, Colors.Grey5);
        }};
    }
  }
`;

const Content = styled.div`
  padding: 0 30px;
  overflow: auto;
  overflow-x: hidden;
  padding-top: 12px;
  padding-bottom: 12px;
  height: calc(100% - 84px);
  @media screen and (max-width: 767px){
    overflow: initial;
    overflow-x: initial;
   }
`;

const NewErrorText = styled(ErrorText)`
  position: relative;
`;

type AddPaymentProps = {
  organization: IOrganization;
};

const CardIconMap: Record<string, React.ReactNode> = {
  Visa: (
    <Icon icon={Icons.UpArrow} size={14} margin="0 7px 0 0" color={Colors.Grey1} />
  ),
  MasterCard: (
    <Icon
      icon={Icons.UpArrow}
      size={14}
      margin="0 7px 0 0"
      color={Colors.Grey1}
    />
  ),
  Discover: (
    <Icon
      icon={Icons.UpArrow}
      size={14}
      margin="0 7px 0 0"
      color={Colors.Grey1}
    />
  ),
  AmericanExpress: (
    <Icon icon={Icons.UpArrow} size={14} margin="0 7px 0 0" color={Colors.Grey1} />
  ),
};

enum ElementsEnum {
  CardNumber = "CardNumber",
  CVC = "CVC",
  ExpDate = "ExpDate",
}

const AddPayment: React.FC<AddPaymentProps> = () => {
  /** Hooks **/
  const stripe = useStripe();
  const elements = useElements();
  const showNext = useShowNext();
  /** State **/
  const { app } = useSelector((state: DonationPortalState) => state);
  const {
    errors,
    createDonationParams: { optInToCommunication },
  } = app;
  const error = errors[ErrorKeyEnum.Global];
  const [focused, setFocus] = React.useState<ElementsEnum | null>(null);

  /** Actions **/
  const dispatch = useDispatch();
  const setCreateDonationParams = () => {

  }
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardNumberElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    console.log(paymentMethod);
  };

  /** Render **/
  const style: StripeElementStyle = {
    base: {
      fontSize: "14px",
      fontWeight: "500",
      // height: "40px",
      color: Colors.Grey1,
      fontSmoothing: "antialiased",
      fontFamily: "neue-haas-grotesk-display",
      "::placeholder": {
        color: Colors.Grey4,
      },
      ":focus": {},
    },
    invalid: {
      color: Colors.Red,
    },
  };

  const isFocused = (field: ElementsEnum) => field === focused;
  const iconColor = (field: ElementsEnum) =>
    isFocused(field) ? Colors.Grey3 : Colors.Grey4;

  return (
    <Container showNext={showNext}>
      <ScreenHeader title="Add payment" />
      <Content>
        <Form onSubmit={handleSubmit}>
          <Row>
            <ElementContainer focused={isFocused(ElementsEnum.CardNumber)}>
              <Icon
                icon={Icons.CreditCardFront}
                color={iconColor(ElementsEnum.CardNumber)}
                size={14}
                position="absolute"
                top="20px"
                left="15px"
              />
              <CardNumberElement
                className="Element"
                options={{ style, placeholder: "Card Number" }}
                onFocus={() => setFocus(ElementsEnum.CardNumber)}
                onBlur={() => setFocus(null)}
              />
            </ElementContainer>
          </Row>
          <Row>
            <ElementContainer focused={isFocused(ElementsEnum.CVC)}>
              <Icon
                icon={Icons.CalendarDayLight}
                color={iconColor(ElementsEnum.CVC)}
                size={14}
                position="absolute"
                top="20px"
                left="17px"
              />
              <CardCvcElement
                className="Element"
                options={{ style, placeholder: "CVC" }}
                onFocus={() => setFocus(ElementsEnum.CVC)}
                onBlur={() => setFocus(null)}
              />
            </ElementContainer>
            <Spacer />
            <ElementContainer focused={isFocused(ElementsEnum.ExpDate)}>
              <Icon
                icon={Icons.CreditCardBack}
                color={iconColor(ElementsEnum.ExpDate)}
                size={14}
                position="absolute"
                top="20px"
                left="15px"
              />
              <CardExpiryElement
                className="Element"
                options={{ style, placeholder: "Exp. Date" }}
                onFocus={() => setFocus(ElementsEnum.ExpDate)}
                onBlur={() => setFocus(null)}
              />
            </ElementContainer>
          </Row>
        </Form>
        <Flex margin="30px 0 30px">
          <Checkbox
            active={optInToCommunication as boolean}
            onChange={(active: boolean) =>
              setCreateDonationParams({ optInToCommunication: active })
            }
          />
          <Flex direction="column">
            <AnonText>Opt-in to communications from {organization.name}</AnonText>
          </Flex>
        </Flex>
        {error && <NewErrorText align="center">{error}</NewErrorText>}
      </Content>
    </Container>
  );
};

export default AddPayment;
