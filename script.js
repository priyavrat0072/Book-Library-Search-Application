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

const showBooks = (books) =>{
  let booklist = document.getElementById("booklist")
  booklist.innerHTML = ""
  books.forEach(book => {
booklist.innerHTML += `
<div class="w-65 min-h-[600px] p-4 rounded-lg shadow-lg border flex flex-col">
    <img
        src="${book.coverImage}"
        alt="${book.title}"
        class="w-full h-72 object-cover rounded-md"
    />

    <h2 class="mt-3 text-lg font-bold pb-1">${book.title}</h2>
    <p class="text-gray-500 font-semibold pb-1">${book.author}</p>
    <p class="text-red-500 font-semibold pb-1">${book.year}</p>

    <p class="line-clamp-2 text-gray-500 text-sm font-light flex-1 pb-1">
        ${book.description  || "No description found"}
    </p>

    <p class="text-green-500 font-semibold pb-1">${book.publisher}</p>

    <button class="mt-auto m-1 p-2 bg-blue-400 w-full h-14 border-2 border-black rounded-lg">
        Add to favorites
    </button>
</div>
`;
  });
  

}

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

  showBooks(bookData)
 
})
