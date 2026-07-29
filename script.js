const inputData = document.getElementById("inputbox")


const getBookData = async(queryText) =>{
  let response = await fetch(`https://openlibrary.org/search.json?q=${queryText}`)
  let data = await response.json()
  console.log(data.docs)
  // data.docs.map((item) =>{
  //   console.log(item.title)
  //   console.log(item.author_name)
  //   console.log(item.cover_i)
  //   console.log(item.first_publish_year)
  //   console.log(item.key)
  //   console.log(`==================================`)
  // })
  
}

const searchBtn = document.getElementById("searchBtn")
searchBtn.addEventListener("click",async()=>{
  queryText = inputData.value 
  
 await getBookData(queryText)

})
