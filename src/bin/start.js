'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

process.env.NODE_ENV = 'development';

// Ensure environment variables are read.
require('../config/env');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const path = require('path');
const MemoryFS = require("memory-fs");
const { createIsomorphicWebpack } = require('isomorphic-webpack');
const {
  choosePort,
    createCompiler,
    prepareProxy,
    prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const paths = require('../config/paths');
const config = require('../config/webpack.config.dev');
const createDevServerConfig = require('../config/webpackDevServer.config');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const vm = require('vm');
const {
    renderToString
} = require('react-dom/server');

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const renderFullPage = (body, bundle) => {
    // eslint-disable-next-line no-restricted-syntax
    return `
    <!doctype html>
    <html>
      <head></head>
      <body>
        <div id='app'>${body}</div>
        ${bundle}
      </body>
    </html>
    `;
};

function normalizeAssets(assets) {
    return Array.isArray(assets) ? assets : [assets]
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
choosePort(HOST, DEFAULT_PORT)
    .then(port => {
        if (port == null) {
            // We have not found a port.
            return;
        }
        const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
        const appName = require(paths.appPackageJson).name;
        const urls = prepareUrls(protocol, HOST, port);

        // Create a webpack compiler that is configured with custom messages.
        const compiler = createCompiler(webpack, config, appName, urls, useYarn);

        // Starting Dev Server with SSR
        const app = express();
        const middleware = webpackDevMiddleware(compiler, {
            noInfo: false,
            publicPath: "/public",
            quiet: true,
            stats: {
                assets: false,
                chunkModules: false,
                chunks: false,
                colors: true,
                hash: false,
                timings: false,
                version: false
            },
            serverSideRender: true
        });
        app.use(middleware);
        const { evalBundleCode } = createIsomorphicWebpack(config);

        app.use((req, res, next) => {
            const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName;

            for (let ch of Object.getOwnPropertyNames(assetsByChunkName)) {
                console.warn(ch);
                for (let i in assetsByChunkName[ch]) {
                    const bundle = assetsByChunkName[ch][i];
                    // const map = assetsByChunkName[ch][1];
                    const absoluteEntryBundleName = path.resolve(compiler.options.output.path, bundle);
                    console.warn(absoluteEntryBundleName);
                    const bundleCode = middleware.fileSystem.readFileSync(absoluteEntryBundleName, 'utf-8');
                    fs.writeFile(__dirname + "/" + ch + "-" + i + ".js", bundleCode)
                }
            }


            // const bundleMap = JSON.parse(middleware.fileSystem.readFileSync(absoluteEntryBundleName + ".map", 'utf-8'));
            // try {
            //     const evalRes = runInNewContext(bundleCode, {}, req.url, {});
            //     console.warn(evalRes);
            // } catch (e) {
            //     console.warn("error");
            //     console.warn(e);
            // }
            // const requireModule = evalCodeInBrowser(currentBundleCode, {}, windowUrl, customContext);
            next()
        })

        // // app.use(express.static(paths.appPublic));     

        app.get('*', (req, res) => {
            const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName
            console.warn(assetsByChunkName);
            const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            const app = renderToString(evalBundleCode(requestUrl).default);
            res.send(renderFullPage(app, normalizeAssets(assetsByChunkName.main)
                .filter(path => path.endsWith('.js'))
                .map(path => `<script src="/public/${path}"></script>`)
                .join('\n')));
        });

        app.listen(port, HOST, err => {
            if (err) {
                return console.log(err);
            }
            if (isInteractive) {
                clearConsole();
            }
            console.log(chalk.cyan('Starting the development server...\n'));
            openBrowser(urls.localUrlForBrowser);
        });

        ['SIGINT', 'SIGTERM'].forEach(function (sig) {
            process.on(sig, function () {
                process.exit();
            });
        });
    })
    .catch(err => {
        if (err && err.message) {
            console.log(err.message);
        }
        process.exit(1);
    });