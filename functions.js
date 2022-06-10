const fetch = require("node-fetch");
const { discordConf } = require("./config.js");

module.exports = {
  /** @param {String} code */
  getAccessToken: async function(code) {
    if(!code) return undefined;
    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${discordConf.redirect_uri}&client_id=${discordConf.client_id}&client_secret=${discordConf.client_secret}`
    })
      .then(res => res.json());
    if(!res.access_token)
      return undefined;
    else
      return res;
  },
  /** @param {String} refreshToken */
  refreshToken: async function(refreshToken) {
    if(!refreshToken) return undefined;
    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${discordConf.client_id}&client_secret=${discordConf.client_secret}`
    })
      .then(res => res.json());
    if(res.error)
      return undefined;
    else
      return res;
  },
  /**
   * @param {String} message 
   * @param {String} source 
   */
  toConsole: async function(message, source) {
    // Send the content of message to the webhook URL found in config.js
    return await fetch(discordConf.logWebhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        embeds: [
          {
            description: message,
            footer: {
              text: `${source.split("at ")[1].replace("\n", "")}`
            }
          }
        ]
      })
    });
  }
};