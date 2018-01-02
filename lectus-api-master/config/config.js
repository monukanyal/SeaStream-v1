"use strict"
let config = {};

config.db = {
  test: "databases/LectusDb-test",
  dev: "databases/LectusDb"
};

config.auth = {
  secret: 'ilovelectus'
};

module.exports = config;