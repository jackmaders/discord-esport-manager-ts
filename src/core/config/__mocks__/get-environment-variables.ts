export function getEnvironmentVariables() {
	return {
		...process.env,
		// biome-ignore lint/style/useNamingConvention: environment variables
		SKIP_COMMAND_REGISTRATION: process.env.SKIP_COMMAND_REGISTRATION === "true",
	};
}
