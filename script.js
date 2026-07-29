const inputData = document.getElementById("inputbox")


const getBookData = async(queryText) =>{
  let response = await fetch(`https://openlibrary.org/search.json?q=${queryText}`)
  let data = await response.json()

  const books = []

  for(let book of data.docs.slice(0,10)){
    const workRes = await fetch(`https://openlibrary.org${book.key}.json`)
  
  const workData = await workRes.json()
  
  let description = "";

  if (typeof workData.description === "string") {
    description = workData.description;
  } else if (workData.description?.value) {
    description = workData.description.value;
  }

  const editionAPI = await fetch(`https://openlibrary.org${book.key}/editions.json`)

  const editionData = await editionAPI.json()

  const publisher = editionData.entries[0]?.publishers?.[0] || "unknown"

  const coverImage = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` :""

  books.push({
    title : book.title,
    author : book.author_name?.[0],
    year : book.first_publish_year,
    description,
    publisher,
    coverImage
  })
}
  return books
}


// const getBookDescription = async(key) =>{
//   let response = await fetch()
// }

const searchBtn = document.getElementById("searchBtn")
searchBtn.addEventListener("click",async()=>{
  queryText = inputData.value 
  let bookData = await getBookData(queryText)
  bookData.map(item => {
    console.log(item.title)
    console.log(item.author)
    console.log(item.year)
    console.log(item.description)
    console.log(item.publisher)
    console.log(item.coverImage)
    console.log("============================")
  })

 
})
