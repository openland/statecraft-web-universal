import * as React from 'react';
import { withUserInfo } from './UserInfo';
import { Link } from './Link';

export const Header = withUserInfo((props) => {
    return (
        <div className="x-top">
            <div className="x-container is-wide clearfix">
                <Link className="x-top--label" path="/">San Francisco Housing Forecast</Link>
                <div className="x-top--tabs">
                    <Link className="x-top--tab" path="/">Home</Link>
                    <Link className="x-top--tab is-active" path="/pipeline">Pipeline Explorer</Link>
                    {/* <a className="x-top--tab is-active" href="#">Dashboard</a>
                    <a className="x-top--tab" href="#">Pipeline Explorer</a> */}
                </div>
                <ul className="x-top--nav">
                    {props.user && (<li className="x-top--item"><span><img src={props.user.picture} alt="" />{props.user.firstName} {' '} {props.user.lastName}</span></li>)}
                    {props.user && (<li className="x-top--item is-join"><button onClick={e => { props.doLogout() }}>Sign Out</button></li>)}

                    {!props.user && (<li className="x-top--item"><button onClick={e => { props.doLogin() }}>Sign In</button></li>)}
                    {!props.user && (<li className="x-top--item is-join"><a target="_blank" href="https://goo.gl/forms/YX8LSpH6jWLzbEj02">Join</a></li>)}
                </ul>
            </div>
        </div>
    );
});