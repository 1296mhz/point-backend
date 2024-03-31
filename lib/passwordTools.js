const bcrypt = require('bcryptjs');
require('dotenv').config();
//.config({path: `.env.${process.env.NODE_ENV}`});
const SALT_LENGTH = Number(process.env.SALT_LENGTH);

function genSaltPromise() {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_LENGTH, function (err, salt) {
      if (err) return reject(err)
      return resolve(salt);
    }
    )
  })
}

function hashPromise(password, salt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) return reject(err);
      return resolve(hash);
    });
  })
}

function comparePromise(plainPassword, hash) {
  return new Promise(async (resolve, reject) => {
    bcrypt.compare(plainPassword, hash, function (err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  })
}

async function hashPassword(password) {
  console.log("hashPassword")
  const salt = await genSaltPromise();
  return await hashPromise(password, salt);
}

async function validatePassword(plainPassword, hash) {
  return await comparePromise(plainPassword, hash)
};

module.exports = { hashPassword, validatePassword }