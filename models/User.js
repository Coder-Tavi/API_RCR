const { DataTypes } = require("sequelize");

module.exports.import = (sequelize) => sequelize.define("User", {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  discordId: {
    type: DataTypes.STRING,
    length: 20,
    allowNull: false,
    validate: {
      is: /^[a-zA-Z0-9]+$/,
      notEmpty: true
    }
  },
  discord_access_token: {
    type: DataTypes.STRING,
    length: 255,
    allowNull: true,
  },
  discord_refresh_token: {
    type: DataTypes.STRING,
    length: 255,
    allowNull: true,
  }
});