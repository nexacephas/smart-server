const db = require("../firebase/admin");

async function getLast24HoursData() {
const ref = db.ref("energy_monitor/live_data");
 // adjust path to your DB
  /* const since = Date.now() - 24 * 60 * 60 * 1000; */
  const since = 0; // include all records



  const snapshot = await ref
    .orderByChild("timestamp")
    .startAt(since)
    .once("value");

  const data = snapshot.val() || {};
  let totalEnergy = 0;
  let totalBilling = 0;

  // Group by hour
  const hourly = {};

  Object.values(data).forEach((record) => {
    const ts = record.timestamp || Date.now();
    const date = new Date(ts);
    const hourLabel = date.getHours() + ":00";

    if (!hourly[hourLabel]) {
      hourly[hourLabel] = {
        energy: 0,
        billing: 0,
        voltageSum: 0,
        currentSum: 0,
        count: 0,
      };
    }

    hourly[hourLabel].energy += record.energy || 0;
    hourly[hourLabel].billing += record.billing || 0;
    hourly[hourLabel].voltageSum += record.voltage || 0;
    hourly[hourLabel].currentSum += record.current || 0;
    hourly[hourLabel].count++;

    totalEnergy += record.energy || 0;
    totalBilling += record.billing || 0;
  });

  return {
    totalEnergy,
    totalBilling,
    records: Object.values(data).length,
    hourly,
    since,
  };
}

module.exports = { getLast24HoursData };
