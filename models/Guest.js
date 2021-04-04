module.exports = (sequelize, DataTypes) => {
  const Guest = sequelize.define(
    "Guest",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      underscored: true,
      timestamps: false,
    }
  );
  Guest.associate = (models) => {
    Guest.hasMany(models.Reservation, {
      foreignKey: {
        name: "guestId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Guest;
};
