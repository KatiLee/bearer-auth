'use strict';

const { users } = require('../models/index.js');

module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) { next('Invalid login') }

        const token = req.headers.authorization.split(' ').pop();
        const validUser = await users.authenticateWithToken(token);

        req.user = validUser;
        req.token = validUser.token;
        if(!validUser){
            throw new Error('Invalid login');
        }
    } catch (error) {
        console.error(error);
        res.status(403).send('Invaild login');
    }
};