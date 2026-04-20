import NPECheck from './NPECheck';

export function getErrorMessage(error) {
  if (!error) return null;

  let errorMsg = NPECheck(error, 'graphQLErrors/0/message', null);
  if (errorMsg) return errorMsg;

  errorMsg = NPECheck(error, 'networkError/result/errors/0/message', null);
  if (errorMsg) return errorMsg;
}

export function getJoiErrors(error) {
  if (!error) return null;
  const errorMsg = NPECheck(error, 'graphQLErrors/0/extensions/exception/invalidArgs', null);
  if (errorMsg) return errorMsg;
}
