import { z } from "zod";
import StatusSchema from "./status.js";

const IssueSchema = z.object({
	name: z.string(),
	description: z.string(),
	status: StatusSchema,
});

export default IssueSchema;
