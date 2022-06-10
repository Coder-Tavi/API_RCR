const // Imports
  { NotFoundError } = require("./classes/Errors.js"),
  { Sequelize } = require("sequelize"),
  { User } = require("./classes/User.js"),
  { toConsole } = require("./functions.js"),
  { readdirSync, existsSync, mkdirSync } = require("fs"),
  { sequelizeConf } = require("./config.js"),
  express = require("express"),
  app = express(),
  sequelize = new Sequelize(sequelizeConf),
  methods = {"GET":[],"POST":[],"DELETE":[]};
let // Temp vars
  files = 0;

//#region Database
(async () => {
  // Models
  if(!existsSync("./models")) mkdirSync("./models");
  const models = readdirSync("./models").filter(file => file.endsWith(".js"));
  console.info(`[DB] Importing {${models.length}} models`);
  for (const model of models) {
    console.info(`[DB] Importing ${model}`);
    try {
      const file = require(`./models/${model}`);
      await file.import(sequelize);
      console.info(`[DB] Imported {${model}}`);
      files++;
    } catch(e) {
      console.error(`[DB] Failed {${model}}`);
      console.error(e);
    }
  }
  console.info(`[DB] Imported {${files}/${models.length}} models`);

  // Sync
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("[DB] Connected and synced");
  } catch (e) {
    console.error("[DB] Connection or sync failed");
    console.error(`[DB] ${e}`);
  }
})();
//#endregion

//#region Routing
// Authorisation
app.use(async (req, res, next) => {
  req.sequelize = sequelize;
  req.models = sequelize.models;
  const bypassRoutes = [/^\/$/, /\/tokens\/create/];
  if(bypassRoutes.some(route => req.originalUrl.match(route))) req.headers.authorization = "Bearer X";
  await toConsole(bypassRoutes.some(r => req.originalUrl.match(r)), new Error().stack);
  console.info(`[ROUTE] Incoming challenge ${req.get("Authorization") === null || req.get("Authorization") === "Bearer X" ? "without auth" : "with auth"} at {${req.originalUrl}} from {${req.ip}}`);
  if(!req.get("Authorization") || !req.get("Authorization").trim().startsWith("Bearer")) {
    res.status(401).send({
      success: false,
      message: "No bearer token provided"
    });
  } else {
    const token = req.get("Authorization").split(" ")[1];
    const user = await sequelize.models.Token.findOne({ where: { token: token } })
      .then(entry => {
        if(entry)
          return sequelize.models.User.findOne({ where: { userId: entry.userId } });
        else
          return {userId: 0, discordId: 0, sequelize: sequelize};
      });
    req.user = new User(user);
    next();
  }
});

// Static routes
app.get("/", async (_req, res) => {
  res.redirect("https://docs.tavis.page");
});
app.get("/favicon.ico", async (_req, res) => {
  res.status(204).send();
});
app.options("*", (req, res) => {
  const validMethods = [];
  for (const method in methods) {
    if (methods[method].some(route => req.originalUrl.match(route))) {
      validMethods.push(method);
    }
  }
  if(validMethods.length > 0) validMethods.unshift("OPTIONS");
  res.set("Allow", validMethods.join(", "));
  res.status(200).send({
    success: true,
    message: "Options",
    data: {
      methods: validMethods
    }
  });
});

// Dynamic routes
(async () => {
  // Set routes
  const routes = readdirSync("./routes").filter(file => file.endsWith(".js"));
  files = 0;
  console.info(`[ROUTE] Importing {${routes.length}} routes`);
  for (const route of routes) {
    console.info(`[ROUTE] Importing ${route}`);
    try {
      const file = require(`./routes/${route}`);
      for (let method in file) {
        if(method === "run") continue;
        if(methods[method]) {
          methods[method].push(file[method]);
          app[method.toLowerCase()](file[method], file.run);
        } else
          console.error(`[ROUTE] Unknown method {${method}}`);
      }
      console.info(`[ROUTE] Imported {${route}}`);
      files++;
    } catch(e) {
      console.error(`[ROUTE] Failed {${route}}`);
      console.error(e);
    }
  }
  console.info(`[ROUTE] Imported {${files}/${routes.length}} routes`);
  files = 0;
})();
app.all("*", (req, res) => {
  console.info(`[ROUTE] Unhandled request at {${req.originalUrl}} from {${req.ip}}`);
  const e = new NotFoundError(`${req.originalUrl} (Method: ${req.method}) was not found on the server`, new Error().stack);
  res.status(404).send(e.generateJSON());
});
//#endregion

//#region Start up
app.listen(80, () => {
  console.info("[START] Example app listening on port 80!");
  console.info(`[START] Started at: ${new Date()}`);
});
//#endregion

//#region Error handling
process.on("unhandledRejection", async (reason, p) => {
  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});
//#endregion
