import * as React from 'react';
import { withRouter } from 'next/router';
import { Link } from './Link';
import * as qs from 'query-string';

export function DataList(props: { children?: any }) {
    return (
        <div className="x-in">
            <div className="x-container is-wide">
                <div className="row">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export function DataListFilters(props: { title: string, children?: any }) {
    return (
        <div className="col-xs-12 col-lg-3">
            <div className="x-in--title">{props.title}</div>
            {props.children}
        </div>
    );
}

export function DataListContent(props: { title: string, newUnits: number, newUnitsVerified: number, children?: any }) {
    return (
        <div className="col-xs-12 col-lg-9">
            {(props.newUnits !== 0) && (props.newUnitsVerified === 0) && <div className="x-in--title">{props.newUnits}<span>Net new units</span></div>}
            {(props.newUnits !== 0) && (props.newUnitsVerified !== 0) && <div className="x-in--title">{props.newUnits}<span>Net new units</span><span className="is-verified">Verified</span>{props.newUnitsVerified}<span>Net new units</span></div>}
            {(props.newUnits === 0) && <div className="x-in--title">{props.title}</div>}

            {props.children}
        </div>
    );
}

export function DataListRadio(props: { title: string, radioKey: string, children?: any }) {
    var childrenWithProps = React.Children.map(props.children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<{ radioKey: string }>, { radioKey: props.radioKey });
        } else {
            return child;
        }
    });
    return (
        <div className="x-filter">
            <div className="x-filter--title">{props.title}</div>
            {childrenWithProps}
        </div>
    );
}

export const DataListRadioItem = withRouter<{ title: string, itemKey?: string, radioKey?: string }>(props => {
    var path = props.router.pathname;
    var checked = false;
    if (props.radioKey) {
        let s = JSON.parse(JSON.stringify(props.router.query!!));
        if (props.itemKey) {
            checked = s[props.radioKey] === props.itemKey;
            s[props.radioKey] = props.itemKey;
        } else {
            checked = s[props.radioKey] === undefined;
            delete s[props.radioKey];
        }
        let q = qs.stringify(s);
        if (q !== '') {
            path = props.router.pathname + '?' + q;
        } else {
            path = props.router.pathname;
        }
    }
    return (
        <Link path={path} className={'x-filter--radio' + (checked ? ' is-checked' : '')}>{props.title}</Link>
    );
});

export const DataListSearch = withRouter<{ searchKey: string }>(props => {
    let s = JSON.parse(JSON.stringify(props.router.query!!));
    var value: string = '';
    if (s[props.searchKey]) {
        value = s[props.searchKey];
    }
    return (
        <div className="x-search">
            <form className="x-search--box" method="POST" action="">
                <input
                    className="x-search--input"
                    type="text"
                    placeholder="Search"
                    value={value}
                    onChange={e => {
                        let s2 = JSON.parse(JSON.stringify(props.router.query!!));
                        if (e.target.value === '') {
                            delete s2[props.searchKey];
                        } else {
                            s2[props.searchKey] = e.target.value;
                        }
                        let q = qs.stringify(s2);
                        if (q !== '') {
                            props.router.replace(props.router.pathname + '?' + q);
                        } else {
                            props.router.replace(props.router.pathname);
                        }
                    }}
                />
                <button className="x-search--button" type="submit"><i className="icon-search">{}</i></button>
            </form>
        </div>
    );
});