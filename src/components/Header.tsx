import * as React from 'react';
import { withUserInfo } from './UserInfo';
import { Link } from './Link';
import { withRouter } from '../utils/withRouter';

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
                    {props.user && (<li className="x-top--item is-join"><button onClick={e => { props.doLogout(); }}>Sign Out</button></li>)}

                    {!props.user && (<li className="x-top--item"><button onClick={e => { props.doLogin(); }}>Sign In</button></li>)}
                    {!props.user && (<li className="x-top--item is-join"><a target="_blank" href="https://goo.gl/forms/YX8LSpH6jWLzbEj02">Join</a></li>)}
                </ul>
            </div>
        </div>
    );
});

export const HeaderLarge = withUserInfo((props) => {
    return (
        <div className="x-intro">
            <div className="x-container">
                <div className="x-header">
                    <a className="x-header--logo" href="https://statecraft.one/"><img src="/static/img/logotype.svg" alt="" /></a>
                    <ul className="x-header--nav">
                        <li className="x-header--item"><Link path="/pipeline">Explore Pipeline</Link></li>

                        {props.user &&
                            <li className="x-header--item"><span><img src={props.user.picture} alt="" />{props.user.firstName} {props.user.lastName}</span></li>
                        }
                        {props.user &&
                            <li className="x-header--item is-join"><button onClick={e => { props.doLogout(); }}>Sign Out</button></li>
                        }
                        {!props.user &&
                            <li className="x-header--item"><button onClick={e => { props.doLogin(); }}>Sign In</button></li>
                        }
                        {!props.user &&
                            (<li className="x-header--item is-join"><a target="_blank" href="https://goo.gl/forms/YX8LSpH6jWLzbEj02">Join</a></li>)
                        }
                    </ul>
                </div>
                <div className="x-intro--in">
                    {props.children}
                </div>
            </div>
        </div>
    );
});

export function HeaderLargeTitle(props: { title: string }) {
    return (
        <div className="x-intro--title">{props.title}</div>
    );
}

export const HeaderLargeSocial = withRouter((props) => {

    var shareText: string = 'San Francisco Housing Forecast 2017-18 ' + props.router.href + ' #housing #sf';
    var shareUrl: string = props.router.href;

    return (
        <div className="x-intro--tools">
            <form className="x-intro--form" action="https://one.us15.list-manage.com/subscribe/post?u=b588cb73ec7bd801c3b609670&amp;id=c943356ada" method="post">
                <input type="hidden" name="b_b588cb73ec7bd801c3b609670_c943356ada" value="" />

                <input className="x-intro--input" type="email" name="EMAIL" placeholder="Email" />
                <button className="x-intro--button" type="submit">Subscribe to updates</button>
            </form>
            <div className="x-intro--socials">
                <div className="x-intro--label">Share</div>
                <a className="x-intro--social" target="_blank" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl)}><i className="icon-fb">{}</i></a>
                <a className="x-intro--social" target="_blank" href={'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText)}><i className="icon-tw">{}</i></a>
            </div>
        </div>
    );
});