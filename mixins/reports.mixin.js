"use strict";

module.exports = {
  methods: {
    async checkTheExistenceOfTheReportForTheCurrentUserAndForTheCurrentDay(ctx) {

      const reports = await ctx.call("reports.find", {
        query: {
          user: ctx.params.user,
          createdAt:
          {
            $gte: new Date(new Date().setHours(0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59))
          }
        }
      });

      if(reports.length){
        throw new Error("ReportExist");
      }
      return ctx
    }
  }
}