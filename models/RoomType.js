module.exports = (sequelize, DataTypes) => {
  const RoomType = sequelize.define(
    "RoomType",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
      timestamps: false,
    }
  );

  RoomType.associate = (models) => {
    RoomType.hasMany(models.Room, {
      foreignKey: {
        name: "roomTypeId",
        allowNull: false,
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };

  return RoomType;
};
