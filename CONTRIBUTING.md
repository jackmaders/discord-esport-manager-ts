## Development Setup

### Prerequisites

1. [Bun](https://bun.sh/) (v1.2.2 or later recommended)
2. A Discord Server and Account with administrative permissions.
3. A Discord Bot Application created via the [Discord Developer Portal](https://discord.com/developers/applications).

### Setup

1.  **Install dependencies:**

    ```bash
    bun install
    ```

2.  **Configure environment variables:**

    - Make a copy of the `.env.example` in the root directory, and rename to `.env`.
    - Set the required variables for your `.env` file.

3.  **Run the bot:**

    ```bash
    bun run start
    ```

## Coding Standards

### Discord.js Interaction Replies

- Avoid the Deprecated `ephemeral: true` option when sending replies or follow-ups that should only be visible to the user.
- Instead, you should import `MessageFlags` from `discord.js` and use the `flags` property on the reply or follow-up.

  ```typescript
  import { MessageFlags } from "discord.js";

  // Correct usage:
  await interaction.reply({
    content: "This message is only for you.",
    flags: [MessageFlags.Ephemeral],
  });

  // Deprecated usage (Avoid):
  // await interaction.reply({
  //     content: "This message is only for you.",
  //     ephemeral: true // <-- Do not use
  // });
  ```

### Logging Strings

- Logging string should not be hard-coded directly into the logic of the bot.
- Instead, they should be stored within a relevant `LogMessages.ts` file for the module.
- The LogMessages.ts should have a single default export of an object containing the logging strings.
  -The keys of the object should be in the this format: `[File Abbreviation]_[Log Level]_[Action]`. e.g. `IDX_DEBUG_CLIENT_LOGIN`

### User-Facing Strings

- User-facing string should not be hard-coded directly into the logic of the bot.
- Instead, they should be handled by i18n.
