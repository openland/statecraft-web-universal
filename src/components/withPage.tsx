import * as React from 'react';
import { withAccountQuery } from '../api/Account';
import { withData } from '../utils/withData';
import { UserInfoProvider } from '../components/UserInfo';
import { QueryProps } from 'react-apollo';
import Error from 'next/error';
import Router from 'next/router';
import { Page } from './Page';
import { Loader } from './Loaders';
import * as NProgress from 'nprogress';

//
// Setup Loader
//

Router.onRouteChangeStart = (url) => {
    console.log(`Loading: ${url}`)
    NProgress.start()
}
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

//
// Root Loader. We shouldn't render anything untill page is loaded since we have global progress indicator.
//

function withRootLoader<P>(WrappedComponent: React.ComponentType<P>): React.ComponentType<{ data: QueryProps } & P> {
    return function (props: { data: QueryProps } & P) {
        if (props.data.loading) {
            return <Loader key="__loader" />;
        } else if (props.data.error != null) {
            return (
                <Error key="_message" statusCode={500} />
            );
        }

        return (
            <WrappedComponent {...props} key="_component" />
        );
    };
}

//
// Page HoC
//

export function withPage(WrappedComponent: React.ComponentType<{}>) {
    return withData(withAccountQuery(withRootLoader((props) =>
        <UserInfoProvider user={props.data.me} account={props.data.account}><Page><WrappedComponent /></Page></UserInfoProvider>
    )));
}