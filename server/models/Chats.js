const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Chats = sequelize.define("Chats", {
        userID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    Chats.sync();

    return Chats;
};
