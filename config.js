module.exports = {
  sequelizeConf: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql"
  },
  discordConf: {
    client_id: process.env.DISCORD_CLIENT_ID,
    client_secret: process.env.DISCORD_CLIENT_SECRET,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    logWebhook: process.env.DISCORD_WEBHOOK_URL,
    token: process.env.DISCORD_BOT_TOKEN
  }
};