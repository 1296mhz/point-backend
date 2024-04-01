"use strict";

require('dotenv').config();
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const ReportModel = require('../models/Report');
const MyReportsMixin = require("../mixins/reports.mixin");
/** @type {ServiceSchema} */
module.exports = {
  name: "reports",
  // version: 1
  mixins: [DbService, MyReportsMixin],
  adapter: new MongooseAdapter(process.env.MONGODB),
  model: ReportModel,
  settings: {
    // Available fields in the responses
    populates: {
      user: {
        action: "users.get",
        params: {
          fields: ["_id", "username", "firstName", "lastName", "middleName", "pointAddress"]
        }
      },
      address: {
        action: "pointAddresses.get",
        params: {
          fields: ["_id", "user", "address"]
        }
      }
    },
    fields: [
      "_id",
      "user",
      "taking",
      "address",
      "createdAt",
      "updatedAt",
    ],
    // Validator for the `create` & `insert` actions.
    // entityValidator: {
    // 	username: "string|min:3",
    // 	password: "string|min:3"
    // },

  },
  hooks: {
    before: {
      create: [
        "checkTheExistenceOfTheReportForTheCurrentUserAndForTheCurrentDay"
      ]
    }
  },
  actions: {
    getReportsCurrentMonths: {
      async handler(ctx) {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const reports = await ctx.call("reports.find", {
          query: {
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          }, populate: ["user"]
        });
        return Promise.resolve(reports)
      }
    },
    getReportsCurrentMonths: {
      async handler(ctx) {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        const reports = await ctx.call("reports.find", {
          query: {
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth
            }
          }, populate: ["usernameId"]
        });
        return Promise.resolve(reports)
      }
    }
  },

  /**
   * Methods
   */
  methods: {
    // async seedDB() {
    // 	await this.adapter.insertMany([
    // 		{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
    // 		{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
    // 		{ name: "Huawei P30 Pro", quantity: 15, price: 679 },
    // 	]);
    // }
  },
  async afterConnected() {
    // await this.adapter.collection.createIndex({ name: 1 });
  }
};
