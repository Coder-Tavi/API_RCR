const fetch = require("node-fetch");

module.exports = {
  GET: /\/v1\/bans\/check/,
  POST: /\/v1\/bans\/(add|check)/,
  DELETE: /\/v1\/bans\/delete/,
  run: async (req, res) => {
    const endpoint = req.path.replace("/bans/", "");
    if (endpoint === "check") {
      const { robloxId } = req.query;
      if (!robloxId) return res.status(400).send({
        success: false,
        message: "Missing roblox ID"
      });
      const ban = await req.models.Ban.findAll({ where: { robloxId: robloxId } });
      if (ban.length === 0) return res.status(200).send({
        success: true,
        message: "No bans found"
      });
      // Compile all the bans into one array
      let bans = [];
      for (let i = 0; i < ban.length; i++) {
        bans.push(ban[i].dataValues);
      }
      return res.status(200).send({
        success: true,
        message: "Bans found",
        data: {
          bans: bans
        }
      });
    } else if(endpoint === "add" || endpoint === "create") {
      // Check if they can CREATE_BAN
      const permissions = await req.user.getPermissions();
      if(!permissions.includes("CREATE_BAN")) return res.status(403).send({
        success: false,
        message: "You do not have permission to create bans"
      });
      const authorization = await req.user.validateDiscordAuthorization();
      if(!authorization.valid) return res.status(403).send({
        success: false,
        message: "Discord authorization is invalid",
        data: {
          message: authorization.message
        }
      });

      // Check for valid data
      const { robloxId, reason, appealable, proof } = req.body;
      const missing = [];
      if(robloxId === undefined) missing.push("robloxId");
      if(reason === undefined) missing.push("reason");
      // Appealable is optional
      if(proof === undefined) missing.push("proof");
      if(missing.length > 0) return res.status(400).send({
        success: false,
        message: "Missing fields",
        data: {
          missing: missing
        }
      });

      // Validate the data
      if(typeof robloxId != "number") return res.status(400).send({
        success: false,
        message: "robloxId must be a number"
      });
      if(typeof reason != "string") return res.status(400).send({
        success: false,
        message: "reason must be a string"
      });
      if(appealable != undefined && typeof appealable != "boolean") return res.status(400).send({
        success: false,
        message: "appealable must be a boolean"
      });
      if(!Array.isArray(proof) && !proof.every(proof => typeof proof === "string")) return res.status(400).send({
        success: false,
        message: "proof must be an array of image URLs"
      });
      const imageRegex = /https:\/\/(i\.){0,1}(imgur.com|ibb.co)\/.+[a-zA-Z0-9]\.(png|jpg)$/;
      // Regex tester: https://regexr.com/6nin7
      if(!imageRegex.test(proof)) return res.status(400).send({
        success: false,
        message: "proof must be a valid image URL"
      });

      // Check if a user exists
      const user = await fetch(`https://api.roblox.com/users/${robloxId}`);
      if(user.status === 400) return res.status(404).send({
        success: false,
        message: "robloxId is not a valid Roblox user ID"
      });

      // Create the ban
      const ban = await req.models.Ban.create({
        moderatorId: req.user.id,
        robloxId: robloxId,
        reason: reason,
        appealable: appealable,
        proof: JSON.stringify(proof)
      });

      // Send the ban
      ban.proof = JSON.parse(ban.proof); // Parse it back to an array
      return res.status(201).send({
        success: true,
        message: "Ban created",
        data: {
          ban: ban
        }
      });
    } else if(endpoint === "delete") {
      // Check if they can DELETE_BAN
      const permissions = await req.user.getPermissions();
      if(!permissions.includes("DELETE_BAN")) return res.status(403).send({
        success: false,
        message: "You do not have permission to delete bans"
      });
      const authorization = await req.user.validateDiscordAuthorization();
      if(!authorization.valid) return res.status(403).send({
        success: false,
        message: "Discord authorization is invalid",
        data: {
          message: authorization.message
        }
      });

      // Check for valid data
      const { banId } = req.query;
      if(!banId) return res.status(400).send({
        success: false,
        message: "banId is a required parameter"
      });
      if(typeof banId != "number") return res.status(400).send({
        success: false,
        message: "banId must be a number"
      });

      // Check if a ban by that ID exists
      const ban = await req.models.Ban.findOne({ where: { banId: banId } });
      if(!ban) return res.status(404).send({
        success: false,
        message: "Ban does not exist"
      });
      // Remove the ban
      await ban.destroy();
      return res.status(200).send({
        success: true,
        message: "Ban deleted"
      });
    }
  }
};