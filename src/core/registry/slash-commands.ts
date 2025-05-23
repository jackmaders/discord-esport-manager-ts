import availabilityCommand from "../../modules/availability/commands/availability.command";
import configCommand from "../../modules/config/commands/config.command";

/**
 * Commands array containing all slash commands to be registered.
 */
const slashCommands = [availabilityCommand, configCommand];

export default slashCommands;
