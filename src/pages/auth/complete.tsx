import * as React from 'react';
import { AuthenticationController } from '../../utils/auth';
export default class AuthenticationHandler extends React.Component<{}, {}> {

    componentDidMount() {
        new AuthenticationController().completeAuth().then((v) => {
            console.warn(v)
        }).catch((e) => {
            console.warn(e)
        })
        // console.warn("did mount")
    }

    render() {
        return <div />;
    }
}