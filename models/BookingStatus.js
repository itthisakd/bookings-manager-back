module.exports = (sequelize, DataTypes) => {
  const BookingStatus = sequelize.define(
    "BookingStatus",
    {
      bookingStatus: {
        type: DataTypes.STRING,
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
