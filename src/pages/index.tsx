import * as React from 'react';
import { withAccountQuery } from '../api/Account';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
// import { ApolloProvider } from 'react-apollo';
// import { apolloClient } from '../utils/apolloClient';
import { canUseDOM } from '../utils/environment';
import { withData } from '../utils/withData';
// const BasePage = withData((props: { children: any }) => {
//     if (canUseDOM) {
//         return <BrowserRouter>{props.children}</BrowserRouter>
//     } else {
//         return <StaticRouter location={"/"} context={{}}>{props.children}</StaticRouter>
//     }
// });

const Page = withAccountQuery((props) => {
    console.warn(props);
    return <div>Welcome</div>
});
export default withData((props: { children: any }) => {
    if (canUseDOM) {
        return <BrowserRouter><Page /></BrowserRouter>
    } else {
        return <StaticRouter location={"/"} context={{}}><Page /></StaticRouter>
    }
});