const { RoomType, sequelize } = require("../models/");
const { QueryTypes } = require("sequelize");

exports.getRates = async (req, res, next) => {
  try {
    const roomTypes = await RoomType.findAll();
    res.status(200).json({ roomTypes });
  } catch (err) {
    next(err);
  }
};

exports.updateRates = async (req, res, next) => {
  try {
    const { updatedRates } = req.body;

    const updateAllRates = await Promise.all(
      updatedRates.map(async (type) => {
        await sequelize.query(
          `UPDATE room_types SET rate=${type.rate} WHERE id = ${type.id}`,
          {
            type: QueryTypes.UPDATE,
          }
        );
      })
    );

    res.status(200).json({ message: "Updated rates Successfully" });
  } catch (err) {
    next(err);
  }
};
