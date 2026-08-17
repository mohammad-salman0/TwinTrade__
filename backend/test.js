const loadNifty500 =
 require(
  "./src/services/loadNifty500"
 )


loadNifty500()

 .then((stocks) => {

  console.log(
   stocks.slice(0, 5)
  )

 })

 .catch(console.log)