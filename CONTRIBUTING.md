# Contribution Guide

## Development Setup

### Prerequisites

1. [Bun](https://bun.sh/) (v1.2.2 or later recommended)
2. A Discord Server and Account with administrative permissions.
3. A Discord Bot Application created via the [Discord Developer Portal](https://discord.com/developers/applications).

### Setup

```bash
# Install dependencies
bun install
```

```bash
# Setup environment variables
# Ensure to set the relevant variables in the new .env file
cp .env.example .env
```

```bash
# Setup database
bunx prisma migrate dev
```

```bash
# Run the bot
bun run start
```

### Database changes

If you make any changes to `prisma/schema.prisma` you will need to re-run the database migration command.

```bash
bunx prisma migrate dev
```

During development, the database migration command will likely automatically generate a typed Prisma Client based on your schema. However, you may need to generate one manually with the below script.

```bash
bunx prisma generate
```

## Coding Standards

### Discord.js Interaction Replies

- Avoid the Deprecated `ephemeral: true` option when sending replies or follow-ups that should only be visible to the user.
- Instead, you should import `MessageFlags` from `discord.js` and use the `flags` property on the reply or follow-up.

```typescript
import { MessageFlags } from "discord.js";

// Correct
await interaction.reply({
  content,
  flags: [MessageFlags.Ephemeral],
});

// Incorrect
// await interaction.reply({
//     content,
//     ephemeral: true // <-- Do not use
// });
```

### Internationalization

- Avoid hard-coding strings for user-facing text.
- Instead, you should use add a string to the relevant JSON file, and use the `t()` function provided by `i18next`.
- The JSON files should all be located within the `/src/locales` directory, with a matching structure to the main app.

  ```typescript
  import { t } from "i18next";

  // Correct
  await interaction.reply({
    content: t("common:someKey"),
  });

  // Incorrect
  // await interaction.reply({
  //     content: "Example text.",
  // });
  ```

### Logging

- Avoid using `console.log()` and hard-coding strings for logging.
- Instead, you should use the existing pino logger with the message added to the 'logger/log-messages.ts' file.
- The keys for the logMessages object should be upper snake case and follow this structure `[LogLevel]_[Object]_[Action]`.
- Logs should use the interpolation functionality provided by pino wherever reasonable.

  ```typescript
  import logger from "./core/logger";
  import logMessages from "./core/logger/messages";

  // Correct
  logger.info(logMessages.INFO_ACTION_SUCCESS, actionName);

  // Incorrect
  // console.info(logMessages.INFO_ACTION_SUCCESS, actionName)

  // Incorrect
  // logger.info("Action Succeeded: %s", actionName)
  ```

  | Level | Description                                                            |
  | ----- | ---------------------------------------------------------------------- |
  | Trace | Temporary logs added to debug specific functionality.                  |
  | Debug | Implementation-specific logs for individual modules or utilities.      |
  | Info  | Top-level bot functionality and interactions.                          |
  | Warn  | Undesirable situation, but the bot is able to continue execution.      |
  | Error | Undesirable situation; the bot cannot continue the specific operation. |
  | Fatal | Fatal error in core bot functionality, potentially requiring shutdown. |

### Module Structure

Each distinct feature or command group of the bot resides in its own directory under `src/modules/`.

Any code, utilities, type definitions, or configurations that are not specific to a single feature module and are intended to be used across multiple modules or by the core application should be placed in the `src/shared/` directory.

Within each feature module directory, the following subdirectories are conventionally used to organize its components. While not all subdirectories are mandatory for every module, this structure is encouraged for consistency and scalability:

- `commands/`: Defines each of the the feature's slash commands and links to the corresponding handler (`<command-name>.command.ts`).
- `handlers/`: Contains the core implementation logic for each command, calling necessary services and triggering a response (`<command-name>.handler.ts`).
- `services/`: Encapsulates complex business logic that is too extensive for a handler file (`<command-name>.service.ts`).
- `ui/`: Manages the creation and formatting of user interface elements (`<command-name>.ui.ts`).
- `clients/`: Handles interactions with external APIs or SDKs (`<command-name>.client.ts`).
- `repositories/`: Abstracts data persistence logic (`<command-name>.repository.ts`).
- `types/`: Contains TypeScript type definitions, interfaces, or enums (`<command-name>.types.ts`).
