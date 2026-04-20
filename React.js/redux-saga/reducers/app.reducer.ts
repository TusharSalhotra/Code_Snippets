import {
  AppActionTypes,
  AppActionCreatorTypes,
  SetScreenAction,
  SetErrorAction,
  CreateStripeTokenAction,
  CreateStripeTokenSuccessAction,
  CreateStripeTokenFailureAction,
} from '../actions/app.actions';

export enum ErrorKeyEnum {
  Global = 'Global',
  UserEmail = 'UserEmail',
  ConfirmUserEmail = 'ConfirmUserEmail',
  UserFullName = 'UserFullName',
  UserPhoneNumber = 'UserPhoneNumber',
}

export enum ScreenEnum {
  Campaign= 'Campaign',
  Donate = 'Donate',
  Email = 'Email',
  DonationType = 'DonationType',
  DonorType = 'DonorType',
  UserInfo = 'UserInfo',
  BusinessInfo = 'BusinessInfo',
  UserAddressInfo = 'UserAddressInfo',
  BusinessAddressInfo = 'BusinessAddressInfo',
  EnterPayment = 'EnterPayment',
  ConfirmDonation = 'Confirm Donation',
  DonationConfirmed = 'Donation Confirmed',
  ThankYou = 'ThankYou',
}

export type ErrorMap = {
  [key in ErrorKeyEnum]?: string
}

type AppReducerState = {
  intercomEnabled: boolean;
  screen: ScreenEnum;
  errors: ErrorMap;
  loading: boolean;
  shareModal: boolean;
};

function appReducerState(): AppReducerState {

  return {
    intercomEnabled: false,
    screen: ScreenEnum.Campaign,
    errors: {},
    loading: false,
    shareModal: false,
  };
}

export default function reducer(state = appReducerState(), action: AppActionCreatorTypes) {
  const { type, payload } = action;

  switch (type) {
    case AppActionTypes.SET_SCREEN:
      return setScreen(state, payload as SetScreenAction["payload"]);

    /********************************************************************************
    *  Errors
    *******************************************************************************/

    case AppActionTypes.SET_ERROR:
      return setError(state, payload as SetErrorAction["payload"]);

    case AppActionTypes.SET_ERROR_EMPTY:
      return setErrorEmpty(state);

  /********************************************************************************
  *  Create Stripe Token
  *******************************************************************************/

    case AppActionTypes.CREATE_STRIPE_TOKEN:
      return createStripeToken(state);
    case AppActionTypes.CREATE_STRIPE_TOKEN_SUCCESS:
      return createStripeTokenSuccess(state, payload as CreateStripeTokenSuccessAction["payload"]);
    case AppActionTypes.CREATE_STRIPE_TOKEN_FAILURE:
      return createStripeTokenFailure(state, payload as CreateStripeTokenFailureAction["payload"]);
    default:
      return state;
  }
}

/********************************************************************************
 *  Set Screen
 *******************************************************************************/

function setScreen(
  state: AppReducerState,
  { screen }: { screen: ScreenEnum }
): AppReducerState {
  return {
    ...state,
    screen,
  };
};


/********************************************************************************
 *  Set Error
 *******************************************************************************/

function setError(
  state: AppReducerState,
  { key, errorMsg }: { key: ErrorKeyEnum, errorMsg: string }
): AppReducerState {
  return {
    ...state,
    errors: {
      ...state.errors,
      [key]: errorMsg,
    }
  };
}

/********************************************************************************
 *  Set Error
 *******************************************************************************/

function setErrorEmpty(state: AppReducerState): AppReducerState {
  return {
    ...state,
    errors: {}
  };
}

/********************************************************************************
 *  Create Stripe Token
 *******************************************************************************/

function createStripeToken(
  state: AppReducerState,
): AppReducerState {

  state = setError(state, {key: ErrorKeyEnum.Global, errorMsg: ''});
  return {
    ...state,
    loading: true,
  };
}

function createStripeTokenSuccess(
  state: AppReducerState,
  { stripeToken, }: { stripeToken: string }
): AppReducerState {

  state = setError(state, { key: ErrorKeyEnum.Global, errorMsg: '' });

  return {
    ...state,
    loading: false,
  };
}

function createStripeTokenFailure(
  state: AppReducerState,
  { errorMsg, }: { errorMsg: string }
): AppReducerState {
  state = setError(state, { key: ErrorKeyEnum.Global, errorMsg: errorMsg });
  return {
    ...state,
    loading: false,
  };
}