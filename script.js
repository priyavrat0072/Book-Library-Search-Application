const inputData = document.getElementById("inputbox")

const getBookData = async(queryText) =>{
  const loading = document.getElementById("loading")
  const booklist = document.getElementById("booklist")
  const nobook = document.getElementById("nobook")
  loading.classList.remove("hidden")
  booklist.classList.add("hidden")
  nobook.classList.add("hidden")
  let response = await fetch(`https://openlibrary.org/search.json?q=${queryText}`)
  let data = await response.json()

  const booksObject = []
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
    key : book.key,
    title : book.title,
    author : book.author_name?.[0],
    year : book.first_publish_year,
    description,
    publisher,
    coverImage
  })
}
loading.classList.add("hidden")
booklist.classList.remove("hidden")
  return books
}

const showBooks = (books) =>{
  booksObject = books
  if(books.length === 0){
    let  nobook = document.getElementById("nobook")
    nobook.classList.remove("hidden")
    nobook.innerText = "No books found, Please try another search"
    let booklist = document.getElementById("booklist")
    booklist.classList.add("hidden")
  }else{
    let nobook = document.getElementById("nobook")
    nobook.classList.add("hidden")
    let booklist = document.getElementById("booklist")
  booklist.innerHTML = ""
  books.forEach((book,index) => {
booklist.innerHTML += `
<div class="w-65 min-h-[600px] p-4 rounded-lg shadow-lg border flex flex-col bg-gray-100">
    <img
        src="${book.coverImage}"
        alt="${book.title}"
        class="w-24 h-36 sm:w-32 sm:h-48 md:w-40 md:h-60 lg:w-48 lg:h-72 mx-auto object-cover rounded-md"
    />

    <h2 class="mt-3 text-lg font-bold pb-1">${book.title || "No title found"}</h2>
    <p class="text-gray-500 font-semibold pb-1">${book.author || "No author found"}</p>
    <p class="text-red-500 font-semibold pb-1">${book.year || "No year found"}</p>

    <p class="line-clamp-2 text-gray-500 text-sm font-light flex-1 pb-1">
        ${book.description  || "No description found"}
    </p>

    <p class="text-green-500 font-semibold pb-1">${book.publisher || "No publisher found"}</p>
    <a
  href="https://openlibrary.org${book.key}"
  target="_blank"
  rel="noopener noreferrer"
  class="mt-auto m-1 p-2 bg-green-400 w-full h-12 border-2 border-black rounded-lg flex items-center justify-center"
  >
  Preview Link
  </a>
    <button onclick="addToFavorites(${index})" class="mt-auto m-1 p-2 bg-blue-400 w-full h-12 border-2 border-black rounded-lg">
        Add to favorites
    </button>
</div>
`;
  });
  }
}
const favoriteBooks = []
const addToFavorites=(index)=>{
   let favorites = JSON.parse(localStorage.getItem("favorites")) || []

   const exists = favorites.some((item) => item.key === booksObject[index].key)

   if(!exists){
    favorites.push(booksObject[index])
    localStorage.setItem("favorites",JSON.stringify(favorites))
    console.log("Book added to favorites")
    // console.log(favorites)
   }else{
    console.log("Book already exists")
   }

}

const showFavoriteBooks =()=>{
  const favorites = JSON.parse(localStorage.getItem("favorites")) || []
  console.log(favorites)
}
showFavoriteBooks()

const searchBtn = document.getElementById("searchBtn")
searchBtn.addEventListener("click",async()=>{
  queryText = inputData.value 
  let bookData = await getBookData(queryText)
  // bookData.map(item => {
  //   console.log(item.key)
  //   console.log(item.title)
  //   console.log(item.author)
  //   console.log(item.year)
  //   console.log(item.description)
  //   console.log(item.publisher)
  //   console.log(item.coverImage)
  //   console.log("============================")
  // })

  showBooks(bookData)
 
})
