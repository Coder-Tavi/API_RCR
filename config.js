module.exports = {
  sequelizeConf: {
    username: process.argv.find(v => v.startsWith("DB_USERNAME")).split("=")[1],
    password: process.argv.find(v => v.startsWith("DB_PASSWORD")).split("=")[1],
    database: process.argv.find(v => v.startsWith("DB_NAME")).split("=")[1],
    host: process.argv.find(v => v.startsWith("DB_HOST")).split("=")[1],
    dialect: "mysql"
  },
  discordConf: {
    client_id: process.argv.find(v => v.startsWith("DISCORD_CLIENT_ID")).split("=")[1],
    client_secret: process.argv.find(v => v.startsWith("DISCORD_CLIENT_SECRET")).split("=")[1],
    redirect_uri: process.argv.find(v => v.startsWith("DISCORD_REDIRECT_URI")).split("=")[1],
    logWebhook: process.argv.find(v => v.startsWith("DISCORD_WEBHOOK_URL")).split("=")[1],
    token: process.argv.find(v => v.startsWith("DISCORD_BOT_TOKEN")).split("=")[1],
  },
  sslConf: {
    key: process.argv.find(v => v.startsWith("SSL_KEY")).split("=")[1],
    cert: process.argv.find(v => v.startsWith("SSL_CERT")).split("=")[1]
  }
};