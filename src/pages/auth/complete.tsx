import * as React from 'react';
import { AuthenticationController } from '../../utils/auth';
import Error from 'next/error';

export default class AuthenticationHandler extends React.Component<{}, { error: boolean }> {

    constructor(props: {}) {
        super(props);
        this.state = { error: false };
    }

    componentDidMount() {
        new AuthenticationController().completeAuth().then((v) => {
            // Do nothing
        }).catch((e) => {
            this.setState({ error: true });
        })
    }

    render() {
        if (this.state.error) {
            return <Error statusCode={500} />;
        } else {
            return <div />;
        }
    }
}