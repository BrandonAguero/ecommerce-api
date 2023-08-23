const { DataTypes } = require("sequelize");
const sequelize = require("../utils/connection");

const ProductImg = sequelize.define("productImg", {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filename: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  // productId
});

module.exports = ProductImg;
