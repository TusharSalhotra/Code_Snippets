import { all, takeLatest, put, select, call } from "redux-saga/effects";
import { AppActionTypes } from "../actions/app.actions";
import * as AppActions from "../actions/app.actions";
import * as Embed from "../../utils/Embed";
import { useSelector, useDispatch } from 'react-redux';
import { DonationPortalState } from "../store";
import { ScreenEnum, ErrorKeyEnum } from "../reducers/app.reducer";
import { DonationPortalStatusEnum } from "@demo/models/.dist/enums/DonationPortalStatusEnum";
import { DonorTypeEnum } from "@demo/models/.dist/enums/DonorTypeEnum";
import * as StripeService from "../../utils/StripeService";
import { CardNumberElement } from "@stripe/react-stripe-js";
import client from "../../graphql/client";
import gql from "graphql-tag";
import * as ErrorUtil from "../../utils/ErrorUtil";
import { inIframe } from "../../utils/Tools";
import ICreateDonationParams from "@demo/models/.dist/interfaces/ICreateDonationParams";
import { DonationTypesEnum } from "@demo/models/.dist/enums/DonationTypesEnum";

const offlineDonation = window.location.href.split("offlineDonation")[1] !== undefined ? window.location.href.split("offlineDonation")[1] : "";

const CREATE_DONATION = gql`
  mutation CreateDonation($params: CreateDonationParams!) {
    createDonation(params: $params) {
      _id
    }
  }
`;

export default function* appSaga() {
  try {
    yield all([
      setStatusWatch(),
      navigateForwardWatch(),
      navigateBackwardWatch(),
      createStripeTokenWatch(),
      createDonationWatch(),
    ]);
  } catch (e) {
    console.error(e);
  }
}

/********************************************************************************
 *  Set Status
 *******************************************************************************/

function* setStatusWatch() {
  yield takeLatest(AppActionTypes.SET_PURCHASE_PORTAL_STATUS, setStatusSaga);
}

function* setStatusSaga(action: AppActions.SetDonationPortalStatusAction) {
  const {
    payload: { status },
  } = action;

  Embed.setStatus(status);
}

/********************************************************************************
 *  Clear Validation Error
 *******************************************************************************/
function* clearValidation() {
}

/********************************************************************************
 *  Navigate Forward
 *******************************************************************************/

function* navigateForwardWatch() {
  yield takeLatest(AppActionTypes.NAVIGATE_FORWARD, navigateForwardSaga);
}

function* navigateForwardSaga(action: AppActions.NavigateForwardAction) {
  const state: DonationPortalState = yield select(
    (state: DonationPortalState) => state
  );

  const { app } = state;
  const { screen, organizationId, organizationsCache, errors } = app;
  const organization = organizationsCache[organizationId];
  const {
    createDonationParams: { donorType },
  } = app;

  switch (screen) {
    case ScreenEnum.Campaign:
      yield put(AppActions.setScreen(ScreenEnum.Donate));
      return;

    case ScreenEnum.Donate:
      yield put(AppActions.setScreen(ScreenEnum.Email));
      return;

    case ScreenEnum.Email:
      if (offlineDonation) {
        yield put(AppActions.setScreen(ScreenEnum.DonorType));
      }
      else {
        yield put(AppActions.setScreen(ScreenEnum.DonationType));
      }
      return;

    case ScreenEnum.DonationType:
      yield put(AppActions.setScreen(ScreenEnum.DonorType));
      return;

    case ScreenEnum.DonorType:
      if (donorType === DonorTypeEnum.Individual) {
        yield put(AppActions.setScreen(ScreenEnum.UserInfo));
        return;
      } else {
        yield put(AppActions.setScreen(ScreenEnum.BusinessInfo));
        return;
      }

    case ScreenEnum.UserInfo:
      yield put(AppActions.setScreen(ScreenEnum.UserAddressInfo));
      return;

    case ScreenEnum.BusinessInfo:
      yield put(AppActions.setScreen(ScreenEnum.BusinessAddressInfo));
      return;

    case ScreenEnum.UserAddressInfo:
    case ScreenEnum.BusinessAddressInfo:
      if (offlineDonation) {
        yield put(AppActions.setScreen(ScreenEnum.ConfirmDonation));
      }
      else {
        yield put(AppActions.setScreen(ScreenEnum.EnterPayment));
      }
      return;

    case ScreenEnum.EnterPayment:
      yield put(AppActions.createStripeToken());
      yield takeLatest(
        AppActionTypes.CREATE_STRIPE_TOKEN_SUCCESS,
        function* () {
          yield put(AppActions.setScreen(ScreenEnum.ConfirmDonation));
        }
      );
      return;

    case ScreenEnum.ConfirmDonation:
      yield put(AppActions.createDonation());
      yield takeLatest(AppActionTypes.CREATE_DONATION_SUCCESS, function* () {
        yield put(AppActions.setScreen(ScreenEnum.ThankYou));
      });
      return;

    case ScreenEnum.ThankYou:
      if (inIframe()) {
        Embed.close();
      } else {
        yield put(AppActions.setScreen(ScreenEnum.Campaign));
      }

      return;
  }
}

/********************************************************************************
 *  Navigate Backward
 *******************************************************************************/

function* navigateBackwardWatch() {
  yield takeLatest(AppActionTypes.NAVIGATE_BACKWARD, navigateBackwardSaga);
}

function* navigateBackwardSaga(action: AppActions.NavigateBackwardAction) {
  const state: DonationPortalState = yield select(
    (state: DonationPortalState) => state
  );

  const { app } = state;
  const { screen, organizationId, organizationsCache, errors } = app;
  const organization = organizationsCache[organizationId];
  const {
    createDonationParams: { donorType },
  } = app;
  const { createDonationParams } = app;

  switch (screen) {
    case ScreenEnum.Campaign:
      return;

    case ScreenEnum.Donate:
      yield put(AppActions.setScreen(ScreenEnum.Campaign));
      return;

    case ScreenEnum.Email:
      yield put(AppActions.setScreen(ScreenEnum.Donate));
      return;

    case ScreenEnum.DonationType:
      yield put(AppActions.setScreen(ScreenEnum.Email));
      return;

    case ScreenEnum.DonorType:
      if (offlineDonation) {
        yield put(AppActions.setScreen(ScreenEnum.Email));
      }
      else {
        yield put(AppActions.setScreen(ScreenEnum.DonationType));
      }
      return;

    case ScreenEnum.UserInfo:
    case ScreenEnum.BusinessInfo:
      let sendData = { ...createDonationParams, name: "", url: "", phoneNumber: "", anonymous: false }
      app.createDonationParams = sendData
      yield put(AppActions.setScreen(ScreenEnum.DonorType));
      return put(AppActions.setCreateDonationParams(app.createDonationParams))

    case ScreenEnum.UserAddressInfo:
      let addressData = { ...createDonationParams, address: { streetAddress: '', city: '', state: '', zip: '' }, optInToCommunication: true }
      app.createDonationParams = addressData
      yield put(AppActions.setScreen(ScreenEnum.UserInfo));
      return put(AppActions.setCreateDonationParams(app.createDonationParams))

    case ScreenEnum.BusinessAddressInfo:
      let businessData = { ...createDonationParams, address: { streetAddress: '', city: '', state: '', zip: '' } }
      app.createDonationParams = businessData
      yield put(AppActions.setScreen(ScreenEnum.BusinessInfo));
      return put(AppActions.setCreateDonationParams(app.createDonationParams))

    case ScreenEnum.EnterPayment:
      let paymentData = { ...createDonationParams, optInToCommunication: true }
      app.createDonationParams = paymentData
      if (donorType === DonorTypeEnum.Individual) {
        yield put(AppActions.setScreen(ScreenEnum.UserAddressInfo));
        return put(AppActions.setCreateDonationParams(app.createDonationParams))
      } else {
        yield put(AppActions.setScreen(ScreenEnum.BusinessAddressInfo));
        return;
      }

    case ScreenEnum.ConfirmDonation:
      if (offlineDonation) {
        if (donorType === DonorTypeEnum.Individual) {
          yield put(AppActions.setScreen(ScreenEnum.UserAddressInfo));
          return put(AppActions.setCreateDonationParams(app.createDonationParams))
        } else {
          yield put(AppActions.setScreen(ScreenEnum.BusinessAddressInfo));
        }
      }
      else {
        yield put(AppActions.setScreen(ScreenEnum.EnterPayment));
      }
      return;
  }
}


/********************************************************************************
 *  Create Stripe Token
 *******************************************************************************/

function* createStripeTokenWatch() {
  yield takeLatest(AppActionTypes.CREATE_STRIPE_TOKEN, createStripeTokenSaga);
}

function* createStripeTokenSaga({
  payload,
}: AppActions.CreateStripeTokenAction) {
  const stripeInjection = StripeService.stripe();
  if (!stripeInjection) return;

  const { stripe, elements } = stripeInjection;

  try {
    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) return;

    const { token, error } = yield call(async () => {
      return await stripe.createToken(cardNumberElement);
    });

    if (error) {
      yield put(AppActions.createStripeTokenFailure(error.message));
      return;
    } else {
      yield put(AppActions.createStripeTokenSuccess(token.id));
    }
  } catch (e) {
    console.error(e);
  }
}

/********************************************************************************
 *  Create Donation
 *******************************************************************************/

function* createDonationWatch() {
  yield takeLatest(AppActionTypes.CREATE_DONATION, createDonationSaga);
}

function* createDonationSaga({ payload }: AppActions.CreateDonationAction) {
  const state: DonationPortalState = yield select(
    (state: DonationPortalState) => state
  );
  const { app } = state;
  const { createDonationParams } = app;
  let sendData = { ...createDonationParams }
  
  if(offlineDonation){
    sendData = { ...createDonationParams, type: DonationTypesEnum.OfflineDonation}
  }
  if (createDonationParams.donorType === DonorTypeEnum.Organization) {
    delete sendData.phoneNumber
  }
  else if (createDonationParams.donorType === DonorTypeEnum.Individual) {
    delete sendData.url
  }

  sendData.amount = Math.round(Number(sendData.donationAmount) * 100)
  delete sendData.donationAmount
  try {
    const res: Promise<void> = yield call(async () => {
      return await client.mutate({
        mutation: CREATE_DONATION,
        variables: {
          params: sendData,
        },
      });
    });
    yield put(AppActions.createDonationSuccess(sendData));

  } catch (e) {
    const errorMsg = ErrorUtil.getErrorMessage(e);
    yield put(AppActions.createDonationFailure(errorMsg));
  }
}
