module.exports = (sequelize, DataTypes) => {
  const BookingStatus = sequelize.define(
    "BookingStatus",
    {
      bookingStatus: {
        type: DataTypes.ENUM(["booked", "modified", "cancelled", "enquiry"]),
        allowNull: false,
        unique: true,
      },
    },
    {
      underscored: true,
      timestamps: false,
    }
  );
  BookingStatus.associate = (models) => {
    BookingStatus.hasMany(models.Reservation, {
      foreignKey: {
        name: "bookingStatusId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return BookingStatus;
};
