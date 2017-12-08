import * as React from 'react';
import { withAccountQuery } from '../api/Account';
import { withData } from '../utils/withData';
import { UserInfoProvider } from '../components/UserInfo';
import { QueryProps } from 'react-apollo';
import Error from 'next/error';
import { Page } from './Page';

function withRootLoader<P>(WrappedComponent: React.ComponentType<P>): React.ComponentType<{ data: QueryProps } & P> {
    return function (props: { data: QueryProps } & P) {
        if (props.data.loading) {
            return null;
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

export function withPage(WrappedComponent: React.ComponentType<{}>) {
    return withData(withAccountQuery(withRootLoader((props) =>
        <UserInfoProvider user={props.data.me} account={props.data.account}><Page><WrappedComponent /></Page></UserInfoProvider>
    )));
}