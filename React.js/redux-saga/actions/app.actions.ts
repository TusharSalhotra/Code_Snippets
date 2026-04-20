import { ScreenEnum, ErrorKeyEnum } from '../reducers/app.reducer';
export const AppActionTypes = {
  // Screen
  SET_SCREEN: 'SET_SCREEN',
  NAVIGATE_FORWARD: 'NAVIGATE_FORWARD',
  NAVIGATE_BACKWARD: 'NAVIGATE_BACKWARD',
  // Errors
  SET_ERROR: 'SET_ERROR',
  SET_ERROR_EMPTY: 'SET_ERROR_EMPTY',

  // Create Stripe Token
  CREATE_STRIPE_TOKEN: 'CREATE_STRIPE_TOKEN',
  CREATE_STRIPE_TOKEN_SUCCESS: 'CREATE_STRIPE_TOKEN_SUCCESS',
  CREATE_STRIPE_TOKEN_FAILURE: 'CREATE_STRIPE_TOKEN_FAILURE',
};

/********************************************************************************
 *  App Action Creators
 *******************************************************************************/

export type AppActionCreatorTypes = SetScreenAction
  | NavigateForwardAction
  | NavigateBackwardAction
  | SetErrorAction
  | SetErrorRemoveAction
  | CreateStripeTokenAction
  | CreateStripeTokenSuccessAction
  | CreateStripeTokenFailureAction


/********************************************************************************
*  Set Screen
*******************************************************************************/

export interface SetScreenAction {
  type: typeof AppActionTypes.SET_SCREEN;
  payload: {
    screen: ScreenEnum,
  };
};

export function setScreen(screen: ScreenEnum): SetScreenAction {
  return {
    type: AppActionTypes.SET_SCREEN,
    payload: {
      screen,
    },
  };
};

/********************************************************************************
*  Navigate Forward
*******************************************************************************/

export interface NavigateForwardAction {
  type: typeof AppActionTypes.NAVIGATE_FORWARD;
  payload: {};
};

export function navigateForward(): NavigateForwardAction {
  return {
    type: AppActionTypes.NAVIGATE_FORWARD,
    payload: {},
  };
};

/********************************************************************************
*  Navigate Backward
*******************************************************************************/

export interface NavigateBackwardAction {
  type: typeof AppActionTypes.NAVIGATE_BACKWARD;
  payload: {};
};

export function navigateBackward(): NavigateBackwardAction {
  return {
    type: AppActionTypes.NAVIGATE_BACKWARD,
    payload: {},
  };
};


/********************************************************************************
 *  Set Error
 *******************************************************************************/

export interface SetErrorAction {
  type: typeof AppActionTypes.SET_ERROR;
  payload: {
    key: ErrorKeyEnum;
    errorMsg: string;
  };
}

export function setError(key: ErrorKeyEnum, errorMsg: string): SetErrorAction {
  return {
    type: AppActionTypes.SET_ERROR,
    payload: {
      key,
      errorMsg,
    },
  };
}


/********************************************************************************
 *  Set Error
 *******************************************************************************/

 export interface SetErrorRemoveAction {
  type: typeof AppActionTypes.SET_ERROR;
  payload: {};
}

export function setErrorEmpty(): SetErrorRemoveAction {
  return {
    type: AppActionTypes.SET_ERROR_EMPTY,
    payload: {},
  };
}

/********************************************************************************
 *  Create Stripe Token
 *******************************************************************************/

export interface CreateStripeTokenAction {
  type: typeof AppActionTypes.CREATE_STRIPE_TOKEN;
  payload: {};
}

export function createStripeToken(): CreateStripeTokenAction {
  return {
    type: AppActionTypes.CREATE_STRIPE_TOKEN,
    payload: {},
  };
}


export interface CreateStripeTokenSuccessAction {
  type: typeof AppActionTypes.CREATE_STRIPE_TOKEN_SUCCESS;
  payload: {
    stripeToken: string,
  };
}

export function createStripeTokenSuccess(stripeToken: string): CreateStripeTokenSuccessAction {
  return {
    type: AppActionTypes.CREATE_STRIPE_TOKEN_SUCCESS,
    payload: {
      stripeToken,
    },
  };
}

export interface CreateStripeTokenFailureAction {
  type: typeof AppActionTypes.CREATE_STRIPE_TOKEN_FAILURE;
  payload: {
    errorMsg: string,
  };
}

export function createStripeTokenFailure(errorMsg: string): CreateStripeTokenFailureAction {
  return {
    type: AppActionTypes.CREATE_STRIPE_TOKEN_FAILURE,
    payload: {
      errorMsg,
    },
  };
}