import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { canUseDOM } from './environment';

let cachedClient: ApolloClient | undefined = undefined

const buildClient = (initialState?: any, token?: string) => {
    var headers: any = {};
    headers['x-statecraft-domain'] = "sf";
    if (token) {
        headers['authorization'] = 'Bearer ' + token;
    }
    console.warn("Build client")
    return new ApolloClient({
        networkInterface: createNetworkInterface({
            //uri: "http://localhost:9000/api/",
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

export const apolloClient = (initialState?: any, token?: string) => {
    if (canUseDOM) {
        if (!cachedClient) {
            cachedClient = buildClient(initialState, token)
        }
        return cachedClient!!
    } else {
        return buildClient(initialState, token)
    }
};