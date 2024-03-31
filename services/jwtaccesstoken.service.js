"use strict";
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs');
const privateKey = fs.readFileSync(`${process.cwd()}/keys/jwtRS512.key`);
const cert = fs.readFileSync(`${process.cwd()}/keys/jwtRS512.key.pub`); 
module.exports = {
	name: "jwtaccesstoken",
	settings: {
  
	},
	actions: {
    auth: {
      async handler(ctx) {
        try {
          const decoded = await jwt.verify(ctx.params.token, cert);
          if (decoded.exp < Date.now().valueOf() / 1000) {
            ctx.meta.$statusCode = 401;
            return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN))
          }
          return Promise.resolve(decoded);
        } catch (err) {
          ctx.meta.$statusCode = 401;
          return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN))
        }
      }
    },
    generateAccessToken: {
      async handler(ctx) {
        const user = {
          _id: ctx.params._id,
          username: ctx.params.username,
          firstName: ctx.params.firstName,
          lastName: ctx.params.lastName,
          middleName: ctx.params.middleName,
          pointAddress: ctx.params.pointAddress,
          role: ctx.params.role
        }
        const accessToken = jwt.sign({userId: ctx.params}, privateKey,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
            algorithm: 'RS512'
          }
        );
        const result = jwt.verify(accessToken, cert)
        const response = {
          status: "Logged in",
          accessToken: accessToken,
          data: user,
          expiresIn: result.exp,
        }
    
        return response
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
