const { DataTypes } = require("sequelize");

module.exports.import = (sequelize) => sequelize.define("TokenBan", {
  tokenBanId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  moderatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "userId"
    }
  },
  discordId: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});