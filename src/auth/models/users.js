'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;
// const { DataTypes } = require('sequelize');

const userSchema = (sequelize, DataTypes) => {
    const model = sequelize.define('User', {
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false, },
        token: {
            type: DataTypes.VIRTUAL,
            get() {
                return jwt.sign({ username: this.username }, SECRET, {expiresIn: 1000 * 60 * 60 * 24 * 7});
            },
        },
    });

    model.beforeCreate(async (user) => {
        let hashedPass = await bcrypt.hash(user.password, 10);
        user.password = hashedPass;
    });

    model.authenticateBasic = async function (username, password) {
        const user = await this.findOne({ where: { username }});
        const valid = await bcrypt.compare(password, user.password)
        if (valid) { return user; }
        throw new Error('Invalid User');
    };
    model.authenticateToken = async function (token) {
        try {
            const parsedToken = jwt.verify(token, SECRET);
            const user = this.findOne({ where: { username: parsedToken.username }})
            if (user) { return user; }
            throw new Error('User Not Found');
        } catch (error) {
            throw new Error(error.message)
        }
    }
    return model;
}
module.exports = userSchema;