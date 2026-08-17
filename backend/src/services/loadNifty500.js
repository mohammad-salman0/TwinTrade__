const fs =
 require("fs")

const path =
 require("path")

const csv =
 require("csv-parser")


// CACHE
let cachedStocks = null


const loadNifty500 =
 () => {

  return new Promise(
   (resolve, reject) => {

    // RETURN CACHE
    if (cachedStocks) {

     return resolve(
      cachedStocks
     )

    }

    const results = []

    fs.createReadStream(

     path.join(
      __dirname,
      "../data/ind_nifty500list.csv"
     )

    )

    .pipe(csv())

    .on(
     "data",

     (data) => {

      const symbol =
       data.Symbol
        ? data.Symbol.trim()
        : ""


      if (!symbol) {
       return
      }


      if (
       symbol.includes("DUMMY")
      ) {
       return
      }


      results.push({

       symbol:
        `${symbol}.NS`,

       companyName:
        data["Company Name"]
         ? data["Company Name"].trim()
         : "Unknown Company",

       industry:
        data.Industry
         ? data.Industry.trim()
         : "Unknown",

      })

     }
    )

    .on(
     "end",

     () => {

      cachedStocks =
       results

      console.log(

       `Loaded ${results.length} NIFTY stocks`

      )

      resolve(results)

     }
    )

    .on(
     "error",

     (error) => {

      reject(error)

     }
    )

   }
  )
}


module.exports =
 loadNifty500