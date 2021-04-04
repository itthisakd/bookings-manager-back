const { RoomType } = require("../models/");

exports.getRates = async (req, res, next) => {
  try {
    const rates = await RoomType.findAll();
    res.status(200).json({ rates });
  } catch (err) {
    next(err);
  }
};

exports.updateRates = async (req, res, next) => {
  try {
    const { updatedRates } = req.body;

    updatedRates.forEach(async (rt, idx) => {
      await RoomType.update(
        {
          rate: rt.rate,
        },
        { where: { id: rt.id } }
      );
    });
    res.status(200).json({ message: "Updated Successfully" });
  } catch (err) {
    next(err);
  }
};

//BODY TO UPDATE RATES:
// {
//     "updatedRates": [
//         {
//             "id": 1,
//             "rate": 1099
//         },
//         {
//             "id": 2,
//             "rate": 1299
//         }
//     ]
// }
