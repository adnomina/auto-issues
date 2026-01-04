import Fastify from "fastify";
import fastifyBetterSqlite3 from "./db.js";
import routes from "./routes.js";

const fastify = Fastify({
    logger: true,
});

const start = async () => {
    try {
        fastify.register(fastifyBetterSqlite3);
        fastify.register(routes);

        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
