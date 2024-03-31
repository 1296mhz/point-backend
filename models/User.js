const mongoose = require('mongoose');
const Schema = require('mongoose');
const hashPassword = require('../lib/passwordTools').hashPassword;

const UserScheme = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  firstName: {type: String},
  lastName: {type: String},
  middleName: {type: String},
  password: {type: String},
  pointAddress: {
    type: Schema.Types.ObjectId,
    ref: 'PointAddresses'
  },
  role: {type: String, default: 'MANAGER'}
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

// UserScheme.pre('save', async function (next) {

//   try {
//     if (!this.isModified('password')) {
//       return next();
//     }
//     const hashed = await hashPassword(this.password);
//     this.password = hashed;

//   } catch (err) {
//     return next(err);
//   }
// });

const UserModel = mongoose.model("User", UserScheme);

module.exports = UserModel;