"use strict";
const { Model } = require("sequelize");
const { CashAccount } = require("./../models");

module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
    static associate(models) {
      // Association with Employees
      this.belongsTo(models.Employee, {
        foreignKey: "manager_id",
        as: "manager",
      });

      // Association with Companies
      this.belongsTo(models.Company, {
        foreignKey: "company_id",
        as: "company",
      });
    }
  }

  Branch.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      branch_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Branch name cannot be empty",
          },
        },
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Location cannot be empty",
          },
        },
      },
      manager_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Branch",
      tableName: "branches",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Branch.afterCreate(async (branch, options) => {
    await CashAccount.create({
      branch_id: branch.branch_id,
      balance: 0.0,
    });
  });

  return Branch;
};