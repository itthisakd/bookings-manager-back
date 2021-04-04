module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    "Reservation",
    {
      inDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      outDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      underscored: true,
    }
  );

  Reservation.associate = (models) => {
    Reservation.belongsTo(models.Guest, {
      foreignKey: {
        name: "guestId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Reservation.belongsTo(models.BookingStatus, {
      foreignKey: {
        name: "bookingStatusId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Reservation.belongsTo(models.Staff, {
      foreignKey: {
        name: "staffId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Reservation.hasMany(models.BookedNight, {
      foreignKey: {
        name: "reservationId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Reservation;
};
