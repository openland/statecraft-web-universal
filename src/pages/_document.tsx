import * as React from 'react';
import Document, { Head, Main, NextScript } from 'next/document'

export default class StateDocument extends Document {
    render() {
        return (
            <html>
                <Head>
                    <link rel="shortcut icon" href="/static/favicon.ico" />
                    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Nunito+Sans:300,400,400i,600,700,800" />
                    <link rel="stylesheet" type="text/css" href="/static/css/style.css" />
                </Head>
                <body className="custom_class">
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}