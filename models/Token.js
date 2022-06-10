const { DataTypes } = require("sequelize");

module.exports.import = (sequelize) => sequelize.define("Token", {
  tokenId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Users",
      key: "userId",
    },
    onDelete: "CASCADE"
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
});