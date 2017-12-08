import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { canUseDOM } from './environment';
import { getClientToken, getServerToken } from './auth';

var cachedClient: ApolloClient | undefined = undefined

const buildClient = (initialState?: any, ctx?: any) => {
    let token = canUseDOM ? getClientToken() : (ctx ? getServerToken(ctx) : undefined);
    var headers: any = {};
    headers['x-statecraft-domain'] = "sf";
    if (token) {
        headers['authorization'] = 'Bearer ' + token;
    }
    return new ApolloClient({
        networkInterface: createNetworkInterface({
            uri: "https://statecraft-api.herokuapp.com/api/",
            opts: {
                headers: headers
            },
        }),
        initialState: {
            apollo: initialState || {}
        },
        ssrMode: canUseDOM
    })
}

export const apolloClient = (initialState?: any, ctx?: any) => {
    if (canUseDOM) {
        if (!cachedClient) {
            cachedClient = buildClient(initialState, ctx)
        }
        return cachedClient!!
    } else {
        return buildClient(initialState, ctx)
    }
};