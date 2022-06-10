const { DataTypes } = require("sequelize");

module.exports.import = (sequelize) => sequelize.define("Permission", {
  userId: {
    type: DataTypes.INTEGER,
    notNull: true,
    references: {
      model: "Users",
      key: "userId",
    },
    onDelete: "CASCADE"
  },
  permission: {
    type: DataTypes.INTEGER,
    notNull: true,
    references: {
      model: "PermissionLists",
      key: "permissionId",
    },
    onDelete: "CASCADE"
  }
});