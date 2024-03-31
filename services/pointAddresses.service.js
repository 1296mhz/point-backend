"use strict";

require('dotenv').config();
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const PointAddressesModel = require('../models/PointAddresses');

/** @type {ServiceSchema} */
module.exports = {
  name: "pointAddresses",
  // version: 1
  mixins: [DbService],
  adapter: new MongooseAdapter(process.env.MONGODB),
  model: PointAddressesModel,
  settings: {
    // populates: {
    //   user: {
    //     action: "users.get",
    //     params: {
    //       fields: ["_id", "username", "firstName", "lastName", "middleName", "pointAddress"]
    //     }
    //   },
    //   address: {
    //     action: "users.get",
    //     params: {
    //       fields: ["_id", "username", "firstName", "lastName", "middleName", "pointAddress"]
    //     }
    //   },
    // },
    fields: [
      "_id",
      "user",
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
  actions: {
  },

  methods: {
  },
  async afterConnected() {
  }
};
