"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
// const configJson = require("./../config/config.json");
const basename = path.basename(__filename);

const configJson = JSON.parse(process.env.DB_CREDENTIALS);
console.log("models.index: ENV", process.env.DB_CREDENTIALS);
const config = configJson[process.env.ENV];
console.log("models.index: config", config);

const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;