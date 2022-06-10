const { DataTypes } = require("sequelize");

module.exports.import = (sequelize) => sequelize.define("PermissionList", {
  permissionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  permissionName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^[A-Z0-9_]+$/,
      notEmpty: true
    }
  },
});