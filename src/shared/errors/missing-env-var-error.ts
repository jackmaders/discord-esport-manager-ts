export class MissingEnvVarError extends Error {
	public readonly variable: string;

	constructor(variable: string) {
		super(`Missing environment variable: ${variable}`);
		this.name = "MissingEnvVarError";
		this.variable = variable;
	}
}
