import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Account } from '../api/Account';
import { User } from '../api/User';
import { AuthenticationController } from '../utils/auth';

export class UserInfoProvider extends React.Component<{ user?: User, account: Account }> implements React.ChildContextProvider<{}> {
    static childContextTypes = {
        user: PropTypes.object,
        account: PropTypes.object.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        doLogin: PropTypes.func.isRequired,
        doLogout: PropTypes.func.isRequired
    };

    render() {
        var children: any = false;
        React.Children.forEach(this.props.children, (ch) => {
            if (ch) {
                if (children) {
                    throw 'Only one child possible!';
                }
                children = ch;
            }
        });
        return children;
    }

    getChildContext() {
        return {
            user: this.props.user,
            account: this.props.account,
            isLoggedIn: this.props.user != undefined,
            doLogin: () => {
                new AuthenticationController().startAuth()
            },
            doLogout: () => {
                new AuthenticationController().logOut()
            }
        };
    }
}

interface UserInfoComponentProps {
    user?: User
    account: Account
    isLoggedIn: boolean
    doLogin: () => void
    doLogout: () => void
}

class UserInfoReceiver extends React.Component<{ render: React.ComponentType<UserInfoComponentProps> }> {
    static contextTypes = {
        user: PropTypes.object,
        account: PropTypes.object.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        doLogin: PropTypes.func.isRequired,
        doLogout: PropTypes.func.isRequired
    };

    render() {
        var user = this.context.user as User | undefined;
        var account = this.context.account as Account;
        var isLoggedIn = this.context.isLoggedIn as boolean;
        var doLogin = this.context.doLogin as () => void;
        var doLogout = this.context.doLogout as () => void;
        var Wrapped = this.props.render;
        return <Wrapped
            user={user}
            account={account}
            isLoggedIn={isLoggedIn}
            doLogin={doLogin}
            doLogout={doLogout}
            {...this.props}
        />;
    }
}

export function withUserInfo<P>(WrappedComponent: React.ComponentType<P & UserInfoComponentProps>): React.ComponentType<P> {
    return function (props: P) {
        return <UserInfoReceiver render={WrappedComponent} {...props} />;
    };
}