module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define(
    "Reservation",
    {
      guest: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("booked", "modified", "cancelled", "enquiry"),
        allowNull: true,
      },
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
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentSlip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      underscored: true,
      timestamps: true,
    }
  );

  Reservation.associate = (models) => {
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
