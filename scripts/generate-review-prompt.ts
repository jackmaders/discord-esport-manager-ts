#!/usr/bin/env bun
// Filename: generate-review-prompt.ts
// Version: Parallel file reading

import { promises as fs } from "node:fs";
import path from "node:path";
import { spawnSync } from "bun";

// --- Configuration ---
const MAIN_BRANCH_NAMES = ["main", "master"];
const IMPORTANT_FILES = [
	"README.md",
	"CONTRIBUTING.md",
	"package.json",
	"tsconfig.json",
	"bun.lockb",
	".eslintrc.json", // Or other eslint config names
	".prettierrc.json", // Or other prettier config names
	"CODE_OF_CONDUCT.md",
	// Add any other project-specific important files
];
const MAX_FILE_SIZE_MB = 5;
const OUTPUT_FILE_PATH = "./.temp/review-prompt.md";

// --- Helper Functions ---

/**
 * Runs a shell command synchronously and returns its stdout.
 * Throws an error if the command fails.
 */
function runSync(cmd: string, args: string[]): string {
	console.log(`⏳ Running: ${cmd} ${args.join(" ")}...`);
	const { stdout, stderr, exitCode } = spawnSync([cmd, ...args]);

	if (exitCode !== 0) {
		console.error(`❌ Error running command: ${cmd} ${args.join(" ")}`);
		console.error(`   Exit Code: ${exitCode}`);
		console.error(`   Stderr: ${stderr.toString()}`); // Ensure stderr is string
		throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
	}
	// console.log(`✅ Command successful: ${cmd} ${args.join(' ')}`);
	return stdout.toString().trim();
}

/**
 * Attempts to find the main branch name from the predefined list.
 */
async function findMainBranch(): Promise<string> {
	console.log("⏳ Detecting main branch...");
	// No async operation here, runSync is sync, so keep as is.
	const branches = runSync("git", ["branch", "-a"])
		.split("\n")
		.map((b) =>
			b
				.trim()
				.replace(/^\*?\s*/, "")
				.replace(/^remotes\/origin\//, ""),
		);

	const branchSet = new Set(branches);

	for (const name of MAIN_BRANCH_NAMES) {
		if (branchSet.has(name)) {
			console.log(`✅ Detected main branch: ${name}`);
			return name;
		}
	}
	throw new Error(
		`Could not automatically detect main branch. Checked: ${MAIN_BRANCH_NAMES.join(", ")}`,
	);
}

/**
 * Reads a file's content using Bun.file, handling potential errors and size limits.
 * Returns the content as a string, a placeholder string for errors/size limits, or null if non-existent.
 */
async function readFileContent(filePath: string): Promise<string | null> {
	try {
		const resolvedPath = path.resolve(filePath);
		const file = Bun.file(resolvedPath);
		if (!(await file.exists())) {
			// console.warn(`   Skipping non-existent file: ${filePath}`);
			return null; // Indicate file doesn't exist
		}

		if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
			console.warn(
				`   ⚠️ Skipping large file (${(file.size / (1024 * 1024)).toFixed(
					2,
				)} MB): ${filePath}`,
			);
			return `--- File content skipped (Too large: > ${MAX_FILE_SIZE_MB}MB) ---`;
		}
		// console.log(`   Reading file: ${filePath}`);
		return await file.text();
	} catch (error) {
		console.error(`   ❌ Error reading file ${filePath}:`, error);
		return `--- Error reading file: ${error instanceof Error ? error.message : String(error)} ---`;
	}
}

// --- Main Script Logic ---
(async () => {
	try {
		// 1. Determine Branches
		const mainBranch = await findMainBranch(); // Remains async due to potential future changes, but currently runs sync git command
		const currentBranch = runSync("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
		console.log(`✅ Current branch: ${currentBranch}`);
		if (currentBranch === mainBranch) {
			console.warn(
				`⚠️ Warning: You are on the main branch (${mainBranch}). Diff might be empty or unexpected.`,
			);
		}

		// 2. Get Diff
		console.log(`⏳ Generating diff: ${mainBranch}...${currentBranch}`);
		const diff = runSync("git", ["diff", `${mainBranch}...${currentBranch}`]);

		// 3. Get Changed File Paths
		const changedFilesPaths = runSync("git", [
			"diff",
			"--name-only",
			`${mainBranch}...${currentBranch}`,
		])
			.split("\n")
			.filter(Boolean); // Filter out empty lines
		console.log(`✅ Found ${changedFilesPaths.length} changed file(s).`);

		if (changedFilesPaths.length === 0 && !diff) {
			console.log("ℹ️ No changes detected between branches.");
		}

		// 4. Read Content of Changed Files (in Parallel) <<< MODIFIED SECTION
		console.log("\n⏳ Reading changed files (in parallel)...");
		let changedFilesContent = "";
		if (changedFilesPaths.length > 0) {
			const changedFilePromises = changedFilesPaths.map(readFileContent); // Create promises
			const changedFileResults = await Promise.all(changedFilePromises); // Execute in parallel

			// Process results, associating them back to their paths
			changedFileResults.forEach((content, index) => {
				if (content !== null) {
					// Skip non-existent files
					const filePath = changedFilesPaths[index];
					changedFilesContent += `--- START FILE: ${filePath} ---\n`;
					changedFilesContent += content; // Content might be actual text or an error/skip message
					changedFilesContent += `\n--- END FILE: ${filePath} ---\n\n`;
				}
			});
		}
		console.log("✅ Finished reading changed files.");

		// 5. Read Content of Important Project Files (in Parallel) <<< MODIFIED SECTION
		console.log("\n⏳ Reading important project files (in parallel)...");
		let importantFilesContent = "";
		if (IMPORTANT_FILES.length > 0) {
			const importantFilePromises = IMPORTANT_FILES.map(readFileContent); // Create promises
			const importantFileResults = await Promise.all(importantFilePromises); // Execute in parallel

			// Process results
			importantFileResults.forEach((content, index) => {
				if (content !== null) {
					// Skip non-existent files (readFileContent returns null)
					const filePath = IMPORTANT_FILES[index];
					importantFilesContent += `--- START FILE: ${filePath} ---\n`;
					importantFilesContent += content; // Content might be actual text or an error/skip message
					importantFilesContent += `\n--- END FILE: ${filePath} ---\n\n`;
				} else {
					// console.log(`   Skipped important file (not found): ${IMPORTANT_FILES[index]}`);
				}
			});
		}
		console.log("✅ Finished reading important files.");

		// 6. Define LLM Instructions (Keep this section as is from original)
		const llmInstructions = `# AI Code Review Request

**Objective:** Please perform a thorough code review of the provided changes.

**Project Type:** TypeScript

**Focus Areas:**

1.  **Maintainability:**
    * Is the code clear, understandable, and easy to follow?
    * Is it well-structured and organized (e.g., modules, functions, classes)?
    * Is the complexity appropriate? Could anything be simplified?
    * Does it adhere to SOLID, DRY, KISS principles where applicable?
    * Are variable and function names descriptive and meaningful?

2.  **Performance:**
    * Are there any obvious performance bottlenecks (e.g., inefficient loops, excessive computations, blocking I/O)?
    * Is memory usage reasonable? Any potential memory leaks?
    * Could asynchronous operations be optimized (e.g., Promise handling, concurrency)?
    * Are data structures chosen appropriately for the task?

3.  **Best Practices (TypeScript/Node.js/Bun):**
    * Does the code leverage TypeScript's type system effectively? Minimize \`any\`?
    * Are modern JavaScript/TypeScript features used appropriately (e.g., async/await, modules, optional chaining)?
    * Does it follow common Node.js/Bun patterns (e.g., error-first callbacks if applicable, non-blocking I/O)?
    * Is dependency management clean (see package.json)? Are dependencies up-to-date and secure?

4.  **Scope Creep:**
    * Do all changes directly relate to the intended feature, bug fix, or refactoring?
    * Are there any unrelated changes included in this diff?

5.  **Documentation:**
    * Is there sufficient inline documentation (comments) for complex logic?
    * Are JSDoc annotations used effectively for functions, classes, and types?
    * If changes affect external behavior, are relevant READMEs or other documentation updated?

6.  **Testing:**
    * Are the changes covered by new or existing tests (unit, integration, e2e)?
    * Are test cases thorough? Do they cover edge cases and potential failure modes?
    * Do all tests pass?

7.  **Security:**
    * Are there any potential security vulnerabilities (e.g., SQL injection, XSS, insecure handling of secrets, input validation)?
    * Are external dependencies vetted for security issues?
    * Is sensitive data handled appropriately?

8.  **Error Handling:**
    * Is error handling robust and consistent?
    * Are potential errors anticipated and handled gracefully?
    * Are error messages informative for debugging?
    * Are resources cleaned up properly in case of errors (e.g., file handles, network connections)?
`;

		// 7. Assemble the final prompt (Keep this section as is from original)
		console.log("\n⏳ Assembling final prompt...");
		const prompt = `${llmInstructions}

---
## Code Review Context

**Branch Under Review:** \`${currentBranch}\`
**Compared Against:** \`${mainBranch}\`

---
## Git Diff (${mainBranch}...${currentBranch})

\`\`\`diff
${diff || "No textual diff generated (might be binary files or no changes)."}
\`\`\`

---
## Full Content of Changed Files (${changedFilesPaths.length} files)

${changedFilesContent || "No changed files found or readable."}

---
## Content of Important Project Files

${importantFilesContent || "No important project files found or readable."}

---
**Request:**

* Please provide your feedback based on the focus areas above.
* Structure your review clearly, referencing specific files and line numbers where possible.
* Identify potential issues, suggest improvements, and highlight good practices.
* If reviewing certain files is difficult due to missing context, please explicitly state which files require more context and they will be provided.
* Provide an easy to reference list of improvements at the end of the review
* If you have any questions or need clarifications, feel free to ask.`;
		console.log("✅ Prompt assembled.");

		// 8. Ensure output directory exists and write the prompt to the file
		console.log(`\n⏳ Writing prompt to file: ${OUTPUT_FILE_PATH}...`);
		try {
			const outputDir = path.dirname(OUTPUT_FILE_PATH);
			await fs.mkdir(outputDir, { recursive: true }); // Async directory creation

			await Bun.write(OUTPUT_FILE_PATH, prompt); // Async write

			console.log(
				`✅ Prompt successfully written to: ${path.resolve(OUTPUT_FILE_PATH)}`,
			);
		} catch (writeError) {
			console.error(`❌ Failed to write prompt to file: ${OUTPUT_FILE_PATH}`);
			console.error(writeError);
			throw writeError; // Re-throw to be caught by the main catch block
		}
	} catch (error) {
		console.error("\n--- ❌ Failed to generate code review prompt ---");
		if (error instanceof Error) {
			console.error(`Error: ${error.message}`);
		} else {
			console.error("An unknown error occurred:", error);
		}
		process.exit(1);
	}
})();
