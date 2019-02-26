module.exports = function(sequelize, DataTypes) {
    var Contact = sequelize.define("Contact", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        len: [1]
      }
    }
    });
    return Contact;
  };
  