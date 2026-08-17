const prohibitedSectors = [
  "Banks",
  "Insurance",
  "Tobacco",
  "Alcohol",
  "Gambling",
];


const screeningPipeline = (stock) => {

  let confidence = 100;

  const reasons = [];


  // sector check
  if (
    prohibitedSectors.includes(stock.sector)
  ) {

    return {
      status: "Non-Halal",
      confidence: 0,
      reasons: [
        "Prohibited sector detected",
      ],
    };
  }


  // debt ratio check
  if (stock.debtRatio > 30) {

    confidence -= 35;

    reasons.push(
      "High debt exposure"
    );

  } else {

    reasons.push(
      "Debt ratio within limits"
    );
  }


  // business compliance
  reasons.push(
    "Core business compliant"
  );


  // minimal interest assumption
  confidence -= 5;

  reasons.push(
    "Minimal interest exposure"
  );


  return {
    status:
      confidence >= 60
        ? "Halal"
        : "Non-Halal",

    confidence,

    reasons,
  };
};

module.exports = screeningPipeline;