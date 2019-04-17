'use strict'
const env = process.env.NODE_ENV
module.exports = {
  // NODE_ENV: '"production"'
  NODE_ENV: '"' + env + '"'
}
