# Roblox Cheater Registry API
This repository contains the Roblox Cheater Registry API. All code is written in [Node.js](https://nodejs.org/). The API is written in [Express](https://expressjs.com/).

**Table of Contents**
1. [Installing](#installing)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
2. [Commands](#commands)
3. [License](#license)
4. [Credits](#credits)

## Installing
### Prerequisites
The Agent Black API requires the following prerequisites:
Before installing the project, you will need the following. Some have been marked as optional, in which case, they are optional and not required, but recommended.

* Internet connection
* Node.js v16.11.1 or higher
* NPM v8.0.0 or higher
* MySQL v8.0.28
* Git CLI

**Important!** The `git` commands used are adapted for git version 2.32.0 (Apple Git-132). This may vary across platforms or new versions.

### Installation
To install the bot's code, please use the following commands.

1. `git clone https://github.com/Coder-Tavi/API_RCA`
2. `cd API_RCA`
3. `npm install`

**Important!** You must set the following environment variables when running the command below:
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_HOST`
- `DISCORD_BOT_TOKEN`
- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_REDIRECT_URI`
- `DISCORD_WEBHOOK_URL`

When you are done with that, you can run the bot using the following command:
* `node index.js`

To validate your code against the ESLint configuration, please use the following command:
* `npx eslint ./`

## Commands ##
Since this bot operates on Discord's slash commands, all commands can be viewed by typing `/` into the Discord chat bar. You will see a list of commands appear for the different bots. Scroll until you see the bot's. All available commands will be listed there.

## License ##
Coder-Tavi/API_RCA is licensed under the GNU General Public License v3.0. You can find more details about the license and where to find it in the file titled "LICENSE" in the primary directory.

## Credits ##
This bot was made possible thanks to the following people:
- [Tavi](https://github.com/Coder-Tavi) - Developer