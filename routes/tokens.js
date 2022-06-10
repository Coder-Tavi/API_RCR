const { User } = require("../classes/User");
const { getAccessToken } = require("../functions");
const fetch = require("node-fetch");

module.exports = {
  GET: /\/tokens\/(create|check|validate)/,
  DELETE: /\/tokens\/delete/,
  run: async (req, res) => {
    const endpoint = req.path.replace("/tokens/", "");
    if(endpoint === "create") {
      const { code } = req.query;
      if(!code) return res.status(400).send({
        success: false,
        message: "Missing code"
      });
      const discordToken = await getAccessToken(code);
      if(!discordToken) return res.status(400).send({
        success: false,
        message: "Invalid code"
      });
      const discordUser = await fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `Bearer ${discordToken.access_token}`
        }
      })
        .then(res => res.json());
      if(discordUser.error)
        return res.status(400).send({
          success: false,
          message: discordUser.error
        });
      if((await req.models.User.findOne({ where: { discordId: discordUser.id } })) === null) {
        const user = await req.models.User.create({
          discordId: discordUser.id,
          discord_access_token: discordToken.access_token,
          discord_refresh_token: discordToken.refresh_token
        }); 
        let token = `NszKJZedPgq${Math.random().toString(36).substring(2, 15)}.${Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15)}`;
        while (await req.models.Token.findOne({ where: { token: token } }) != null) {
          token = `NszKJZedPgq${Math.random().toString(36).substring(2, 15)}.${Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15)}`;
        }
        await req.models.Token.create({
          token: token,
          userId: user.userId
        });
        req.user = new User(user);
        return res.status(200).send({
          README: "WARNING! This token will be shown only once (Which is right now). If you forget it, you will have to reauthorize with Discord and create a new one",
          success: true,
          message: "Token created",
          data: {
            token: token
          }
        });
      } else {
        const user = await req.models.User.update({
          discord_access_token: discordToken.access_token,
          discord_refresh_token: discordToken.refresh_token
        }, { where: { discordId: discordUser.id } }); 
        let token = `NszKJZedPgq${Math.random().toString(36).substring(2, 15)}.${Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15)}`;
        while (await req.models.Token.findOne({ where: { token: token } }) != null) {
          token = `NszKJZedPgq${Math.random().toString(36).substring(2, 15)}.${Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15)+Math.random().toString(36).substring(2, 15)}`;
        }
        await req.models.Token.update({
          token: token
        }, { where: { userId: req.user.id } });
        req.user = new User(user);
        return res.status(200).send({
          README: "WARNING! This token will be shown only once (Which is right now). If you forget it, you will have to reauthorize with Discord and create a new one",
          success: true,
          message: "Token updated",
          data: {
            token: token
          }
        });
      }
    } else if(endpoint === "check" || endpoint === "validate") {
      if(req.user.id <= 0)
        return res.status(404).send({
          success: false,
          message: "Token not found",
          data: {
            token: req.headers.authorization
          }
        });
      else {
        const permissions = await req.user.getPermissions();
        return res.status(200).send({
          success: true,
          message: "",
          data: {
            token: req.headers.authorization.replace("Bearer ", ""),
            permissions: permissions
          }
        });
      }
    } else if(endpoint === "delete") {
      res.status(501).send({
        success: false,
        message: "Not implemented"
      });
    }
  }
};