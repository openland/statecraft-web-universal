import * as React from 'react';
import { withAccountQuery } from '../api/Account';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { canUseDOM } from '../utils/environment';
import { withData } from '../utils/withData';
import { AuthenticationController } from '../utils/auth';
const Page = withAccountQuery((props) => {
    console.warn(props.data)
    return (
        <div className="x-page">
            <div className="x-top">
                <div className="x-container is-wide clearfix">
                    {/* <Link className="x-top--label" path="/">San Francisco Housing Forecast</Link> */}
                    <div className="x-top--tabs">
                        {/* <Link className="x-top--tab" path="/">Home</Link>
                        <Link className="x-top--tab is-active" path="/pipeline">Pipeline Explorer</Link> */}
                        {/* <a className="x-top--tab is-active" href="#">Dashboard</a>
                    <a className="x-top--tab" href="#">Pipeline Explorer</a> */}
                    </div>
                    <ul className="x-top--nav">
                        <button onClick={() => { new AuthenticationController(undefined).startAuth() }}>Log In</button>
                        {/* {props.user && (<li className="x-top--item"><span><img src={props.user.picture} alt="" />{props.user.firstName} {' '} {props.user.lastName}</span></li>)}
                        {props.user && (<li className="x-top--item is-join"><button onClick={e => { e.preventDefault(); A.logout(); }}>Sign Out</button></li>)}

                        {!props.user && (<li className="x-top--item"><button onClick={e => { e.preventDefault(); A.login(); }}>Sign In</button></li>)}
                        {!props.user && (<li className="x-top--item is-join"><a target="_blank" href="https://goo.gl/forms/YX8LSpH6jWLzbEj02">Join</a></li>)} */}
                    </ul>
                </div>
            </div>
            Welcome
        </div>
    );
});
export default withData((props: { children: any }) => {
    if (canUseDOM) {
        return <BrowserRouter><Page /></BrowserRouter>
    } else {
        return <StaticRouter location={"/"} context={{}}><Page /></StaticRouter>
    }
});