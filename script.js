const inputData = document.getElementById("inputbox")

/* 
getBookData function fetching all the Books and Author based on the search made by the user on click of search button
*/
const getBookData = async(queryText) =>{
  const loading = document.getElementById("loading")
  const booklist = document.getElementById("booklist")
  const nobook = document.getElementById("nobook")
  loading.classList.remove("hidden")
  booklist.classList.add("hidden")
  nobook.classList.add("hidden")

  const booksObject = []
  const books = []
  
  /* 
  Hitting the API endpoint "openlibray" to get data based on query and storing the response array
  */
  try{
  let favoriteBookDetails = document.getElementById("favoriteBookDetails")
    favoriteBookDetails.classList.add("hidden")
  let response = await fetch(`https://openlibrary.org/search.json?q=${queryText}`)
  let data = await response.json()

    /* 
    slice the response data array in 10 because data loading taking too much time for Demo purpose
    Fetching the description data using key property from responnse array
    */
    for(let book of data.docs.slice(0,10)){
      try{
    const workRes = await fetch(`https://openlibrary.org${book.key}.json`)
  
  const workData = await workRes.json()
  
  let description = "";

  if (typeof workData.description === "string") {
    description = workData.description;
  } else if (workData.description?.value) {
    description = workData.description.value;
  }
  /* 
    Fetching the publisher data using key property from responnse array
    */

  const editionAPI = await fetch(`https://openlibrary.org${book.key}/editions.json`)

  const editionData = await editionAPI.json()

  const publisher = editionData.entries[0]?.publishers?.[0] || "unknown"

  /* 
    Fetching the cover image data using cover_i property from responnse array
    */

  const coverImage = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` :""

  /* 
  Pushing All the data in books Array for render data on UI
  */

  books.push({
    key : book.key,
    title : book.title,
    author : book.author_name?.[0],
    year : book.first_publish_year,
    description,
    publisher,
    coverImage
  })
}catch(err){
  console.log(`Error fetching book details`,err)
}
}
  }catch(err){
    console.log(`Error in searching data`,err)
  }

  
loading.classList.add("hidden")
booklist.classList.remove("hidden")
  return books
}

/* 
Showing all the books in UI from previously stored books array 
*/

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

/* 
  addToFavorites is creating a Array of favorite books from fetched data using key property from booksObject Array and storing in
  local storage to make it presisted data 
*/
const favoriteBooks = []
const addToFavorites=(index)=>{
   let favorites = JSON.parse(localStorage.getItem("favorites")) || []

   const exists = favorites.some((item) => item.key === booksObject[index].key)

   if(!exists){
    favorites.push(booksObject[index])
    localStorage.setItem("favorites",JSON.stringify(favorites))
    console.log("Book added to favorites")
    showFavoriteBooks()
    // console.log(favorites)
   }else{
    console.log("Book already exists")
   }

}

/* 
  removeDetails function just close the  favorite book details box on a button click
*/

  const removeDetails=()=>{
    let favoriteBookDetails = document.getElementById("favoriteBookDetails")
    favoriteBookDetails.classList.add("hidden")
  }

  /* 
    showDetails function fetch the data from local storage array of favorite books and show it in a box below the favorite books
  */

  const showDetails=(index)=>{
    let favorites = JSON.parse(localStorage.getItem("favorites")) || []
    console.log(favorites[index])
    let favoriteBookDetails = document.getElementById("favoriteBookDetails")
    favoriteBookDetails.classList.remove("hidden")
    favoriteBookDetails.innerHTML = ""
    favoriteBookDetails.innerHTML = `
    <p class="flex justify-center font-bold text-xl underline text-blue-700 mb-4">Book Details</p>
    <div class="flex flex-col relative sm:flex-row gap-6 items-center sm:items-start w-full">
    
    <button
  onclick="removeDetails(${index})"
  class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 text-xs sm:text-sm md:text-base rounded-lg">
  Close
  </button>
    
          <div class="flex-shrink-0">
      <img src="${favorites[index].coverImage}" alt="${favorites[index].title}" class="w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-48 object-cover rounded-md mx-auto"/>
      </div>
      <div class="flex-1">
      <h1 class="text-xl sm:text-2xl font-bold">${favorites[index].title || "No title found"}</h1>
      <p class="text-sm sm:text-base text-gray-500">${favorites[index].author || "No author found"}</p>
    <p class="text-red-500 font-semibold pb-1">${favorites[index].year || "No year found"}</p>

    <p class="line-clamp-2 text-gray-500 text-sm font-light flex-1 pb-1">
        ${favorites[index].description  || "No description found"}
    </p>

    <p class="text-green-500 font-semibold pb-1">${favorites[index].publisher || "No publisher found"}</p>
      </div>
    </div>

    `
  }

  /* 
  removeFromFavorites function remove the book from local storage favorites array on button click using splice method
  */

const removeFromFavorites=(index)=>{
  let favorites = JSON.parse(localStorage.getItem("favorites")) || []
  favorites.splice(index,1)
  localStorage.setItem("favorites" , JSON.stringify(favorites))
  showFavoriteBooks()
}

/* 
  showFavoriteBooks function shows favorite books in horizontal manner by looping through local storage array below search bar with 2 buttons "Details" and "Remove" on each book
*/

const showFavoriteBooks =()=>{
  let favoriteBookDetails = document.getElementById("favoriteBookDetails")
    favoriteBookDetails.classList.add("hidden")
  let favorites = JSON.parse(localStorage.getItem("favorites")) || []
  const favoritesDiv = document.getElementById("favorites")
  console.log(favorites)

  favoritesDiv.innerHTML = ""
  

  favorites.forEach((book,index)=>{
    favoritesDiv.innerHTML += `
    <div  class="w-48 flex-shrink-0 min-h-[300px] p-4 rounded-lg shadow-lg border flex flex-col bg-orange-50">
      <img src=${book.coverImage} alt=${book.title} class="w-24 h-32 sm:w-28 sm:h-40 mx-auto object-cover rounded-md"/>
      <h4 class="mt-3 text-base font-normal pb-1">${book.title || "No title found"}</h3>
      <button onclick="showDetails(${index})" class="mt-auto m-1 p-2 bg-green-400 w-full h-12 border-2 border-black rounded-lg">
      Details
      </button>
      <button onclick="removeFromFavorites(${index})" class=" m-1 p-2 bg-red-400 w-full h-12 border-2 border-black rounded-lg">
    Remove
    </button>
      </div>
    
    `
  })

}
/* 
showFavoriteBooks function fetch data from local storage when page loads first time
*/
showFavoriteBooks()

/* 
Getting data from search button and passing it as query for searching books and auhtors
*/

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

  // Main function call
  showBooks(bookData)
 
})
