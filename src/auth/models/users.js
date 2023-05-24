'use strict';

const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');

const userSchema = (sequelize, DataTypes) => {
    const model = sequelize.define('User', {
        username: { type: DataTypes.STRING, allowNull: false, unique: ture },
        password: { type: DataTypes.STRING, allowNull: false, },
        token: {
            type: DataTypes.VIRTUAL,
            get() {
                return jwt.sign({ username: this.username });
            }
        }
    });

    model.beforeCreate(async (user) => {
        let hashedPass = bcrypt.hash(user.password, 10);
        user.password = hashedPass;
    });

    model.authenticateBasic = async function (username, password) {
        const user = await this.findOne({ username })
        const valid = await bcrypt.compare(password, user.password)
        if (valid) { return user; }
        throw new Error('Invalid User');
    }
    model.authenticateToken = async function (token) {
        try {
            const parsedToken = jwt.verify(token, process.env.SECRET);
            const user = this.findOne({ username: parsedToken.username })
            if (user) { return user; }
            throw new Error('User Not Found');
        } catch (e) {
            throw new Error(e.message)
        }
    }
    return model;
}
module.exports = userSchema;