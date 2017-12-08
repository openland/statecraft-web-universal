import * as React from 'react';
import createHistory from 'history/createBrowserHistory';
import * as Cookie from 'js-cookie';

export default class LogoutHandler extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);
    }

    componentDidMount() {
        Cookie.remove("statecraft-key");
        createHistory({
            forceRefresh: true
        }).replace('/');
    }

    render() {
        return <div />;
    }
}