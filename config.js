module.exports = {
  sequelizeConf: {
    username: process.argv.DB_USERNAME,
    password: process.argv.DB_PASSWORD,
    database: process.argv.DB_NAME,
    host: process.argv.DB_HOST,
    dialect: "mysql"
  },
  discordConf: {
    client_id: process.argv.DISCORD_CLIENT_ID,
    client_secret: process.argv.DISCORD_CLIENT_SECRET,
    redirect_uri: process.argv.DISCORD_REDIRECT_URI,
    logWebhook: process.argv.DISCORD_WEBHOOK_URL,
    token: process.argv.DISCORD_BOT_TOKEN
  }
};