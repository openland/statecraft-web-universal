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

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

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
        const outputFileSystem = compiler.inputFileSystem;

        // Starting Dev Server with SSR
        const app = express();
        app.use(webpackDevMiddleware(compiler, {
            noInfo: false,
            publicPath: paths.appPublic,
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
        }));
        app.use((req, res, next) => {
            const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName
            const bundle = assetsByChunkName['main'][0]
            const map = assetsByChunkName['main'][1]
            const absoluteEntryBundleName = path.resolve(compiler.options.output.path, 'main');
            console.warn(outputFileSystem);
            const code = outputFileSystem.readFileSync(absoluteEntryBundleName, 'utf-8')
            console.warn(code);
            next()
        })

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
                devServer.close();
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