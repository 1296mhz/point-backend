"use strict";

require('dotenv').config();
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const UserModel = require('../models/User');
const hashPassword = require('../lib/passwordTools').hashPassword;
const validatePassword = require('../lib/passwordTools').validatePassword;
const MyUsersMixin = require("../mixins/users.mixin");
/** @type {ServiceSchema} */
module.exports = {
  name: "users",
  // version: 1
  mixins: [DbService, MyUsersMixin],
  adapter: new MongooseAdapter(process.env.MONGODB),
  model: UserModel,
  hooks: {
    before: {
      update: [
        // function addTimestamp(ctx) {
        //   // Add timestamp
        //   ctx.params.createdAt = new Date();
        //   return ctx;
        // }
        "transformPlainPasswordToHash"
      ]
    },
    after: {
      update: [
        async (ctx, res) => {
          const generateAccessToken = await ctx.call('jwtaccesstoken.generateAccessToken',
            {
              _id: res._id,
              username: res.username,
              firstName: res.firstName,
              lastName: res.lastName,
              middleName: res.middleName,
              pointAddress: res.pointAddress,
              role: res.role,
            }, {});
          return generateAccessToken;
        }
      ]
    }
  },
  settings: {
    fields: [
      '_id',
      'username',
      'firstName',
      'lastName',
      'middleName',
      'pointAddress',
      'createdAt',
      'updatedAt',
      'role'
    ],
    populates: {
      pointAddress: {
        action: "pointAddresses.get",
        params: {
          fields: ["_id", "address"]
        }
      }
    },
    // Validator for the `create` & `insert` actions.
    // entityValidator: {
    // 	username: "string|min:3",
    // 	password: "string|min:3"
    // },
  },
  actions: {
    login: {
      params: {
        username: "string",
        password: "string"
      },
      async handler(ctx) {
        const user = await ctx.call("users.find",
          {
            fields:
              ['_id',
                'email',
                'lastName',
                'firstName',
                'middleName',
                'pointAddress',
                'role',
                'createdAt',
                'updatedAt'
              ],
            query:
            {
              username: ctx.params.username
            }, populate: ["pointAddress"]
          });

        if (user.length) {
          const hash = await hashPassword(ctx.params.password);

          const validPassword = await validatePassword(ctx.params.password, hash);
          if (!validPassword) return new Error('Password is not correct');
          const generateAccessToken = await ctx.call('jwtaccesstoken.generateAccessToken',
            {
              _id: user[0]._id,
              username: user[0].username,
              firstName: user[0].firstName,
              lastName: user[0].lastName,
              middleName: user[0].middleName,
              pointAddress: user[0].pointAddress,
              role: user[0].role
            }, {});
          return Promise.resolve(generateAccessToken)
        }
        throw new NotFoundError("User not found", "USER_NOT_FOUND");

      }
    },
    userUpdate: {
      async handler(ctx) { }
    },
    register: {
      // params: {
      // 	username: "string",
      // 	password: "string",
      //   firstName: "string",
      //   lastName: "string",
      //   middleName: "string",
      //   role: "string"
      // },
      async handler(ctx) {
        const hash = await hashPassword(ctx.params.password);
        const newUser = {
          username: ctx.params.username,
          password: hash,
          firstName: ctx.params.firstName,
          lastName: ctx.params.lastName,
          middleName: ctx.params.middleName,
          pointAddress: ctx.params.pointAddress,
          role: ctx.params.role
        }
        const user = await ctx.call("users.find", {fields: ['username'], query: {username: ctx.params.username}, populate: ["pointAddress"]});

        if (!user.length) {
          const _newUser = await ctx.call("users.create", newUser);
          ctx.meta.$statusCode = 201;
          return Promise.resolve({
            message: 'User created',
            code: 201,
            type: 'USER_CREATED',
            data: _newUser,
          })
        }

        if (user.length) {
          ctx.meta.$statusCode = 409;
          return Promise.resolve({
            message: 'User exist',
            code: 409,
            type: 'USER_EXIST',
            data: {},
          })
        }
      }
    },

    findWithPopulate: {
      async handler(ctx) {
        const reports = await ctx.call("pointAddresses.find", {
          populate: ["pointAddress"]
        });
        return Promise.resolve(reports)
      }
    }
  },

  methods: {
  },
  async afterConnected() {
  }
};
