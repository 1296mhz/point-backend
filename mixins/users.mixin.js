"use strict";

const hashPassword = require('../lib/passwordTools').hashPassword;

module.exports = {
  methods: {
    async transformPlainPasswordToHash(ctx) {
      if (ctx.params.password) {
        const hash = await hashPassword(ctx.params.password);
        ctx.params.password = hash
        return ctx
      }
    }
  }
}