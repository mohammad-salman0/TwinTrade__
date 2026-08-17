const loadNifty500 =
 require("./loadNifty500")


/*
====================================
 STRICT AAOIFI-STYLE EXCLUSIONS
====================================
*/

const haramIndustries = [

 "Financial Services",
 "Banks",
 "Private Banks",
 "Public Banks",
 "Insurance",
 "Capital Markets",
 "NBFC",
 "Asset Management",
 "Brokerage",

 "Tobacco",

 "Alcohol",
 "Breweries",
 "Distilleries",

 "Gambling",
 "Casino",

 "Entertainment",
 "Media",

 "Defense",
 "Weapons",

]


/*
====================================
 STRICT HARAM KEYWORDS
====================================
*/

const haramKeywords = [

 /*
   BANKING
 */
 "bank",
 "banking",

 /*
   FINANCE
 */
 "finance",
 "financial",
 "finserv",
 "finserve",

 /*
   INSURANCE
 */
 "insurance",
 "assurance",

 /*
   INVESTMENT
 */
 "capital",
 "wealth",
 "asset",
 "securities",
 "investment",
 "invest",
 "ventures",
 "leasing",
 "holding",

 /*
   NBFC / LENDING
 */
 "microfinance",
 "housing finance",
 "credit",
 "loan",
 "lending",

 /*
   ALCOHOL
 */
 "alcohol",
 "distiller",
 "brewery",
 "beer",
 "wine",

 /*
   TOBACCO
 */
 "tobacco",
 "cigarette",

 /*
   GAMBLING
 */
 "casino",
 "gambling",

 /*
   ENTERTAINMENT
 */
 "media",
 "entertainment",

 /*
   DEFENSE
 */
 "weapon",
 "defence",
 "defense",

 /*
   ADDITIONAL STRICT FILTERS
 */
 "nbfc",
 "mutual",
 "fund",
 "treasury",
 "housing",
 "mortgage",
 "bonds",
 "capital advisory",
 "wealth management",
 "stock broking",

]


/*
====================================
 REVIEW NEEDED INDUSTRIES
====================================
*/

const reviewIndustries = [

 /*
   BORDERLINE
 */
 "Retail",
 "Telecommunication",
 "Healthcare",
 "Pharmaceuticals",
 "Consumer Services",

 /*
   OFTEN FAIL AAOIFI
 */
 "Real Estate",
 "Construction",

 "Power",
 "Utilities",

 "Diversified",

 "Chemicals",
 "Metals",
 "Mining",

 "Infrastructure",
 "Logistics",

 "Automobile",
 "Auto Components",

 "Oil & Gas",

]


/*
====================================
 FORCED NON-HALAL
====================================
*/

const forcedNonHalal = [

 "ABDL",
 "ITC",

 "HDFCBANK",
 "ICICIBANK",
 "SBIN",
 "BANKBARODA",
 "KOTAKBANK",
 "AXISBANK",
 "INDUSINDBK",

 "BAJFINANCE",
 "BAJAJFINSV",

 "PFC",
 "RECLTD",

]


/*
====================================
 KEYWORD CHECK
====================================
*/

const containsHaramKeyword =
 (text = "") => {

  const lower =
   text.toLowerCase()

  return haramKeywords.some(
   (keyword) =>
    lower.includes(keyword)
  )

}


/*
====================================
 COMPLIANCE SCORE
====================================
*/

const getComplianceScore =
 (
  industry,
  companyName,
  symbol
 ) => {

  const cleanSymbol =
   symbol.replace(
    ".NS",
    ""
   )


  /*
    FORCED NON-HALAL
  */
  if (
   forcedNonHalal.includes(
    cleanSymbol
   )
  ) {

   return 10

  }


  /*
    INDUSTRY CHECK
  */
  if (
   haramIndustries.includes(
    industry
   )
  ) {

   return 20

  }


  /*
    KEYWORD CHECK
  */
  if (
   containsHaramKeyword(
    companyName
   )
  ) {

   return 25

  }


  /*
    REVIEW NEEDED
  */
  if (
   reviewIndustries.includes(
    industry
   )
  ) {

   return 55

  }


  /*
    TECHNOLOGY COMPANIES
    OFTEN FAIL CASH RATIO
  */
  if (
   industry.includes(
    "Technology"
   ) ||

   industry.includes(
    "Software"
   )
  ) {

   return 65

  }


  /*
    HALAL
  */
  return 78 + Math.floor(
   Math.random() * 10
  )

}


/*
====================================
 HALAL STATUS
====================================
*/

const getHalalStatus =
 (
  industry,
  companyName,
  symbol
 ) => {

  const cleanSymbol =
   symbol.replace(
    ".NS",
    ""
   )


  /*
    FORCED NON-HALAL
  */
  if (
   forcedNonHalal.includes(
    cleanSymbol
   )
  ) {

   return "Non-Halal"

  }


  /*
    INDUSTRY CHECK
  */
  if (
   haramIndustries.includes(
    industry
   )
  ) {

   return "Non-Halal"

  }


  /*
    KEYWORD CHECK
  */
  if (
   containsHaramKeyword(
    companyName
   )
  ) {

   return "Non-Halal"

  }


  /*
    REVIEW NEEDED
  */
  if (
   reviewIndustries.includes(
    industry
   )
  ) {

   return "Review Needed"

  }


  /*
    TECHNOLOGY COMPANIES
    NEED FINANCIAL REVIEW
  */
  if (
   industry.includes(
    "Technology"
   ) ||

   industry.includes(
    "Software"
   )
  ) {

   return "Review Needed"

  }


  /*
    HALAL
  */
  return "Halal"

}


/*
====================================
 MAIN SCREENING
====================================
*/

const getScreenedStocks =
 async () => {

  const niftyStocks =
   await loadNifty500()


  return niftyStocks.map(
   (stock) => ({

    symbol:
     stock.symbol.replace(
      ".NS",
      ""
     ),

    companyName:
     stock.companyName,

    industry:
     stock.industry,

    halalStatus:
     getHalalStatus(

      stock.industry,
      stock.companyName,
      stock.symbol

     ),

    complianceScore:
     getComplianceScore(

      stock.industry,
      stock.companyName,
      stock.symbol

     ),

   })
  )

}


module.exports = {
 getScreenedStocks,
}