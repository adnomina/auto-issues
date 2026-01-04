import { z } from "zod";

const StatusSchema = z
	.enum(["backlog", "in_progress", "done"])
	.describe(
		"The status to filter the issues by. Must be one of backlog, in_progress, or done",
	);

export default StatusSchema;
