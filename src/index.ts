import exitProcess from "./core/utils/exit-process.ts";
import { main } from "./main.ts";

main();

process.on("SIGINT", () => exitProcess(0));
process.on("SIGTERM", () => exitProcess(0));
