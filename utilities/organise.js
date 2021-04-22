const { DateTime } = require("luxon");

module.exports.organise = (arr) => {
  let obj = arr.reduce((map, val) => {
    if (!map[`${val.reservationId}-${val.num}`]) {
      map[`${val.reservationId}-${val.num}`] = [];
    }
    map[`${val.reservationId}-${val.num}`].push(val);
    return map;
  }, {});

  for (let prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      let temp = {
        reservationId: obj[prop][0].reservationId,
        num: obj[prop][0].num,
        type: obj[prop][0].type,
        rate: obj[prop][0].rate,
        checkIn: obj[prop][0].nightlyDate,
        checkOut: DateTime.fromISO(obj[prop][obj[prop].length - 1].nightlyDate)
          .plus({ days: 1 })
          .toString(),
      };
      obj[prop] = temp;
    }
  }
  return Object.values(obj);
};
