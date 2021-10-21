import { gql } from "@apollo/client";

export const GET_ME = gql`
query me{
    me{
      _id
      username
      email
      savedBooks{
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

// // make a search to google books api
// // https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};