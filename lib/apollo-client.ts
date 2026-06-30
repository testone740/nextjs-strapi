import { HttpLink } from '@apollo/client';
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { getJwt } from './auth';

const STRAPI_GRAPHQL_URL =
  process.env.STRAPI_GRAPHQL_URL ?? 'http://localhost:1337/graphql';

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Note: { keyFields: ['documentId'] },
        Tag: { keyFields: ['documentId'] },
        UsersPermissionsUser: { keyFields: ['id'] },
      },
    }),
    link: new HttpLink({
      uri: STRAPI_GRAPHQL_URL,
      fetchOptions: { cache: 'no-store' },
      fetch: async (url, init = {}) => {
        const jwt = await getJwt();
        const headers = new Headers(init.headers);
        if (jwt) headers.set('Authorization', `Bearer ${jwt}`);
        return fetch(url, { ...init, headers });
      },
    }),
  });
});
