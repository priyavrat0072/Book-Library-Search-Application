GUVI-HCL
Assignment - 2
Book Library Search Application

Documentation of Book Library Search Application

1. How to navigate through Application

-> open the page 
-> Search the book or the author in the search bar
-> wait till loading indictor is spinning(in case of invalid search it will show "No books found")
-> After the search is complete the books with details shows up (cover image , title , author etc)
-> Two buttons are present Preview(Takes you to offical Book page on Open Library website), Add to favorites(Add the book to favorites)
-> Books which are added to favorites are present below search bar in horizontal manner
-> In favorite books 2 buttons are present Details(show the book detail in below box), Remove(Remove the book from favorites)
-> In Book detail box which show in between favorite books and search books consist book data and a Close button(To close the detail box)

2.Source of Data in website

-> I have used openlibrary API in Place of googleapis which was mentioned in the assignment document 
   after discussion with mentor because googleapis limit is exahausted and i was not able to use that API endpoint.

--->All the APIs used in the project
 ** Note--> I have used data from top 10 books because data fetching is taking to much time from open library and for demo purpose i have shown 
            10 books for each search

-> Main API for Books and authors = https://openlibrary.org/search.json?q=${queryText}
   title, author_name, cover_i,first_publish_year,key

-> For the image of the book = https://covers.openlibrary.org/b/id/15155833-M.jpg
   Cover of the book

-> For short description = https://openlibrary.org/works/OL27448W.json (key)
   Description

-> For fetching publisher details = https://openlibrary.org/works/OL27448W/editions.json (key + editons)
   Publisher


