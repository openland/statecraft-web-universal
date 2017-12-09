import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { canUseDOM } from './environment';
import 'isomorphic-fetch';

let cachedClient: ApolloClient<NormalizedCacheObject> | undefined = undefined;

const buildClient = (initialState?: any, token?: string) => {
    var headers: any = {};
    headers['x-statecraft-domain'] = 'sf';
    if (token) {
        headers.authorization = 'Bearer ' + token;
    }
    var cache = new InMemoryCache();
    if (initialState) {
        cache = cache.restore(initialState);
    }
    return new ApolloClient({
        link: new HttpLink({
            uri: 'https://statecraft-api.herokuapp.com/api/',
            // uri: 'http://localhost:9000/api/',
            headers: headers
        }),
        cache: cache,
        ssrMode: canUseDOM
    });
};

export const apolloClient = (initialState?: any, token?: string) => {
    if (canUseDOM) {
        if (!cachedClient) {
            cachedClient = buildClient(initialState, token);
        }
        return cachedClient!!;
    } else {
        return buildClient(initialState, token);
    }
};