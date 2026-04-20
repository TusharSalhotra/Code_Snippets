import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';

const apiHost = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4444';

export const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('YOUR_DOMAIN_AUTH_TOKEN') || '',
    },
  });
  return forward(operation);
});

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => console.log(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
    ));
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// HttpLink is deprecated and not needed
export const httpLink = new HttpLink({
  uri: `${apiHost}/graphql`,
  credentials: 'same-origin',
});

export const uploadLink = createUploadLink({
  uri: `${apiHost}/graphql`,
  credentials: 'same-origin',
});

export const omitTypeNameLink = new ApolloLink((operation, forward) => {
  if (operation.variables && operation.operationName !== 'uploadFiles' && operation.operationName !== 'uploadOrgFiles') {
    operation.variables = omitDeep(operation.variables, '__typename');
  }
  return forward(operation).map((data) => {
    return data;
  });
});

// helper functions
function omitDeep(obj, key) {
  const keys = Object.keys(obj);
  const newObj = {};
  keys.forEach((i) => {
    if (i !== key) {
      const val = obj[i];
      if (Array.isArray(val)) newObj[i] = omitDeepArrayWalk(val, key);
      else if (typeof val === 'object' && val !== null) newObj[i] = omitDeep(val, key);
      else newObj[i] = val;
    }
  });
  return newObj;
}

function omitDeepArrayWalk(arr, key) {
  return arr.map((val) => {
    if (Array.isArray(val)) return omitDeepArrayWalk(val, key);
    if (typeof val === 'object') return omitDeep(val, key);
    return val;
  });
}
