import { ApolloClient, createNetworkInterface } from 'react-apollo';

var headers: any = {};
headers['x-statecraft-domain'] = "sf";

export const apolloClient: ApolloClient = new ApolloClient({
    networkInterface: createNetworkInterface({
        uri: "https://statecraft-api.herokuapp.com/api/",
        opts: {
            headers: headers
        }
    })
});