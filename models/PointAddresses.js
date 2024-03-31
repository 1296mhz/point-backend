const mongoose = require('mongoose');
const Schema = require('mongoose');

const PointAddressesModel = mongoose.model("PointAddresses", new mongoose.Schema({
  address: {
    type: String,
    unique: true
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
}));

module.exports = PointAddressesModel;