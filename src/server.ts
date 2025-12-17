import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type Sqlite from "better-sqlite3";
import Database from "better-sqlite3";
import { z } from "zod";

const Status = z
	.enum(["backlog", "in_progress", "done"])
	.describe(
		"The status to filter the issues by. Must be one of backlog, in_progress, or done",
	);

const Issue = z.object({
	name: z.string(),
	description: z.string(),
	status: Status,
});

type Issue = z.infer<typeof Issue>;

let db: Sqlite.Database;

// Create server instance
const server = new McpServer({
	name: "issue_tracker",
	version: "1.0.0",
});

// Register tools
server.registerTool(
	"add_issue",
	{
		description: "Add a new issue",
		inputSchema: {
			name: z.string(),
			description: z.string(),
			status: Status,
		},
	},
	async (newIssue: Issue) => {
		try {
			const stmt = db.prepare(
				"INSERT INTO issues (name, description, status) VALUES (?, ?, ?)",
			);
			const info = stmt.run(
				newIssue.name,
				newIssue.description,
				newIssue.status,
			);

			return {
				content: [
					{
						type: "text",
						text: `Inserted ${info.changes} new rows`,
					},
				],
			};
		} catch (err) {
			console.error(err);

			return {
				content: [
					{
						type: "text",
						text: "Failed to add issue",
					},
				],
			};
		}
	},
);

server.registerTool(
	"get_issues",
	{
		description: "Get all issues for a specified status",
		inputSchema: {
			status: Status,
		},
		outputSchema: {
			results: z.array(Issue.extend({ id: z.number() })),
		},
	},
	async ({ status }) => {
		try {
			const stmt: Sqlite.Statement = db.prepare(
				"SELECT * FROM issues WHERE status = ?",
			);
			const rows: unknown[] = stmt.all(status);

			const structuredContent = {
				results: rows,
			};

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(structuredContent, null, 2),
					},
				],
				structuredContent,
			};
		} catch (err) {
			console.error(err);

			return {
				content: [
					{
						type: "text",
						text: "Failed to get issues",
					},
				],
			};
		}
	},
);

server.registerTool(
	"get_issue",
	{
		description: "Get a single issue by its ID",
		inputSchema: {
			id: z.number().describe("The ID of the issue"),
		},
		outputSchema: {
			result: Issue.extend({ id: z.number() }),
		},
	},
	async ({ id }) => {
		try {
			const stmt: Sqlite.Statement = db.prepare(
				"SELECT * FROM issues WHERE id = ?",
			);
			const issue = stmt.get(id);

			const structuredContent = {
				result: issue,
			};

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(structuredContent, null, 2),
					},
				],
				structuredContent,
			};
		} catch (err) {
			console.error(err);

			return {
				content: [
					{
						type: "text",
						text: "Failed to get issue",
					},
				],
			};
		}
	},
);

server.registerTool(
	"update_status",
	{
		description: "Update the status of an issue",
		inputSchema: {
			id: z.number().describe("The ID of the issue"),
			status: Status,
		},
	},
	async (args) => {
		try {
			const result: Sqlite.RunResult = db
				.prepare("UPDATE issues SET status = ? WHERE id = ?")
				.run(args.status, args.id);

			return {
				content: [
					{
						type: "text",
						text: `Updated the status of issue with ID ${result.lastInsertRowid} to ${args.status}`,
					},
				],
			};
		} catch (err) {
			console.error(err);

			return {
				content: [
					{
						type: "text",
						text: "Failed to update issue status",
					},
				],
			};
		}
	},
);

server.registerTool(
	"delete_issue",
	{
		description: "Delete the issue identified by the provided ID",
		inputSchema: {
			id: z.number(),
		},
	},
	async (args: { id: number }) => {
		try {
			const result: Sqlite.RunResult = db
				.prepare("DELETE FROM issues WHERE id = ?")
				.run(args.id);

			return {
				content: [
					{
						type: "text",
						text: `DELETED ${result.changes} row (ID: ${result.lastInsertRowid})`,
					},
				],
			};
		} catch (err) {
			console.error(err);

			return {
				content: [
					{
						type: "text",
						text: "Failed to delete issue",
					},
				],
			};
		}
	},
);

async function main() {
	db = new Database(path.join(process.cwd(), "issues.db"), {
		verbose: console.error,
	});
	db.pragma("journal_mode = WAL");

	try {
		db.prepare(
			"CREATE TABLE IF NOT EXISTS issues ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL, status TEXT NOT NULL)",
		).run();
	} catch (err) {
		console.error(err);
	}

	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("Issue Tracker MCP Server running on stdio");
}

main().catch((error) => {
	console.error("Fatal error in main():", error);
	process.exit(1);
});
