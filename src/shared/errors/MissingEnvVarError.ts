class MissingEnvVarError extends Error {
	constructor(public variable: string) {
		super(`Missing environment variable: ${variable}`);
		this.name = "MissingEnvVarError";
	}
}

export default MissingEnvVarError;
