import * as React from 'react'
import * as PropTypes from 'prop-types';
import { ApolloProvider, ApolloClient, getDataFromTree } from 'react-apollo'
import Head from 'next/head'
import { canUseDOM } from './environment';
import { apolloClient } from './apolloClient';

import 'isomorphic-fetch';

function getComponentDisplayName(Component: any) {
    return Component.displayName || Component.name || 'Unknown'
}

export const withData = (ComposedComponent: React.ComponentType<{ url?: any }>) => {
    return class WithData extends React.Component<{ serverState?: { apollo: { data: any } } }> {
        static displayName = `WithData(${getComponentDisplayName(
            ComposedComponent
        )})`
        static propTypes = {
            serverState: PropTypes.object.isRequired
        }

        static async getInitialProps(ctx: any) {
            let serverState = { apollo: {} }

            // Evaluate the composed component's getInitialProps()
            // let composedInitialProps = {}
            // if ((ComposedComponent as any).getInitialProps) {
            //     composedInitialProps = await ComposedComponent.getInitialProps(ctx)
            // }

            // Run all GraphQL queries in the component tree
            // and extract the resulting data
            if (!canUseDOM) {
                const apollo = apolloClient(serverState);
                // Provide the `url` prop data in case a GraphQL query uses it
                const url = { query: ctx.query, pathname: ctx.pathname }
                try {
                    // Run all GraphQL queries
                    await getDataFromTree(
                        <ApolloProvider client={apollo}>
                            <ComposedComponent url={url} />
                        </ApolloProvider>
                    )
                } catch (error) {
                    // Prevent Apollo Client GraphQL errors from crashing SSR.
                    // Handle them in components via the data.error prop:
                    // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
                }

                // getDataFromTree does not call componentWillUnmount
                // head side effect therefore need to be cleared manually
                Head.rewind()

                // Extract query data from the Apollo store
                serverState = {
                    apollo: {
                        data: apollo.getInitialState()
                    }
                }
            }

            return {
                serverState
            }
        }

        apollo: ApolloClient

        constructor(props: { serverState: { apollo: { data: any } } }) {
            super(props)
            this.apollo = apolloClient(this.props.serverState ? this.props.serverState.apollo.data : undefined);
        }

        render() {
            return (
                <ApolloProvider client={this.apollo}>
                    <ComposedComponent {...this.props} />
                </ApolloProvider>
            )
        }
    }
}