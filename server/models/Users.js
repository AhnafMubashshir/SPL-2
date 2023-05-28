const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        email: {
            type: DataTypes.STRING,
            primaryKey: true, // Make email the primary key
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userType: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    Users.sync();

    return Users;
};
