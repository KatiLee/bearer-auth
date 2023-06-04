'use strict';

const { users } = require('../models/index');

async function handleSignup(req, res, next) {
    try {
        let userRecord = await users.create(req.body);
        const output = {
            user: userRecord,
            token: userRecord.token,
        };
        res.status(201).json(output); 
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function handleSignin(req, res, next) {
    try {
        const user = {
            user: req.user,
            token: req.user.token,
        };
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

async function handleGetUsers(req, res, next) {
    try {
        const userRecords = await users.findAll({});
        const list = userRecords.map(user => user.username);
        res.status(200).json(list);
    } catch (error) {
        console.error(error);
        next(error);
    }
}

function handleSecret(req, res, next) {
    res.status(200).send('Shhhhh, it\'s a secret!');
}

module.exports = {
    handleSignup,
    handleSignin,
    handleGetUsers,
    handleSecret,
};