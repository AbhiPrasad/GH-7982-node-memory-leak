const express = require("express");
const Sentry = require("@sentry/node");
const SentryIntegrations = require("@sentry/integrations");

Sentry.init({
  dsn: "https://393d841f6a94464b82f4a716ebd0781d@o19635.ingest.sentry.io/4505085841899520",
  integrations: [new SentryIntegrations.RewriteFrames()],
});

const app = express();

// The request handler must be the first middleware on the app
app.use(
  Sentry.Handlers.requestHandler({
    request: ["data", "headers", "method", "query_string", "url"],
  })
);

app.use(require("express-status-monitor")());

app.get("/hello/:name", async function (req, res) {
  const name = req.params.name;
  // console.log(`${JSON.stringify(process.memoryUsage())},`);
  Sentry.captureException(new Error("again hello " + name));
  res.send("hello " + name);
});

app.use(Sentry.Handlers.errorHandler());

app.listen(3000);
