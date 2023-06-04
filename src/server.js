'use strict';

const express = require('express');
const cors = require('cors');

const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/router/index.js');

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);

app.use(notFound);
app.use(errorHandler);

const start = (port) => {
    app.listen(port, () => {
        console.log(`servin it up on ${port}`);
    })
};

module.exports = { app, start };