'use strict';

const base64 = require('base-64');
const { user } = require('../models/index.js');

module.exports = async (req, res, next) => {
    if (!req.headers.authorization) { next('No auth headers present'); }
    let basic = req.headers.authorization.split(' ').pop();
    let[username, password] = base64.decode(basic).split(':');

    try {
        req.user = await user.authenticateBasic(username, password)
        next();
    } catch (error) {
        console.error(error);
        res.status(403).send('Invalid Login');
    }
}