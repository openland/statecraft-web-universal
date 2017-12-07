import * as React from 'react';
import { withAccountQuery } from '../api/Account';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { apolloClient } from '../utils/apolloClient';
import { canUseDOM } from '../utils/environment';

const BasePage = (props: { children: any }) => {
    if (canUseDOM) {
        return <ApolloProvider client={apolloClient}><BrowserRouter>{props.children}</BrowserRouter></ApolloProvider>
    } else {
        return <ApolloProvider client={apolloClient}><StaticRouter location={"/"}>{props.children}</StaticRouter></ApolloProvider>
    }
}

const Page = withAccountQuery((props) => {
    return <div>Welcome</div>
});
export default () => <BasePage><Page /></BasePage>;