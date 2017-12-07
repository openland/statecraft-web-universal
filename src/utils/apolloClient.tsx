import { ApolloClient, createNetworkInterface } from 'react-apollo';
import { canUseDOM } from './environment';

var headers: any = {};
headers['x-statecraft-domain'] = "sf";

export const apolloClient = (initialState?: any) => {
    console.warn(initialState)
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
};