import React, { useState} from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

// import { getMe, deleteBook } from '../utilsold/API';
// import Auth from '../utilsold/auth';
// import { removeBookId } from '../utilsold/localStorage';

import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import {GET_ME} from '../utilsnew/queries';
import {REMOVE_BOOK} from '../utilsnew/mutations';
import Auth from '../utilsnew/auth.js';
import { removeBookId } from '../utilsnew/localStorage';

const SavedBooks = () => {
  // Client Queries
  const { loading, data } = useQuery(GET_ME);
  //Client Mutations
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  const [userData, setUserData] = useState({savedBooks: []});

  
  const getUserData = ()=>{
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
          return false;
        }

        // const response = await getMe(token);
        // if (!response.ok) {
        //   throw new Error('something went wrong!');
        // }
        // const user = await response.json();
          const user = data.me
          setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };



  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // const response = await deleteBook(bookId, token);
      // if (!response.ok) {
      //   throw new Error('something went wrong!');
      // }
      // const updatedUser = await response.json();

      const {data} = await removeBook({
        variables: {
          bookId,
        }
      })
      setUserData({...data.removeBook});
      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
      console.log(error)
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark' onLoad={!userData.username ? getUserData(): null}>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
