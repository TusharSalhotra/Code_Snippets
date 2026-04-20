import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import errorLink from './links/errorLink';
import requestLink from './links/requestLink';
import uploadLink from './links/uploadLink';

const cache = new InMemoryCache();
const link = ApolloLink.from([
  requestLink,
  errorLink,
  uploadLink,
]);

export default new ApolloClient({ link, cache });
