module.exports = (sequelize, DataTypes) => {
  const BookedNight = sequelize.define(
    "BookedNight",
    {
      nightlyDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      underscored: true,
      timestamps: false,
    }
  );

  BookedNight.associate = (models) => {
    BookedNight.belongsTo(models.Room, {
      foreignKey: {
        name: "roomId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    BookedNight.belongsTo(models.Reservation, {
      foreignKey: {
        name: "reservationId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return BookedNight;
};
