module.exports = function(sequelize, DataTypes) {
    var Chat = sequelize.define("Chat", {
      name: DataTypes.STRING
     // allowNull: false
    });
    return Chat;
  };
  