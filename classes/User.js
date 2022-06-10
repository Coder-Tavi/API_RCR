const { Sequelize } = require("sequelize");

module.exports = {
  /**
   * @typedef {Object} UserConstructorData
   * @property {Integer} userId 
   * @property {DiscordUserData} discordId
   * @property {Sequelize} sequelize
   */

  /**
   * @class
   * @classdesc An Object representing a user in the database
   */
  User: class {
    /**
     * @param {UserConstructorData} data User data
     */
    constructor(data) {
      this.setup(data);
    }

    /**
     * @private
     * @param {UserConstructorData} data 
     */
    setup(data) {
      if(!data.sequelize || !data.sequelize.authenticate()) return new SyntaxError("Cannot create a User object with an invalid Sequelize object");
      this.id = data.userId;
      this.discordId = data.discordId;
      this.sequelize = data.sequelize;
    }

    /**
     * @async
     * @description Add Discord authorization information
     * @param {String} access_token Access token
     * @param {String} refresh_token Refresh token
     * @returns {Object} JSON representation of the User
     */
    async addDiscordAuth(access_token, refresh_token) {
      if(!access_token || !refresh_token) return new SyntaxError("Cannot add Discord authorization information without both an access token and refresh token");
      this.access_token = access_token;
      this.refresh_token = refresh_token;
      try {
        const user = await this.sequelize.models.User.update({
          discord_access_token: access_token,
          discord_refresh_token: refresh_token
        }, { where: { userId: this.id } });
        return user;
      } catch(e) {
        console.error(e);
        return null;
      }
    }

    /**
     * @description Gets an Array of the user's permissions
     * @returns {Array<String>} Array of strings representing the user's permissions
     */
    async getPermissions() {
      if(this.id < 1) 
        return [];

      // eslint-disable-next-line no-undef
      const userPermissions = await this.sequelize.query(`SELECT * FROM Permissions WHERE userId = ${this.id}`, { type: Sequelize.QueryTypes.SELECT });
      // eslint-disable-next-line no-undef
      const permissions = await this.sequelize.query("SELECT * FROM PermissionLists", { type: Sequelize.QueryTypes.SELECT });

      // Return an Array of permissions that are strings in the PermissionLists table
      return permissions.filter(permission => {
        return userPermissions.some(userPermission => {
          return userPermission.permissionId === permission.id;
        });
      }).map(permission => {
        return permission.permissionName;
      });
    }

    /**
     * @param {Boolean} force Whether to destroy and recreate the data
     */
    sync(force) {
      if(force) {
        // eslint-disable-next-line no-undef
        this.sequelize.models.User.destroy({ where: { userId: this.id } })
          .then(() => {
            // eslint-disable-next-line no-undef
            this.sequelize.models.User.create({ discordId: this.discordId });
          });
      } else {
        // eslint-disable-next-line no-undef
        this.sequelize.models.User.findOne({ where: { userId: this.id } })
          .then(user => {
            if(user) {
              // eslint-disable-next-line no-undef
              this.sequelize.models.User.update({
                discordId: this.discordId
              }, { where: { userId: this.id } });
            }
            else {
              // eslint-disable-next-line no-undef
              this.sequelize.models.User.create({ discordId: this.discordId });
            }
          });
      }
    }
    /**
     * @description Returns a string representation of the user
     * @returns {String} String representation of the User
     */
    toString() {
      return `User(id: ${this.id}, discordId: ${this.discordId})`;
    }
  }
};