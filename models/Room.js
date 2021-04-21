module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define(
    "Room",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: false,
        primaryKey: true,
      },
    },
    {
      underscored: true,
      timestamps: false,
    }
  );

  Room.associate = (models) => {
    Room.belongsTo(models.RoomType, {
      foreignKey: {
        name: "roomTypeId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
    Room.hasOne(models.BookedNight, {
      foreignKey: {
        name: "roomId",
        allowNull: false,
      },
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    });
  };

  return Room;
};
