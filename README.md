# E-Sports Team Manager

A Discord bot designed for e-sport team servers to streamline the process of organizing weekly practice. Built using Bun, TypeScript, Discord.js, and Prisma.

## Features

- **Availability Polling:** Automatically post polls to check player availability for the upcoming week.
- **Role Mapping:** Set up mappings between in-game roles and Discord roles to aid in scheduling.
- **Schedule Analysis:** Check poll results against registered player roles to determine the best days for practice.

## Commands

### `/config`

- `/config roles-set <role_name> <discord_role>`: Creates a mapping between a custom in-game role name and an existing Discord role.
- `/config roles-view`: Displays all currently configured game role mappings.
- `/config roles-remove <role_name>`: Deletes a previously configured game role mapping.

### `/team`

- `/team create <team_name>`: Initializes the team setup within the bot.
- `/team role-set <team_name> <discord_role>`: Sets the Discord role that identifies team members.
- `/team role-remove <team_name>`: Clears the team Discord role.
- `/team channel-set <team_name> <type> <discord_channel>`: Sets specific channels for bot functions.
- `/team players-add <discord_user>`: Adds a user to the team's list of players.
- `/team players-view`: Lists all players currently tracked for the team.
- `/team players-remove <discord_user>`: Removes a player from the team.

#### `/player`

- `/player roles-add <role_name> <priority>`: Allows a player to set their preferred roles with a priority.
- `/player roles-view`: Shows the game roles the player has currently assigned to themselves.
- `/player roles-remove <role_name>`: Removes a role the player had assigned.

#### `/schedule`

- `/schedule schedule-set <team_name> <post_day> <days>`: Sets the day of the week that a availability poll should be automatically posted.
- `/schedule schedule-remove <team_name>`: Removes a scheduled for availability polls.
- `/schedule poll-post`: Manually triggers the weekly availability poll.
- `/schedule schedule-analyse`: Instructs the bot to analyze the results of the latest availability poll against.

#### `/info`

- `/info`: Displays bot information.
