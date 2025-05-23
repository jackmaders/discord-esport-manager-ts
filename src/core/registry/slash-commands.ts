import availabilityCommand from "../../modules/availability/commands/availability.command";
import pingCommand from "../../modules/ping/commands/ping.command";

/**
 * Commands array containing all slash commands to be registered.
 */
const slashCommands = [pingCommand, availabilityCommand];

export default slashCommands;
