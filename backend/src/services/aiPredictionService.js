const axios = require("axios")

/*
========================================
 AI PREDICTION SERVICE
========================================
 Calls the FastAPI ML microservice's /predict
 endpoint and returns the prediction result.

 FastAPI service must be running:
   python -m uvicorn main:app --reload

 Default URL: http://127.0.0.1:8000
========================================
*/

const AI_SERVICE_URL =

 process.env.AI_SERVICE_URL ||

 "http://127.0.0.1:8000"


/*
========================================
 REQUEST TIMEOUT
========================================
 Feature extraction in FastAPI downloads
 3 months of data via yfinance per request,
 which can be slow. Give it a generous
 timeout rather than failing fast and
 falling back to fake data unnecessarily.
========================================
*/

const REQUEST_TIMEOUT_MS = 15000


/*
========================================
 GET AI PREDICTION
========================================
*/

exports.getAIPrediction =

 async ({ symbol }) => {

  try {

   /*
   ========================================
   STRIP .NS SUFFIX IF PRESENT
   ========================================
   FastAPI's generate_features() appends
   ".NS" itself, so we should NOT send
   a symbol that already has it.
   ========================================
   */

   const cleanSymbol =

    symbol.replace(
     /\.NS$/i,
     ""
    )


   const response =
    await axios.post(

     `${AI_SERVICE_URL}/predict`,

     {

      symbol:
       cleanSymbol,

     },

     {

      timeout:
       REQUEST_TIMEOUT_MS,

     }

    )


   const data =
    response.data


   /*
   ========================================
   FASTAPI RETURNED AN ERROR PAYLOAD
   ========================================
   FastAPI's /predict route catches its own
   exceptions and returns { error: "..." }
   with a 200 status instead of throwing,
   so we have to check for this explicitly —
   axios won't treat it as a failed request.
   ========================================
   */

   if (data.error) {

    throw new Error(

     `AI service error: ${data.error}`

    )

   }


   return data

  } catch (error) {

   /*
   ========================================
   DISTINGUISH FAILURE TYPES
   ========================================
   Helps debugging — "connection refused"
   means FastAPI isn't running at all,
   "timeout" means it's running but slow,
   anything else is a real error from
   inside the prediction logic.
   ========================================
   */

   if (
    error.code === "ECONNREFUSED"
   ) {

    throw new Error(

     `AI service unreachable at ${AI_SERVICE_URL} — is FastAPI running? (python -m uvicorn main:app --reload)`

    )

   }


   if (
    error.code === "ECONNABORTED"
   ) {

    throw new Error(

     `AI service timed out after ${REQUEST_TIMEOUT_MS}ms for symbol ${symbol}`

    )

   }


   throw error

  }

 }