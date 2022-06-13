const { DataTypes } = require("sequelize");

module.exports.import = (sequelize) => sequelize.define("Ban", {
  banId: {
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
  robloxId: {
    type: DataTypes.TEXT,
    length: "TINY",
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  proof: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  appealable: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
});