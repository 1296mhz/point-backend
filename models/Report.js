const mongoose = require('mongoose');
const Schema = require('mongoose');

const ReportModel = mongoose.model("Report", new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'PointAddresses'
  },
  taking: {type: Number, default: 0},
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
}));

module.exports = ReportModel;