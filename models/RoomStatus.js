module.exports = (sequelize, DataTypes) => {
  const RoomStatus = sequelize.define(
    "RoomStatus",
    {
      roomStatus: {
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

  RoomStatus.associate = (models) => {
    RoomStatus.hasMany(models.Room, {
      foreignKey: {
        name: "roomStatusId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return RoomStatus;
};
