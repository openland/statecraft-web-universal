import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import Head from 'next/head';
import { canUseDOM } from './environment';
import { apolloClient } from './apolloClient';
import { getToken } from './auth';

import 'isomorphic-fetch';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

function getComponentDisplayName(Component: any) {
    return Component.displayName || Component.name || 'Unknown';
}

export const withData = (ComposedComponent: React.ComponentType) => {
    return class WithData extends React.Component<{ serverState: { apollo: { data: any, token?: string } } }> {

        static displayName = `WithData(${getComponentDisplayName(
            ComposedComponent
        )})`;
        static propTypes = {
            serverState: PropTypes.object.isRequired
        };
        private apollo: ApolloClient<NormalizedCacheObject>;

        static async getInitialProps(ctx: any) {
            let token = getToken(ctx.req);
            let serverState = { apollo: {} };
            // console.warn(ctx.req);

            // Evaluate the composed component's getInitialProps()
            // let composedInitialProps = {}
            // if ((ComposedComponent as any).getInitialProps) {
            //     composedInitialProps = await ComposedComponent.getInitialProps(ctx)
            // }

            // Run all GraphQL queries in the component tree
            // and extract the resulting data
            if (!canUseDOM) {
                const apollo = apolloClient(serverState, token);
                // Provide the `url` prop data in case a GraphQL query uses it
                // const url = { query: ctx.query, pathname: ctx.pathname }
                try {
                    // Run all GraphQL queries
                    await getDataFromTree(
                        <ApolloProvider client={apollo}>
                            <ComposedComponent />
                        </ApolloProvider>
                        ,
                        { router: { query: ctx.query, pathname: ctx.pathname, asPath: ctx.asPath } });
                } catch (error) {
                    console.warn(error);
                    // Prevent Apollo Client GraphQL errors from crashing SSR.
                    // Handle them in components via the data.error prop:
                    // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
                }

                // getDataFromTree does not call componentWillUnmount
                // head side effect therefore need to be cleared manually
                if (!canUseDOM) {
                    Head.rewind();
                }

                // Extract query data from the Apollo store
                serverState = {
                    apollo: {
                        data: apollo.extract(),
                        token: token
                    }
                };
            } else {
                const apollo = apolloClient(serverState, token);
                // Provide the `url` prop data in case a GraphQL query uses it
                // const url = { query: ctx.query, pathname: ctx.pathname }
                try {
                    // Run all GraphQL queries
                    await getDataFromTree(
                        <ApolloProvider client={apollo}>
                            <ComposedComponent />
                        </ApolloProvider>
                        ,
                        { router: { query: ctx.query, pathname: ctx.pathname, asPath: ctx.asPath } });
                } catch (error) {
                    console.warn(error);
                    // Prevent Apollo Client GraphQL errors from crashing SSR.
                    // Handle them in components via the data.error prop:
                    // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
                }
                serverState = {
                    apollo: {
                        token: token
                    }
                };
            }

            return {
                serverState
            };
        }

        constructor(props: { serverState: { apollo: { data: any, token?: string } } }) {
            super(props);
            this.apollo = apolloClient(this.props.serverState.apollo.data, this.props.serverState.apollo.token);
        }

        render() {
            return (
                <ApolloProvider client={this.apollo}>
                    <ComposedComponent {...this.props} />
                </ApolloProvider>
            );
        }
    };
};