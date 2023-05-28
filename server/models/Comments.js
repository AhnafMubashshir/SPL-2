const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("Comments", {
        postID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        body: {
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
        }
    });

    Comments.sync();

    return Comments;
};
