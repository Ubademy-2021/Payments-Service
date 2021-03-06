const config = require("./SCconfig");
const services = require("./services/services")({ config });
const routes = require("./routes");
// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });
// Require cron jobs
const cronJobs = require("./services/cronJobs");
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
// Declares routes
routes.forEach(route => fastify.route(route({ config, services })));

// Run the server!
const start = async () => {
  try {
    /* Escucha requests en el puerto 3000 */
    await fastify.listen(process.env.PORT || 8080, '0.0.0.0');
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
    // Run cron jobs
    cronJobs.runCronJobs()
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
