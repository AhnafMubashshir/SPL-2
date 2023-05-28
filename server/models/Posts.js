const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
        title: {
            type: DataTypes.STRING,
            allownull: false
        },
        body: {
            type: DataTypes.STRING,
            allownull: false
        },
        userName: {
            type: DataTypes.STRING,
            allownull: false
        },
        userID: {
            type: DataTypes.STRING,
            allownull: false
        },
        likeCount: {
            type: DataTypes.INTEGER,
            allownull: false,
            defaultValue: 0
        },
        commentCount: {
            type: DataTypes.INTEGER,
            allownull: false,
            defaultValue: 0
        }
    })

    Posts.sync();

    return Posts;
};