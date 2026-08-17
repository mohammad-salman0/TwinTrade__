const prohibitedSectors = require("./constants");

const sectorFilter = (sector) => {

  if (prohibitedSectors.includes(sector)) {
    return {
      status: "Non-Halal",
      reason: "Prohibited sector",
    };
  }

  return {
    status: "Halal",
    reason: "Sector compliant",
  };
};

module.exports = sectorFilter;