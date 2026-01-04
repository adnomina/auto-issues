import path from "node:path";
import type Sqlite from "better-sqlite3";
import Database from "better-sqlite3";
import type { FastifyPluginCallback } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
    interface FastifyInstance {
        betterSqlite3: Sqlite.Database;
    }
}

const fastifyBetterSqlite3: FastifyPluginCallback = (
    fastify,
    _options,
    done,
) => {
    const db: Sqlite.Database = new Database(
        path.join(process.cwd(), "issues.db"),
        {
            verbose: console.error,
        },
    );
    db.pragma("journal_mode = WAL");

    db.prepare(
        "CREATE TABLE IF NOT EXISTS issues ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL, status TEXT NOT NULL)",
    ).run();

    if (!fastify.hasDecorator("betterSqlite3")) {
        fastify.decorate("betterSqlite3", db);
    }

    fastify.addHook("onClose", () => db.close());

    done();
};

export default fp(fastifyBetterSqlite3);
