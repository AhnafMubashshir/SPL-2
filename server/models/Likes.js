const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Likes = sequelize.define("Likes", {
        postID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        liked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    Likes.sync();

    return Likes;
};
