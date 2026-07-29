async function getBooks() {
  try {
    const response = await fetch(
      "https://www.googleapis.com/books/v1/volumes"
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

getBooks();