const { DateTime } = require("luxon");

module.exports.sortNights = (arr) => {
  let obj = arr.reduce((map, val) => {
    if (!map[`${val.nightlyDate}`]) {
      map[`${val.nightlyDate}`] = [];
    }
    map[`${val.nightlyDate}`].push(val);
    return map;
  }, {});

  for (let prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      console.log(obj[prop]);
      let temp = obj[prop].reduce((acc, cur) => [...acc, cur.roomNum], []);
      obj[prop] = temp;
    }
  }
  return obj;
};
