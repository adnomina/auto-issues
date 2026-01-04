import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const routes: FastifyPluginAsync = async (fastify) => {
    const db = fastify.betterSqlite3;

    fastify.get(
        "/issues",
        {
            schema: {
                response: {
                    200: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                                description: { type: "string" },
                                status: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
        (_request, reply) => {
            const stmt = db.prepare("SELECT * FROM issues");
            const rows = stmt.all();

            reply.send(rows);
        },
    );

    fastify.get(
        "/issues/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                    },
                },
                response: {
                    200: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                                description: { type: "string" },
                                status: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
        (request, reply) => {
            const { id } = request.params as { id?: string };

            const stmt = db.prepare("SELECT * FROM issues WHERE id = ?");
            const row = stmt.get(id);

            reply.send(row);
        },
    );

    fastify.post(
        "/issues",
        {
            schema: {
                body: {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        status: { type: "string" },
                    },
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            changes: { type: "number" },
                            lastInsertRowid: { type: "number" },
                        },
                    },
                },
            },
        },
        (request, reply) => {
            const { name, description, status } = request.body as {
                name?: string;
                description?: string;
                status?: string;
            };

            const stmt = db.prepare(
                "INSERT INTO issues (name, description, status) VALUES (?, ?, ?)",
            );
            const info = stmt.run(name, description, status);

            reply.send(info);
        },
    );

    fastify.patch(
        "/issues/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                    },
                },
                querystring: {
                    type: "object",
                    properties: {
                        status: { type: "string" },
                    },
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            changes: { type: "number" },
                            lastInsertRowid: { type: "number" },
                        },
                    },
                },
            },
        },
        (request, reply) => {
            const { id } = request.params as { id?: string };
            const { status } = request.query as { status?: string };

            const info = db
                .prepare("UPDATE issues SET status = ? WHERE id = ?")
                .run(status, id);

            reply.send(info);
        },
    );

    fastify.delete(
        "/issues/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                    },
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            changes: { type: "number" },
                            lastInsertRowid: { type: "number" },
                        },
                    },
                },
            },
        },
        (request, reply) => {
            const { id } = request.params as { id?: string };

            const info = db.prepare("DELETE FROM issues WHERE id = ?").run(id);

            reply.send(info);
        },
    );
};

export default fp(routes);
