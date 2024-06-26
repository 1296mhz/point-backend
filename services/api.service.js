"use strict";

const ApiGateway = require("moleculer-web");
const E = require("moleculer-web").Errors;
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 * @typedef {import('moleculer-web').ApiSettingsSchema} ApiSettingsSchema API Setting Schema
 */

module.exports = {
  name: "api",
  mixins: [ApiGateway],

  /** @type {ApiSettingsSchema} More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html */
  settings: {
    // Exposed port
    port: process.env.PORT || 3000,

    // Exposed IP
    ip: "0.0.0.0",

    // Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
    use: [],
    cors: {
      // Configures the Access-Control-Allow-Origin CORS header.
      origin: "*",
      // Configures the Access-Control-Allow-Methods CORS header. 
      methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
      // Configures the Access-Control-Allow-Headers CORS header.
      allowedHeaders: ["*"],
      contentType: "*",
      // Configures the Access-Control-Expose-Headers CORS header.
      exposedHeaders: [],
      // Configures the Access-Control-Allow-Credentials CORS header.
      credentials: false,
      // Configures the Access-Control-Max-Age CORS header.
      maxAge: 3600
  },
    routes: [
      {
        path: "/api",
        whitelist: [
          "greeter.hello",
          "reports.create",
          "reports.update",
          "reports.find",
          "reports.get",
          "reports.getReportsCurrentMonths",
          "reports.getReportDatesForEachDay",
          "pointAddresses.get",
          "pointAddresses.find",
          "pointAddresses.create",
          "pointAddresses.remove",
          "pointAddresses.update",
          "users.get",
          "users.find",
          "users.create",
          "users.remove",
          "users.update",
          "users.register",
          "users.findManagers"
        ],

        // Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
        use: [],

        // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
        mergeParams: true,

        // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
        authentication: false,

        // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
        authorization: false,

        // The auto-alias feature allows you to declare your route alias directly in your services.
        // The gateway will dynamically build the full routes from service schema.
        autoAliases: true,
        aliases: {
          "POST /reports": "reports.create",
          "GET /reports": "reports.find",
          "GET /reports/:id": "reports.get",
          "PUT /reports/:id": "reports.update",
          "GET /reportsMonths": "reports.getReportsCurrentMonths",
          "GET /getReportDatesForEachDay/:managerId/:dateMonthYear": "reports.getReportDatesForEachDay",
          "GET /pointAddresses": "pointAddresses.find",
          "GET /pointAddresses/:id": "pointAddresses.get",
          "POST /pointAddresses": "pointAddresses.create",
          "PUT /pointAddresses/:id": "pointAddresses.update",
          "DELETE /pointAddresses/:id": "pointAddresses.remove",
          "GET /managers": "users.findManagers",
          "GET /users": "users.find",
          "GET /users/:id": "users.get",
          "POST /users": "users.register",
          "PUT /users/:id": "users.update",
        },

        /**
         * Before call hook. You can check the request.
         * @param {Context} ctx
         * @param {Object} route
         * @param {IncomingRequest} req
         * @param {ServerResponse} res
         * @param {Object} data
         *
        onBeforeCall(ctx, route, req, res) {
          // Set request headers to context meta
          ctx.meta.userAgent = req.headers["user-agent"];
        }, */

        /**
         * After call hook. You can modify the data.
         * @param {Context} ctx
         * @param {Object} route
         * @param {IncomingRequest} req
         * @param {ServerResponse} res
         * @param {Object} data
        onAfterCall(ctx, route, req, res, data) {
          // Async function which return with Promise
          return doSomething(ctx, res, data);
        }, */

        // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
        callOptions: {},

        bodyParsers: {
          json: {
            strict: false,
            limit: "1MB"
          },
          urlencoded: {
            extended: true,
            limit: "1MB"
          }
        },

        // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
        mappingPolicy: "all", // Available values: "all", "restrict"

        // Enable/disable logging
        logging: true
      },
      {
        path: "/auth",
        whitelist: [
          "users.login",
          "users.register"
        ],
        use: [],
        mergeParams: true,
        authentication: false,
        authorization: false,
        autoAliases: true,
        aliases: {
          "POST /login": "users.login",
          "POST /register": "users.register"
        },
        callOptions: {},
        bodyParsers: {
          json: {
            strict: false,
            limit: "1MB"
          },
          urlencoded: {
            extended: true,
            limit: "1MB"
          }
        }
      }
    ],

    // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
    log4XXResponses: false,
    // Logging the request parameters. Set to any log level to enable it. E.g. "info"
    logRequestParams: null,
    // Logging the response data. Set to any log level to enable it. E.g. "info"
    logResponseData: null,


    // Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
    assets: {
      folder: "public",

      // Options to `server-static` module
      options: {}
    }
  },

  methods: {
    async authenticate(ctx, route, req) {
      // Read the token from header
      const auth = req.headers["authorization"];

      if (auth && auth.startsWith("Bearer")) {
        const token = auth.slice(7);

        // Check the token. Tip: call a service which verify the token. E.g. `accounts.resolveToken`
        if (token == "123456") {
          // Returns the resolved user. It will be set to the `ctx.meta.user`
          return {id: 1, name: "John Doe"};

        } else {
          // Invalid token
          throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_INVALID_TOKEN);
        }

      } else {
        // No token. Throw an error or do nothing if anonymous access is allowed.
        // throw new E.UnAuthorizedError(E.ERR_NO_TOKEN);
        return null;
      }
    },

    /**
     * Authorize the request. Check that the authenticated user has right to access the resource.
     *
     * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
     *
     * @param {Context} ctx
     * @param {Object} route
     * @param {IncomingRequest} req
     * @returns {Promise}
     */
    // async authorize(ctx, route, req) {
    //   // Get the authenticated user.
    //   const user = ctx.meta.user;

    //   // It check the `auth` property in action schema.
    //   if (req.$action.auth == "required" && !user) {
    //     throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS");
    //   }
    // }

    async authorize(ctx, route, req, res) {
      let auth = req.headers["authorization"];
      if (auth && auth.startsWith("Bearer")) {
        let token = auth.slice(7);
        try {
          const res = await ctx.call('jwtaccesstoken.auth', {token: token}, {});
          ctx.meta.user = res;
          return Promise.resolve(ctx);
        } catch (err) {
          return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN))
        }
      } else {
        return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
      }
    }

  }
};
